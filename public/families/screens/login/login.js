/**
 * @file Login screen: lets a family sign in with their username and
 * password.
 */

import { decorations } from '../../../js/decorations.js';
import { t } from '../../../js/i18n/es.js';
import '../../../components/text-field/text-field.js';
import { logIn } from '../../../js/session.js';
import { icon } from '../../../js/icons.js';
import { BalamLoginForm } from '../../../components/login-form/login-form.js';

/**
 * Shows the login screen inside the container.
 * @param {HTMLElement} app - Container where the screen is drawn.
 */
export function showLogin(app) {
  // The installed app opens straight on the login: there is nothing to go
  // back to, and the home page (/) is outside the app's scope.
  const isInstalledApp = matchMedia('(display-mode: standalone)').matches;
  const backLink = isInstalledApp
    ? ''
    : /* HTML */ `
        <a class="login__back text-body" href="/">
          ${icon('arrow-left')} ${t('outside.back')}
        </a>
      `;

  app.innerHTML = /* HTML */ `
    <div class="outside-layout login">
      <div class="backdrop">
        ${decorations['fret-bottom-left']} ${decorations['fret-top-left']}
        ${decorations['fret-top-right']} ${decorations['fret-bottom-right']}
        ${decorations['wave-top']} ${decorations['wave-bottom']}
      </div>
      <div class="login__content">
        ${backLink}
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
        <balam-login-form data-login-form></balam-login-form>
        <p class="login__forgot text-body">${t('login.forgotPassword')}</p>
      </div>
    </div>
  `;

  const loginForm = app.querySelector('[data-login-form]');
  if (!(loginForm instanceof BalamLoginForm)) {
    throw new Error('[data-login-form] not found in login');
  }

  loginForm.addEventListener('login-submit', (event) => {
    loginForm.setLoading(true);
    if (!(event instanceof CustomEvent)) return;
    const { username, password } = event.detail;
    logIn(username, password)
      .then(() => {
        location.replace('#/notices');
      })
      .catch((error) => {
        loginForm.showError(error.type);
      })
      .finally(() => {
        loginForm.setLoading(false);
      });
  });
}
