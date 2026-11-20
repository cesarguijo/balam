/**
 * @file Family layout: draws the frame shared by the family's sections
 * (notices, grades, attendance) and lets each section fill its middle.
 */

import { icon } from '../../js/icons.js';
import { getSession } from '../../js/session.js';

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

  app.innerHTML = /* HTML */ `
    <div class="family">
      <div class="family__app-bar-content">
        <div class="family__app-bar">
          <div class="family__logo">
            <img class="family__logo" src="/img/icon-512.png" alt="" />
          </div>
          <h1 class="family__app-name">Balam</h1>
        </div>
        <div class="family__pyramid"></div>
        <svg
          class="family__curve"
          viewBox="0 0 320 16"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path class="family__curve-fill" d="M0 4 Q160 16 320 4 V16 H0 Z" />
          <path
            class="family__curve-line"
            d="M0 4 Q160 16 320 4"
            vector-effect="non-scaling-stroke"
          />
        </svg>
      </div>

      <div class="family__tabs" role="tablist">
        <button class="family__tab family__tab_selected" role="tab">
          <span class="family__avatar">A</span>Ana
        </button>
        <button class="family__tab" role="tab">
          <span class="family__avatar">L</span>Luis
        </button>
        <button class="family__tab" role="tab">
          <span class="family__avatar">S</span>Sofia
        </button>
        <button class="family__tab" role="tab">
          <span class="family__avatar">M</span>Maximiliano
        </button>
      </div>

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

  if (!family) location.replace('#/login');

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
