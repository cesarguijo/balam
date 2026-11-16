/**
 * @file Welcome screen: briefly describes the app and shows the install
 * button.
 */

import '../../components/install-footer/install-footer.js';
import { icon } from '../../js/icons.js';
import { decorations } from '../../js/decorations.js';
import { t } from '../../js/i18n/es.js';

/**
 * Shows the welcome screen inside the container.
 * @param {HTMLElement} app - Container where the screen is drawn.
 */
export function showWelcome(app) {
  app.innerHTML = /* HTML */ `
    <div class="outside-layout welcome">
      <div class="backdrop">
        ${decorations['fret-bottom-left']} ${decorations['fret-top-left']}
        ${decorations['fret-top-right']} ${decorations['fret-bottom-right']}
        ${decorations['wave-top']} ${decorations['wave-bottom']}
      </div>
      <div class="welcome__content">
        <div class="welcome__left-column">
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
            <p class="identity__tagline">${t('welcome.tagline')}</p>
          </header>
          <ul class="features" role="list">
            <li class="features__item">
              <div class="features__icon">${icon('megaphone')}</div>
              <p class="features__text">${t('welcome.feature.notices')}</p>
            </li>
            <li class="features__item">
              <div class="features__icon">${icon('calculator')}</div>
              <p class="features__text">${t('welcome.feature.math')}</p>
            </li>
            <li class="features__item">
              <div class="features__icon">${icon('lock')}</div>
              <p class="features__text">${t('welcome.feature.private')}</p>
            </li>
          </ul>
        </div>

        <footer class="welcome__footer">
          <balam-install-footer></balam-install-footer>
        </footer>
      </div>
    </div>
  `;
}
