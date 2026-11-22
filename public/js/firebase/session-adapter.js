/**
 * @file Firebase session adapter: fulfills the session.js contract using
 * Firebase Auth and Firestore. It is the only file that imports Firebase;
 * the rest of the app does not know it exists (ADR 0008).
 *
 * It only talks to the server: storing the family on the phone is done by
 * session.js, so it is not repeated in each adapter (Firebase today, PHP
 * tomorrow).
 */

// Circular import on purpose: session.js imports this file and this one
// imports SessionError from session.js. It works because SessionError is only
// used inside the functions, when both modules have finished loading.
import { SessionError } from '../session.js';
import {
  auth,
  db,
  doc,
  getDoc,
  signInWithEmailAndPassword,
} from './connection.js';
import { translateFirebaseError } from './errors.js';
import { toFamily } from '../family.js';

/** @typedef {import('../session.js').Family} Family */

/**
 * Tells whether there is an open Firebase session on this phone. Waits for
 * Firebase to restore the saved session: before that, `currentUser` is
 * `null` even if there is a session. Uses no internet and no Firestore reads.
 * @returns {Promise<boolean>} `true` if there is a session; `false` if the login must be shown.
 */
export async function hasSession() {
  return auth.authStateReady().then(() => {
    return auth.currentUser !== null;
  });
}

/**
 * Reads the family of the open session again from Firestore, so the phone
 * gets the changes the teacher made (a new child, another group). Waits for
 * Firebase to restore the session first, like `hasSession`.
 * @returns {Promise<Family>} The family, already validated by `toFamily`.
 */
export function getFamily() {
  return auth.authStateReady().then(() => {
    if (auth.currentUser === null) {
      throw new SessionError('unknown');
    }
    return readFamily(auth.currentUser.uid).catch((error) => {
      throw new SessionError(translateFirebaseError(error.code), {
        cause: error,
      });
    });
  });
}

/**
 * Logs in to Firebase with username and password, and reads the family
 * document (`families/{uid}`) only once. The username becomes a made-up
 * email (`username@balam.local`) because Firebase Auth asks for an email.
 * @param {string} username - The family's username, without the domain and already normalized by `validateCredentials`, e.g. `mariaperez1985`.
 * @param {string} password - Password the teacher handed out on paper.
 * @returns {Promise<Family>} The family, already validated by `toFamily`.
 * @throws {SessionError} If the password is wrong, there is no internet,
 * the account is disabled or the family document is missing or malformed.
 */
export async function logIn(username, password) {
  const email = `${username}@balam.local`;
  return signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const uid = userCredential.user.uid;

      return readFamily(uid);
    })
    .catch((error) => {
      return auth.signOut().then(() => {
        throw new SessionError(translateFirebaseError(error.code), {
          cause: error,
        });
      });
    });
}

/**
 * Logs out of Firebase on this phone. Removing the stored family is not its
 * job: session.js does it after this promise fulfills.
 * @returns {Promise<void>} Fulfills when Firebase finished logging out.
 */
export async function logOut() {
  return auth.signOut();
}

/**
 * Reads the family document (`families/{uid}`) and validates it. Shared by
 * `logIn` and `getFamily` so both read and check the family the same way.
 * @param {string} uid - Firebase Auth id of the family account.
 * @returns {Promise<Family>} The family, already validated by `toFamily`.
 * @throws {SessionError} If the document is missing (`unknown`).
 */
function readFamily(uid) {
  const documentRef = doc(db, `families/${uid}`);
  return getDoc(documentRef).then((snapshot) => {
    if (snapshot.exists()) {
      return toFamily(snapshot.data());
    } else {
      throw new SessionError('unknown');
    }
  });
}
