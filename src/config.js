export const TEST_MODE = false;

// ── UPI Payment Config — per-plan QR codes ──────────────────────
export const PLAN_QR = {
  starter: '/starter-qr.jpg',
  creator: '/creator-qr.jpg',
  pro:     '/pro-qr.jpg',
};

// Fallback (used if plan not found in PLAN_QR)
export const UPI_QR_URL = '/starter-qr.jpg';
