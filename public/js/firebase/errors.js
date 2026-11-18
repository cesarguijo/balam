/**
 * @file Firebase errors: translates Firebase error codes into SessionError
 * and NoticeError types. It is pure (it only compares strings, it does not
 * import Firebase) so it can be tested in Node. It is deleted together with the other
 * Firebase files when moving to PHP (ADR 0008).
 */

/** @typedef {import('../session.js').SessionErrorType} SessionErrorType */
/** @typedef {import('../notices.js').NoticeErrorType} NoticeErrorType */

/**
 * Maps each Firebase error code to the type the app understands. Several
 * codes give `wrong-credentials` on purpose: the login never says whether
 * the username or the password failed, so nobody can find out which
 * usernames exist.
 * @type {Record<string, SessionErrorType>}
 */
const errorTypes = {
  'auth/invalid-credential': 'wrong-credentials',
  'auth/wrong-password': 'wrong-credentials',
  'auth/user-not-found': 'wrong-credentials',
  'auth/invalid-email': 'wrong-credentials',
  'auth/missing-password': 'wrong-credentials',
  'auth/network-request-failed': 'offline',
  'auth/timeout': 'offline',
  'auth/user-disabled': 'account-disabled',
  'auth/too-many-requests': 'too-many-attempts',
};

/**
 * Maps each Firestore error code to the notice error type. Firestore codes
 * have no prefix, unlike the Auth ones (`auth/...`).
 * @type {Record<string, NoticeErrorType>}
 */
const noticeErrorTypes = {
  unavailable: 'offline',
  'permission-denied': 'not-allowed',
  'not-found': 'not-found',
};

/**
 * Translates a Firebase error code into the app's error type. If it does
 * not recognize the code, returns `unknown`: that way no Firebase error
 * reaches the screens untranslated.
 * @param {string | undefined} code - The Firebase error code (`error.code`), e.g. `auth/user-disabled`; it can be `undefined` if the error is not from Firebase.
 * @returns {SessionErrorType} The error type the login screen understands.
 */
export function translateFirebaseError(code) {
  if (code !== undefined && Object.hasOwn(errorTypes, code)) {
    return errorTypes[code];
  }
  return 'unknown';
}

/**
 * Translates a Firestore error code into the notice error type. If it does
 * not recognize the code, returns `unknown`. The errors that are not from
 * Firebase (e.g. the `TypeError` from `toNotice` when a notice is damaged)
 * have no code, so they also end up as `unknown`.
 * @param {string | undefined} code - The Firestore error code (`error.code`), e.g. `permission-denied`; it can be `undefined` if the error is not from Firebase.
 * @returns {NoticeErrorType} The error type the notice screens understand.
 */
export function translateNoticeError(code) {
  if (code !== undefined && Object.hasOwn(noticeErrorTypes, code)) {
    return noticeErrorTypes[code];
  }
  return 'unknown';
}
