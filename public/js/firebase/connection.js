/**
 * @file Firebase connection: initializes the project and exports what the
 * session adapter uses. Only the Firebase files import it; it is deleted
 * when moving to PHP (ADR 0008).
 *
 * The config is public by design: security lives in the Firestore rules,
 * not in hiding this data.
 *
 * The Firebase version (13.3.0) shows up in three places that must change
 * together: the CDN URLs in this file, `firebase` in package.json (for the
 * types) and `paths` in jsconfig.json.
 */

import { initializeApp } from 'https://www.gstatic.com/firebasejs/13.3.0/firebase-app.js';
import {
  getAuth,
  signInWithEmailAndPassword,
} from 'https://www.gstatic.com/firebasejs/13.3.0/firebase-auth.js';
import {
  doc,
  getDoc,
  getFirestore,
} from 'https://www.gstatic.com/firebasejs/13.3.0/firebase-firestore.js';

const firebaseConfig = {
  apiKey: 'AIzaSyD-xPIIi_23crQ6Orm6YuAVyPXjXr8BH2Q',
  authDomain: 'balam-math.firebaseapp.com',
  projectId: 'balam-math',
  storageBucket: 'balam-math.firebasestorage.app',
  messagingSenderId: '1054293458563',
  appId: '1:1054293458563:web:4f16863b5a35a8e6ff25b6',
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
// Re-exported with Firebase's own names, so the adapter reads like the
// Firebase docs and only this file knows the CDN URLs.
export { doc, getDoc, signInWithEmailAndPassword };
