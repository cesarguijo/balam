/**
 * @file Pantalla de bienvenida: por ahora solo muestra un mensaje corto de bienvenida.
 */

import '../../componentes/boton/boton.js';

/**
 * Muestra la pantalla de bienvenida dentro del contenedor.
 * @param {HTMLElement} app - Contenedor donde se dibuja la pantalla.
 */
export function mostrarBienvenida(app) {
  app.innerHTML = /* HTML */ `
    <div class="bienvenida">
      <div class="bienvenida__contenido">
        <header class="identidad">
          <div class="identidad__logo">
            <img
              src="/img/icon-192.png"
              alt="Logo de Balam"
              width="52"
              height="52"
            />
          </div>
          <h1 class="identidad__nombre titulo-marca">Balam</h1>
          <p class="identidad__lema titulo-grande">
            La app de la clase del Prof. César
          </p>
        </header>
        <ul class="caracteristicas" role="list">
          <li class="caracteristicas__item">
            <div class="caracteristicas__icono" aria-hidden="true">
              <svg class="icono">
                <use href="/img/iconos.svg#megafono"></use>
              </svg>
            </div>
            <p class="cuerpo-grande">Avisos y notas en tu celular</p>
          </li>
          <li class="caracteristicas__item" aria-hidden="true">
            <div class="caracteristicas__icono">
              <svg class="icono">
                <use href="/img/iconos.svg#calculadora"></use>
              </svg>
            </div>
            <p class="cuerpo-grande">Matemáticas a tu ritmo</p>
          </li>
          <li class="caracteristicas__item" aria-hidden="true">
            <div class="caracteristicas__icono">
              <svg class="icono">
                <use href="/img/iconos.svg#candado"></use>
              </svg>
            </div>
            <p class="cuerpo-grande">Privado gratis y sin anuncios</p>
          </li>
        </ul>
        <footer class="pie-instalacion">
          <balam-boton texto="Instalar"></balam-boton>
          <p class="etiqueta-pequena">Consume pocos datos y almacenamiento</p>
        </footer>
      </div>
    </div>
  `;
}
