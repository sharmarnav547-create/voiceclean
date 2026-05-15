import { useRef, useState, useEffect } from 'react';
import { checkWebGPU } from '../utils/deviceCheck';

function isOnnxBytes(bytes) {
  return bytes.length >= 4 && bytes[0] !== 0x3c && bytes[0] !== 0x7b && bytes[0] !== 0x20;
}

const MODEL_URLS = {
  demucs:     { url: '/models/htdemucs.onnx',      name: 'Voice Separator', sizeMB: 120 },
  deepfilter: { url: '/models/DeepFilterNet3.onnx', name: 'Audio Cleaner',   sizeMB:  50 },
};

const CACHE_NAME = 'clearvoice-models-v2';
const TOTAL_MB = 170;

export function useAudioProcessor() {
  const workerRef = useRef(null);
  const [hasGPU, setHasGPU] = useState(null);
  const [modelDownload, setModelDownload] = useState(null);
  const [modelsReady, setModelsReady] = useState(false);

  useEffect(() => {
    checkWebGPU().then(setHasGPU);
    areAllModelsCached().then(setModelsReady);
  }, []);

  function getWorker() {
    if (!workerRef.current) {
      workerRef.current = new Worker(
        new URL('../workers/audioProcessor.worker.js', import.meta.url),
        { type: 'module' }
      );
    }
    return workerRef.current;
  }

  async function ensureModels(onStatus) {
    if (await areAllModelsCached()) {
      setModelsReady(true);
      return;
    }

    setModelDownload({ demucs: 0, deepfilter: 0 });
    onStatus?.('Downloading AI models…');

    let allDownloaded = true;
    for (const [key, info] of Object.entries(MODEL_URLS)) {
      const ok = await fetchAndCache(info.url, (pct) => {
        setModelDownload((d) => d ? { ...d, [key]: pct } : null);
      });
      if (!ok) allDownloaded = false;
    }

    setModelDownload(null);
    if (allDownloaded) setModelsReady(true);
  }

  async function processAudio(rawWavBlob, onProgress) {
    await ensureModels((msg) => onProgress?.(5, msg));

    const arrayBuffer = await rawWavBlob.arrayBuffer();
    let mono, sampleRate;

    try {
      // Try Web Audio API — pass a copy so the original survives if decoding fails
      const ctx = new (window.AudioContext || window.webkitAudioContext)({ sampleRate: 44100 });
      const audioBuffer = await ctx.decodeAudioData(arrayBuffer.slice(0));
      await ctx.close();
      const ch0 = audioBuffer.getChannelData(0);
      const ch1 = audioBuffer.numberOfChannels > 1 ? audioBuffer.getChannelData(1) : ch0;
      mono = new Float32Array(ch0.length);
      for (let i = 0; i < ch0.length; i++) mono[i] = (ch0[i] + ch1[i]) * 0.5;
      sampleRate = audioBuffer.sampleRate;
    } catch {
      // Fallback: parse PCM s16le WAV directly — works for all FFmpeg-generated WAVs
      ({ mono, sampleRate } = parsePCMWav(arrayBuffer));
    }

    return new Promise((resolve, reject) => {
      const worker = getWorker();

      worker.onmessage = ({ data }) => {
        if (data.type === 'PROGRESS') onProgress?.(data.percent, data.stage);
        else if (data.type === 'DONE') resolve(new Blob([data.wav], { type: 'audio/wav' }));
        else if (data.type === 'ERROR') reject(new Error(data.message));
      };
      worker.onerror = (e) => reject(new Error(e.message));

      worker.postMessage(
        { type: 'PROCESS', payload: { samples: mono, sampleRate } },
        [mono.buffer]
      );
    });
  }

  function terminate() {
    workerRef.current?.terminate();
    workerRef.current = null;
  }

  return { hasGPU, modelDownload, modelsReady, processAudio, terminate, TOTAL_MB, MODEL_URLS };
}

async function areAllModelsCached() {
  try {
    const cache = await caches.open(CACHE_NAME);
    for (const info of Object.values(MODEL_URLS)) {
      const resp = await cache.match(info.url);
      if (!resp) return false;
      const peek = new Uint8Array(await resp.clone().arrayBuffer(), 0, 4);
      if (!isOnnxBytes(peek)) return false;
    }
    return true;
  } catch {
    return false;
  }
}

function parsePCMWav(buffer) {
  const view = new DataView(buffer);
  const channels = view.getUint16(22, true);
  const sampleRate = view.getUint32(24, true);
  const bitsPerSample = view.getUint16(34, true);
  // Walk chunks to find 'data'
  let offset = 12;
  while (offset + 8 <= view.byteLength) {
    const id = String.fromCharCode(
      view.getUint8(offset), view.getUint8(offset+1),
      view.getUint8(offset+2), view.getUint8(offset+3)
    );
    const size = view.getUint32(offset + 4, true);
    if (id === 'data') {
      const bytesPerSample = bitsPerSample / 8;
      const numFrames = Math.floor(size / (channels * bytesPerSample));
      const mono = new Float32Array(numFrames);
      const base = offset + 8;
      for (let i = 0; i < numFrames; i++) {
        let sum = 0;
        for (let c = 0; c < channels; c++) {
          sum += view.getInt16(base + (i * channels + c) * bytesPerSample, true);
        }
        mono[i] = (sum / channels) / 32768;
      }
      return { mono, sampleRate };
    }
    offset += 8 + size + (size & 1); // pad byte on odd chunks
  }
  throw new Error('WAV data chunk not found');
}

async function fetchAndCache(url, onProgress) {
  const cache = await caches.open(CACHE_NAME);

  const existing = await cache.match(url);
  if (existing) {
    const peek = new Uint8Array(await existing.clone().arrayBuffer(), 0, 4);
    if (isOnnxBytes(peek)) { onProgress(100); return true; }
    await cache.delete(url);
  }

  const response = await fetch(url);
  if (!response.ok) return false;

  const total = Number(response.headers.get('content-length') || 0);
  const reader = response.body.getReader();
  const chunks = [];
  let received = 0;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
    received += value.length;
    if (total) onProgress(Math.round((received / total) * 100));
  }

  const first = chunks[0];
  if (!first || !isOnnxBytes(first)) return false;

  const blob = new Blob(chunks);
  await cache.put(url, new Response(blob, { headers: { 'content-type': 'application/octet-stream' } }));
  onProgress(100);
  return true;
}
