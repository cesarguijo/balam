/**
 * @file Playground screen: shows every UI component so they can be tried
 * out and reviewed in one place.
 */

import { wait } from '../../js/utils.js';
import { BalamButton } from '../../components/button/button.js';
import { icon, iconNames } from '../../js/icons.js';
import { t } from '../../js/i18n/es.js';
import { BalamTextField } from '../../components/text-field/text-field.js';

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

      <section class="playground__section">
        <h2 class="text-title">${t('playground.textField')}</h2>
        <h3>Estado normal</h3>
        <div class="playground__sample">
          <balam-text-field
            label="${t('login.username.label')}"
            left-icon="user"
            placeholder="${t('login.username.placeholder')}"
          ></balam-text-field>
          <balam-text-field
            label="${t('login.password.label')}"
            left-icon="user"
            type="password"
            placeholder="${t('login.password.placeholder')}"
          ></balam-text-field>
        </div>
        <div class="playground__sample">
          <h3>Estado error</h3>
          <balam-text-field
            error-message="${t('login.error.usernameEmpty')}"
            label="${t('login.username.label')}"
            left-icon="user"
            placeholder="${t('login.username.placeholder')}"
          ></balam-text-field>
          <balam-text-field
            error-message="${t('login.error.passwordEmpty')}"
            label="${t('login.password.label')}"
            left-icon="user"
            type="password"
            placeholder="${t('login.password.placeholder')}"
          ></balam-text-field>
        </div>
        <div class="playground__sample">
          <h3>Estado deshabilitado</h3>
          <balam-text-field
            disabled
            label="${t('login.username.label')}"
            left-icon="user"
            placeholder="${t('login.username.placeholder')}"
          ></balam-text-field>
          <balam-text-field
            disabled
            label="${t('login.password.label')}"
            left-icon="lock"
            type="password"
            placeholder="${t('login.password.placeholder')}"
          ></balam-text-field>
        </div>
      </section>
    </div>
  `;

  const button = app.querySelector('balam-button');
  if (!(button instanceof BalamButton)) {
    throw new Error('<balam-button> not found in the playground');
  }

  const textField = app.querySelector('balam-text-field');
  if (!(textField instanceof BalamTextField)) {
    throw new Error('<balam-text-field> not found in the playground');
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
