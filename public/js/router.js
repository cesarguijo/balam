/**
 * @file Router: shows the screen that matches the current route. If the
 * route does not exist, `decideRoute` picks one: the welcome screen on
 * desktop, and the login or the notices on the phone, installed or not
 * (ADR 0011). Inside the installed app, it never shows the welcome screen.
 */

import { decideRoute } from './route.js';
import { detectPlatform } from './platform.js';
import { getSession } from './session.js';
import { showWelcome } from '../screens/welcome/welcome.js';
import { showPlayground } from '../screens/playground/playground.js';
import { showLogin } from '../screens/login/login.js';
import { showNotices } from '../screens/notices/notices.js';
import { showFamily } from '../screens/family/family.js';
import { showGrades } from '../screens/grades/grades.js';
import { showAttendance } from '../screens/attendance/attendance.js';
import { showAccount } from '../screens/account/account.js';

/**
 * An app screen: receives the container and draws its content inside.
 * @callback Screen
 * @param {HTMLElement} app - Container where the screen is drawn.
 * @returns {void}
 */

/**
 * The app's route table: maps each route to the function that shows its
 * screen. To add a new screen:
 * 1. Import the screen's function.
 * 2. Add a line of the form `'#/route': showScreen,`.
 * @type {Record<string, Screen>}
 */
const routes = {
  '#/welcome': showWelcome,
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
 * Shows the screen that matches the current route; if the route does not
 * exist, asks `decideRoute` for the default one.
 * @throws {Error} If the #app container does not exist in index.html.
 */
async function navigate() {
  const app = document.getElementById('app');
  if (!app) {
    throw new Error('#app container not found in index.html');
  }

  const screen = routes[location.hash];
  // No route or an unknown one (the manifest's start_url has no #), or the
  // welcome screen inside the installed app, which already did its job.
  // The phone in the browser can still open #/welcome on purpose: the
  // install banner sends the family there for the instructions.
  const needsDefault =
    !screen || (isStandalone() && location.hash === '#/welcome');
  if (!needsDefault) {
    screen(app);
    return;
  }

  const isDesktop =
    detectPlatform(navigator.userAgent, navigator.maxTouchPoints) === 'desktop';
  // Desktop never needs the session, so it does not wait for Firebase.
  const hasSession = !isDesktop && (await getSession()) !== null;
  const route = decideRoute({ isDesktop, hasSession });

  // replace() changes the # so the routes table draws the screen (and the
  // nav marks it as active). If the # is already that route, hashchange
  // would not fire, so it is drawn here.
  if (route === location.hash) {
    routes[route](app);
  } else {
    location.replace(route);
  }
}

// Every time the # changes
window.addEventListener('hashchange', navigate);
// When the tab becomes the installed app
matchMedia('(display-mode: standalone)').addEventListener('change', navigate);
navigate();
