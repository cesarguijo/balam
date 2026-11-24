/**
 * @file Families' session: the shared `createSession` set up for family
 * accounts. It is the only thing the families' screens import for the
 * session; the teachers have their own in `teachers/js/teacher-session.js`
 * (ADR 0008).
 */

import { toFamily } from '../js/to-family.js';
import { clearNotices } from '../../js/notices.js';
import { createSession } from '../../js/create-session.js';

/**
 * A child of the family who studies at the school. It only holds what is
 * needed when the app opens; each screen asks for their grades and notices
 * (ADR 0008).
 * @typedef {object} Child
 * @property {string} id - Identifies the child; screens use it to ask for their data.
 * @property {string} name - The child's name, so the parent can pick them in the app.
 * @property {number} grade - School grade they are enrolled in this year, e.g. `7`.
 * @property {string} groupId - Grade and section, e.g. `'7-1'`; the screens use it to ask for the group's notices (ADR 0010).
 */

/**
 * A family account: shared by the parents or guardians of one or more
 * children at the school. It has no id of its own: the server already knows
 * who it is from the session.
 * @typedef {object} Family
 * @property {string} username - Name the family logs in with, e.g. `perez.family`.
 * @property {Child[]} children - One or more children enrolled at the school.
 */

/**
 * Session functions for family accounts: log in, log out, read the stored
 * family and refresh it from the server.
 * @type {import('../../js/create-session.js').Session<Family>}
 */
export const familySession = createSession({
  key: 'family',
  collection: 'families',
  convert: toFamily,
  onLogOut: clearNotices,
});
