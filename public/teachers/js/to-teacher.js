/**
 * @file Teacher converter: turns unknown data into a clean Teacher, with only
 * what the teachers' app uses. Like `family.js`, it is pure (it does not
 * import Firebase or use the browser) so it can be tested in Node.
 *
 * If the data is wrong, it throws a TypeError with the detail for whoever
 * checks the console; the teacher only sees an `unknown` error.
 */

import { assertItems, assertObject, assertText } from '../../js/utils.js';

/**
 * A class the teacher teaches: one subject in one group.
 * @typedef {object} TeacherClass
 * @property {string} id - Subject and group together, e.g. `'math-7-1'`.
 * @property {string} subject - Lowercase subject, e.g. `'math'`.
 * @property {string} groupId - Grade and section, e.g. `'7-1'`; the same format as the families' groupId (ADR 0010).
 */

/**
 * A teacher account, as the teachers' app uses it after logging in.
 * @typedef {object} Teacher
 * @property {string} username - Name the teacher logs in with, taken from the Auth email (not stored in the database), e.g. `'teacher7'`.
 * @property {TeacherClass[]} classes - The classes they teach.
 * @property {string[]} groupIds - Every group they teach, e.g. `['7-1', '8-2']`; kept so the stored copy passes `validateTeacher` again when the app opens.
 * @property {string | null} homeroomGroupId - Their homeroom group, e.g. `'7-1'`, or `null` if they have none.
 */

/**
 * Checks that an item of the `classes` list has a valid id, subject and
 * groupId. Throws if not, so a mistyped class does not silently disappear
 * from the app.
 * @param {unknown} classData - An item of the `classes` list, as it came.
 * @param {number} position - Its place in the list, from 0 (the Firebase console numbers it the same way).
 * @returns {asserts classData is TeacherClass}
 * @throws {TypeError} If it is not an object or a field is missing or is not text.
 */
export function validateClass(classData, position) {
  assertObject(classData, `Class ${position} is not an object`);
  for (const key of ['groupId', 'id', 'subject']) {
    assertText(classData[key], `Class ${position} has no text ${key}`);
  }
}

/**
 * Checks that an item of the `groupIds` list is text.
 * @param {unknown} groupIdData - An item of the `groupIds` list, as it came.
 * @param {number} position - Its place in the list, from 0.
 * @returns {asserts groupIdData is string}
 * @throws {TypeError} If it is not a non-empty string.
 */
export function validateGroupId(groupIdData, position) {
  assertText(groupIdData, `groupId ${position} has no text`);
}

/**
 * Checks that the teacher data has a text username, at least one valid
 * class, at least one valid groupId and a homeroomGroupId that is text or
 * `null`. Stops at the first error.
 * @param {unknown} teacherData - The data as it came from the server.
 * @returns {asserts teacherData is Record<string, unknown> & { username: string, classes: TeacherClass[], groupIds: string[], homeroomGroupId: string | null }}
 * @throws {TypeError} If a field is missing or has the wrong type.
 */
export function validateTeacher(teacherData) {
  assertObject(teacherData, 'The teacher is not an object');
  assertItems(
    teacherData.classes,
    'The teacher has no list with at least one class',
  );
  assertItems(
    teacherData.groupIds,
    'The teacher has no list with at least one groupId',
  );
  teacherData.classes.forEach(validateClass);
  teacherData.groupIds.forEach(validateGroupId);
  if (teacherData.homeroomGroupId !== null) {
    assertText(
      teacherData.homeroomGroupId,
      'The teacher has no text homeroomGroupId',
    );
  }
  assertText(teacherData.username, 'The teacher has no text username');
}

/**
 * Turns the already validated classes list into clean classes: builds new
 * objects with only id, groupId and subject, so extra fields added on the
 * server are not kept in the app.
 * @param {TeacherClass[]} classes - The classes list, already validated by `validateTeacher`.
 * @returns {TeacherClass[]} A new list, with only the fields the app uses.
 */
function toClasses(classes) {
  return classes.map(({ id, groupId, subject }) => ({
    id,
    groupId,
    subject,
  }));
}

/**
 * Turns data of unknown origin into a Teacher, or fails if it does not have
 * its shape. Everything that claims to be a teacher goes through here.
 * @param {unknown} data - E.g. `snapshot.data()` of the `teachers/{uid}` document.
 * @returns {Teacher} The teacher, with only the fields the app uses.
 * @throws {TypeError} If the data does not have the shape of a Teacher.
 */
export function toTeacher(data) {
  validateTeacher(data);
  return {
    username: data.username,
    classes: toClasses(data.classes),
    groupIds: data.groupIds,
    homeroomGroupId: data.homeroomGroupId ?? null,
  };
}
