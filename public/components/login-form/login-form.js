/**
 * @file <balam-login-form> component: registers the tag and defines the
 * login form shared by the families' and teachers' apps (ADR 0012).
 */

import {
  getErrorIcon,
  getErrorMessage,
  getErrorPlace,
} from './error-messages.js';
import { validateCredentials } from './validation.js';
import { t } from '../../js/i18n/es.js';
import { BalamTextField } from '../text-field/text-field.js';
import { BalamButton } from '../button/button.js';
import { icon } from '../../js/icons.js';

/**
 * Login form with the username, the password and the "Entrar" button.
 *
 * Takes no attributes. It checks the data itself and shows the errors under
 * each field; when the data is valid it fires `login-submit`, and the screen
 * decides what to do with it (each app logs in its own way).
 *
 * Events:
 * - `login-submit`: `detail` is `{ username, password }`, with the username
 *   already normalized by `validateCredentials`.
 *
 * @example
 * <balam-login-form></balam-login-form>
 *
 * loginForm.addEventListener('login-submit', async (event) => {
 *   loginForm.setLoading(true);
 *   try {
 *     await logIn(event.detail.username, event.detail.password);
 *   } catch (error) {
 *     loginForm.showError(error.type);
 *   }
 *   loginForm.setLoading(false);
 * });
 */
export class BalamLoginForm extends HTMLElement {
  /**
   * Draws the form and listens to its submit: it validates the data and, if
   * it is valid, fires `login-submit`.
   * @throws {Error} If an element of the template is missing.
   */
  connectedCallback() {
    this.innerHTML = /* HTML */ `
      <form data-login-form class="login-form">
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
          class="login-form__button"
          text="${t('login.button.default')}"
        ></balam-button>
        <div data-login-banner hidden role="alert" class="login-form__banner">
          <span data-banner-icon class="login-form__banner-icon-container">
          </span>
          <p
            data-banner-message
            class="login-form__banner-error-message text-body"
          ></p>
        </div>
      </form>
    `;

    const form = this.querySelector('[data-login-form]');
    if (!(form instanceof HTMLFormElement)) {
      throw new Error('[data-login-form] not found');
    }

    const usernameTextField = this.querySelector('[data-username]');
    if (!(usernameTextField instanceof BalamTextField)) {
      throw new Error('[data-username] not found in login');
    }

    const passwordTextField = this.querySelector('[data-password]');
    if (!(passwordTextField instanceof BalamTextField)) {
      throw new Error('[data-password] not found in login');
    }

    // preventDefault keeps the browser from reloading the page; the errors
    // of the previous try are cleared before validating again.
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const formData = new FormData(form);

      const username = String(formData.get('username') ?? '');
      const password = String(formData.get('password') ?? '');
      usernameTextField.removeAttribute('error-message');
      passwordTextField.removeAttribute('error-message');
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
      this.dispatchEvent(
        new CustomEvent('login-submit', {
          detail: { username: validation.username, password },
        }),
      );
    });
  }

  /**
   * Turns the button's loading state on or off, while the screen waits for
   * the server.
   * @param {boolean} loading - `true` shows "Entrando…"; `false` restores
   * the original text.
   * @throws {Error} If the button is not inside the form.
   */
  setLoading(loading) {
    const button = this.querySelector('[data-login-button]');
    if (!(button instanceof BalamButton)) {
      throw new Error('[data-login-button] not found in login');
    }
    button.loading = loading;
  }

  /**
   * Shows the server's error in the banner below the button, with its icon,
   * for example when the password is wrong or there is no internet. The
   * validation errors do not come here: they show under each field.
   * @param {string | undefined} type - The `type` of the SessionError, e.g.
   * `offline`. An unknown or missing type shows the generic message.
   * @throws {Error} If the banner or its parts are not inside the form.
   */
  showError(type) {
    const banner = this.querySelector('[data-login-banner]');
    if (!(banner instanceof HTMLElement)) {
      throw new Error('[data-login-banner] not found in login');
    }
    const iconContainer = this.querySelector('[data-banner-icon]');
    if (!(iconContainer instanceof HTMLElement)) {
      throw new Error('[data-banner-icon] not found in login');
    }
    const messageContainer = this.querySelector('[data-banner-message]');
    if (!(messageContainer instanceof HTMLElement)) {
      throw new Error('[data-banner-message] not found in login');
    }
    iconContainer.innerHTML = icon(getErrorIcon(type));
    messageContainer.textContent = getErrorMessage(type);
    banner.removeAttribute('hidden');
  }
}

customElements.define('balam-login-form', BalamLoginForm);
