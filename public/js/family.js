/**
 * @file Family converter: turns unknown data into a clean Family, with only
 * what the app uses. It works for any source: the server (Firestore today,
 * PHP tomorrow) and the copy stored on the phone. It is pure (it does not
 * import Firebase or use the browser) so it can be tested in Node.
 *
 * If the data is wrong, it throws a TypeError with the detail for whoever
 * checks the console; the parent only sees an `unknown` error.
 */

/** @typedef {import('./session.js').Family} Family */
/** @typedef {import('./session.js').Child} Child */

/**
 * Checks that an item of the `children` list has a valid id, name and
 * grade. Throws if not, so a mistyped child does not silently disappear
 * from the app.
 * @param {unknown} childData - An item of the `children` list, as it came.
 * @param {number} position - Its place in the list, from 0 (the Firebase console numbers it the same way).
 * @returns {asserts childData is Child}
 * @throws {TypeError} If a field is missing or has the wrong type.
 */
function validateChild(childData, position) {
  if (!isObject(childData)) {
    throw new TypeError('Child ' + position + ' is not an object');
  }
  if (typeof childData.id !== 'string' || childData.id === '') {
    throw new TypeError('Child ' + position + ' has no text id');
  }
  if (typeof childData.name !== 'string' || childData.name === '') {
    throw new TypeError('Child ' + position + ' has no text name');
  }
  // Number.isInteger also rules out NaN and decimals, which typeof would accept as numbers.
  if (!Number.isInteger(childData.grade)) {
    throw new TypeError('Child ' + position + ' has no whole-number grade');
  }
}

/**
 * Checks that the family data has a username and at least one valid child.
 * Stops at the first error.
 * @param {unknown} familyData - The data as it came (from the server or the phone).
 * @returns {asserts familyData is Family}
 * @throws {TypeError} If a field is missing or has the wrong type.
 */
function validateFamily(familyData) {
  if (!isObject(familyData)) {
    throw new TypeError('The family is not an object');
  }
  if (typeof familyData.username !== 'string' || familyData.username === '') {
    throw new TypeError('The family has no text username');
  }
  if (!Array.isArray(familyData.children) || familyData.children.length === 0) {
    throw new TypeError('The family has no list with at least one child');
  }
  familyData.children.forEach(validateChild);
}

/**
 * Turns the already validated children list into clean children: builds new
 * objects with only id, name and grade, so extra fields (grades, data the
 * teacher adds on the server) are not stored on the phone.
 * @param {Child[]} children - The children list, already validated by `validateFamily`.
 * @returns {Child[]} A new list, with only the fields the app uses.
 */
function toChildren(children) {
  return children.map(({ id, name, grade }) => ({ id, name, grade }));
}

/**
 * Turns data of unknown origin into a Family, or fails if it does not have
 * its shape. It is the app's customs office: everything that claims to be a
 * family goes through here.
 * @param {unknown} data - E.g. `snapshot.data()` from Firestore or `JSON.parse` of what the phone stored.
 * @returns {Family} The family, with only the username and each child's id, name and grade.
 * @throws {TypeError} If the data does not have the shape of a Family.
 */
export function toFamily(data) {
  validateFamily(data);
  return {
    username: data.username,
    children: toChildren(data.children),
  };
}

/**
 * Tells whether a value is an object with properties that can be checked.
 * It does not throw: each validation decides its own message.
 * @param {unknown} x - Any value, e.g. what `JSON.parse` returns.
 * @returns {x is Record<string, unknown>} `true` if it is an object (and not `null`).
 */
function isObject(x) {
  return typeof x === 'object' && x !== null;
}
