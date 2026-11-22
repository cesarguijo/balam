/**
 * @file Notices section: shows the family the recent notices of the selected
 * child, inside the content area of the family layout (screens/family).
 */

//import { getSession } from '../../../js/session.js';

//const family = await getSession();

// TODO: replace the sample notices with getRecentNotices(groupId) of the
// selected child, drawing each one from the Notice (title, body, createdAt,
// updatedAt for "Edited").
// TODO: draw each state of getListState (loading, empty, offline, cached,
// error) with the texts in es.js (notices.* keys).
/**
 * Shows the notices inside the content area. It only draws the list: the
 * header, the child tabs and the nav belong to the family layout, so they
 * are not redrawn when the section changes.
 * @param {HTMLElement} container - The layout's `<main>`, where the notices are drawn.
 */
export function showNotices(container) {
  container.innerHTML = /* HTML */ `
    <div class="notices">
      <ul class="notices__list">
        <li class="notices__item">
          <article>
            <h2>Hora de salida</h2>
            <p class="font-body">
              Hoy 10 de marzo, los estudiantes saldrán a las 3:00 PM debido a la
              decoración del dia del padre
            </p>
            <footer>
              <time datetime="2026-03-10T10:00">Hoy 10:00 am</time
              ><span>Edited</span>
            </footer>
          </article>
        </li>
        <li class="notices__item">
          <article>
            <h2>Reunion de Padres</h2>
            <p>Recuerda la reunion obligatoria el jueves a las 6:00 p.m.</p>
            <footer>
              <time datetime="2026-03-10T10:00">Hoy 10:00 am</time
              ><span>Edited</span>
            </footer>
          </article>
        </li>
      </ul>
    </div>
  `;
}
