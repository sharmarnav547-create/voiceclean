import {
  collection, addDoc, getDocs, updateDoc, doc,
  serverTimestamp, Timestamp, query, orderBy,
} from 'firebase/firestore';
import { db } from '../firebase';

const BACKEND = import.meta.env.VITE_BACKEND_URL || '';

// ── Auth ─────────────────────────────────────────────────────────

export async function verifyStaffPassword(password) {
  const res = await fetch(`${BACKEND}/api/staff-verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password }),
  });
  if (!res.ok) return false;
  const data = await res.json();
  if (data.ok) {
    sessionStorage.setItem('cv_staff_token', data.token);
    sessionStorage.setItem('cv_staff_until', String(Date.now() + 8 * 60 * 60 * 1000));
    return true;
  }
  return false;
}

export function isStaffLoggedIn() {
  const token = sessionStorage.getItem('cv_staff_token');
  const until = sessionStorage.getItem('cv_staff_until');
  return !!(token && until && Date.now() < Number(until));
}

export function staffLogout() {
  sessionStorage.removeItem('cv_staff_token');
  sessionStorage.removeItem('cv_staff_until');
}

// ── Image compression → base64 (no Storage needed) ───────────────

function compressImage(file, maxWidth = 900, quality = 0.75) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      let { width, height } = img;
      if (width > maxWidth) {
        height = Math.round(height * maxWidth / width);
        width = maxWidth;
      }
      const canvas = document.createElement('canvas');
      canvas.width  = width;
      canvas.height = height;
      canvas.getContext('2d').drawImage(img, 0, 0, width, height);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL('image/jpeg', quality));
    };
    img.onerror = reject;
    img.src = url;
  });
}

// ── Payment Requests ─────────────────────────────────────────────

export async function submitPaymentRequest({ userId, userEmail, userPhone, planId, planLabel, amount, receiptFile }) {
  const receiptBase64 = await compressImage(receiptFile);

  await addDoc(collection(db, 'paymentRequests'), {
    userId:        userId || 'guest',
    userEmail:     userEmail || '',
    userPhone,
    planId,
    planLabel,
    amount,
    receiptBase64,
    status:        'pending',
    submittedAt:   serverTimestamp(),
    approvedAt:    null,
    rejectedAt:    null,
    expiresAt:     null,
  });
}

export async function getAllRequests() {
  const q = query(collection(db, 'paymentRequests'), orderBy('submittedAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function approveRequest(requestId, userId, planId) {
  const now     = new Date();
  const expires = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

  await updateDoc(doc(db, 'paymentRequests', requestId), {
    status:     'approved',
    approvedAt: Timestamp.fromDate(now),
    expiresAt:  Timestamp.fromDate(expires),
  });

  if (userId && userId !== 'guest') {
    await updateDoc(doc(db, 'users', userId), {
      plan:               planId,
      subscriptionActive: true,
      subscriptionExpiry: Timestamp.fromDate(expires),
    });
  }
}

export async function rejectRequest(requestId) {
  await updateDoc(doc(db, 'paymentRequests', requestId), {
    status:     'rejected',
    rejectedAt: serverTimestamp(),
  });
}
