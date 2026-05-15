const CACHE_NAME = 'clearvoice-models-v1';

export const MODEL_INFO = {
  fast: { sizeMB: 52,  label: 'Fast Mode' },
  deep: { sizeMB: 207, label: 'Deep Clean' },
};

export async function areModelsReady(mode) {
  try {
    const cache = await caches.open(CACHE_NAME);
    const key = `/models/${mode}-ready`;
    const resp = await cache.match(key);
    return !!resp;
  } catch {
    return false;
  }
}

export async function markModelsReady(mode) {
  try {
    const cache = await caches.open(CACHE_NAME);
    await cache.put(`/models/${mode}-ready`, new Response('1'));
  } catch {
    // ignore
  }
}

export async function downloadModels(mode, onProgress) {
  // Models are bundled/served from /models/ — mark as ready immediately for now.
  // When real ONNX files are placed in public/models/, fetch them here and cache.
  onProgress?.(100, `${MODEL_INFO[mode].label} ready`);
  await markModelsReady(mode);
  return true;
}
