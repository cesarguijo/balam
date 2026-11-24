/**
 * @file Teachers' session: the shared `createSession` set up for teacher
 * accounts. It is the only thing the teachers' screens import for the
 * session; the families have their own in `families/js/family-session.js`
 * (ADR 0008).
 */

import { createSession } from '../../js/create-session.js';
import { toTeacher } from './to-teacher.js';

/** @typedef {import('./to-teacher.js').Teacher} Teacher */

/**
 * Session functions for teacher accounts: log in, log out, read the stored
 * teacher and refresh it from the server.
 * @type {import('../../js/create-session.js').Session<Teacher>}
 */
export const teacherSession = createSession({
  key: 'teacher',
  collection: 'teachers',
  convert: toTeacher,
});
