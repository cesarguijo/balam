// js/enrutador.js
import { mostrarBienvenida } from '../pantallas/bienvenida/bienvenida.js';
import { mostrarInicio } from '../pantallas/inicio/inicio.js';

const rutas = {
  '#/bienvenida': mostrarBienvenida,
  '#/inicio': mostrarInicio,
};

function navegar() {
  const pantalla = rutas[location.hash] ?? mostrarInicio;   // si no existe, va a inicio
  pantalla(document.querySelector('#app'));                  // la pantalla se dibuja en #app
}

window.addEventListener('hashchange', navegar);   // cada vez que cambia la #
navegar();                                        // al abrir la app