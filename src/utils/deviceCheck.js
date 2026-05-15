export async function checkWebGPU() {
  if (!('gpu' in navigator)) return false;
  try {
    const adapter = await navigator.gpu.requestAdapter();
    return adapter !== null;
  } catch {
    return false;
  }
}

export function gpuLabel(hasGPU) {
  if (hasGPU === null) return null;
  return hasGPU
    ? '🟢 GPU detected — processing will be fast'
    : '🟡 No GPU — processing will take longer';
}
