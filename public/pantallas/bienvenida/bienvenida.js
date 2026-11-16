/**
 * @file Pantalla de bienvenida: describe brevemente la app y muestra el botón de instalación.
 */

import '../../componentes/install-footer/install-footer.js';
import { icon } from '../../js/icons.js';
import { decorations } from '../../js/decorations.js';

/**
 * Muestra la pantalla de bienvenida dentro del contenedor.
 * @param {HTMLElement} app - Contenedor donde se dibuja la pantalla.
 */
export function mostrarBienvenida(app) {
  app.innerHTML = /* HTML */ `
    <div class="bienvenida">
      <div class="bienvenida__fondo">
        ${decorations['fret-bottom-left']}
        ${decorations['fret-top-left']}
        ${decorations['fret-top-right']}
        ${decorations['fret-bottom-right']}
        ${decorations['wave-top']} ${decorations['wave-bottom']}
      </div>
      <div class="bienvenida__contenido">
        <div class="bienvenida__columna-izquierda">
          <header class="identidad">
            <div class="identidad__logo">
              <img
                src="/img/icon-192.png"
                alt="Logo de Balam"
                width="52"
                height="52"
              />
            </div>
            <h1 class="identidad__nombre">Balam</h1>
            <p class="identidad__lema">La app de la clase del Prof. César</p>
          </header>
          <ul class="caracteristicas" role="list">
            <li class="caracteristicas__item">
              <div class="caracteristicas__icono">${icon('megaphone')}</div>
              <p class="caracteristicas__texto">Avisos y notas en tu celular</p>
            </li>
            <li class="caracteristicas__item">
              <div class="caracteristicas__icono">${icon('calculator')}</div>
              <p class="caracteristicas__texto">Matemáticas a tu ritmo</p>
            </li>
            <li class="caracteristicas__item">
              <div class="caracteristicas__icono">${icon('lock')}</div>
              <p class="caracteristicas__texto">
                Privado, gratis y sin anuncios
              </p>
            </li>
          </ul>
        </div>

        <footer class="bienvenida__pie">
          <balam-install-footer></balam-install-footer>
        </footer>
      </div>
    </div>
  `;
}
