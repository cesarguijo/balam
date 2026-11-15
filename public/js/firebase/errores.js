/**
 * @file Errores de Firebase: traduce los códigos de error de Firebase a los
 * tipos de ErrorDeSesion. Es pura (solo compara textos, no importa Firebase)
 * para poder probarla en Node. Se borra junto con los demás archivos de
 * Firebase al migrar a PHP (ADR 0008).
 */

/** @typedef {import('../sesion.js').TipoDeErrorDeSesion} TipoDeErrorDeSesion */

/**
 * Relaciona cada código de error de Firebase con el tipo que entiende la app.
 * Varios códigos dan `clave-incorrecta` a propósito: el login nunca dice si
 * falló el usuario o la clave, para que nadie descubra qué usuarios existen.
 * @type {Record<string, TipoDeErrorDeSesion>}
 */
const traduccion = {
  'auth/invalid-credential': 'clave-incorrecta',
  'auth/wrong-password': 'clave-incorrecta',
  'auth/user-not-found': 'clave-incorrecta',
  'auth/invalid-email': 'clave-incorrecta',
  'auth/missing-password': 'clave-incorrecta',
  'auth/network-request-failed': 'sin-conexion',
  'auth/timeout': 'sin-conexion',
  'auth/user-disabled': 'cuenta-deshabilitada',
  'auth/too-many-requests': 'demasiados-intentos',
};

/**
 * Traduce un código de error de Firebase al tipo de error de la app. Si no
 * reconoce el código, devuelve `desconocido`: así ningún error de Firebase
 * llega a las pantallas sin traducir.
 * @param {string} codigo - El código del error de Firebase (`error.code`), p. ej. `auth/user-disabled`.
 * @returns {TipoDeErrorDeSesion} El tipo de error que entiende la pantalla de login.
 */
export function traducirErrorDeFirebase(codigo) {
  return traduccion[codigo] ?? 'desconocido';
}
