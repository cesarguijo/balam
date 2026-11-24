/**
 * @file Firebase session adapter shared by both apps: fulfills the contract
 * `createSession` needs using Firebase Auth and Firestore. The collection
 * (`families` or `teachers`) comes as a parameter, so one adapter serves
 * every kind of user (ADR 0008).
 */

import { SessionError } from '../create-session.js';
import {
  doc,
  getConnection,
  getDoc,
  signInWithEmailAndPassword,
} from './connection.js';
import { translateFirebaseError } from './errors.js';

/**
 * Tells whether there is an open Firebase session on this device. Waits for
 * Firebase to restore the saved session: before that, `currentUser` is
 * `null` even if there is a session. Uses no internet and no Firestore reads.
 * @returns {Promise<boolean>} `true` if there is a session; `false` if the login must be shown.
 */
export async function hasSession() {
  const { auth } = getConnection();
  return auth.authStateReady().then(() => {
    return auth.currentUser !== null;
  });
}

/**
 * Logs out of Firebase on this device. Removing the stored user is not its
 * job: `createSession` does it after this promise fulfills.
 * @returns {Promise<void>} Fulfills when Firebase finished logging out.
 */
export async function logOut() {
  const { auth } = getConnection();
  return auth.signOut();
}

/**
 * Logs in to Firebase with username and password, and reads the user's
 * document only once. The username becomes a made-up email
 * (`username@balam.local`) because Firebase Auth asks for an email. If
 * anything fails after signing in, it signs out, so no half-open session is
 * left behind.
 * @param {string} username - Without the domain and already normalized by `validateCredentials`, e.g. `mariaperez1985`.
 * @param {string} password - The user's password.
 * @param {string} collection - Collection with one document per user, e.g. `'families'`.
 * @returns {Promise<object>} The raw document data plus `username`; `createSession` validates it.
 * @throws {SessionError} If the password is wrong, there is no internet,
 * the account is disabled or the document is missing.
 */
export async function logIn(username, password, collection) {
  const email = `${username}@balam.local`;
  const { auth } = getConnection();
  return signInWithEmailAndPassword(auth, email, password)
    .then(() => {
      return readUser(collection);
    })
    .catch((error) => {
      return auth.signOut().then(() => {
        if (error instanceof SessionError) {
          throw error;
        }
        throw new SessionError(translateFirebaseError(error.code), {
          cause: error,
        });
      });
    });
}

/**
 * Reads the document of the user with an open session. Used by `logIn`
 * right after signing in and by `refresh` to get the changes made on the
 * server. The username comes from the made-up email (`teacher7@balam.local`
 * → `teacher7`), so the documents do not have to store it.
 * @param {string} collection - Collection with one document per user, e.g. `'teachers'`.
 * @returns {Promise<object>} The raw document data plus `username`; `createSession` validates it.
 * @throws {SessionError} If there is no open session or the document is missing (`unknown`).
 */
export function readUser(collection) {
  const { auth, db } = getConnection();
  if (auth.currentUser === null) {
    throw new SessionError('unknown');
  }
  const email = auth.currentUser.email;
  const username = email?.split('@')[0];
  const uid = auth.currentUser.uid;
  const documentRef = doc(db, `${collection}/${uid}`);
  return getDoc(documentRef)
    .then((snapshot) => {
      if (snapshot.exists()) {
        return { username, ...snapshot.data() };
      } else {
        throw new SessionError('unknown');
      }
    })
    .catch((error) => {
      throw new SessionError(translateFirebaseError(error.code), {
        cause: error,
      });
    });
}
