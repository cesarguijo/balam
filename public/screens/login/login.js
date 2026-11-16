/**
 * @file Login screen: lets a family sign in with their username and
 * password.
 */

import { decorations } from '../../js/decorations.js';
import { t } from '../../js/i18n/es.js';
import '../../components/button/button.js';
import '../../components/text-field/text-field.js';

/**
 * Shows the login screen inside the container.
 * @param {HTMLElement} app - Container where the screen is drawn.
 */
export function showLogin(app) {
  app.innerHTML = /* HTML */ `
    <div class="outside-layout login">
      <div class="backdrop">
        ${decorations['fret-bottom-left']} ${decorations['fret-top-left']}
        ${decorations['fret-top-right']} ${decorations['fret-bottom-right']}
        ${decorations['wave-top']} ${decorations['wave-bottom']}
      </div>
      <div class="login__content">
        <header class="identity">
          <div class="identity__logo">
            <img
              src="/img/icon-192.png"
              alt="${t('identity.logoAlt')}"
              width="52"
              height="52"
            />
          </div>
          <h1 class="identity__name">Balam</h1>
          <p class="identity__tagline">${t('login.subtitle')}</p>
        </header>
        <form class="login__form">
          <balam-text-field
            left-icon="user"
            label="${t('login.username.label')}"
            placeholder="${t('login.username.placeholder')}"
            name="username"
            autocomplete="username"
          ></balam-text-field>
          <balam-text-field
            type="password"
            left-icon="lock"
            label="${t('login.password.label')}"
            placeholder="${t('login.password.placeholder')}"
            name="password"
            autocomplete="current-password"
          ></balam-text-field>
          <balam-button
            class="login__button"
            text="${t('login.button.default')}"
          ></balam-button>
        </form>
        <p class="login__forgot text-body">${t('login.forgotPassword')}</p>
      </div>
    </div>
  `;
}
