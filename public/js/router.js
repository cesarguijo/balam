/**
 * @file Router: shows the screen that matches the current route. If the
 * route does not exist, shows home in the installed app or the welcome
 * screen in the browser; inside the installed app, it never shows the
 * welcome screen.
 */

import { showWelcome } from '../screens/welcome/welcome.js';
import { showHome } from '../screens/home/home.js';
import { showPlayground } from '../screens/playground/playground.js';

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
  '#/home': showHome,
  '#/playground': showPlayground,
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

  // Inside the installed app the welcome screen is not shown: it already did its job.
  if (isStandalone() && location.hash === '#/welcome') {
    location.replace('#/home');
    return;
  }

  // No route or an unknown one: the installed app goes home; the browser, to the welcome screen.
  const fallback = isStandalone() ? showHome : showWelcome;
  const screen = routes[location.hash] ?? fallback;
  screen(app);
}

// Every time the # changes
window.addEventListener('hashchange', navigate);
// When the tab becomes the installed app
matchMedia('(display-mode: standalone)').addEventListener('change', navigate);
navigate();
