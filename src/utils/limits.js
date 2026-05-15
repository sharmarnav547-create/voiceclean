export const LIMITS = {
  maxFileSizeMB: 500,
  warnDurationMinutes: {
    withGPU: 30,
    withoutGPU: 10,
  },
};

export function checkFileSize(file) {
  const sizeMB = file.size / (1024 * 1024);
  if (sizeMB > LIMITS.maxFileSizeMB) {
    return { ok: false, reason: `File too large (${Math.round(sizeMB)} MB). Limit: ${LIMITS.maxFileSizeMB} MB.` };
  }
  return { ok: true };
}

export function getDurationWarning(durationSec, hasGPU) {
  const warnMins = hasGPU ? LIMITS.warnDurationMinutes.withGPU : LIMITS.warnDurationMinutes.withoutGPU;
  if (durationSec > warnMins * 60) {
    const range = hasGPU ? '5–10 minutes' : '20–40 minutes';
    return `This video may take ${range} to process without a GPU. Consider a shorter clip first.`;
  }
  return null;
}
