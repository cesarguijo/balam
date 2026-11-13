/**
 * @file Plantillas de manual de instalación: relaciona la plataforma con la plantilla de manual de instalación.
 */

import { icono } from '../../js/iconos.js';

/**
 * Instrucciones de instalación por plataforma.
 * @see https://www.figma.com/design/gppFLl6SOZO1WDO7pzQkXx/Balam?node-id=253-531&t=3FMcOL8uA5ZsPQ1j-4
 * @see docs/diseno/ (capturas de cada variante)
 */
export const instrucciones = {
  escritorio: /* HTML */ `
    <div class="pie-instalacion__nota">
      <p class="etiqueta-pequena">Balam funciona mejor en tu celular</p>
    </div>
    <div class="pie-instalacion__QR">
      <img
        src="/img/qr-balam.svg"
        width="400"
        alt="Código QR para abrir Balam en tu celular"
      />
    </div>
    <div class="pie-instalacion__instrucciones">
      <div class="pie-instalacion__icono">${icono('movil')}</div>
      <div class="pie-instalacion__texto">
        <p>Escanea este código con la cámara de tu celular</p>
        <p>balam-math.web.app</p>
      </div>
    </div>
  `,
  'android-chrome': /* HTML */ `
    <div class="pie-instalacion__nota">
      <p class="etiqueta-pequena">Instala desde tu navegador</p>
    </div>
    <ol class="pie-instalacion__pasos">
      <li class="pie-instalacion__paso">
        ${icono('menu-puntos-vertical')}
        <p class="pie-instalacion__texto">Toca el menú, arriba a la derecha</p>
      </li>
      <li class="pie-instalacion__paso">
        ${icono('instalar-app')}
        <p class="pie-instalacion__texto">
          Elige <strong>Instalar y crear acceso directo</strong>
        </p>
      </li>
    </ol>
  `,
  firefox: /* HTML */ `
    <div class="pie-instalacion__nota">
      <p class="etiqueta-pequena">Instala desde tu navegador</p>
    </div>
    <ol class="pie-instalacion__pasos">
      <li class="pie-instalacion__paso">
        ${icono('menu-puntos-vertical')}
        <p class="pie-instalacion__texto">Toca el menú, arriba a la derecha</p>
      </li>
      <li class="pie-instalacion__paso">
        ${icono('menu-puntos-horizontal')}
        <p class="pie-instalacion__texto">Toca <strong>Más</strong></p>
      </li>
      <li class="pie-instalacion__paso">
        ${icono('cuadrado-mas')}
        <p class="pie-instalacion__texto">
          Elige <strong>Agregar app a la pantalla de inicio</strong>
        </p>
      </li>
      <li class="pie-instalacion__paso">
        ${icono('check')}
        <p class="pie-instalacion__texto">Toca <strong>Agregar</strong></p>
      </li>
    </ol>
  `,
  'ios-chrome': /* HTML */ `
    <div class="pie-instalacion__nota">
      <p class="etiqueta-pequena">Instala desde tu navegador</p>
    </div>
    <ol class="pie-instalacion__pasos">
      <li class="pie-instalacion__paso">
        ${icono('compartir')}
        <p class="pie-instalacion__texto">
          Toca <strong>Compartir</strong>, en la barra de direcciones
        </p>
      </li>
      <li class="pie-instalacion__paso">
        ${icono('cuadrado-mas')}
        <p class="pie-instalacion__texto">
          Elige <strong>Agregar a la pantalla de inicio</strong>
        </p>
      </li>
      <li class="pie-instalacion__paso">
        ${icono('check')}
        <p class="pie-instalacion__texto">
          Toca <strong>Agregar</strong>, arriba a la derecha
        </p>
      </li>
    </ol>
  `,
  'ios-safari-clasico': /* HTML */ `
    <div class="pie-instalacion__nota">
      <p class="etiqueta-pequena">Instala desde tu navegador</p>
    </div>
    <ol class="pie-instalacion__pasos">
      <li class="pie-instalacion__paso">
        ${icono('compartir')}
        <p class="pie-instalacion__texto">
          Toca <strong>Compartir</strong>, abajo en el centro
        </p>
      </li>
      <li class="pie-instalacion__paso">
        ${icono('cuadrado-mas')}
        <p class="pie-instalacion__texto">
          Elige <strong>Agregar a la pantalla de inicio</strong>
        </p>
      </li>
      <li class="pie-instalacion__paso">
        ${icono('check')}
        <p class="pie-instalacion__texto">
          Toca <strong>Agregar</strong>, arriba a la derecha
        </p>
      </li>
    </ol>
  `,
  'ios-safari': /* HTML */ `
    <div class="pie-instalacion__nota">
      <p class="etiqueta-pequena">Instala desde tu navegador</p>
    </div>
    <ol class="pie-instalacion__pasos">
      <li class="pie-instalacion__paso">
        ${icono('menu-puntos-horizontal')}
        <p class="pie-instalacion__texto">
          Toca menú, abajo a la derecha, si no lo ves pasa al paso 2
        </p>
      </li>
      <li class="pie-instalacion__paso">
        ${icono('compartir')}
        <p class="pie-instalacion__texto">Toca <strong>Compartir</strong></p>
      </li>
      <li class="pie-instalacion__paso">
        ${icono('cuadrado-mas')}
        <p class="pie-instalacion__texto">
          Elige <strong>Agregar a la pantalla de inicio</strong>
        </p>
      </li>
      <li class="pie-instalacion__paso">
        ${icono('check')}
        <p class="pie-instalacion__texto">
          Toca <strong>Agregar</strong>, arriba a la derecha
        </p>
      </li>
    </ol>
  `,
  otro: /* HTML */ `
    <div class="pie-instalacion__nota">
      <p class="etiqueta-pequena">Instala desde tu navegador</p>
    </div>
    <ol class="pie-instalacion__pasos">
      <li class="pie-instalacion__paso">
        ${icono('chrome')}
        <p class="pie-instalacion__texto">
          Para instalar la app, ábrela en Chrome
        </p>
      </li>
    </ol>
  `,
  samsung: /* HTML */ `
    <div class="pie-instalacion__nota">
      <p class="etiqueta-pequena">Instala desde tu navegador</p>
    </div>
    <ol class="pie-instalacion__pasos">
      <li class="pie-instalacion__paso">
        ${icono('cuadro-redondeado-flecha-abajo')}
        <p class="pie-instalacion__texto">
          Toca el ícono de instalar, arriba en la barra
        </p>
      </li>
      <li class="pie-instalacion__paso">
        ${icono('check')}
        <p class="pie-instalacion__texto">Toca <strong>Instalar</strong></p>
      </li>
    </ol>
  `,
};
