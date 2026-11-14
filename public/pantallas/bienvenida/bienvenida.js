/**
 * @file Pantalla de bienvenida: describe brevemente la app y muestra el botón de instalación.
 */

import '../../componentes/pie-instalacion/pie-instalacion.js';
import { icono } from '../../js/iconos.js';
import { decoraciones } from '../../js/decoraciones.js';

/**
 * Muestra la pantalla de bienvenida dentro del contenedor.
 * @param {HTMLElement} app - Contenedor donde se dibuja la pantalla.
 */
export function mostrarBienvenida(app) {
  app.innerHTML = /* HTML */ `
    <div class="bienvenida">
      <div class="bienvenida__fondo">
        ${decoraciones['greca-abajo-izquierda']}
        ${decoraciones['greca-arriba-izquierda']}
        ${decoraciones['greca-arriba-derecha']}
        ${decoraciones['greca-abajo-derecha']}
        ${decoraciones['onda-arriba']} ${decoraciones['onda-abajo']}
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
              <div class="caracteristicas__icono">${icono('megafono')}</div>
              <p class="caracteristicas__texto">Avisos y notas en tu celular</p>
            </li>
            <li class="caracteristicas__item">
              <div class="caracteristicas__icono">${icono('calculadora')}</div>
              <p class="caracteristicas__texto">Matemáticas a tu ritmo</p>
            </li>
            <li class="caracteristicas__item">
              <div class="caracteristicas__icono">${icono('candado')}</div>
              <p class="caracteristicas__texto">
                Privado, gratis y sin anuncios
              </p>
            </li>
          </ul>
        </div>

        <footer class="bienvenida__pie">
          <balam-pie-instalacion></balam-pie-instalacion>
        </footer>
      </div>
    </div>
  `;
}
