/**
 * @file <balam-install-banner> component: registers the tag and invites the
 * family to install Balam, without forcing them (ADR 0011).
 */
import { isInstalled, canInstall, install } from '../../js/install.js';
import { detectPlatform } from '../../js/platform.js';
import { icon } from '../../js/icons.js';
import { t } from '../../js/i18n/es.js';
import { shouldShowInstallBanner } from './visibility.js';

/**
 * Name of the `localStorage` flag that remembers the family closed the
 * banner, so it does not come back every time the app opens.
 */
const DISMISSED_KEY = 'balam-install-banner-dismissed';

/**
 * Optional invitation to install Balam, shown above the family's sections.
 *
 * Takes no attributes: it works out by itself whether to show (see
 * `shouldShowInstallBanner`). "Instalar" opens the browser's install dialog
 * when the browser offers one; if not, it goes to the welcome screen, which
 * has the steps for each phone. "Ahora no" closes it for good.
 */
export class BalamInstallBanner extends HTMLElement {
  /**
   * Removes the window listener when leaving the page.
   * @type {AbortController | undefined}
   */
  #controller;

  /**
   * Draws the banner (or nothing) and hides it if the app gets installed
   * while it is on the page.
   */
  connectedCallback() {
    const show = shouldShowInstallBanner({
      isDesktop:
        detectPlatform(navigator.userAgent, navigator.maxTouchPoints) ===
        'desktop',
      installed:
        matchMedia('(display-mode: standalone)').matches || isInstalled(),
      dismissed: localStorage.getItem(DISMISSED_KEY) === 'yes',
    });
    if (!show) {
      this.innerHTML = '';
      return;
    }

    this.innerHTML = /* HTML */ `
      <div
        class="install-banner"
        role="region"
        aria-label="${t('installBanner.label')}"
      >
        <span class="install-banner__icon"
          >${icon('square-rounded-arrow-down')}</span
        >
        <p class="install-banner__text text-body">${t('installBanner.text')}</p>
        <div class="install-banner__actions">
          <button class="install-banner__install text-label" type="button">
            ${t('installBanner.install')}
          </button>
          <button class="install-banner__dismiss text-label" type="button">
            ${t('installBanner.dismiss')}
          </button>
        </div>
      </div>
    `;

    this.querySelector('.install-banner__install')?.addEventListener(
      'click',
      () => this.#install(),
    );
    this.querySelector('.install-banner__dismiss')?.addEventListener(
      'click',
      () => this.#dismiss(),
    );

    this.#controller = new AbortController();
    window.addEventListener('appinstalled', () => (this.innerHTML = ''), {
      signal: this.#controller.signal,
    });
  }

  /**
   * Removes the `window` listener when leaving the page.
   */
  disconnectedCallback() {
    this.#controller?.abort();
  }

  /**
   * Opens the browser's install dialog; if the browser does not offer one
   * (iPhone, Firefox, or the family cancelled it before), goes to the
   * welcome screen, which shows the manual steps for this phone.
   */
  async #install() {
    if (canInstall()) {
      const result = await install();
      if (result !== 'unavailable') return;
    }
    location.hash = '#/welcome';
  }

  /**
   * Closes the banner and remembers it on this phone.
   */
  #dismiss() {
    localStorage.setItem(DISMISSED_KEY, 'yes');
    this.innerHTML = '';
  }
}

customElements.define('balam-install-banner', BalamInstallBanner);
