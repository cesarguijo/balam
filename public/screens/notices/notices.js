/**
 * @file Notices screen: shows the family the recent notices of each child.
 */

import { t } from '../../js/i18n/es.js';
import { getSession } from '../../js/session.js';

const family = await getSession();
/**
 * Shows the notices screen inside the container.
 * @param {HTMLElement} app - Container where the screen is drawn.
 */
export function showNotices(app) {
  app.innerHTML = /* HTML */ `
    <div class="notices">
      <h1>Balam</h1>

      <div role="tablist">
        <!-- TODO: one <button role="tab"> per child -->
      </div>

      <div role="tabpanel">
        <ul>
          <li>
            <article>
              <h2>Hora de salida</h2>
              <p>Hoy los estudiantes saldrán a las 3:00 PM.</p>
              <footer>
                <time datetime="2026-03-10T10:00">Hoy 10:00 am</time>
              </footer>
            </article>
          </li>
        </ul>
      </div>

      <nav>
        <!-- TODO: links to Avisos, Notas and Asistencia -->
      </nav>
    </div>
  `;
}
