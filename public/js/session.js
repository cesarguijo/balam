/**
 * @file Balam session: connects the app with the login service (Firebase
 * today, PHP tomorrow). It is the only thing the rest of the app imports for
 * the session; see ADR 0008.
 */

import * as adapter from './firebase/session-adapter.js';
import { toFamily } from './family.js';
import { clearNotices } from './notices.js';

/**
 * Name the family is stored under in `localStorage`. It is a constant
 * because it is used to save, read and remove: a typo in only one of them
 * would throw no error, it would just find nothing.
 */
const FAMILY_KEY = 'family';

/**
 * Login error types. The login screen shows a different message for each.
 * - `wrong-credentials`: the username or the password is wrong (it never
 *   says which one).
 * - `offline`: there is no internet.
 * - `account-disabled`: the teacher disabled the account.
 * - `too-many-attempts`: many errors in a row; the person has to wait.
 * - `unknown`: any other server error.
 * @typedef {'wrong-credentials' | 'offline' | 'account-disabled' | 'too-many-attempts' | 'unknown'} SessionErrorType
 */

/**
 * Login error, with its type so the screen knows what to show. The adapters
 * (Firebase, PHP) throw it instead of their own errors.
 */
export class SessionError extends Error {
  /**
   * @param {SessionErrorType} type - What went wrong.
   * @param {ErrorOptions} [options] - Extra details, such as the `cause` of the error.
   */
  constructor(type, options) {
    super(`Could not log in: ${type}`, options);
    this.name = 'SessionError';
    this.type = type;
  }
}

/**
 * A child of the family who studies at the school. It only holds what is
 * needed when the app opens; each screen asks for their grades and notices
 * (ADR 0008).
 * @typedef {object} Child
 * @property {string} id - Identifies the child; screens use it to ask for their data.
 * @property {string} name - The child's name, so the parent can pick them in the app.
 * @property {number} grade - School grade they are enrolled in this year, e.g. `7`.
 * @property {string} groupId - Grade and section, e.g. `'7-1'`; the screens use it to ask for the group's notices (ADR 0010).
 */

/**
 * A family account: shared by the parents or guardians of one or more
 * children at the school. It has no id of its own: the server already knows
 * who it is from the session.
 * @typedef {object} Family
 * @property {string} username - Name the family logs in with, e.g. `perez.family`.
 * @property {Child[]} children - One or more children enrolled at the school.
 */

/**
 * Logs out on this phone and removes the stored family and the copy of the
 * notices, so the next family on the same phone never sees them. The next
 * time the app opens, it shows the login. Removes the copies only after the
 * adapter logged out, so there is never a session without a family.
 * @returns {Promise<void>} Fulfills when the session and the copies are gone.
 */
export function logOut() {
  return adapter.logOut().then(() => {
    localStorage.removeItem(FAMILY_KEY);
    clearNotices();
  });
}

/**
 * Returns the family with an open session on this phone, or `null` if there
 * is no session. First asks the adapter whether the session is still alive
 * (the one the server recognizes) and then reads the copy saved by `logIn`,
 * so opening the app does not spend server reads.
 *
 * If the copy is damaged or comes from an old version of the app, it logs
 * out instead of failing: that way the parent goes back to the login and
 * does not get stuck.
 * @returns {Promise<Family | null>} The family, or `null` if the login must be shown.
 */
export function getSession() {
  const text = localStorage.getItem(FAMILY_KEY);
  return adapter
    .hasSession()
    .then((hasSession) => {
      if (!hasSession || text === null) return null;
      return toFamily(JSON.parse(text));
    })
    .catch((error) => {
      console.warn('The stored family is not valid; logging out.', error);
      return logOut().then(() => null);
    });
}

/**
 * Logs in on this phone. The session stays saved: the parent does not have
 * to type their password again.
 * @param {string} username - The family's username, already normalized by `validateCredentials`, e.g. `mariaperez1985`.
 * @param {string} password - Password the teacher handed out on paper.
 * @returns {Promise<Family>} The family that logged in.
 * @throws {SessionError} If the password is wrong, there is no internet or
 * the account is disabled (see `SessionErrorType`).
 */
export async function logIn(username, password) {
  const family = await adapter.logIn(username, password);
  localStorage.setItem(FAMILY_KEY, JSON.stringify(family));
  return family;
}
