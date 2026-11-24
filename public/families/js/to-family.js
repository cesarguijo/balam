/**
 * @file Family converter: turns unknown data into a clean Family, with only
 * what the app uses. It works for any source: the server (Firestore today,
 * PHP tomorrow) and the copy stored on the phone. It is pure (it does not
 * import Firebase or use the browser) so it can be tested in Node.
 *
 * If the data is wrong, it throws a TypeError with the detail for whoever
 * checks the console; the parent only sees an `unknown` error.
 */

import {
  assertInteger,
  assertItems,
  assertObject,
  assertText,
} from '../../js/utils.js';

/** @typedef {import('../js/family-session.js').Family} Family */
/** @typedef {import('../js/family-session.js').Child} Child */

/**
 * Checks that an item of the `children` list has a valid id, name, groupId
 * and grade. Throws if not, so a mistyped child does not silently disappear
 * from the app.
 * @param {unknown} childData - An item of the `children` list, as it came.
 * @param {number} position - Its place in the list, from 0 (the Firebase console numbers it the same way).
 * @returns {asserts childData is Child}
 * @throws {TypeError} If a field is missing or has the wrong type.
 */
function validateChild(childData, position) {
  assertObject(childData, `Child ${position} is not an object`);
  for (const key of ['id', 'name', 'groupId']) {
    assertText(childData[key], `Child ${position} has no text ${key}`);
  }
  assertInteger(
    childData.grade,
    'Child ' + position + ' has no whole-number grade',
  );
}

/**
 * Checks that the family data has a username and at least one valid child.
 * Stops at the first error.
 * @param {unknown} familyData - The data as it came (from the server or the phone).
 * @returns {asserts familyData is Family}
 * @throws {TypeError} If a field is missing or has the wrong type.
 */
function validateFamily(familyData) {
  assertObject(familyData, 'The family is not an object');

  assertText(familyData.username, 'The family has no text username');

  assertItems(
    familyData.children,
    'The family has no list with at least one child',
  );

  familyData.children.forEach(validateChild);
}

/**
 * Turns the already validated children list into clean children: builds new
 * objects with only id, name, grade and groupId, so extra fields (grades, data the
 * teacher adds on the server) are not stored on the phone.
 * @param {Child[]} children - The children list, already validated by `validateFamily`.
 * @returns {Child[]} A new list, with only the fields the app uses.
 */
function toChildren(children) {
  return children.map(({ id, name, grade, groupId }) => ({
    id,
    name,
    grade,
    groupId,
  }));
}

/**
 * Turns data of unknown origin into a Family, or fails if it does not have
 * its shape. It is the app's customs office: everything that claims to be a
 * family goes through here.
 * @param {unknown} data - E.g. `snapshot.data()` from Firestore or `JSON.parse` of what the phone stored.
 * @returns {Family} The family, with only the username and each child's id, name, grade and groupId.
 * @throws {TypeError} If the data does not have the shape of a Family.
 */
export function toFamily(data) {
  validateFamily(data);
  return {
    username: data.username,
    children: toChildren(data.children),
  };
}
