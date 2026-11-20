/**
 * @file Router: shows the screen that matches the current route. If the
 * route does not exist, sends the installed app to the notices and shows
 * the welcome screen in the browser; inside the installed app, it never
 * shows the welcome screen.
 */

import { showWelcome } from '../screens/welcome/welcome.js';
import { showPlayground } from '../screens/playground/playground.js';
import { showLogin } from '../screens/login/login.js';
import { showNotices } from '../screens/notices/notices.js';
import { showFamily } from '../screens/family/family.js';
import { showGrades } from '../screens/grades/grades.js';
import { showAttendance } from '../screens/attendance/attendance.js';

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
 * exist, shows the default one.
 * @throws {Error} If the #app container does not exist in index.html.
 */
function navigate() {
  const app = document.getElementById('app');
  if (!app) {
    throw new Error('#app container not found in index.html');
  }

  // The installed app opens on the notices: with no route or an unknown one
  // (the manifest's start_url has no #), and on the welcome screen, which
  // already did its job. replace() changes the # so the routes table draws
  // the notices with their section and the nav marks them as active.
  if (
    isStandalone() &&
    (!routes[location.hash] || location.hash === '#/welcome')
  ) {
    location.replace('#/notices');
    return;
  }

  // No route or an unknown one in the browser: the welcome screen.
  const fallback = showWelcome;
  const screen = routes[location.hash] ?? fallback;
  screen(app);
}

// Every time the # changes
window.addEventListener('hashchange', navigate);
// When the tab becomes the installed app
matchMedia('(display-mode: standalone)').addEventListener('change', navigate);
navigate();
