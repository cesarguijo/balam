/**
 * @file Shared router: shows the screen that matches the current route. It
 * knows no screens of its own: each app passes its route table and how to
 * pick the default route to `startRouter`. Inside the installed app, it
 * never shows the welcome screen.
 */

/**
 * An app screen: receives the container and draws its content inside.
 * @callback Screen
 * @param {HTMLElement} app - Container where the screen is drawn.
 * @returns {void}
 */

/**
 * Tells whether the app was opened installed, in its own window, and not in
 * the browser.
 * @returns {boolean}
 */
function isStandalone() {
  return matchMedia('(display-mode: standalone)').matches;
}

/**
 * Picks the route to show when the current one does not exist. Each app has
 * its own rule.
 * @callback PickDefault
 * @returns {Promise<string>} The route, for example `'#/login'`.
 */

/**
 * Shows the screen that matches the current route; if the route does not
 * exist, asks `pickDefault` for the default one.
 * @param {Record<string, Screen>} routes - The app's route table.
 * @param {PickDefault} pickDefault - The app's rule for the default route.
 * @throws {Error} If the #app container does not exist in index.html.
 */
async function navigate(routes, pickDefault) {
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

  const route = await pickDefault();

  // replace() changes the # so the routes table draws the screen (and the
  // nav marks it as active). If the # is already that route, hashchange
  // would not fire, so it is drawn here.
  if (route === location.hash) {
    routes[route](app);
  } else {
    location.replace(route);
  }
}

/**
 * Starts the router for one app: shows the first screen and shows it again
 * every time the # changes or the tab becomes the installed app.
 * @param {Record<string, Screen>} routes - The app's route table.
 * @param {PickDefault} pickDefault - The app's rule for the default route.
 */
export function startRouter(routes, pickDefault) {
  // navigate needs the app's data; the events only call it with an Event
  const go = () => navigate(routes, pickDefault);
  window.addEventListener('hashchange', go);
  matchMedia('(display-mode: standalone)').addEventListener('change', go);
  go();
}
