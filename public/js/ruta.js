/**
 * @file Ruta de la app: decide qué pantalla mostrar según dónde se abrió Balam
 * y si hay sesión. Es pura (no usa window ni document) para poder probarla en Node.
 * @see docs/decisiones/0007-flujo-de-entrada.md
 */

/**
 * Decide qué pantalla mostrar al abrir Balam. El escritorio y el navegador
 * siempre van a la bienvenida, porque Balam se usa instalada en el celular.
 * @param {object} datos - Lo que se sabe del dispositivo y de la sesión.
 * @param {boolean} datos.esEscritorio - Si se abrió en una computadora.
 * @param {boolean} datos.instalada - Si se abrió como app instalada y no en el navegador.
 * @param {boolean} datos.haySesion - Si la familia ya inició sesión.
 * @returns {'#/bienvenida' | '#/login' | '#/inicio'} La ruta que se debe mostrar.
 */
export function decidirRuta({ esEscritorio, instalada, haySesion }) {
  if (esEscritorio) return '#/bienvenida';
  if (!instalada) return '#/bienvenida';
  if (!haySesion) return '#/login';
  return '#/inicio';
}
