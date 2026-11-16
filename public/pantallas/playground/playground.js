/**
 * @file Playground screen: shows every UI component so they can be tried
 * out and reviewed in one place.
 */

import { esperar } from '../../js/utilidades.js';
import { BalamButton } from '../../componentes/button/button.js';
import { icon, iconNames } from '../../js/icons.js';

/**
 * Shows the playground screen inside the container.
 * @param {HTMLElement} app - Container where the screen is drawn.
 */
export function showPlayground(app) {
  document.title = 'Balam - Catálogo';

  app.innerHTML = /* HTML */ `
    <div class="playground">
      <h1 class="titulo-marca">Catálogo de componentes</h1>

      <section class="playground__section">
        <h2 class="titulo-grande">Botón</h2>
        <div class="playground__sample">
          <balam-button text="Instalar"></balam-button>
        </div>
      </section>

      <section class="playground__section">
        <h2 class="titulo-grande">Íconos</h2>
        <div class="playground__icons">${drawIcons()}</div>
      </section>
    </div>
  `;

  const button = app.querySelector('balam-button');
  if (!(button instanceof BalamButton)) {
    throw new Error('<balam-button> not found in the playground');
  }

  button.addEventListener('click', async () => {
    if (button.loading) return;
    button.loading = true;
    // Simulates a slow task, to see the loading state
    await esperar(3000);
    button.loading = false;
  });
}

/**
 * Draws every available icon, to check at a glance that they are centered.
 * @returns {string} HTML with one icon per name in iconNames.
 */
export function drawIcons() {
  let icons = ``;
  iconNames.forEach((name) => {
    icons =
      icons +
      /* HTML */ `
        <figure class="playground__icon">
          ${icon(name)}
          <figcaption class="playground__name">${name}</figcaption>
        </figure>
      `;
  });
  return icons;
}
