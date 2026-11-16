/**
 * @file Playground screen: shows every UI component so they can be tried
 * out and reviewed in one place.
 */

import { wait } from '../../js/utils.js';
import { BalamButton } from '../../components/button/button.js';
import { icon, iconNames } from '../../js/icons.js';
import { t } from '../../js/i18n/es.js';

/**
 * Shows the playground screen inside the container.
 * @param {HTMLElement} app - Container where the screen is drawn.
 */
export function showPlayground(app) {
  document.title = t('playground.pageTitle');

  app.innerHTML = /* HTML */ `
    <div class="playground">
      <h1 class="text-display">${t('playground.title')}</h1>

      <section class="playground__section">
        <h2 class="text-title">${t('playground.button')}</h2>
        <div class="playground__sample">
          <balam-button text="${t('install.button')}"></balam-button>
        </div>
      </section>

      <section class="playground__section">
        <h2 class="text-title">${t('playground.icons')}</h2>
        <div class="playground__icons">${drawIcons()}</div>
      </section>
    </div>
  `;

  const button = app.querySelector('balam-button');
  if (!(button instanceof BalamButton)) {
    throw new Error('<balam-button> not found in the playground');
  }

  button.addEventListener('click', async () => {
    if (button.loading) return;
    button.loading = true;
    // Simulates a slow task, to see the loading state
    await wait(3000);
    button.loading = false;
  });
}

/**
 * Draws every available icon, to check at a glance that they are centered.
 * @returns {string} HTML with one icon per name in iconNames.
 */
export function drawIcons() {
  let icons = ``;
  iconNames.forEach((name) => {
    icons =
      icons +
      /* HTML */ `
        <figure class="playground__icon">
          ${icon(name)}
          <figcaption class="playground__name">${name}</figcaption>
        </figure>
      `;
  });
  return icons;
}
