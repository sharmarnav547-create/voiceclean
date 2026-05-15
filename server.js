import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 8000;

// Cashfree credentials — NEVER expose SECRET to the frontend
const CF_APP_ID = process.env.CASHFREE_APP_ID;
const CF_SECRET = process.env.CASHFREE_SECRET;
const CF_BASE   = 'https://sandbox.cashfree.com/pg'; // change to api.cashfree.com for production

app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:5174'] }));
app.use(express.json());

/* ─── POST /api/staff-verify ──────────────────────────────────── */
app.post('/api/staff-verify', (req, res) => {
  const { password } = req.body || {};
  const STAFF_PASSWORD = process.env.STAFF_PASSWORD || 'luoi4538';
  if (password === STAFF_PASSWORD) {
    const token = Buffer.from(`cv-staff-${Date.now()}`).toString('base64');
    return res.json({ ok: true, token });
  }
  res.status(401).json({ ok: false, error: 'Wrong password' });
});

/* ─── POST /api/create-order ──────────────────────────────────────
   Body: { planId, planLabel, amount, userId, email }
   Returns: { payment_session_id, order_id }
──────────────────────────────────────────────────────────────────── */
app.post('/api/create-order', async (req, res) => {
  try {
    const { planId, planLabel, amount, userId, email, returnUrl } = req.body;

    if (!planId || !amount || !userId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const orderId = `cv_${planId}_${userId.slice(0, 8)}_${Date.now()}`;

    const response = await fetch(`${CF_BASE}/orders`, {
      method: 'POST',
      headers: {
        'x-api-version':    '2023-08-01',
        'x-client-id':      CF_APP_ID,
        'x-client-secret':  CF_SECRET,
        'Content-Type':     'application/json',
      },
      body: JSON.stringify({
        order_id:       orderId,
        order_amount:   amount,
        order_currency: 'INR',
        customer_details: {
          customer_id:    userId,
          customer_email: email || 'user@clearvoice.app',
          customer_phone: '9999999999',
        },
        order_meta: {
          return_url: returnUrl || `http://localhost:5173/?order_id={order_id}&plan=${planId}`,
        },
        order_note: `ClearVoice ${planLabel} — monthly`,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Cashfree error:', data);
      return res.status(response.status).json({ error: data.message || 'Order creation failed' });
    }

    res.json({
      payment_session_id: data.payment_session_id,
      order_id:           data.order_id,
    });
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/* ─── POST /api/verify-order ──────────────────────────────────────
   Body: { order_id }
   Returns: { status, plan }
──────────────────────────────────────────────────────────────────── */
app.post('/api/verify-order', async (req, res) => {
  try {
    const { order_id } = req.body;
    if (!order_id) return res.status(400).json({ error: 'order_id required' });

    const response = await fetch(`${CF_BASE}/orders/${order_id}`, {
      headers: {
        'x-api-version':   '2023-08-01',
        'x-client-id':     CF_APP_ID,
        'x-client-secret': CF_SECRET,
      },
    });

    const data = await response.json();
    res.json({
      status: data.order_status, // PAID | ACTIVE | EXPIRED
      order_id: data.order_id,
    });
  } catch (err) {
    res.status(500).json({ error: 'Verification failed' });
  }
});

app.listen(PORT, () => {
  console.log(`✅ ClearVoice server running at http://localhost:${PORT}`);
  console.log(`   Cashfree mode: SANDBOX (test)`);
});
