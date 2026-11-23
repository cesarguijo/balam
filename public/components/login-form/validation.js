/**
 * @file Login validation: checks the username and password before calling
 * the server, so a call that would fail anyway is not spent and the parent
 * gets a clear message. It is pure (it does not touch the DOM) so it can be
 * tested in Node. It is a convenience, not a protection: the server always
 * decides whether the password is right.
 */

/**
 * Validation error types. Unlike `SessionErrorType`, they are detected
 * instantly on the phone, without waiting for the server.
 * - `username-empty`: no username typed (or only spaces).
 * - `username-invalid`: after normalizing, there are characters that are not letters `a-z` or numbers.
 * - `password-empty`: no password typed (or only spaces).
 * @typedef {'username-empty' | 'username-invalid' | 'password-empty'} ValidationErrorType
 */

/**
 * Validation result. It has two shapes, told apart by `valid`.
 * @typedef {{ valid: true, username: string } | { valid: false, error: ValidationErrorType }} ValidationResult
 */

/**
 * Cleans the username of what the phone or the parent adds by accident:
 * accents and ñ, spaces at the ends and capital letters. It does not check
 * whether the result is valid; `usernameError` does that.
 * @param {string} username - The username as the parent typed it, e.g. ` MÚÑOZ1990 `.
 * @returns {string} The clean username, e.g. `munoz1990`.
 */
function normalize(username) {
  // NFD (Normalization Form Decomposition) splits each letter from its marks (accents, tilde, diaeresis, etc.).
  // In /\p{M}/gu, \p{M} matches the marks drawn over the letter; g (global) means all of them and u (unicode) is required for \p{...} to work.
  // trim() removes the spaces at the ends.
  return username.normalize('NFD').replace(/\p{M}/gu, '').trim().toLowerCase();
}

/**
 * Finds the first username error: first whether it is empty and then
 * whether it has something that is not a letter `a-z` or a number. Expects
 * the username already normalized, which is why it rejects capitals and
 * accents.
 * @param {string} normalizedUsername - The username returned by `normalize`.
 * @returns {ValidationErrorType | null} The error, or `null` if the username is valid.
 */
function usernameError(normalizedUsername) {
  if (normalizedUsername === '') return 'username-empty';
  else if (!/^[a-z0-9]+$/.test(normalizedUsername)) return 'username-invalid';
  return null;
}

/**
 * Checks whether the password is empty or only spaces. Uses `trim` only to
 * check: the password is not changed, because a space can be part of it.
 * @param {string} password - The password as the parent typed it.
 * @returns {ValidationErrorType | null} `password-empty`, or `null` if the password has something.
 */
function passwordError(password) {
  if (password.trim() === '') return 'password-empty';
  return null;
}

/**
 * Checks the username and password the parent typed. Fixes what can be
 * fixed without doubt (the keyboard's automatic capital, the autocorrect's
 * space, accents) and rejects only what is still wrong after fixing: that
 * way the parent does not get an error for something that was not their
 * fault.
 * @param {string} username - The username as the parent typed it, e.g. ` María1985`.
 * @param {string} password - The password as the parent typed it.
 * @returns {ValidationResult} The normalized username, or the first error found.
 */
export function validateCredentials(username, password) {
  const normalizedUsername = normalize(username);
  const error = usernameError(normalizedUsername) ?? passwordError(password);
  if (error) return { valid: false, error: error };
  return { valid: true, username: normalizedUsername };
}
