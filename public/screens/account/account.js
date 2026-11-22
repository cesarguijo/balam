import { drawAppBar } from '../../components/app-bar/app-bar.js';
import { t } from '../../js/i18n/es.js';
import { icon } from '../../js/icons.js';

/**
 *
 * @param {HTMLElement} app
 */

const start = /* HTML */ `
  <button data-account-back class="icon-button ripple">
    ${icon('arrow-left')}
  </button>
  <h1>${t('account.title')}</h1>
`;

/**
 *
 * @param {HTMLElement} app
 */
export function showAccount(app) {
  app.innerHTML = /* HTML */ ` ${drawAppBar(start)} `;

  const backButton = app.querySelector('[data-account-back]');

  backButton?.addEventListener('click', () => location.replace('#/notices'));
}
