/**
 * @file Teachers' routes: the screen table and the default route rule that
 * the teachers' app passes to the shared router (`startRouter`).
 */

import { showAtendance } from '../screens/attendance/atendance.js';
import { showFinals } from '../screens/finals/finals.js';
import { showGrades } from '../screens/grades/grades.js';
import { showLogin } from '../screens/login/login.js';
import { showGroups } from '../screens/groups/groups.js';
import { showTeacher } from '../screens/teachers/teacher.js';

/** @typedef {import('../../js/router.js').Screen} Screen */

/**
 * The teachers' route table: maps each route to the function that shows its
 * screen.
 * @type {Record<string, Screen>}
 */
export const routes = {
  '#/login': showLogin,
  '#/grades': (app) => showTeacher(app, showGrades),
  '#/groups': (app) => showTeacher(app, showGroups),
  '#/finals': (app) => showTeacher(app, showFinals),
  '#/attendance': (app) => showTeacher(app, showAtendance),
};

/**
 * Picks the teachers' default route: always the login, because teachers have
 * no welcome screen (ADR 0012).
 * @returns {Promise<string>} The route to show.
 */
export async function pickTeacherDefault() {
  return '#/login';
}
