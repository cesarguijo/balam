/**
 * @file Family layout: draws the frame shared by the family's sections
 * (notices, grades, attendance) and lets each section fill its middle.
 */

import { icon } from '../../js/icons.js';
import { getSession } from '../../js/session.js';
import '../../components/install-banner/install-banner.js';
import { getNoticeTabs } from './tabs.js';
import { t } from '../../js/i18n/es.js';
import { BalamMenu } from '../../components/menu/menu.js';
import { drawAppBar } from '../../components/app-bar/app-bar.js';
import { avatar } from '../../components/avatar/avatar.js';
import { install, isInstalled } from '../../js/install.js';

/**
 * Shows that Chrome is installing Balam, until the family closes it with
 * the X. There is a single message because the web cannot know when the
 * install ends: on Android, `appinstalled` fires when it starts, while
 * Chrome keeps building the app.
 * @param {HTMLElement} app - Container where the family screen is drawn.
 */
function showInstallMessage(app) {
  const message = app.querySelector('.family__install-status');
  const text = app.querySelector('.family__install-text');
  if (!(message instanceof HTMLElement) || !(text instanceof HTMLElement)) {
    return;
  }
  message.hidden = false;
  // The text is written after showing the box: a `role="status"` region is
  // announced by screen readers only when its content changes.
  text.textContent = t('family.installing');
}

// TODO: draw one tab per child with getNoticeTabs(getSession().children)
// instead of the fixed names; with a single child, show only the name.
// TODO: when a tab is clicked, mark it (aria-selected, family__tab_selected)
// and redraw the section with that child's groupId.
// TODO: move "Balam", "Avisos", "Notas" and "Asistencia" to es.js
// (family.* keys) and use t().
// TODO: pick icons that describe grades and attendance (today alert-circle
// and calculator).
/**
 * Draws the family layout (header, child tabs and nav) and asks the section
 * to draw itself in the middle. The layout does not know which section it
 * is: the router passes it, so notices, grades and attendance share the
 * same frame.
 * @param {HTMLElement} app - Container where the screen is drawn.
 * @param {(container: HTMLElement) => void} section - Function that draws the section inside the layout's `<main>`, e.g. `showNotices`.
 */
export async function showFamily(app, section) {
  let family = await getSession();
  console.log(family);
  if (!family) {
    location.replace('#/login');
    return; // Don't draw
  }

  const tabs = getNoticeTabs(family.children);
  let htmlTabs = ``;
  tabs.forEach((tab, index) => {
    const classSelected = index === 0 ? 'family__tab_selected' : '';
    htmlTabs += /* HTML */ `
      <button
        class="family__tab ${classSelected}"
        role="tab"
        aria-selected="${index === 0}"
      >
        ${avatar(tab.label, index + 1)} ${tab.label}
      </button>
    `;
  });

  // Opened as the app, or installed from this browser: nothing to install.
  const installed =
    matchMedia('(display-mode: standalone)').matches || isInstalled();

  /** @type {import('../../components/menu/menu.js').BalamMenuItem} */
  const installItem = {
    icon: 'device-mobile-down',
    text: t('family.menu.install'),
    action: async () => {
      const result = await install();
      // No browser dialog (iPhone, Firefox, or already used once): the
      // welcome screen has the manual steps for this phone.
      if (result === 'unavailable') {
        location.hash = '#/welcome';
        return;
      }
      if (result === 'accepted') {
        if (menu instanceof BalamMenu) {
          menu.items = menuItems.filter((item) => item !== installItem);
        }
        showInstallMessage(app);
      }
    },
  };

  /** @type {import('../../components/menu/menu.js').BalamMenuItem[]} */
  const menuItems = [
    {
      icon: 'books',
      text: t('family.menu.books'),
      action: () => {
        console.log('clic on books');
      },
    },
    {
      icon: 'user-circle',
      text: t('family.menu.account'),
      action: () => {
        location.replace('#/account');
      },
    },
    ...(installed ? [] : [installItem]),
  ];

  const start = /* HTML */ `
    <div class="family__logo">
      <img class="family__logo" src="/img/icon-512.png" alt="" />
    </div>
    <h1>Balam</h1>
  `;

  const end = /* HTML */ `
    <balam-menu class="family__menu" data-balam-menu></balam-menu>
  `;

  app.innerHTML = /* HTML */ `
    <div class="family">
      ${drawAppBar(start, end)}

      <div class="family__install-status" hidden>
        <p class="family__install-text text-body" role="status"></p>
        <button
          class="family__install-close icon-button ripple"
          type="button"
          aria-label="${t('family.installClose')}"
          data-install-close
        >
          ${icon('x')}
        </button>
      </div>

      <div class="family__tabs" role="tablist">${htmlTabs}</div>

      <div class="family__tabpanel" role="tabpanel">
        <main class="family__content"></main>
      </div>

      <nav class="family__nav">
        <a class="family__nav-item" href="#/notices">
          <span class="family__nav-icon">${icon('megaphone')}</span> Avisos
        </a>
        <a class="family__nav-item" href="#/grades">
          <span class="family__nav-icon">${icon('alert-circle')}</span>
          Notas
        </a>
        <a class="family__nav-item" href="#/attendance">
          <span class="family__nav-icon">${icon('calculator')}</span>
          Asistencia
        </a>
      </nav>
    </div>
  `;

  const menu = app.querySelector('[data-balam-menu]');
  if (!(menu instanceof BalamMenu)) {
    throw new Error('[data-balam-menu] not found in app');
  }
  menu.items = menuItems;

  const main = app.querySelector('main');
  if (!(main instanceof HTMLElement)) {
    throw new Error('main not found in app');
  }

  section(main);

  app.querySelector('[data-install-close]')?.addEventListener('click', () => {
    const message = app.querySelector('.family__install-status');
    if (message instanceof HTMLElement) message.hidden = true;
  });

  for (const link of app.querySelectorAll('.family__nav-item')) {
    if (link.getAttribute('href') === location.hash) {
      link.setAttribute('aria-current', 'page');
      link.classList.add('family__nav-item_active');
    }
  }
}
