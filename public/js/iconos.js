/**
 * @file Íconos: dibuja el ícono solicitado
 */

/**
 * Guarda el interior del ícono, porque la etiqueta <svg> es igual para todos y la pone icono().
 */
const iconos = {
  megafono: /* HTML */ `
    <path d="M18 8a3 3 0 0 1 0 6" />
    <path d="M10 8v11a1 1 0 0 1 -1 1h-1a1 1 0 0 1 -1 -1v-5" />
    <path
      d="M12 8l4.524 -3.77a.9 .9 0 0 1 1.476 .692v12.156a.9 .9 0 0 1 -1.476 .692l-4.524 -3.77h-8a1 1 0 0 1 -1 -1v-4a1 1 0 0 1 1 -1h8"
    />
  `,
  calculadora: /* HTML */ `
    <path
      d="M4 5a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2l0 -14"
    />
    <path
      d="M8 8a1 1 0 0 1 1 -1h6a1 1 0 0 1 1 1v1a1 1 0 0 1 -1 1h-6a1 1 0 0 1 -1 -1l0 -1"
    />
    <path d="M8 14l0 .01" />
    <path d="M12 14l0 .01" />
    <path d="M16 14l0 .01" />
    <path d="M8 17l0 .01" />
    <path d="M12 17l0 .01" />
    <path d="M16 17l0 .01" />
  `,
  candado: /* HTML */ `
    <path
      d="M5 13a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v6a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2v-6"
    />
    <path d="M11 16a1 1 0 1 0 2 0a1 1 0 0 0 -2 0" />
    <path d="M8 11v-4a4 4 0 1 1 8 0v4" />
  `,
  'menu-puntos-horizontal': /* HTML */ `
    <path d="M4 12a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
    <path d="M11 12a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
    <path d="M18 12a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
  `,
  'menu-puntos-vertical': /* HTML */ `
    <path d="M11 12a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
    <path d="M11 19a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
    <path d="M11 5a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
  `,
  compartir: /* HTML */ `
    <path
      d="M8 9h-1a2 2 0 0 0 -2 2v8a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-8a2 2 0 0 0 -2 -2h-1"
    />
    <path d="M12 14v-11" />
    <path d="M9 6l3 -3l3 3" />
  `,
  'cuadrado-mas': /* HTML */ `
    <path d="M9 12h6" />
    <path d="M12 9v6" />
    <path
      d="M3 5a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-14"
    />
  `,
  menu: /* HTML */ `
    <path d="M4 6l16 0" />
    <path d="M4 12l16 0" />
    <path d="M4 18l16 0" />
  `,
  'instalar-app': /* HTML */ `
    <path d="M11 3H3V18H21V16M17 3V14M21 8L17 14L13 8M8 21H16" />
  `,
  check: /* HTML */ `
    <path d="M9 11l3 3l8 -8" />
    <path
      d="M20 12v6a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2h9"
    />
  `,
  chrome: /* HTML */ `
    <path d="M3 12a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
    <path d="M9 12a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
    <path d="M12 9h8.4" />
    <path d="M14.598 13.5l-4.2 7.275" />
    <path d="M9.402 13.5l-4.2 -7.275" />
  `,
  'cuadro-redondeado-flecha-abajo': /* HTML */ `
    <path d="M8 12l4 4l4 -4" />
    <path d="M12 8v8" />
    <path
      d="M12 3c7.2 0 9 1.8 9 9c0 7.2 -1.8 9 -9 9c-7.2 0 -9 -1.8 -9 -9c0 -7.2 1.8 -9 9 -9"
    />
  `,
  movil: /* HTML */ `
    <path
      d="M6 5a2 2 0 0 1 2 -2h8a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2h-8a2 2 0 0 1 -2 -2v-14"
    />
    <path d="M11 4h2" />
    <path d="M12 17v.01" />
  `,
};

/**
 * Devuelve el SVG del ícono indicado, listo para insertarse en una plantilla.
 * @param {keyof typeof iconos} nombre - El nombre del ícono.
 * @returns {string} HTML correspondiente al SVG del ícono
 * @throws {RangeError} Si no existe un ícono con ese nombre.
 */
export function icono(nombre) {
  if (!nombresDeIconos.includes(nombre)) {
    throw new RangeError(`El ícono ${nombre} no existe`);
  }
  return /* HTML */ `<svg
    class="icono"
    aria-hidden="true"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    ${iconos[nombre]}
  </svg>`;
}

// TODO: usar nombresDeIconos en una página catálogo de íconos.
/**
 * Nombres de todos los íconos disponibles.
 * Se exporta para que las pruebas puedan recorrer cada ícono.
 */
export const nombresDeIconos = Object.keys(iconos);
