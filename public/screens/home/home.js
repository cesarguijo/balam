/**
 * @file Home screen: the first screen of the installed app, once the family
 * has logged in.
 */

import { t } from '../../js/i18n/es.js';

/**
 * Shows the home screen inside the container.
 * @param {HTMLElement} app - Container where the screen is drawn.
 */
export function showHome(app) {
  app.innerHTML = /* HTML */ `
    <div class="home">
      <h1 class="text-title">${t('home.hello')}</h1>
    </div>
  `;
}
