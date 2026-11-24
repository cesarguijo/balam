/**
 * @file Teacher layout: draws the frame shared by the teacher's sections
 * (grades, attendance, messages, homeroom) and lets each section fill its
 * middle. For now it is a test version, to check that the login works.
 */

import { drawAppBar } from '../../../components/app-bar/app-bar.js';
import { drawLockup } from '../../../components/lockup/lockup.js';
import { BalamMenu } from '../../../components/menu/menu.js';
import { drawNavbar } from '../../../components/nav-bar/nav-bar.js';
import { t } from '../../../js/i18n/es.js';
import { icon } from '../../../js/icons.js';
import { install, isInstalled } from '../../../js/install.js';
import { teacherSession } from '../../js/teacher-session.js';

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

/**
 * Draws the teacher layout and asks the section to draw itself in the
 * middle. The layout does not know which section it is: the router passes
 * it, so all the sections share the same frame.
 * @param {HTMLElement} app - Container where the screen is drawn.
 * @param {(container: HTMLElement) => void} section - Function that draws the section inside the layout's `<main>`, e.g. `showGrades`.
 */
export async function showTeacher(app, section) {
  let teacher = await teacherSession.getSession();

  if (!teacher) {
    location.replace('#/login');
    return;
  }

  // Opened as the app, or installed from this browser: nothing to install.
  const installed =
    matchMedia('(display-mode: standalone)').matches || isInstalled();

  /** @type {import('../../../components/menu/menu.js').BalamMenuItem} */
  const installItem = {
    icon: 'device-mobile-down',
    text: t('family.menu.install'),
    action: async () => {
      const result = await install();
      // No browser dialog (iPhone, Firefox, or already used once): the
      // install screen has the manual steps for this phone.
      if (result === 'unavailable') {
        location.hash = '#/install';
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

  /** @type {import('../../../components/menu/menu.js').BalamMenuItem[]} */
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

  const start = /* HTML */ ` ${drawLockup()} `;

  const end = /* HTML */ `
    <balam-menu class="family__menu" data-balam-menu></balam-menu>
  `;

  /**
   * @type {import('../../../components/nav-bar/nav-bar.js').NavItem[]}
   */
  const navItems = [
    {
      href: '#/grades',
      icon: 'megaphone',
      label: 'Notas',
    },
    {
      href: '#/attendance',
      icon: 'alert-circle',
      label: 'Asistencia',
    },
    {
      href: '#/groups',
      icon: 'calculator',
      label: 'Avisos',
    },
    {
      href: '#/finals',
      icon: 'calculator',
      label: 'Finales',
    },
  ];

  app.innerHTML = /* HTML */ `
    <div class="teacher">
      ${drawAppBar(start, end)};
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
    </div>
    <main class="teacher__content"></main>
    ${drawNavbar(navItems)}
  `;

  const menu = app.querySelector('[data-balam-menu]');
  if (!(menu instanceof BalamMenu)) {
    throw new Error('[data-balam-menu] not found in app');
  }
  menu.items = menuItems;

  const content = app.querySelector('.teacher__content');
  if (!(content instanceof HTMLElement)) {
    throw new Error('.teacher__content not found in teacher');
  }
  section(content);

  app.querySelector('[data-install-close]')?.addEventListener('click', () => {
    const message = app.querySelector('.family__install-status');
    if (message instanceof HTMLElement) message.hidden = true;
  });
}
