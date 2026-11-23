/**
 * @file Firebase connection: initializes the project and exports what the
 * adapters use. Only the Firebase files import it; it is deleted
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
  collection,
  where,
  orderBy,
  query,
  getDocs,
  addDoc,
  serverTimestamp,
  updateDoc,
  deleteDoc,
} from 'https://www.gstatic.com/firebasejs/13.3.0/firebase-firestore.js';

const firebaseConfig = {
  apiKey: 'AIzaSyD-xPIIi_23crQ6Orm6YuAVyPXjXr8BH2Q',
  authDomain: 'balam-math.firebaseapp.com',
  projectId: 'balam-math',
  storageBucket: 'balam-math.firebasestorage.app',
  messagingSenderId: '1054293458563',
  appId: '1:1054293458563:web:4f16863b5a35a8e6ff25b6',
};

/**
 * Firebase services of one app (families or teachers) that the adapters use.
 * @typedef {object} Connection
 * @property {import('https://www.gstatic.com/firebasejs/13.3.0/firebase-auth.js').Auth} auth - Login service; keeps the session of this connection.
 * @property {import('https://www.gstatic.com/firebasejs/13.3.0/firebase-firestore.js').Firestore} db - Database the adapters read and write.
 */

/**
 * The app's connection, saved by `connect` so the adapters can ask for it
 * with `getConnection`. `null` until the app calls `connect`.
 * @type {Connection | null}
 */
let connection = null;

/**
 * Connects to the Firebase project under its own name. Firebase saves the
 * session per name, so each app keeps its session apart even in the same
 * browser (ADR 0012). Each app calls it only once: a second call with the
 * same name throws.
 * @param {string} name - Name of the connection, e.g. `'families'` or
 * `'teachers'`.
 * @returns {Connection} The login service and the database of this connection.
 */
export function connect(name) {
  const app = initializeApp(firebaseConfig, name);

  const auth = getAuth(app);
  const db = getFirestore(app);
  connection = { auth, db };
  return connection;
}

/**
 * Returns the connection the app created with `connect`. The adapters ask
 * for it on each call, so they work in both apps without knowing which one
 * they are in.
 * @returns {Connection} The login service and the database of this app.
 * @throws {Error} If the app has not called `connect` yet.
 */
export function getConnection() {
  if (connection === null) {
    throw new Error('connect() was not called');
  }
  return connection;
}

// Re-exported with Firebase's own names, so the adapter reads like the
// Firebase docs and only this file knows the CDN URLs.
export {
  doc,
  getDoc,
  signInWithEmailAndPassword,
  collection,
  where,
  orderBy,
  query,
  getDocs,
  addDoc,
  serverTimestamp,
  updateDoc,
  deleteDoc,
};
