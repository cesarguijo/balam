/**
 * @file Balam session: connects the app with the login service (Firebase
 * today, PHP tomorrow). It is the only thing the rest of the app imports for
 * the session; see ADR 0008.
 */

import * as adapter from './firebase/auth-adapter.js';

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
 * The session functions one app gets from `createSession`, already set up
 * for its kind of user (a family or a teacher).
 * @template T
 * @typedef {object} Session
 * @property {(username: string, password: string) => Promise<T>} logIn - Logs in and stores the user on this device.
 * @property {() => Promise<void>} logOut - Logs out and removes the stored copies.
 * @property {() => Promise<T | null>} getSession - The stored user, or `null` if the login must be shown.
 * @property {() => Promise<T>} refresh - Reads the user from the server again and replaces the stored copy.
 * @property {() => Date | null} getLastRefreshDate - When the user was last read from the server.
 */

/**
 * Builds the session functions for one kind of user. Families and teachers
 * log in, store and log out the same way; only these options change. The
 * returned functions are closures: they remember the options without
 * receiving them again.
 * @template T
 * @param {object} options - What makes this session different from the others.
 * @param {string} options.key - Name the user is stored under in `localStorage`, e.g. `'family'`. Both apps share `localStorage`, so each one needs its own.
 * @param {string} options.collection - Server collection with one document per user, e.g. `'families'`.
 * @param {(data: unknown) => T} options.convert - Checks and cleans the raw data, e.g. `toFamily`. It throws a TypeError if the data is malformed.
 * @param {() => void} [options.onLogOut] - Extra cleanup after logging out, e.g. `clearNotices`. Optional.
 * @returns {Session<T>} The session functions, ready to export.
 */
export function createSession({ key, collection, convert, onLogOut }) {
  /**
   * Name the date of the last read from the server is stored under, in
   * milliseconds. Built from `key`, so the apps never share it.
   */
  const refreshKey = `${key}-last-refresh-date`;

  /**
   * Logs in on this device. If the user's document is malformed, it logs
   * out again, so no half-open session is left behind.
   * @param {string} username - Already normalized by `validateCredentials`, e.g. `mariaperez1985`.
   * @param {string} password - The user's password.
   * @returns {Promise<T>} The user that logged in.
   * @throws {SessionError} If the login fails or the document is malformed.
   */
  async function logIn(username, password) {
    const data = await adapter.logIn(username, password, collection);
    let user;
    try {
      user = convert(data);
    } catch (error) {
      await adapter.logOut();
      throw new SessionError('unknown', { cause: error });
    }

    localStorage.setItem(key, JSON.stringify(user));
    localStorage.setItem(refreshKey, String(Date.now()));
    return user;
  }

  /**
   * Logs out on this device and removes the stored copies, so the next
   * person on the same phone never sees them. Removes them only after the
   * server logged out, so there is never a session without a user.
   * @returns {Promise<void>} Fulfills when the session and the copies are gone.
   */
  async function logOut() {
    await adapter.logOut();
    localStorage.removeItem(key);
    localStorage.removeItem(refreshKey);
    onLogOut?.();
  }

  /**
   * Returns the user with an open session on this device, or `null`. Reads
   * the stored copy instead of the server, so opening the app spends no
   * reads. If the copy is damaged or comes from an old version, it logs out
   * instead of failing, so the user goes back to the login.
   * @returns {Promise<T | null>} The user, or `null` if the login must be shown.
   */
  async function getSession() {
    const text = localStorage.getItem(key);

    try {
      const hasSession = await adapter.hasSession();
      if (!hasSession || text === null) return null;
      return convert(JSON.parse(text));
    } catch (error) {
      console.warn(`The stored ${key} is not valid: logging out`, error);
      await logOut();
      return null;
    }
  }

  /**
   * Reads the user from the server again and replaces the stored copy, so
   * the device gets the changes made on the server without logging out.
   * Only `convert` is inside the `try`: the adapter's own errors (e.g.
   * `offline`) must reach the screen untouched.
   * @returns {Promise<T>} The updated user.
   * @throws {SessionError} If there is no internet or the document is missing or malformed.
   */
  async function refresh() {
    const data = await adapter.readUser(collection);
    let user;
    try {
      user = convert(data);
    } catch (error) {
      throw new SessionError('unknown', { cause: error });
    }

    localStorage.setItem(key, JSON.stringify(user));
    localStorage.setItem(refreshKey, String(Date.now()));
    return user;
  }

  /**
   * Returns when the user was last read from the server (on login or on
   * refresh). Stored as milliseconds, returned as a `Date`.
   * @returns {Date | null} The date, or `null` if it was never stored.
   */
  function getLastRefreshDate() {
    if (localStorage.getItem(refreshKey) === null) return null;
    const dateNumber = Number(localStorage.getItem(refreshKey));
    return new Date(dateNumber);
  }

  return { logIn, logOut, getSession, refresh, getLastRefreshDate };
}
