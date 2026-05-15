import { useState, useEffect } from 'react';
import {
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithCredential,
  signOut as firebaseSignOut,
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebase';

// Google OAuth Web Client ID — see Firebase Console → Auth → Sign-in method → Google → Web SDK config
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

let _gisLoaded = false;
function loadGIS() {
  if (_gisLoaded || window.google?.accounts?.id) { _gisLoaded = true; return Promise.resolve(); }
  return new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = 'https://accounts.google.com/gsi/client';
    s.async = true;
    s.onload = () => { _gisLoaded = true; resolve(); };
    s.onerror = () => reject(new Error('Failed to load Google Identity Services'));
    document.head.appendChild(s);
  });
}

export function useAuth() {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 8000);
    const unsub = onAuthStateChanged(auth, (fu) => {
      clearTimeout(timer);
      setUser(fu ?? null);
      if (fu) ensureUserDoc(fu).catch(console.error);
      setLoading(false);
    });
    return () => { unsub(); clearTimeout(timer); };
  }, []);

  async function ensureUserDoc(fu) {
    try {
      const ref  = doc(db, 'users', fu.uid);
      const snap = await getDoc(ref);
      if (!snap.exists()) {
        await setDoc(ref, {
          email:               fu.email,
          displayName:         fu.displayName,
          photoURL:            fu.photoURL,
          plan:                'free',
          videosUsedThisMonth: 0,
          usagePeriodStart:    serverTimestamp(),
          subscriptionActive:  false,
          subscriptionExpiry:  null,
          createdAt:           serverTimestamp(),
        });
      }
    } catch (e) {
      console.warn('Firestore write skipped:', e.message);
    }
  }

  // Trigger sign-in via GIS One Tap / FedCM (works with COOP: same-origin).
  // Rejects with code 'auth/one-tap-unavailable' when One Tap cannot display;
  // caller should then use renderGISButton() to show Google's native button.
  async function signInWithGoogle() {
    if (!GOOGLE_CLIENT_ID) {
      throw Object.assign(
        new Error('VITE_GOOGLE_CLIENT_ID is not set — add it to .env.local'),
        { code: 'auth/missing-client-id' },
      );
    }

    await loadGIS();

    return new Promise((resolve, reject) => {
      window.google.accounts.id.initialize({
        client_id:           GOOGLE_CLIENT_ID,
        use_fedcm_for_prompt: true,
        callback: async ({ credential: idToken }) => {
          try {
            const cred = GoogleAuthProvider.credential(idToken);
            await signInWithCredential(auth, cred);
            resolve();
          } catch (err) {
            reject(err);
          }
        },
      });

      window.google.accounts.id.prompt((n) => {
        if (n.isNotDisplayed() || n.isSkippedMoment()) {
          reject(Object.assign(
            new Error(n.isNotDisplayed() ? n.getNotDisplayedReason() : n.getSkippedReason()),
            { code: 'auth/one-tap-unavailable' },
          ));
        }
      });
    });
  }

  // Mount Google's rendered button (FedCM-aware) into a DOM element.
  // Use this as a fallback when signInWithGoogle() rejects with auth/one-tap-unavailable.
  async function renderGISButton(container) {
    if (!GOOGLE_CLIENT_ID) return;
    await loadGIS();

    window.google.accounts.id.initialize({
      client_id:           GOOGLE_CLIENT_ID,
      use_fedcm_for_prompt: true,
      callback: async ({ credential: idToken }) => {
        try {
          const cred = GoogleAuthProvider.credential(idToken);
          await signInWithCredential(auth, cred);
        } catch (e) {
          console.error('GIS button sign-in failed:', e);
        }
      },
    });

    window.google.accounts.id.renderButton(container, {
      type:  'standard',
      theme: 'filled_black',
      size:  'large',
      text:  'continue_with',
      shape: 'pill',
      width: '360',
    });
  }

  async function signOut() {
    if (window.google?.accounts?.id) window.google.accounts.id.disableAutoSelect();
    await firebaseSignOut(auth);
  }

  return { user, loading, signInWithGoogle, renderGISButton, signOut };
}
