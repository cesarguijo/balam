/**
 * @file Componente <balam-boton>: registra la etiqueta y define su
 * comportamiento (texto, variante y estado «cargando»).
 */

/**
 * Botón de Balam con estilo de piedra.
 *
 * Atributos:
 * - `texto`: texto que se muestra en el botón. Por defecto: 'Aceptar'.
 * - `variante`: `relleno` o `contorno`. Por defecto: `relleno`.
 *
 * @example
 * <balam-boton texto="Instalar" variante="contorno"></balam-boton>
 */
export class BalamBoton extends HTMLElement {
  connectedCallback() {
    this.innerHTML = /* html */ `
            <button class="boton boton--${this.#variante}">
                <span class="boton__cuerpo">
                    <span class="boton__indicador" aria-hidden="true">
                        <span></span><span></span><span></span>
                    </span>
                    <span class="boton__etiqueta">${this.#texto}</span>
                </span>
            </button>
        `;
  }

  get #texto() {
    return this.getAttribute('texto') ?? 'Aceptar';
  }

  get #variante() {
    return this.getAttribute('variante') ?? 'relleno';
  }

  get #boton() {
    const boton = this.querySelector('button');
    if (!(boton instanceof HTMLButtonElement)) {
      throw new Error('No se encontró el <button> dentro de balam-boton');
    }
    return boton;
  }

  get #etiqueta() {
    const etiqueta = this.#boton.querySelector('.boton__etiqueta');
    if (!(etiqueta instanceof HTMLElement)) {
      throw new Error(
        'No se encontró el elemento con la clase .boton__etiqueta',
      );
    }
    return etiqueta;
  }

  /**
   * Indica si el botón está cargando. Con `true` muestra la animación y el
   * texto «Cargando…»; con `false` vuelve a su texto original.
   * @type {boolean}
   */
  get cargando() {
    return this.#boton.getAttribute('aria-busy') === 'true';
  }

  /** @param {boolean} valor */
  set cargando(valor) {
    if (valor) {
      this.#boton.setAttribute('aria-busy', 'true');
      this.#etiqueta.textContent = 'Cargando…';
    } else {
      this.#boton.removeAttribute('aria-busy');
      this.#etiqueta.textContent = this.#texto;
    }
  }
}

customElements.define('balam-boton', BalamBoton);
