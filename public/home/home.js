/**
 * @file Home page (/): asks whether the person is a family or a teacher and
 * sends them to that app's login. It lives outside both apps (ADR 0012), so
 * it has no router: it is a single screen.
 */

import { decorations } from '../js/decorations.js';
import { t } from '../js/i18n/es.js';

/**
 * Builds a link that looks like a <balam-button>. It is a link and not a
 * button because it opens another page; it does not need the button's
 * loading state.
 * @param {string} href - Page it opens.
 * @param {string} text - Text of the link, already translated.
 * @param {'default-primary' | 'secondary'} variant - Button colors.
 * @returns {string} HTML of the link.
 */
function linkButton(href, text, variant) {
  return /* HTML */ `
    <a class="button button--${variant} home__link" href="${href}">
      <span class="button__body">
        <span class="button__label">${text}</span>
      </span>
    </a>
  `;
}

/**
 * Draws the home page inside the #app container.
 * @throws {Error} If the #app container does not exist in index.html.
 */
function showHome() {
  const app = document.getElementById('app');
  if (!app) {
    throw new Error('#app container not found in index.html');
  }

  app.innerHTML = /* HTML */ `
    <div class="outside-layout home">
      <div class="backdrop">
        ${decorations['fret-bottom-left']} ${decorations['fret-top-left']}
        ${decorations['fret-top-right']} ${decorations['fret-bottom-right']}
        ${decorations['wave-top']} ${decorations['wave-bottom']}
      </div>
      <div class="home__content">
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
          <p class="identity__tagline">${t('home.question')}</p>
        </header>
        <nav class="home__links">
          ${linkButton('/families/#/login', t('home.family'), 'default-primary')}
          ${linkButton('/teachers/#/login', t('home.teacher'), 'secondary')}
        </nav>
      </div>
    </div>
  `;
}

showHome();
