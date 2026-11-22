/**
 * @file <balam-button> component: registers the tag and defines its
 * behavior (text, variant and loading state).
 */

import { t } from '../../js/i18n/es.js';

/**
 * Balam button with a carved-stone style.
 *
 * Attributes:
 * - `text`: text shown on the button, already translated by the caller.
 *   Default: `t('button.default')`.
 * - `variant`: `default-primary`, `secondary`, `danger-primary` or
 *   `danger-secondary`; it becomes the `button--{variant}` class. The danger
 *   ones are only for destructive actions. Default: `default-primary`.
 * - `loading-text`: text shown while loading, so it can say what is
 *   happening ("Instalando…"). Default: `t('button.loading')`.
 *
 * @example
 * <balam-button text="Install" variant="secondary"></balam-button>
 * <balam-button text="Install" loading-text="Installing…"></balam-button>
 */
export class BalamButton extends HTMLElement {
  connectedCallback() {
    this.innerHTML = /* html */ `
            <button class="button button--${this.#variant}">
                <span class="button__body">
                    <span class="button__loader" aria-hidden="true">
                        <span></span><span></span><span></span>
                    </span>
                    <span class="button__label">${this.#text}</span>
                </span>
            </button>
        `;
  }

  get #text() {
    return this.getAttribute('text') ?? t('button.default');
  }

  get #variant() {
    return this.getAttribute('variant') ?? 'default-primary';
  }

  get #loadingText() {
    return this.getAttribute('loading-text') ?? t('button.loading');
  }

  get #button() {
    const button = this.querySelector('button');
    if (!(button instanceof HTMLButtonElement)) {
      throw new Error('<button> not found inside <balam-button>');
    }
    return button;
  }

  get #label() {
    const label = this.#button.querySelector('.button__label');
    if (!(label instanceof HTMLElement)) {
      throw new Error('.button__label not found inside <balam-button>');
    }
    return label;
  }

  /**
   * Tells whether the button is loading. `true` shows the animation and the
   * `loading-text`; `false` restores the original text.
   * @type {boolean}
   */
  get loading() {
    return this.#button.getAttribute('aria-busy') === 'true';
  }

  /** @param {boolean} value */
  set loading(value) {
    if (value) {
      this.#button.setAttribute('aria-busy', 'true');
      this.#label.textContent = this.#loadingText;
    } else {
      this.#button.removeAttribute('aria-busy');
      this.#label.textContent = this.#text;
    }
  }
}

customElements.define('balam-button', BalamButton);
