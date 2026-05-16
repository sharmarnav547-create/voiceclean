export function buildFinalAudioFilters(boostDb, balanceVolume, balanceStrength) {
  const filters = [
    'highpass=f=80',
    'afftdn=nf=-25:nr=25',   // adaptive FFT denoiser — catches residual steady-state hum
    'lowpass=f=8000',
  ];

  if (boostDb > 0) {
    filters.push(`volume=${boostDb}dB`);
  }
  if (balanceVolume) {
    const map = {
      gentle: 'dynaudnorm=f=500:g=15:p=0.7',
      normal: 'dynaudnorm=f=250:g=11:p=0.9',
      strong: 'dynaudnorm=f=150:g=5:p=0.95:m=30',
    };
    filters.push(map[balanceStrength] || map.normal);
  }

  return ['-af', filters.join(',')];
}

export function encodeWAV(samples, sampleRate = 44100) {
  const buffer = new ArrayBuffer(44 + samples.length * 2);
  const view = new DataView(buffer);

  function writeString(offset, str) {
    for (let i = 0; i < str.length; i++) view.setUint8(offset + i, str.charCodeAt(i));
  }

  writeString(0, 'RIFF');
  view.setUint32(4, 36 + samples.length * 2, true);
  writeString(8, 'WAVE');
  writeString(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeString(36, 'data');
  view.setUint32(40, samples.length * 2, true);

  const clamp = (v) => Math.max(-1, Math.min(1, v));
  for (let i = 0; i < samples.length; i++) {
    view.setInt16(44 + i * 2, clamp(samples[i]) * 0x7fff, true);
  }

  return new Uint8Array(buffer);
}

export function computeRMS(samples) {
  let sum = 0;
  for (let i = 0; i < samples.length; i++) sum += samples[i] * samples[i];
  return Math.sqrt(sum / samples.length);
}

export function estimateNoiseReduction(originalSamples, cleanedSamples) {
  const origRMS = computeRMS(originalSamples);
  const cleanRMS = computeRMS(cleanedSamples);
  if (origRMS === 0) return 0;
  return Math.max(0, Math.min(99, Math.round((1 - cleanRMS / origRMS) * 100)));
}

export async function decodeAudioFromBlob(blob) {
  const AudioCtx = window.AudioContext || /** @type {any} */(window).webkitAudioContext;
  const ctx = new AudioCtx({ sampleRate: 44100 });
  const arrayBuffer = await blob.arrayBuffer();
  const audioBuffer = await ctx.decodeAudioData(arrayBuffer);
  ctx.close();
  return audioBuffer.getChannelData(0);
}
