/**
 * @file Mensajes de error del login: elige el texto que ve el padre cuando
 * no puede iniciar sesión, según el tipo de ErrorDeSesion. Es pura (no toca
 * el DOM) para poder probarla en Node.
 */

/** @typedef {import('../../js/sesion.js').TipoDeErrorDeSesion} TipoDeErrorDeSesion */
/** @typedef {import('./validacion.js').TipoDeErrorDeValidacion} TipoDeErrorDeValidacion */
/**
 * Relaciona cada tipo de error con el mensaje que ve el padre. Los mensajes
 * son cortos y dicen qué hacer, porque se leen en el teléfono y sin ayuda.
 * @type {Record<TipoDeErrorDeSesion|TipoDeErrorDeValidacion, string>}
 */
const mensajes = {
  'clave-incorrecta':
    'El usuario o la clave no son correctos. Revíselos e intente nuevamente.',
  'sin-conexion':
    'No tiene conexión a internet, conecte su celular a una señal wifi o cuenta de datos.',
  'cuenta-deshabilitada':
    'Su cuenta está deshabilitada. Comuníquese con el maestro encargado.',
  'demasiados-intentos':
    'Ha intentado iniciar sesión demasiadas veces, espere antes de volver a intentar.',
  desconocido: 'Ocurrió un error desconocido, reporte al maestro encargado.',
  'clave-vacia': 'Por favor ingrese su clave.',
  'usuario-invalido':
    'Usuario inválido, El usuario solo lleva letras y números, sin espacios ni puntos.',
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
