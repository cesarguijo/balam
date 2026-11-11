/**
 * @file Instalación de la app: atrapa el aviso del navegador al arrancar
 * y permite usarlo después desde cualquier pantalla o componente.
 */

/**
 * El aviso de instalación de Chrome. No viene en los tipos estándar,
 * así que describimos lo que usamos de él.
 * @typedef {Event & {
 *   prompt: () => Promise<void>,
 *   userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
 * }} AvisoInstalacion
 */

/** @type {AvisoInstalacion | null} */
let aviso = null;

window.addEventListener('beforeinstallprompt', (evento) => {
  evento.preventDefault();
  aviso = /** @type {AvisoInstalacion} */ (evento);
});

/**
 * Indica si el navegador permite instalar con un botón.
 * @returns {boolean}
 */
export function sePuedeInstalar() {
  return aviso !== null;
}

/**
 * Muestra el diálogo de instalación del navegador. El aviso es de un solo uso.
 * @returns {Promise<'accepted' | 'dismissed' | 'no-disponible'>}
 */
export async function instalar() {
  if (!aviso) return 'no-disponible';
  aviso.prompt();
  const { outcome } = await aviso.userChoice;
  aviso = null;
  return outcome;
}
