/**
 * @file Teacher's grades section: the classes the teacher teaches, to
 * review each student's homework. For now it is a test version, to check
 * that the login reaches it.
 */

import { avatar } from '../../../components/avatar/avatar.js';
import { card } from '../../../components/card/card.js';
import { list } from '../../../components/list/list.js';
import { teacherSession } from '../../js/teacher-session.js';

/**
 * Draws the grades section inside the teacher layout.
 * @param {HTMLElement} container - The layout's `<main>`, where the section is drawn.
 */
export async function showGroups(container) {
  let content;
  const teacher = await teacherSession.getSession();
  console.log(teacher);
  if (teacher === null) {
    teacherSession.logOut();
    return;
  }
  if (!teacher.groupIds) {
    content = /* HTML */ `<p>
      No estas agregado a ningun grupo. Contacta al administrador
    </p>`;
  } else {
    const items = [
      {
        leading: avatar({ iconName: 'groups' }),
        content: /* HTML */ ` <div class="all-groups group__content">
          <span class="group__name">Todos mis grupos</span>
          <span class="group__last-message">Suspension de clases</span>
        </div>`,
        tag: 'button',
      },
    ];
    teacher.groupIds.forEach((id, index) => {
      const groupName = idToText(id);
      content = /* HTML */ ` <div class="group__content">
        <span class="group__name">${groupName}</span>
        <span class="group__last-message">Aun no hay mensajes</span>
      </div>`;
      items.push({
        leading: avatar({ text: id, order: index + 1 }),
        content: content,
        tag: 'button',
      });
    });

    const groupList = list(items);
    content = card(groupList);
  }
  /** @type {import('../../../components/list/list.js').ListItemOptions} */

  container.innerHTML = /* HTML */ ` ${content} `;
}

/**
 *
 * @param {string} id
 */
function idToText(id) {
  const groups = id.split('-');

  /** @type {Record<string,string>} */
  const grades = {
    7: 'Séptimo',
    8: 'Octavo',
    9: 'Noveno',
  };

  return `${grades[groups[0]]} - ${groups[1]}`;
}
