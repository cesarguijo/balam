/**
 * @file Login screen: lets a family sign in with their username and
 * password.
 */

import { decorations } from '../../../js/decorations.js';
import { t } from '../../../js/i18n/es.js';
import '../../../components/text-field/text-field.js';
import { validateCredentials } from './validation.js';
import {
  getErrorIcon,
  getErrorMessage,
  getErrorPlace,
} from './error-messages.js';
import { logIn } from '../../../js/session.js';
import { icon } from '../../../js/icons.js';
import { BalamButton } from '../../../components/button/button.js';

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
        <form data-login-form class="login__form">
          <balam-text-field
            data-username
            left-icon="user"
            label="${t('login.username.label')}"
            placeholder="${t('login.username.placeholder')}"
            name="username"
            autocomplete="username"
          ></balam-text-field>
          <balam-text-field
            data-password
            type="password"
            left-icon="lock"
            label="${t('login.password.label')}"
            placeholder="${t('login.password.placeholder')}"
            name="password"
            autocomplete="current-password"
          ></balam-text-field>
          <balam-button
            data-login-button
            loading-text="${t('login.button.loading')}"
            class="login__button"
            text="${t('login.button.default')}"
          ></balam-button>
          <div data-login-banner hidden role="alert" class="login__banner">
            <span data-banner-icon class="login__banner-icon-container"> </span>
            <p
              data-banner-message
              class="login__banner-error-message text-body"
            ></p>
          </div>
        </form>
        <p class="login__forgot text-body">${t('login.forgotPassword')}</p>
      </div>
    </div>
  `;
  const button = app.querySelector('[data-login-button]');
  if (!(button instanceof BalamButton)) {
    throw new Error('[data-login-button] not found in login');
  }

  const banner = app.querySelector('[data-login-banner]');
  if (!(banner instanceof HTMLElement)) {
    throw new Error('[data-login-banner] not found in login');
  }

  const iconContainer = app.querySelector('[data-banner-icon]');
  if (!(iconContainer instanceof HTMLElement)) {
    throw new Error('[data-banner-icon] not found in login');
  }
  const messageContainer = app.querySelector('[data-banner-message]');
  if (!(messageContainer instanceof HTMLElement)) {
    throw new Error('[data-banner-message] not found in login');
  }

  const form = app.querySelector('[data-login-form]');
  if (!(form instanceof HTMLFormElement)) {
    throw new Error('[data-login-form] not found in login');
  }

  const usernameTextField = app.querySelector('[data-username]');
  if (!(usernameTextField instanceof HTMLElement)) {
    throw new Error('[data-username] not found in login');
  }

  const passwordTextField = app.querySelector('[data-password]');
  if (!(passwordTextField instanceof HTMLElement)) {
    throw new Error('[data-password] not found in login');
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    usernameTextField.removeAttribute('error-message');
    passwordTextField.removeAttribute('error-message');
    banner.setAttribute('hidden', '');
    const formData = new FormData(form);
    const username = String(formData.get('username') ?? '');
    const password = String(formData.get('password') ?? '');
    const validation = validateCredentials(username, password);
    if (!validation.valid) {
      const error = getErrorMessage(validation.error);
      const place = getErrorPlace(validation.error);
      if (place === 'username') {
        usernameTextField.setAttribute('error-message', error);
      }
      if (place === 'password') {
        passwordTextField.setAttribute('error-message', error);
      }
      return;
    }
    button.loading = true;
    logIn(validation.username, password)
      .then(() => {
        location.replace('#/notices');
      })
      .catch((error) => {
        iconContainer.innerHTML = icon(getErrorIcon(error.type));
        messageContainer.innerHTML = getErrorMessage(error.type);
        banner.removeAttribute('hidden');
      })
      .finally(() => {
        button.loading = false;
      });
  });
}
