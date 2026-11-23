/**
 * @file Families' routes: the screen table and the default route rule that
 * the families app passes to the shared router (`startRouter`).
 */

import { decideRoute } from './route.js';
import { detectPlatform } from '../../js/platform.js';
import { showWelcome } from '../screens/welcome/welcome.js';
import { getSession } from '../../js/session.js';
import { showPlayground } from '../screens/playground/playground.js';
import { showLogin } from '../screens/login/login.js';
import { showNotices } from '../screens/notices/notices.js';
import { showFamily } from '../screens/family/family.js';
import { showGrades } from '../screens/grades/grades.js';
import { showAttendance } from '../screens/attendance/attendance.js';
import { showAccount } from '../screens/account/account.js';

/** @typedef {import('../../js/router.js').Screen} Screen */

/**
 * The families' route table: maps each route to the function that shows its
 * screen. To add a new screen:
 * 1. Import the screen's function.
 * 2. Add a line of the form `'#/route': showScreen,`.
 * @type {Record<string, Screen>}
 */
export const routes = {
  // Inside the installed app the welcome screen already did its job, so it
  // goes to the default route. In the phone's browser it is still shown: the
  // install banner sends the family there for the instructions. On an
  // installed desktop app the default is the welcome screen itself, and
  // replace() to the same # would leave the screen blank.
  '#/welcome': async (app) => {
    const route = isStandalone() ? await pickFamilyDefault() : '#/welcome';
    if (route === '#/welcome') showWelcome(app);
    else location.replace(route);
  },
  '#/playground': showPlayground,
  '#/login': showLogin,
  '#/notices': (app) => showFamily(app, showNotices),
  '#/grades': (app) => showFamily(app, showGrades),
  '#/attendance': (app) => showFamily(app, showAttendance),
  '#/account': showAccount,
};

/**
 * Tells whether the app was opened installed, in its own window, and not in
 * the browser.
 * @returns {boolean}
 */
function isStandalone() {
  return matchMedia('(display-mode: standalone)').matches;
}

/**
 * Picks the families' default route: the welcome screen on desktop, and the
 * login or the notices on the phone, installed or not (ADR 0011).
 * @returns {Promise<string>} The route to show.
 */
export async function pickFamilyDefault() {
  const isDesktop =
    detectPlatform(navigator.userAgent, navigator.maxTouchPoints) === 'desktop';
  // Desktop never needs the session, so it does not wait for Firebase.
  const hasSession = !isDesktop && (await getSession()) !== null;
  const route = decideRoute({ isDesktop, hasSession });
  return route;
}
