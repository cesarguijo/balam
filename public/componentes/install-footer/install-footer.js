/**
 * @file <balam-install-footer> component: registers the tag and decides how
 * to offer the install (button, progress, confirmation or instructions
 * depending on the platform).
 */
import { BalamButton } from '../button/button.js';
import {
  yaSeInstalo,
  sePuedeInstalar,
  instalar,
} from '../../js/instalacion.js';
import { detectarPlataforma } from '../../js/plataforma.js';
import { instructions } from './instructions.js';
import { t } from '../../js/i18n/es.js';

/**
 * Install footer states:
 * - `install`: the browser allows installing; the button is shown.
 * - `installing`: the person accepted; waits for the `appinstalled` event.
 * - `installed`: the app is already installed; the confirmation is shown.
 * - `manual`: the browser does not offer the button (or the person
 *   cancelled); the instructions for their platform are shown.
 * @typedef {'install' | 'installing' | 'installed' | 'manual'} InstallState
 */

/**
 * Footer of the welcome screen that invites the person to install Balam.
 *
 * Works out its own state (it takes no attributes) and redraws itself every
 * time it changes. Listens to `beforeinstallprompt` and `appinstalled` on
 * `window` while it is on the page.
 */
export class BalamInstallFooter extends HTMLElement {
  /**
   * Removes the window listeners when leaving the page, so no ghost
   * components stay in memory.
   * @type {AbortController | undefined}
   */
  #controller;

  /**
   * Current state. Only changed through #setState, so it always redraws.
   * @type {InstallState}
   */
  #state = 'install';

  /**
   * Works out the initial state and starts listening to the install events.
   * Creates a new controller on every connection, because an aborted one
   * cannot be reused.
   */
  connectedCallback() {
    this.#controller = new AbortController();
    const isDesktop = this.#platform === 'escritorio';
    // Initial state.
    if (isDesktop) this.#setState('manual');
    else if (yaSeInstalo()) this.#setState('installed');
    else if (sePuedeInstalar()) this.#setState('install');
    else this.#setState('manual');
    window.addEventListener(
      'beforeinstallprompt',
      () => {
        if (
          (this.#state === 'manual' || this.#state === 'installed') &&
          !isDesktop
        ) {
          this.#setState('install');
        }
      },
      { signal: this.#controller.signal },
    );
    // When the install finishes.
    window.addEventListener(
      'appinstalled',
      () => {
        this.#setState('installed');
      },
      { signal: this.#controller.signal },
    );
  }

  /**
   * Removes the `window` listeners when leaving the page.
   */
  disconnectedCallback() {
    this.#controller?.abort();
  }

  /**
   * Returns the button drawn inside the component.
   * @returns {BalamButton}
   * @throws {Error} If the current state did not draw a <balam-button>.
   */
  get #button() {
    const button = this.querySelector('balam-button');
    if (!(button instanceof BalamButton)) {
      throw new Error('<balam-button> not found inside <balam-install-footer>');
    }
    return button;
  }

  /**
   * Changes the state and redraws the component.
   * @param {InstallState} value - The new state.
   */
  #setState(value) {
    this.#state = value;
    this.#render();
  }

  /**
   * Detects the current browser's platform. Uses `navigator`, which is why
   * the detection itself lives in plataforma.js, which is pure and testable.
   */
  get #platform() {
    return detectarPlataforma(navigator.userAgent, navigator.maxTouchPoints);
  }

  /**
   * Triggers the browser's install prompt when the button is tapped. The
   * listener goes on the button (not on `window`), so it goes away with it.
   */
  #connectButton() {
    this.#button.addEventListener('click', async () => {
      if (this.#button.loading) return;
      this.#button.loading = true;

      const result = await instalar();
      if (result === 'accepted') {
        // Ends in 'installed' with the appinstalled event
        this.#setState('installing');
      } else {
        // Cancelled or not available: show the instructions
        this.#setState('manual');
      }
    });
  }

  /**
   * Replaces the content according to the current state.
   */
  #render() {
    if (this.#state === 'installed') {
      this.innerHTML = /* HTML */ `
        <p class="install-footer__note etiqueta-pequena">
          ${t('install.installed')}
        </p>
      `;
    } else if (this.#state === 'manual') {
      const platform = this.#platform;
      this.innerHTML = instructions[platform] ?? instructions['otro'];
    } else if (this.#state === 'installing') {
      this.innerHTML = /* HTML */ `
        <balam-button
          text="${t('install.button')}"
          loading-text="${t('install.installing')}"
        ></balam-button>
        <p class="install-footer__note etiqueta-pequena">
          ${t('install.installingNote')}
        </p>
      `;
      this.#button.loading = true;
    } else if (this.#state === 'install') {
      this.innerHTML = /* HTML */ `
        <balam-button text="${t('install.button')}"></balam-button>
        <p class="install-footer__note etiqueta-pequena">
          ${t('install.buttonNote')}
        </p>
      `;
      this.#connectButton();
    }
  }
}

customElements.define('balam-install-footer', BalamInstallFooter);
