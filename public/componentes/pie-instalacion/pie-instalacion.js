import { BalamBoton } from '../boton/boton.js';
import {
  yaSeInstalo,
  sePuedeInstalar,
  instalar,
} from '../../js/instalacion.js';

export class BalamPieInstalacion extends HTMLElement {
  connectedCallback() {
    // Estado inicial.
    if (yaSeInstalo()) this.estado = 'instalada';
    else if (sePuedeInstalar()) this.estado = 'instalar';
    else this.estado = 'manual';
    window.addEventListener('beforeinstallprompt', () => {
      if (this.estado === 'manual') this.estado = 'instalar';
    });
    // Al terminar la instalación.
    window.addEventListener('appinstalled', () => {
      this.estado = 'instalada';
    });
  }

  get #balamBoton() {
    const balamButon = this.querySelector('balam-boton');
    if (!(balamButon instanceof BalamBoton)) {
      throw new Error('No se encontró el elemento <balam-boton>');
    }
    return balamButon;
  }

  get estado() {
    return this.getAttribute('estado') ?? 'instalar';
  }

  set estado(valor) {
    this.setAttribute('estado', valor);
    this.#dibujar();
  }

  #conectarBoton() {
    this.#balamBoton.addEventListener('click', async () => {
      if (this.#balamBoton.cargando) return;
      this.#balamBoton.cargando = true;

      const resultado = await instalar();
      if (resultado === 'accepted') {
        this.estado = 'instalando'; // termina en 'instalada' con el evento appinstalled
      } else {
        this.estado = 'manual'; // canceló o no estaba disponible: instrucciones
      }
    });
  }

  #dibujar() {
    if (this.estado === 'instalada') {
      this.innerHTML = /* HTML */ `
        <p class="pie-instalacion__nota etiqueta-pequena">
          ¡Listo! Balam ya está instalada <br />
          Ábrela desde tu pantalla de inicio
        </p>
      `;
    } else if (this.estado === 'manual') {
      this.innerHTML = /* HTML */ `
        <p class="pie-instalacion__nota etiqueta-pequena">
          Instálala desde tu navegador:
        </p>
        <ol>
          <li>Instruction</li>
          <li>Instruction</li>
        </ol>
      `;
    } else if (this.estado === 'instalando') {
      this.innerHTML = /* HTML */ `
        <balam-boton texto="Instalando..."></balam-boton>
        <p class="pie-instalacion__nota etiqueta-pequena">
          Esto tarda unos segundos. <br />
          No cierres esta página.
        </p>
      `;
      this.#balamBoton.cargando = true;
    } else if (this.estado === 'instalar') {
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
