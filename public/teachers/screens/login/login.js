/**
 * @file Teachers' login screen. For now it only has the back arrow to the
 * home page; the form will come with the shared <login-form> (ADR 0012).
 */

import { t } from '../../../js/i18n/es.js';
import { icon } from '../../../js/icons.js';

/**
 * Shows the teachers' login screen inside the container.
 * @param {HTMLElement} app - Container where the screen is drawn.
 */
export function showLogin(app) {
  app.innerHTML = /* HTML */ `
    <div class="outside-layout">
      <a
        class="icon-button ripple outside-layout__back"
        href="/"
        aria-label="${t('outside.back')}"
      >
        ${icon('arrow-left')}
      </a>
    </div>
  `;
}
