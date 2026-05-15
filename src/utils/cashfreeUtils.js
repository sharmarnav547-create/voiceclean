import { load } from '@cashfreepayments/cashfree-js';

let _cashfree = null;

export async function getCashfree() {
  if (!_cashfree) {
    _cashfree = await load({ mode: import.meta.env.VITE_CASHFREE_MODE || 'sandbox' });
  }
  return _cashfree;
}

export async function createOrder({ planId, planLabel, amount, userId, email }) {
  // Build return URL from the actual origin so it works on any port
  const returnUrl = `${window.location.origin}/?order_id={order_id}&plan=${planId}`;

  const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/create-order`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ planId, planLabel, amount, userId, email, returnUrl }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `Server error ${res.status}`);
  }

  return res.json(); // { payment_session_id, order_id }
}

export async function verifyOrder(orderId) {
  const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/verify-order`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ order_id: orderId }),
  });
  return res.json(); // { status, order_id }
}
