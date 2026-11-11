/**
 * @file Pantalla de bienvenida: por ahora solo muestra un mensaje corto de bienvenida.
 */
/**
 * Muestra la pantalla de bienvenida dentro del contenedor.
 * @param {HTMLElement} app - Contenedor donde se dibuja la pantalla.
 */
export function mostrarBienvenida(app) {
  app.innerHTML = '<h1>Bienvenido, alumno</h1>';
}