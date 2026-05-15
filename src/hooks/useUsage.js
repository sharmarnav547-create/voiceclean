import { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { TEST_MODE } from '../config';

export function useUsage(user) {
  const [usage, setUsage] = useState({ plan: TEST_MODE ? 'pro' : 'free', videosUsedThisMonth: 0, loading: !TEST_MODE });

  useEffect(() => {
    if (TEST_MODE) return;
    if (!user) { setUsage({ plan: 'free', videosUsedThisMonth: 0, loading: false }); return; }
    loadUsage();
  }, [user]);

  async function loadUsage() {
    try {
      const ref  = doc(db, 'users', user.uid);
      const snap = await getDoc(ref);
      if (!snap.exists()) { setUsage({ plan: 'free', videosUsedThisMonth: 0, loading: false }); return; }

      let data = snap.data();

      // Auto-expire subscription
      if (data.subscriptionActive && data.subscriptionExpiry) {
        const expiry = data.subscriptionExpiry.toDate();
        if (expiry < new Date()) {
          await updateDoc(ref, { plan: 'free', subscriptionActive: false });
          data = { ...data, plan: 'free', subscriptionActive: false };
        }
      }

      // Reset monthly video counter after 30 days
      const periodStart = data.usagePeriodStart?.toDate?.() || new Date();
      const daysSince   = (Date.now() - periodStart.getTime()) / (1000 * 60 * 60 * 24);
      if (daysSince > 30) {
        await updateDoc(ref, { videosUsedThisMonth: 0, usagePeriodStart: serverTimestamp() });
        setUsage({ plan: data.plan || 'free', videosUsedThisMonth: 0, loading: false });
      } else {
        setUsage({ plan: data.plan || 'free', videosUsedThisMonth: data.videosUsedThisMonth || 0, loading: false });
      }
    } catch (e) {
      console.warn('Firestore read failed:', e.message);
      setUsage({ plan: 'free', videosUsedThisMonth: 0, loading: false });
    }
  }

  async function incrementUsage() {
    if (!user) return;
    try {
      const ref  = doc(db, 'users', user.uid);
      const snap = await getDoc(ref);
      if (!snap.exists()) return;
      const current = snap.data().videosUsedThisMonth || 0;
      await updateDoc(ref, { videosUsedThisMonth: current + 1 });
      setUsage(p => ({ ...p, videosUsedThisMonth: current + 1 }));
    } catch (e) { console.warn('Firestore write failed:', e.message); }
  }

  async function upgradePlan(planId) {
    if (!user) return;
    try {
      await updateDoc(doc(db, 'users', user.uid), { plan: planId, subscriptionActive: true, usagePeriodStart: serverTimestamp() });
      setUsage(p => ({ ...p, plan: planId }));
    } catch (e) {
      setUsage(p => ({ ...p, plan: planId }));
    }
  }

  return { ...usage, incrementUsage, upgradePlan, reload: loadUsage };
}
