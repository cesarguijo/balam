/**
 * @file Manual install templates: maps each platform to its install instructions.
 */

import { icon } from '../../js/icons.js';
import { decorations } from '../../js/decorations.js';
import { t } from '../../js/i18n/es.js';

/**
 * Install instructions by platform. Keys are the values returned by
 * detectPlatform(), which match the Figma variant names.
 *
 * The texts are looked up once, when the module loads. That is enough while
 * the app has a single language; switching languages at runtime would need
 * these templates to become functions.
 * @see https://www.figma.com/design/gppFLl6SOZO1WDO7pzQkXx/Balam?node-id=253-531&t=3FMcOL8uA5ZsPQ1j-4
 * @see docs/diseno/ (screenshots of each variant)
 */
export const instructions = {
  desktop: /* HTML */ `
    <p class="install-footer__note install-footer__note--large">
      ${t('install.desktop.title')}
    </p>
    <div class="install-footer__qr">
      <img
        class="install-footer__qr-image"
        src="/img/qr-balam.svg"
        width="400"
        height="400"
        alt="${t('install.desktop.qrAlt')}"
      />
      <span class="install-footer__corner install-footer__corner--top-left"
        >${decorations['rounded-corner']}</span
      >
      <span class="install-footer__corner install-footer__corner--top-right"
        >${decorations['rounded-corner']}</span
      >
      <span class="install-footer__corner install-footer__corner--bottom-left"
        >${decorations['rounded-corner']}</span
      >
      <span class="install-footer__corner install-footer__corner--bottom-right"
        >${decorations['rounded-corner']}</span
      >
    </div>
    <div class="install-footer__scan">
      <div class="install-footer__scan-icon">${icon('device-mobile')}</div>
      <div class="install-footer__scan-text">
        <p>${t('install.desktop.scan')}</p>
        <p><strong>balam-math.web.app</strong></p>
      </div>
    </div>
  `,
  'android-chrome': /* HTML */ `
    <div class="install-footer__note">
      <p class="text-label">${t('install.title')}</p>
    </div>
    <ol class="install-footer__steps">
      <li class="install-footer__step">
        ${icon('dots-vertical')}
        <p class="install-footer__text">${t('install.step.menuTopRight')}</p>
      </li>
      <li class="install-footer__step">
        ${icon('app-install')}
        <p class="install-footer__text">${t('install.step.installShortcut')}</p>
      </li>
    </ol>
  `,
  firefox: /* HTML */ `
    <div class="install-footer__note">
      <p class="text-label">${t('install.title')}</p>
    </div>
    <ol class="install-footer__steps">
      <li class="install-footer__step">
        ${icon('dots-vertical')}
        <p class="install-footer__text">${t('install.step.menuTopRight')}</p>
      </li>
      <li class="install-footer__step">
        ${icon('dots')}
        <p class="install-footer__text">${t('install.step.more')}</p>
      </li>
      <li class="install-footer__step">
        ${icon('square-plus')}
        <p class="install-footer__text">${t('install.step.addAppToHome')}</p>
      </li>
      <li class="install-footer__step">
        ${icon('check')}
        <p class="install-footer__text">${t('install.step.add')}</p>
      </li>
    </ol>
  `,
  'ios-chrome': /* HTML */ `
    <div class="install-footer__note">
      <p class="text-label">${t('install.title')}</p>
    </div>
    <ol class="install-footer__steps">
      <li class="install-footer__step">
        ${icon('share')}
        <p class="install-footer__text">${t('install.step.shareAddressBar')}</p>
      </li>
      <li class="install-footer__step">
        ${icon('square-plus')}
        <p class="install-footer__text">${t('install.step.addToHome')}</p>
      </li>
      <li class="install-footer__step">
        ${icon('check')}
        <p class="install-footer__text">${t('install.step.addTopRight')}</p>
      </li>
    </ol>
  `,
  'ios-safari-legacy': /* HTML */ `
    <div class="install-footer__note">
      <p class="text-label">${t('install.title')}</p>
    </div>
    <ol class="install-footer__steps">
      <li class="install-footer__step">
        ${icon('share')}
        <p class="install-footer__text">
          ${t('install.step.shareBottomCenter')}
        </p>
      </li>
      <li class="install-footer__step">
        ${icon('square-plus')}
        <p class="install-footer__text">${t('install.step.addToHome')}</p>
      </li>
      <li class="install-footer__step">
        ${icon('check')}
        <p class="install-footer__text">${t('install.step.addTopRight')}</p>
      </li>
    </ol>
  `,
  'ios-safari': /* HTML */ `
    <div class="install-footer__note">
      <p class="text-label">${t('install.title')}</p>
    </div>
    <ol class="install-footer__steps">
      <li class="install-footer__step">
        ${icon('dots')}
        <p class="install-footer__text">${t('install.step.menuBottomRight')}</p>
      </li>
      <li class="install-footer__step">
        ${icon('share')}
        <p class="install-footer__text">${t('install.step.share')}</p>
      </li>
      <li class="install-footer__step">
        ${icon('square-plus')}
        <p class="install-footer__text">${t('install.step.addToHome')}</p>
      </li>
      <li class="install-footer__step">
        ${icon('check')}
        <p class="install-footer__text">${t('install.step.addTopRight')}</p>
      </li>
    </ol>
  `,
  other: /* HTML */ `
    <div class="install-footer__note">
      <p class="text-label">${t('install.title')}</p>
    </div>
    <ol class="install-footer__steps">
      <li class="install-footer__step">
        ${icon('brand-chrome')}
        <p class="install-footer__text">${t('install.step.openInChrome')}</p>
      </li>
    </ol>
  `,
  samsung: /* HTML */ `
    <div class="install-footer__note">
      <p class="text-label">${t('install.title')}</p>
    </div>
    <ol class="install-footer__steps">
      <li class="install-footer__step">
        ${icon('square-rounded-arrow-down')}
        <p class="install-footer__text">${t('install.step.installIcon')}</p>
      </li>
      <li class="install-footer__step">
        ${icon('check')}
        <p class="install-footer__text">${t('install.step.install')}</p>
      </li>
    </ol>
  `,
};
