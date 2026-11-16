/**
 * @file Playground screen: shows every UI component so they can be tried
 * out and reviewed in one place.
 */

import { wait } from '../../js/utils.js';
import { BalamButton } from '../../components/button/button.js';
import { icon, iconNames } from '../../js/icons.js';
import { t } from '../../js/i18n/es.js';
import { BalamTextField } from '../../components/text-field/text-field.js';

/** @typedef {import('../../js/icons.js').IconName} IconName */

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
        <div class="playground__sample">
          <h3>${t('playground.textField.normal')}</h3>
          <balam-text-field
            label="${t('login.username.label')}"
            left-icon="user"
            placeholder="${t('login.username.placeholder')}"
          ></balam-text-field>
          <balam-text-field
            label="${t('login.password.label')}"
            left-icon="lock"
            type="password"
            placeholder="${t('login.password.placeholder')}"
          ></balam-text-field>
        </div>
        <div class="playground__sample">
          <h3>${t('playground.textField.error')}</h3>
          <balam-text-field
            error-message="${t('login.error.usernameEmpty')}"
            label="${t('login.username.label')}"
            left-icon="user"
            placeholder="${t('login.username.placeholder')}"
          ></balam-text-field>
          <balam-text-field
            error-message="${t('login.error.passwordEmpty')}"
            label="${t('login.password.label')}"
            left-icon="lock"
            type="password"
            placeholder="${t('login.password.placeholder')}"
          ></balam-text-field>
        </div>
        <form class="playground__sample" data-form-sample>
          <h3>${t('playground.textField.form')}</h3>
          <p>${t('playground.textField.formHint')}</p>
          <balam-text-field
            name="username"
            autocomplete="username"
            label="${t('login.username.label')}"
            left-icon="user"
            placeholder="${t('login.username.placeholder')}"
          ></balam-text-field>
          <balam-text-field
            name="password"
            autocomplete="current-password"
            label="${t('login.password.label')}"
            left-icon="lock"
            type="password"
            placeholder="${t('login.password.placeholder')}"
          ></balam-text-field>
          <balam-button text="${t('login.button.default')}"></balam-button>
          <pre data-form-output></pre>
        </form>
        <div class="playground__sample">
          <h3>${t('playground.textField.disabled')}</h3>
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

  const form = app.querySelector('[data-form-sample]');
  const formOutput = app.querySelector('[data-form-output]');
  if (!(form instanceof HTMLFormElement) || !formOutput) {
    throw new Error('Form sample not found in the playground');
  }

  // Shows what the form really sends: an input without `name` is missing
  // from FormData, so this reveals whether the field passes it through.
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(form));
    formOutput.textContent = JSON.stringify(data, null, 2);
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
          ${icon(/** @type {IconName} */ (name))}
          <figcaption class="playground__name">${name}</figcaption>
        </figure>
      `;
  });
  return icons;
}
