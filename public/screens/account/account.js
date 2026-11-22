/**
 * @file Account screen: shows the signed-in family, its children and the
 * app settings.
 */

import { drawAppBar } from '../../components/app-bar/app-bar.js';
import { avatar } from '../../components/avatar/avatar.js';
import { card } from '../../components/card/card.js';
import { list } from '../../components/list/list.js';
import { t } from '../../js/i18n/es.js';
import { icon } from '../../js/icons.js';
import { getSession } from '../../js/session.js';

/** Start of the app bar: a back button and the screen title. */
const start = /* HTML */ `
  <button data-account-back class="icon-button ripple">
    ${icon('arrow-left')}
  </button>
  <h1>${t('account.title')}</h1>
`;

/**
 * Shows the account screen inside the container, with the data of the
 * current session.
 * @param {HTMLElement} app - Container where the screen is drawn.
 */
export async function showAccount(app) {
  const session = await getSession();
  const username = /** @type {string} */ (session?.username);
  const children = /** @type {import('../family/tabs.js').Child[]} */ (
    session?.children ?? []
  );
  const userAvatar = avatar(session?.username);

  /** @type {import('../../components/list/list.js').ListItemOptions} */
  const userItemOption = {
    leading: userAvatar,
    content: /* HTML */ `<p class="text-body">
      ${t('account.user')} ${username}
    </p>`,
  };
  const userItem = list([userItemOption]);

  /** @type {import('../../components/list/list.js').ListItemOptions[]} */
  const familyItemOption = children.map((child, index) => {
    return {
      leading: avatar(child.name, index + 1),
      content: `${child.name}`,
      trailing: `${child.groupId}`,
    };
  });

  familyItemOption.push({
    leading: icon('refresh'),
    content: /* HTML */ `
      <div class="account__update-content">
        <p>${t('account.refresh')}</p>
        <p class="account__update-time text-label">Ultima vez: hoy, 8:15</p>
      </div>
    `,
    trailing: ``,
    tag: 'button',
  });

  const familyItem = list(familyItemOption);

  /** @type {import('../../components/list/list.js').ListItemOptions[]} */
  const appItemOption = [
    {
      leading: icon('brand-whatsapp'),
      content: `${t('account.whatsapp')}`,
      tag: 'a',
      link: 'https://whatsapp.com/channel/0029VbE9uw9Jpe8cEZOghs37',
    },
    {
      leading: icon('send'),
      content: `${t('account.requests')}`,
      tag: 'button',
    },
  ];

  app.innerHTML = /* HTML */ `
    ${drawAppBar(start)}
    <div class="account">
      <div class="account__section">${card(userItem)}</div>
      <div class="account__section">
        <h2 class="account__heading text-label">${t('account.family')}</h2>
        ${card(familyItem)}
      </div>
      <div class="account__section">
        <h2 class="account__heading text-label">${t('account.app')}</h2>
        ${card(list(appItemOption))}
      </div>
      <balam-button
        class="account__logout-button"
        text="${t('account.logout')}"
        variant="danger-secondary"
      ></balam-button>
    </div>
  `;

  const backButton = app.querySelector('[data-account-back]');

  backButton?.addEventListener('click', () => location.replace('#/notices'));
}
