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
    {
      icon: 'device-mobile-down',
      text: t('family.menu.install'),
      action: () => {
        console.log('clic on install');
      },
    },
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

      <balam-install-banner></balam-install-banner>

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

  for (const link of app.querySelectorAll('.family__nav-item')) {
    if (link.getAttribute('href') === location.hash) {
      link.setAttribute('aria-current', 'page');
      link.classList.add('family__nav-item_active');
    }
  }
}
