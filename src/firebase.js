import { initializeApp, getApps, getApp } from 'firebase/app';
import { initializeAuth, getAuth, indexedDBLocalPersistence, browserPopupRedirectResolver } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey:            "AIzaSyCAph4ZWH9XP9Xtyhgj4RDfEpAUsz-EZXc",
  authDomain:        "clearvoice-a11ab.firebaseapp.com",
  projectId:         "clearvoice-a11ab",
  storageBucket:     "clearvoice-a11ab.firebasestorage.app",
  messagingSenderId: "988333009041",
  appId:             "1:988333009041:web:ba8a2bf265bf5b91e27730",
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

let auth;
try {
  auth = initializeAuth(app, {
    persistence:           indexedDBLocalPersistence,
    popupRedirectResolver: browserPopupRedirectResolver,
  });
} catch {
  auth = getAuth(app);
}

export { auth };
export const db = getFirestore(app);
