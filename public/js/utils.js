/**
 * @file General-purpose helpers shared by several screens.
 */

/**
 * Pauses the code for the given time.
 * @param {number} ms - Waiting time in milliseconds.
 * @returns {Promise<void>} A promise that fulfills when the wait is over.
 */
export function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Tells whether a value is an object with properties that can be checked.
 * It does not throw: each validation decides its own message.
 * @param {unknown} x - Any value, e.g. what `JSON.parse` returns.
 * @returns {x is Record<string, unknown>} `true` if it is an object (and not `null`).
 */
export function isObject(x) {
  return typeof x === 'object' && x !== null;
}

/**
 * Tells whether a value is text with at least one character.
 * @param {unknown} x - Any value, e.g. a field read from the server.
 * @returns {x is string} `true` if it is a string and not `''`.
 */
export function hasText(x) {
  return typeof x === 'string' && x !== '';
}

/**
 * Throws if a value is not text with at least one character. After the
 * call, the editor knows the value is a string.
 * @param {unknown} value - The value to check, e.g. `childData.id`.
 * @param {string} message - What the error says, e.g. `'Child 0 has no text id'`.
 * @returns {asserts value is string}
 * @throws {TypeError} If the value is not a non-empty string.
 */
export function assertText(value, message) {
  if (!hasText(value)) throw new TypeError(message);
}

/**
 * Throws if a value is not a whole number. `Number.isInteger` also rules out
 * `NaN` and decimals, which `typeof` would accept as numbers.
 * @param {unknown} value - The value to check, e.g. `childData.grade`.
 * @param {string} message - What the error says, e.g. `'Child 0 has no whole-number grade'`.
 * @returns {asserts value is number}
 * @throws {TypeError} If the value is not a whole number.
 */
export function assertInteger(value, message) {
  if (!Number.isInteger(value)) throw new TypeError(message);
}

/**
 * Throws if a value is not an object (or is `null`). After the call, the
 * editor knows its properties can be read.
 * @param {unknown} value - The value to check, e.g. `childData`.
 * @param {string} message - What the error says, e.g. `'Child 0 is not an object'`.
 * @returns {asserts value is Record<string, unknown>}
 * @throws {TypeError} If the value is not an object.
 */
export function assertObject(value, message) {
  if (!isObject(value)) {
    throw new TypeError(message);
  }
}

/**
 * Throws if a value is not a list with at least one item. It only checks
 * the list: each item is still `unknown` until its own validation.
 * @param {unknown} value - The value to check, e.g. `familyData.children`.
 * @param {string} message - What the error says, e.g. `'The family has no list with at least one child'`.
 * @returns {asserts value is unknown[]}
 * @throws {TypeError} If the value is not an array or is empty.
 */
export function assertItems(value, message) {
  if (!Array.isArray(value) || value.length === 0) throw new TypeError(message);
}

/**
 * Throws if a value is missing: `null` or `undefined`. Other "empty" values
 * such as `0` or `''` pass. After the call, the editor removes `null` and
 * `undefined` from the value's type (e.g. `string | null` becomes `string`).
 * @template T
 * @param {T} value - The value to check, e.g. `auth.currentUser`.
 * @param {string} message - What the error says, e.g. `'There is no logged-in user'`.
 * @returns {asserts value is NonNullable<T>}
 * @throws {TypeError} If the value is `null` or `undefined`.
 */
export function assertValue(value, message) {
  if (value === null || value === undefined) throw new TypeError(message);
}
