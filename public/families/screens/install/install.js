/**
 * @file Install screen: shows the manual steps to install Balam when the
 * browser does not offer its own install dialog, and a back arrow that
 * returns to the previous screen.
 */

import { drawAppBar } from '../../../components/app-bar/app-bar.js';
import { instructions } from '../../../components/install-footer/instructions.js';
import { detectPlatform } from '../../../js/platform.js';
import { t } from '../../../js/i18n/es.js';
import { icon } from '../../../js/icons.js';

/** Start of the app bar: a back button and the screen title. */
const start = /* HTML */ `
  <button
    data-install-back
    class="icon-button ripple"
    aria-label="${t('install.screen.back')}"
  >
    ${icon('arrow-left')}
  </button>
  <h1>${t('install.screen.title')}</h1>
`;

/**
 * Shows the install screen inside the container, with the steps for the
 * current browser.
 * @param {HTMLElement} app - Container where the screen is drawn.
 */
export function showInstall(app) {
  const platform = detectPlatform(
    navigator.userAgent,
    navigator.maxTouchPoints,
  );
  const steps = instructions[platform] ?? instructions.other;

  app.innerHTML = /* HTML */ `
    ${drawAppBar(start)}
    <div class="install">
      <div class="install__steps">${steps}</div>
    </div>
  `;

  const backButton = app.querySelector('[data-install-back]');
  backButton?.addEventListener('click', goBack);
}

/**
 * Returns to the screen the family came from. If #/install was opened
 * directly (a link, a new tab), there is nothing to go back to, so it goes to
 * `#/`: no screen has that route, so the router picks the default one (the
 * login or the notices, depending on the session).
 */
function goBack() {
  if (history.length > 1) history.back();
  else location.replace('#/');
}
