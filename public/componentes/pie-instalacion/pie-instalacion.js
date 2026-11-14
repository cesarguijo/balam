/**
 * @file Componente <balam-pie-instalacion>: registra la etiqueta y decide
 * cómo ofrecer la instalación (botón, progreso, confirmación o instrucciones
 * según la plataforma).
 */
import { BalamBoton } from '../boton/boton.js';
import {
  yaSeInstalo,
  sePuedeInstalar,
  instalar,
} from '../../js/instalacion.js';
import { detectarPlataforma } from '../../js/plataforma.js';
import { instrucciones } from './instrucciones.js';

/**
 * Estados del pie de instalación:
 * - `instalar`: el navegador permite instalar; se muestra el botón.
 * - `instalando`: la persona aceptó; se espera el evento `appinstalled`.
 * - `instalada`: la app ya está instalada; se muestra la confirmación.
 * - `manual`: el navegador no ofrece el botón (o la persona canceló); se
 *   muestran las instrucciones de su plataforma.
 * @typedef {'instalar' | 'instalando' | 'instalada' | 'manual'} EstadoInstalacion
 */

/**
 * Pie de la bienvenida que invita a instalar Balam.
 *
 * Calcula su propio estado (no recibe atributos) y se redibuja cada vez que
 * cambia. Escucha `beforeinstallprompt` y `appinstalled` en `window` mientras
 * está en la página.
 */
export class BalamPieInstalacion extends HTMLElement {
  /**
   * Quita los listeners de window al salir de la página, para no dejar
   * componentes fantasma en memoria.
   * @type {AbortController | undefined}
   */
  #controlador;

  /**
   * Estado actual. Solo se cambia con #cambiarEstado, para que siempre se redibuje.
   * @type {EstadoInstalacion}
   */
  #estado = 'instalar';

  /**
   * Calcula el estado inicial y empieza a escuchar los eventos de instalación.
   * Crea un controlador nuevo en cada conexión, porque uno abortado no se
   * puede reutilizar.
   */
  connectedCallback() {
    this.#controlador = new AbortController();
    const esEscritorio = this.#plataforma === 'escritorio';
    // Estado inicial.
    if (esEscritorio) this.#cambiarEstado('manual');
    else if (yaSeInstalo()) this.#cambiarEstado('instalada');
    else if (sePuedeInstalar()) this.#cambiarEstado('instalar');
    else this.#cambiarEstado('manual');
    window.addEventListener(
      'beforeinstallprompt',
      () => {
        if (
          (this.#estado === 'manual' || this.#estado === 'instalada') &&
          !esEscritorio
        ) {
          this.#cambiarEstado('instalar');
        }
      },
      { signal: this.#controlador.signal },
    );
    // Al terminar la instalación.
    window.addEventListener(
      'appinstalled',
      () => {
        this.#cambiarEstado('instalada');
      },
      { signal: this.#controlador.signal },
    );
  }

  /**
   * Quita los listeners de `window` al salir de la página.
   */
  disconnectedCallback() {
    this.#controlador?.abort();
  }

  /**
   * Devuelve el botón dibujado dentro del componente.
   * @returns {BalamBoton}
   * @throws {Error} Si el estado actual no dibujó un <balam-boton>.
   */
  get #balamBoton() {
    const balamBoton = this.querySelector('balam-boton');
    if (!(balamBoton instanceof BalamBoton)) {
      throw new Error('No se encontró el elemento <balam-boton>');
    }
    return balamBoton;
  }

  /**
   * Cambia el estado y redibuja el componente.
   * @param {EstadoInstalacion} valor - El nuevo estado.
   */
  #cambiarEstado(valor) {
    this.#estado = valor;
    this.#dibujar();
  }

  /**
   * Detecta la plataforma del navegador actual. Usa `navigator`, por eso la
   * detección en sí vive en plataforma.js, que es pura y se puede probar.
   */
  get #plataforma() {
    return detectarPlataforma(navigator.userAgent, navigator.maxTouchPoints);
  }

  /**
   * Lanza el aviso de instalación del navegador al tocar el botón. El
   * listener va en el botón (no en `window`), así que se va junto con él.
   */
  #conectarBoton() {
    this.#balamBoton.addEventListener('click', async () => {
      if (this.#balamBoton.cargando) return;
      this.#balamBoton.cargando = true;

      const resultado = await instalar();
      if (resultado === 'accepted') {
        this.#cambiarEstado('instalando'); // termina en 'instalada' con el evento appinstalled
      } else {
        this.#cambiarEstado('manual'); // canceló o no estaba disponible: instrucciones
      }
    });
  }

  /**
   * Reemplaza el contenido según el estado actual.
   */
  #dibujar() {
    if (this.#estado === 'instalada') {
      this.innerHTML = /* HTML */ `
        <p class="pie-instalacion__nota etiqueta-pequena">
          ¡Listo! Balam ya está instalada <br />
          Ábrela desde tu pantalla de inicio
        </p>
      `;
    } else if (this.#estado === 'manual') {
      const plataforma = this.#plataforma;
      this.innerHTML = instrucciones[plataforma] ?? instrucciones['otro'];
    } else if (this.#estado === 'instalando') {
      this.innerHTML = /* HTML */ `
        <balam-boton texto="Instalando..."></balam-boton>
        <p class="pie-instalacion__nota etiqueta-pequena">
          Esto tarda unos segundos. <br />
          No cierres esta página.
        </p>
      `;
      this.#balamBoton.cargando = true;
    } else if (this.#estado === 'instalar') {
      this.innerHTML = /* HTML */ `
        <balam-boton texto="Instalar"></balam-boton>
        <p class="pie-instalacion__nota etiqueta-pequena">
          Consume pocos datos y almacenamiento
        </p>
      `;
      this.#conectarBoton();
    }
  }
}

customElements.define('balam-pie-instalacion', BalamPieInstalacion);
