/**
 * @file Login error messages: picks the text the parent sees when they
 * cannot log in, based on the error type (session or validation). It is
 * pure (it does not touch the DOM) so it can be tested in Node.
 */

import { t } from '../../js/i18n/es.js';

/** @typedef {import('../../js/create-session.js').SessionErrorType} SessionErrorType */
/** @typedef {import('./validation.js').ValidationErrorType} ValidationErrorType */
/** @typedef {import('../../js/i18n/es.js').MessageKey} MessageKey */
/** @typedef {import('../../js/icons.js').IconName} IconName */

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

/**
 * Returns where the login screen shows an error. Validation errors know
 * which field is wrong, so they go under that field; server errors do not,
 * so they go in the banner under the button. The field places match the
 * inputs' `name`, so the screen can find the field without an `if`.
 * Unknown types go to the banner, next to the `unknown` message that
 * `getErrorMessage` gives them.
 * @param {string | undefined} type - The error type, e.g. `password-empty` or `offline`.
 * @returns {'username' | 'password' | 'banner'} Where the error is shown.
 */
export function getErrorPlace(type) {
  if (type === 'username-invalid' || type === 'username-empty') {
    return 'username';
  }
  if (type === 'password-empty') return 'password';
  return 'banner';
}

/**
 * Maps each server error to the icon of its banner, so the parent can tell
 * the problem at a glance. Validation errors are not here: the text field
 * already draws its own icon next to the message.
 * @type {Record<SessionErrorType, IconName>}
 */
const errorIcon = {
  'wrong-credentials': 'shield-exclamation',
  offline: 'wifi-off',
  'account-disabled': 'user-off',
  'too-many-attempts': 'clock',
  unknown: 'alert-circle',
};

/**
 * Returns the icon the login banner shows for an error type. Uses
 * `Object.hasOwn` so inherited keys such as `toString` do not return a
 * function; any type without its own icon gets `alert-circle`.
 * @param {string | undefined} type - The error type, e.g. `offline`.
 * @returns {IconName} The icon name for `icon()`, e.g. `wifi-off`.
 */
export function getErrorIcon(type) {
  if (type) {
    return Object.hasOwn(errorIcon, type)
      ? errorIcon[/** @type {SessionErrorType} */ (type)]
      : 'alert-circle';
  } else return 'alert-circle';
}
