/**
 * Muestra la pantalla que corresponde a la ruta actual. Si la ruta no existe,
 * muestra inicio en la app instalada o la bienvenida en el navegador; dentro
 * de la app instalada, nunca muestra la bienvenida.
 * @throws {Error} Si no existe el contenedor #app en index.html.
 */
import { mostrarBienvenida } from '../pantallas/bienvenida/bienvenida.js';
import { mostrarInicio } from '../pantallas/inicio/inicio.js';
import { mostrarCatalogo } from '../pantallas/catalogo/catalogo.js';

/**
 * Una pantalla de la app: recibe el contenedor y dibuja su contenido dentro.
 * @callback Pantalla
 * @param {HTMLElement} app - Contenedor donde se dibuja la pantalla.
 * @returns {void}
 */

/**
 * Tabla de rutas de la aplicación: relaciona cada ruta con la función que
 * muestra su pantalla. Para agregar una pantalla nueva:
 * 1. Importa la función de la pantalla.
 * 2. Agrega una línea con la forma `'#/ruta': mostrarPantalla,`.
 * @type {Record<string, Pantalla>}
 */
const rutas = {
  '#/bienvenida': mostrarBienvenida,
  '#/inicio': mostrarInicio,
  '#/catalogo': mostrarCatalogo,
};

/**
 * Indica si la app se abrió instalada, en su propia ventana, y no en el navegador.
 * @returns {boolean}
 */
function seAbrioComoApp() {
  return matchMedia('(display-mode: standalone)').matches;
}

/**
 * Muestra la pantalla que corresponde a la ruta actual; si la ruta no
 * existe, muestra la de inicio.
 * @throws {Error} Si no existe el contenedor #app en index.html.
 */
function navegar() {
  const app = document.getElementById('app');
  if (!app) {
    throw new Error('No se encontró el contenedor #app en index.html');
  }

  // Dentro de la app instalada no se muestra la bienvenida: ya cumplió su función.
  if (seAbrioComoApp() && location.hash === '#/bienvenida') {
    location.replace('#/inicio');
    return;
  }

  // Sin ruta o con una ruta desconocida: instalada va a inicio; en el navegador, a la bienvenida.
  const porDefecto = seAbrioComoApp() ? mostrarInicio : mostrarBienvenida;
  const pantalla = rutas[location.hash] ?? porDefecto;
  pantalla(app);
}

window.addEventListener('hashchange', navegar); // cada vez que cambia la #
matchMedia('(display-mode: standalone)').addEventListener('change', navegar); // cuando la pestaña pasa a ser la app instalada
navegar();
