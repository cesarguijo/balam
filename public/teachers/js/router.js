/**
 * @file Teachers' routes: the screen table and the default route rule that
 * the teachers' app passes to the shared router (`startRouter`).
 */

import { showLogin } from '../screens/login/login.js';

/** @typedef {import('../../js/router.js').Screen} Screen */

/**
 * The teachers' route table: maps each route to the function that shows its
 * screen.
 * @type {Record<string, Screen>}
 */
export const routes = {
  '#/login': showLogin,
};

/**
 * Picks the teachers' default route: always the login, because teachers have
 * no welcome screen (ADR 0012).
 * @returns {Promise<string>} The route to show.
 */
export async function pickTeacherDefault() {
  return '#/login';
}
