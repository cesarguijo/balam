/**
 * @file Mensajes de error del login: elige el texto que ve el padre cuando
 * no puede iniciar sesión, según el tipo de error (de sesión o de
 * validación). Es pura (no toca
 * el DOM) para poder probarla en Node.
 */

/** @typedef {import('../../js/sesion.js').TipoDeErrorDeSesion} TipoDeErrorDeSesion */
/** @typedef {import('./validacion.js').TipoDeErrorDeValidacion} TipoDeErrorDeValidacion */
/**
 * Relaciona cada tipo de error con el mensaje que ve el padre. Los mensajes
 * son cortos y dicen qué hacer, porque se leen en el teléfono y sin ayuda.
 * Cada uno tiene 60 caracteres o menos: es el espacio que da el diseño de la
 * pantalla en Figma (lo comprueban las pruebas).
 * @type {Record<TipoDeErrorDeSesion|TipoDeErrorDeValidacion, string>}
 */
const mensajes = {
  'clave-incorrecta':
    'Usuario o clave incorrectos. Revise e intente nuevamente.',
  'sin-conexion': 'No tiene conexión a internet, conéctese nuevamente.',
  'cuenta-deshabilitada': 'Cuenta deshabilitada. Contacte al maestro.',
  'demasiados-intentos': 'Demasiados intentos. Reintente más tarde.',
  desconocido: 'Ocurrió un error desconocido, reíntente más tarde.',
  'clave-vacia': 'Por favor ingrese su clave.',
  'usuario-invalido': 'Se permiten letras y números sin espacios ni puntos.',
  'usuario-vacio': 'Por favor ingrese su usuario.',
};

/**
 * Devuelve el mensaje que la pantalla de login muestra para un tipo de error.
 * Si no reconoce el tipo, devuelve el mensaje de `desconocido`: así la
 * pantalla nunca queda sin texto, aunque el error no venga de la sesión.
 * @param {string|undefined} tipo - El `tipo` del ErrorDeSesion; puede ser `undefined` si el error es de otra clase.
 * @returns {string} El mensaje para mostrar al padre.
 */
export function obtenerMensajeDeError(tipo) {
  if (tipo !== undefined && Object.hasOwn(mensajes, tipo)) {
    // El cast es seguro: Object.hasOwn ya confirmó que tipo es una clave de
    // mensajes, pero TypeScript no lo deduce por su cuenta.
    return mensajes[/** @type {TipoDeErrorDeSesion} */ (tipo)];
  }
  return mensajes.desconocido;
}
