/**
 * @file Enrutador de Balam: muestra dentro de #app la pantalla que corresponde a
 * la dirección, cada vez que esta cambia.
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
 * Muestra la pantalla que corresponde a la ruta actual; si la ruta no
 * existe, muestra la de inicio.
 * @throws {Error} Si no existe el contenedor #app en index.html.
 */
function navegar() {
  const app = document.getElementById('app');
  if(!app) {
    throw new Error('No se encontró el contenedor #app en index.html');
  }
  const pantalla = rutas[location.hash] ?? mostrarInicio;  
  pantalla(app);
}

window.addEventListener('hashchange', navegar);   // cada vez que cambia la #
navegar();                                        // al abrir la app