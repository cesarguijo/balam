/**
 * @file <balam-text-field> component: registers the tag and defines its
 * behavior (label, icon, error message, disabled state and, for passwords,
 * the show/hide button).
 */

import { icon, isAnIcon } from '../../js/icons.js';
import { t } from '../../js/i18n/es.js';

/** @typedef {import('../../js/icons.js').IconName} IconName */

/**
 * Balam text field: a label, a box with an icon and the input, and an error
 * message under it.
 *
 * Attributes:
 * - `label`: text above the box, already translated by the caller.
 * - `placeholder`: example text inside the empty input.
 * - `left-icon`: name of the icon inside the box, e.g. `user`.
 * - `type`: `text` or `password`. `password` hides what is typed and adds
 *   the show/hide button. Default: `text`.
 * - `error-message`: if present, the field shows the error with this text.
 *   Remove it to clear the error.
 * - `disabled`: if present, the field cannot be used (e.g. while loading).
 * - `name`: passed to the input, so `FormData` finds its value.
 * - `autocomplete`: passed to the input, e.g. `username` or `current-password`.
 *
 * @example
 * <balam-text-field label="Usuario" left-icon="user"></balam-text-field>
 * <balam-text-field label="Clave" left-icon="lock" type="password"></balam-text-field>
 */
export class BalamTextField extends HTMLElement {
  static observedAttributes = ['error-message', 'disabled'];

  connectedCallback() {
    this.#drawTextField();
    // Attributes written in the HTML arrive before the box exists, so the
    // state is applied again once it is drawn.
    this.#updateError();
    this.#updateDisabled();
  }

  /**
   * Reacts to a watched attribute changing after the field is drawn.
   * @param {string} name - The attribute that changed.
   */
  attributeChangedCallback(name) {
    if (name === 'disabled') {
      this.#updateDisabled();
    } else {
      this.#updateError();
    }
  }

  /**
   * Draws the field. The toggle button lives outside the `<label>`: a label
   * may only hold one control, and inside it the button's name would be
   * read as part of the input's name ("Clave Mostrar clave").
   */
  #drawTextField() {
    this.innerHTML = /* HTML */ `
      <label class="text-field__field">
        <span class="text-field__label">${this.#label}</span>
        <span class="text-field__input-box" data-input-box>
          ${this.#leftIcon}
          <input
            name="${this.#name}"
            autocomplete="${this.#autocomplete}"
            class="text-field__input"
            type="${this.#type}"
            placeholder="${this.#placeholder}"
          />
        </span>
      </label>
      ${this.#type === 'password' ? this.#toggleButton : ''}
      <div class="text-field__error" data-input-error hidden>
        ${icon('alert-circle')}
        <p data-error-text></p>
      </div>
    `;

    this.querySelector('[data-toggle-password]')?.addEventListener(
      'click',
      () => this.#togglePassword(),
    );
  }

  /**
   * HTML of the show/hide button. Its name stays the same and `aria-pressed`
   * says whether the password is visible: that is the accessible pattern
   * for a toggle button.
   * @returns {string}
   */
  get #toggleButton() {
    return /* HTML */ `
      <button
        type="button"
        class="text-field__toggle"
        data-toggle-password
        aria-label="${t('textField.showPassword')}"
        aria-pressed="false"
      >
        ${icon('eye')}
      </button>
    `;
  }

  /** @returns {string} The text above the box. */
  get #label() {
    return this.getAttribute('label') ?? '';
  }

  /** @returns {string} The icon's SVG, or empty if the name does not exist. */
  get #leftIcon() {
    const leftIcon = this.getAttribute('left-icon') ?? '';
    return isAnIcon(leftIcon) ? icon(/** @type {IconName} */ (leftIcon)) : '';
  }

  /**
   * Only `password` is accepted as an alternative, so a typo never ends up
   * as a strange input type.
   * @returns {'text' | 'password'}
   */
  get #type() {
    return this.getAttribute('type') === 'password' ? 'password' : 'text';
  }

  /** @returns {string} The example text inside the empty input. */
  get #placeholder() {
    return this.getAttribute('placeholder') ?? '';
  }

  /** @returns {string | null} The error text, or `null` if there is no error. */
  get #errorMessage() {
    return this.getAttribute('error-message');
  }

  /**
   * Passed to the input so a `<form>` around the field finds its value
   * with `FormData` (no Shadow DOM, so the input belongs to the form).
   * @returns {string} The field's name, e.g. `username`.
   */
  get #name() {
    return this.getAttribute('name') ?? '';
  }

  /**
   * Passed to the input so the phone offers to save and fill the password.
   * @returns {string} The autocomplete hint, e.g. `current-password`.
   */
  get #autocomplete() {
    return this.getAttribute('autocomplete') ?? '';
  }

  /**
   * Shows or hides the error based on `error-message`: if there is a
   * message, there is an error. It reads the attribute itself, so both
   * callbacks can call it.
   */
  #updateError() {
    const inputBox = this.querySelector('[data-input-box]');
    const inputError = this.querySelector('[data-input-error]');
    const errorText = this.querySelector('[data-error-text]');
    // Not drawn yet: connectedCallback will call this again.
    if (!inputBox || !(inputError instanceof HTMLElement) || !errorText) {
      return;
    }

    const message = this.#errorMessage;
    inputBox.classList.toggle('border-error', Boolean(message));
    inputError.hidden = !message;
    errorText.textContent = message ?? '';
  }

  /**
   * Passes `disabled` from the tag to the input and to the toggle button.
   * Boolean attributes work by presence: `<balam-text-field disabled>` is
   * already true.
   */
  #updateDisabled() {
    const disabled = this.hasAttribute('disabled');
    const input = this.querySelector('input');
    const toggle = this.querySelector('[data-toggle-password]');
    // Not drawn yet: connectedCallback will call this again.
    if (!input) return;

    input.disabled = disabled;
    if (toggle instanceof HTMLButtonElement) toggle.disabled = disabled;
  }

  /**
   * Shows the password if it is hidden, and hides it if it is visible. The
   * icon shows the action, not the state: `eye` ("tap to show") while
   * hidden, `eye-off` ("tap to hide") while visible.
   */
  #togglePassword() {
    const input = this.querySelector('input');
    const toggle = this.querySelector('[data-toggle-password]');
    if (!input || !toggle) return;

    const visible = input.type === 'password';
    input.type = visible ? 'text' : 'password';
    toggle.setAttribute('aria-pressed', String(visible));
    toggle.innerHTML = icon(visible ? 'eye-off' : 'eye');
  }
}

customElements.define('balam-text-field', BalamTextField);
