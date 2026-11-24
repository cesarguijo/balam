/**
 * @file Shared router: shows the screen that matches the current route. It
 * knows no screens of its own: each app passes its route table and how to
 * pick the default route to `startRouter`.
 */

/**
 * An app screen: receives the container and draws its content inside.
 * @callback Screen
 * @param {HTMLElement} app - Container where the screen is drawn.
 * @returns {void}
 */

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

  // TODO: when the route changes inside the same layout (family or
  // teacher), redraw only its <main> instead of the whole screen. Do it
  // once there is a real symptom (flicker, lost scroll, a cut animation);
  // the nav bar would then need to update its active item on hashchange.
  const needsDefault = !screen;

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
