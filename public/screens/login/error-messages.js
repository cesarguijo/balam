/**
 * @file Login error messages: picks the text the parent sees when they
 * cannot log in, based on the error type (session or validation). It is
 * pure (it does not touch the DOM) so it can be tested in Node.
 */

import { t } from '../../js/i18n/es.js';

/** @typedef {import('../../js/session.js').SessionErrorType} SessionErrorType */
/** @typedef {import('./validation.js').ValidationErrorType} ValidationErrorType */
/** @typedef {import('../../js/i18n/es.js').MessageKey} MessageKey */

/**
 * Maps each error type to its catalog key. The types come from session.js
 * and validation.js; the texts live in the catalog, so this file holds no
 * user-facing strings.
 *
 * Every text must be 60 characters or less: that is the room the screen has
 * in the Figma design (the tests check it).
 * @type {Record<SessionErrorType | ValidationErrorType, MessageKey>}
 */
const messageKeys = {
  'wrong-credentials': 'login.error.wrongCredentials',
  offline: 'login.error.offline',
  'account-disabled': 'login.error.accountDisabled',
  'too-many-attempts': 'login.error.tooManyAttempts',
  unknown: 'login.error.unknown',
  'password-empty': 'login.error.passwordEmpty',
  'username-invalid': 'login.error.usernameInvalid',
  'username-empty': 'login.error.usernameEmpty',
};

/**
 * Returns the message the login screen shows for an error type.
 * If the type is not recognized, returns the `unknown` message: that way
 * the screen is never left without text, even if the error is not a
 * session one.
 * @param {string | undefined} type - The `type` of the SessionError; it can
 *   be `undefined` if the error is of another class.
 * @returns {string} The message to show the parent.
 */
export function getErrorMessage(type) {
  if (type !== undefined && Object.hasOwn(messageKeys, type)) {
    // The cast is safe: Object.hasOwn already confirmed that type is a key
    // of messageKeys, but TypeScript does not infer it on its own.
    return t(messageKeys[/** @type {SessionErrorType} */ (type)]);
  }
  return t(messageKeys.unknown);
}
