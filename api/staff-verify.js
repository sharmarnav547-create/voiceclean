// Vercel serverless function — password never exposed to the browser
export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).end();

  const { password } = req.body || {};
  // Set STAFF_PASSWORD in Vercel → Settings → Environment Variables
  const STAFF_PASSWORD = process.env.STAFF_PASSWORD || 'luoi4538';

  if (password === STAFF_PASSWORD) {
    const token = Buffer.from(`cv-staff-${Date.now()}`).toString('base64');
    return res.json({ ok: true, token });
  }

  return res.status(401).json({ ok: false, error: 'Wrong password' });
}
