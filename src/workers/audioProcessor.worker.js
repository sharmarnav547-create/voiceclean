// Audio processing worker.
// Primary  : Demucs v4 ONNX → Wiener post-pass using original noise profile.
// Fallback : Single-pass frequency-domain Wiener filter with frequency smoothing.

import * as ort from 'onnxruntime-web';

// ─── Constants ───────────────────────────────────────────────────────────────

const FFT_SIZE = 2048;              // ~46 ms frame @ 44100 Hz
const HOP      = 512;               // 75% overlap
const NBINS    = FFT_SIZE / 2 + 1;

const BIN_HZ = 44100 / FFT_SIZE;   // ≈ 21.5 Hz per bin

// Standard Wiener parameters — used as standalone fallback pass.
const ALPHA_B = new Float32Array(NBINS);
const BETA_B  = new Float32Array(NBINS);
for (let k = 0; k < NBINS; k++) {
  const hz = k * BIN_HZ;
  if (hz < 200)        { ALPHA_B[k] = 15.0; BETA_B[k] = 0.0002; }  // hum + rumble zone
  else if (hz < 4000)  { ALPHA_B[k] = 2.5;  BETA_B[k] = 0.008;  }  // voice body — gentle
  else if (hz < 8000)  { ALPHA_B[k] = 10.0; BETA_B[k] = 0.0005; }  // hiss range
  else                 { ALPHA_B[k] = 25.0; BETA_B[k] = 0.0;    }   // cut all
}

// Post-Demucs Wiener parameters — voice is already preserved so we can be
// more aggressive in the tonal hum / low-mid drone range (100–600 Hz).
const ALPHA_POST = new Float32Array(NBINS);
const BETA_POST  = new Float32Array(NBINS);
for (let k = 0; k < NBINS; k++) {
  const hz = k * BIN_HZ;
  if (hz < 100)        { ALPHA_POST[k] = 25.0; BETA_POST[k] = 0.0001; }  // sub-bass: hard cut
  else if (hz < 600)   { ALPHA_POST[k] = 8.0;  BETA_POST[k] = 0.005;  }  // hum / drone zone
  else if (hz < 4000)  { ALPHA_POST[k] = 3.5;  BETA_POST[k] = 0.008;  }  // voice body: gentle
  else if (hz < 8000)  { ALPHA_POST[k] = 12.0; BETA_POST[k] = 0.0003; }  // hiss range
  else                 { ALPHA_POST[k] = 30.0; BETA_POST[k] = 0.0;    }   // cut all
}

const DEMUCS_CHUNK = 343980;    // ~7.8 s @ 44100 Hz
const CACHE_NAME   = 'clearvoice-models-v2';

// Pre-computed Hann window
const HANN = new Float32Array(FFT_SIZE);
for (let i = 0; i < FFT_SIZE; i++) {
  HANN[i] = 0.5 * (1 - Math.cos(2 * Math.PI * i / (FFT_SIZE - 1)));
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function post(type, extra) { self.postMessage({ type, ...extra }); }
function prog(stage, pct)  { post('PROGRESS', { stage, percent: pct }); }

function isOnnx(buf) {
  if (!buf || buf.byteLength < 4) return false;
  const b = new Uint8Array(buf, 0, 4);
  return b[0] !== 0x3c && b[0] !== 0x7b && b[0] !== 0x20 && b[0] !== 0x0a;
}

// ─── ONNX model management ───────────────────────────────────────────────────

let demucsSession = null;
let onnxReady     = null;

async function tryLoadOnnx() {
  if (onnxReady !== null) return onnxReady;
  try {
    async function loadModel(url, providers) {
      let buf = null;
      try {
        const hit = await (await caches.open(CACHE_NAME)).match(url);
        if (hit) buf = await hit.arrayBuffer();
      } catch {}
      if (!isOnnx(buf)) {
        const r = await fetch(url);
        if (!r.ok) return null;
        buf = await r.arrayBuffer();
        if (!isOnnx(buf)) return null;
      }
      return ort.InferenceSession.create(buf, { executionProviders: providers });
    }

    prog('Loading Voice Separator…', 5);
    demucsSession = await loadModel('/models/htdemucs.onnx', ['webgpu', 'wasm']);
    if (!demucsSession) { onnxReady = false; return false; }

    onnxReady = true;
    return true;
  } catch {
    demucsSession = null;
    onnxReady = false;
    return false;
  }
}

// ─── Entry point ─────────────────────────────────────────────────────────────

self.onmessage = async ({ data: { type, payload } }) => {
  if (type === 'PROCESS') await run(payload);
};

async function run({ samples, sampleRate }) {
  try {
    const useOnnx = await tryLoadOnnx();

    let result;
    if (useOnnx) {
      // Capture the noise profile from the original (pre-Demucs) signal.
      // After Demucs separates voice, we'll use this profile to Wiener-clean
      // any residual hum / drone that leaked into the vocals stem.
      prog('Analysing noise profile…', 17);
      const originalNoise = estimateNoisePSD(samples);

      prog('Separating voice from noise…', 20);
      result = await runDemucs(samples);

      // Estimate residual noise that survived Demucs (from quiet pauses
      // in the vocal stem), then apply a targeted Wiener pass.
      prog('Cleaning up residual noise…', 75);
      const residualNoise = estimateNoisePSD(result);
      // Blend: use the stronger of original vs residual at each bin so we
      // don't under-estimate how much hum is still present.
      const blendedNoise = new Float32Array(NBINS);
      for (let k = 0; k < NBINS; k++) {
        blendedNoise[k] = Math.max(originalNoise[k] * 0.4, residualNoise[k]);
      }
      result = await applyWienerFilter(result, blendedNoise, ALPHA_POST, BETA_POST, 76, 95);
    } else {
      result = await wienerDenoise(samples);
    }

    prog('Done!', 100);
    post('DONE', { wav: encodeWAV(result, sampleRate), usedFallback: !useOnnx });
  } catch (err) {
    post('ERROR', { message: err.message });
  }
}

// ─── Demucs v4 inference ─────────────────────────────────────────────────────

async function runDemucs(mono) {
  const out = new Float32Array(mono.length);
  const n   = Math.ceil(mono.length / DEMUCS_CHUNK);
  for (let c = 0; c < n; c++) {
    prog(`Separating voice… (${c + 1}/${n})`, 20 + Math.round((c / n) * 50));
    const s = c * DEMUCS_CHUNK, len = Math.min(DEMUCS_CHUNK, mono.length - s);
    const chunk = new Float32Array(2 * len);
    for (let i = 0; i < len; i++) { chunk[i] = mono[s + i]; chunk[len + i] = mono[s + i]; }
    const feeds = { [demucsSession.inputNames[0]]: new ort.Tensor('float32', chunk, [1, 2, len]) };
    const res = await demucsSession.run(feeds);
    const o = res[demucsSession.outputNames[0]];
    const vi = o.dims[1] - 1, ss = 2 * len;
    for (let i = 0; i < len; i++) out[s + i] = (o.data[vi * ss + i] + o.data[vi * ss + len + i]) * 0.5;
  }
  return out;
}

// ─── FFT (Cooley-Tukey radix-2, in-place) ───────────────────────────────────

function fft(re, im) {
  const n = re.length;
  for (let i = 1, j = 0; i < n; i++) {
    let bit = n >> 1;
    for (; j & bit; bit >>= 1) j ^= bit;
    j ^= bit;
    if (i < j) {
      let t = re[i]; re[i] = re[j]; re[j] = t;
      t = im[i]; im[i] = im[j]; im[j] = t;
    }
  }
  for (let len = 2; len <= n; len <<= 1) {
    const h = len >> 1, ang = -2 * Math.PI / len;
    const wr0 = Math.cos(ang), wi0 = Math.sin(ang);
    for (let i = 0; i < n; i += len) {
      let wr = 1, wi = 0;
      for (let j = 0; j < h; j++) {
        const ur = re[i+j], ui = im[i+j];
        const vr = re[i+j+h]*wr - im[i+j+h]*wi;
        const vi = re[i+j+h]*wi + im[i+j+h]*wr;
        re[i+j] = ur+vr; im[i+j] = ui+vi;
        re[i+j+h] = ur-vr; im[i+j+h] = ui-vi;
        const nwr = wr*wr0 - wi*wi0; wi = wr*wi0 + wi*wr0; wr = nwr;
      }
    }
  }
}

function ifft(re, im) {
  for (let i = 0; i < im.length; i++) im[i] = -im[i];
  fft(re, im);
  const n = re.length;
  for (let i = 0; i < n; i++) { re[i] /= n; im[i] = -im[i] / n; }
}

// ─── Noise PSD estimation ────────────────────────────────────────────────────

function estimateNoisePSD(samples) {
  const nF = Math.floor((samples.length - FFT_SIZE) / HOP) + 1;
  const energies = new Float32Array(nF);
  for (let f = 0; f < nF; f++) {
    let e = 0, s0 = f * HOP;
    for (let i = 0; i < HOP && s0 + i < samples.length; i++) e += samples[s0 + i] ** 2;
    energies[f] = e / HOP;
  }

  const sorted = Float32Array.from(energies).sort();
  const thr = sorted[Math.floor(nF * 0.40)];

  const noise = new Float32Array(NBINS);
  const re = new Float32Array(FFT_SIZE), im = new Float32Array(FFT_SIZE);
  let count = 0;

  for (let f = 0; f < nF; f++) {
    if (energies[f] > thr * 1.5) continue;
    const s0 = f * HOP;
    for (let i = 0; i < FFT_SIZE; i++) {
      re[i] = (s0 + i < samples.length ? samples[s0 + i] : 0) * HANN[i];
      im[i] = 0;
    }
    fft(re, im);
    for (let k = 0; k < NBINS; k++) noise[k] += re[k] ** 2 + im[k] ** 2;
    count++;
  }

  if (count > 0) {
    for (let k = 0; k < NBINS; k++) noise[k] /= count;
  } else {
    // All frames are loud — fall back to per-bin minimum
    noise.fill(Infinity);
    for (let f = 0; f < nF; f++) {
      const s0 = f * HOP;
      for (let i = 0; i < FFT_SIZE; i++) {
        re[i] = (s0 + i < samples.length ? samples[s0 + i] : 0) * HANN[i]; im[i] = 0;
      }
      fft(re, im);
      for (let k = 0; k < NBINS; k++) {
        const p = re[k] ** 2 + im[k] ** 2;
        if (p < noise[k]) noise[k] = p;
      }
    }
  }
  return noise;
}

// ─── Core Wiener denoiser (parameterised) ────────────────────────────────────

async function applyWienerFilter(samples, noise, alphaArr, betaArr, pctStart = 18, pctEnd = 92) {
  const output   = new Float32Array(samples.length);
  const weights  = new Float32Array(samples.length);
  const re  = new Float32Array(FFT_SIZE);
  const im  = new Float32Array(FFT_SIZE);
  const raw = new Float32Array(NBINS);
  const sm  = new Float32Array(NBINS);
  const prevGain = new Float32Array(NBINS).fill(1.0);

  const nF = Math.floor((samples.length - FFT_SIZE) / HOP) + 1;

  for (let f = 0; f < nF; f++) {
    if (f % 80 === 0) prog('Removing noise…', pctStart + Math.round((f / nF) * (pctEnd - pctStart)));

    const s0 = f * HOP;
    for (let i = 0; i < FFT_SIZE; i++) {
      re[i] = (s0 + i < samples.length ? samples[s0 + i] : 0) * HANN[i];
      im[i] = 0;
    }
    fft(re, im);

    // Per-bin Wiener gain: G(k) = max(β, (|X|²−α·|N|²) / |X|²)
    for (let k = 0; k < NBINS; k++) {
      const pow = re[k] ** 2 + im[k] ** 2;
      raw[k] = pow > 0 ? Math.max(betaArr[k], (pow - alphaArr[k] * noise[k]) / pow) : betaArr[k];
    }

    // 5-point frequency smoothing — eliminates musical noise (isolated spectral peaks)
    sm[0] = (raw[0] * 3 + raw[1] * 2) / 5;
    sm[1] = (raw[0] + raw[1] * 2 + raw[2] * 2) / 5;
    for (let k = 2; k < NBINS - 2; k++) {
      sm[k] = (raw[k-2] + raw[k-1] + raw[k] + raw[k+1] + raw[k+2]) / 5;
    }
    sm[NBINS-2] = (raw[NBINS-3] + raw[NBINS-2] * 2 + raw[NBINS-1]) / 4;
    sm[NBINS-1] = (raw[NBINS-2] + raw[NBINS-1] * 2) / 3;

    // Temporal smoothing: 75% previous frame + 25% current — prevents flicker
    for (let k = 0; k < NBINS; k++) {
      sm[k] = 0.75 * prevGain[k] + 0.25 * sm[k];
      prevGain[k] = sm[k];
    }

    // Apply gains + enforce conjugate symmetry for real IFFT
    for (let k = 0; k < NBINS; k++) {
      re[k] *= sm[k]; im[k] *= sm[k];
      if (k > 0 && k < NBINS - 1) {
        re[FFT_SIZE - k] *= sm[k]; im[FFT_SIZE - k] *= sm[k];
      }
    }

    ifft(re, im);

    // Overlap-add with Hann synthesis window
    for (let i = 0; i < FFT_SIZE; i++) {
      const idx = s0 + i;
      if (idx < output.length) {
        output[idx]  += re[i] * HANN[i];
        weights[idx] += HANN[i] * HANN[i];
      }
    }
  }

  for (let i = 0; i < output.length; i++) {
    if (weights[i] > 1e-6) output[i] /= weights[i];
  }
  return output;
}

// Standalone one-pass denoiser used when ONNX models are unavailable.
async function wienerDenoise(samples) {
  prog('Analysing noise profile…', 14);
  const noise = estimateNoisePSD(samples);
  return applyWienerFilter(samples, noise, ALPHA_B, BETA_B, 18, 92);
}

// ─── WAV encoder ─────────────────────────────────────────────────────────────

function encodeWAV(samples, sr) {
  const buf = new ArrayBuffer(44 + samples.length * 2);
  const v = new DataView(buf);
  const w = (o, s) => { for (let i = 0; i < s.length; i++) v.setUint8(o + i, s.charCodeAt(i)); };
  w(0, 'RIFF'); v.setUint32(4, 36 + samples.length * 2, true);
  w(8, 'WAVE'); w(12, 'fmt ');
  v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, 1, true);
  v.setUint32(24, sr, true); v.setUint32(28, sr * 2, true);
  v.setUint16(32, 2, true); v.setUint16(34, 16, true);
  w(36, 'data'); v.setUint32(40, samples.length * 2, true);
  for (let i = 0; i < samples.length; i++) {
    v.setInt16(44 + i * 2, Math.max(-1, Math.min(1, samples[i])) * 0x7fff, true);
  }
  return new Uint8Array(buf);
}
