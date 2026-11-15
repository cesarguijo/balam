/**
 * @file Convertidor de familia: convierte datos desconocidos en una Familia
 * limpia, con solo lo que usa la app. Sirve para cualquier origen: el
 * servidor (Firestore hoy, PHP mañana) y la copia guardada en el teléfono.
 * Es pura (no importa Firebase ni usa el navegador) para poder probarla en Node.
 *
 * Si los datos vienen mal, lanza un TypeError con el detalle para quien
 * revise la consola; el padre solo verá un error `desconocido`.
 */

/** @typedef {import('./sesion.js').Familia} Familia */
/** @typedef {import('./sesion.js').Hijo} Hijo */

/**
 * Comprueba que un elemento de la lista `hijos` tenga id, nombre y grado
 * válidos. Lanza un error si no, para que un hijo mal escrito no desaparezca
 * en silencio de la app.
 * @param {unknown} datosHijo - Un elemento de la lista `hijos`, tal como vino.
 * @param {number} posicion - Su lugar en la lista, desde 0 (así lo numera también la consola de Firebase).
 * @returns {asserts datosHijo is Hijo}
 * @throws {TypeError} Si falta un campo o tiene un tipo incorrecto.
 */
function validarHijo(datosHijo, posicion) {
  if (!esObjeto(datosHijo)) {
    throw new TypeError('El hijo ' + posicion + ' no es un objeto');
  }
  if (typeof datosHijo.id !== 'string' || datosHijo.id === '') {
    throw new TypeError('El hijo ' + posicion + ' no tiene un id de texto');
  }
  if (typeof datosHijo.nombre !== 'string' || datosHijo.nombre === '') {
    throw new TypeError('El hijo ' + posicion + ' no tiene un nombre de texto');
  }
  // Number.isInteger también descarta NaN y decimales, que typeof aceptaría como número.
  if (!Number.isInteger(datosHijo.grado)) {
    throw new TypeError(
      'El hijo ' + posicion + ' no tiene un grado numérico entero',
    );
  }
}

/**
 * Comprueba que los datos de la familia tengan usuario y al menos un hijo
 * válido. Se detiene en el primer error.
 * @param {unknown} datosFamilia - Los datos tal como vinieron (del servidor o del teléfono).
 * @returns {asserts datosFamilia is Familia}
 * @throws {TypeError} Si falta un campo o tiene un tipo incorrecto.
 */
function validarFamilia(datosFamilia) {
  if (!esObjeto(datosFamilia)) {
    throw new TypeError('La familia no es un objeto');
  }
  if (typeof datosFamilia.usuario !== 'string' || datosFamilia.usuario === '') {
    throw new TypeError('La familia no tiene un usuario de texto');
  }
  if (!Array.isArray(datosFamilia.hijos) || datosFamilia.hijos.length === 0) {
    throw new TypeError('La familia no tiene una lista con al menos un hijo');
  }
  datosFamilia.hijos.forEach(validarHijo);
}

/**
 * Convierte la lista de hijos ya validada en hijos limpios: arma objetos
 * nuevos solo con id, nombre y grado, para que los campos de más (notas,
 * datos que agregue el docente en el servidor) no se guarden en el teléfono.
 * @param {Hijo[]} hijos - La lista de hijos, ya validada con `validarFamilia`.
 * @returns {Hijo[]} Una lista nueva, con solo los campos que usa la app.
 */
function convertirHijos(hijos) {
  return hijos.map(({ id, nombre, grado }) => ({ id, nombre, grado }));
}

/**
 * Convierte datos de origen desconocido en una Familia, o falla si no tienen
 * su forma. Es la aduana de la app: todo lo que dice ser una familia pasa por aquí.
 * @param {unknown} datos - P. ej. `captura.data()` de Firestore o `JSON.parse` de lo guardado en el teléfono.
 * @returns {Familia} La familia, solo con usuario y el id, nombre y grado de cada hijo.
 * @throws {TypeError} Si los datos no tienen la forma de una Familia.
 */
export function convertirEnFamilia(datos) {
  validarFamilia(datos);
  return {
    usuario: datos.usuario,
    hijos: convertirHijos(datos.hijos),
  };
}

/**
 * Indica si un valor es un objeto con propiedades que se pueden revisar. No
 * lanza error: cada validación decide su propio mensaje.
 * @param {unknown} x - Cualquier valor, p. ej. lo que devuelve `JSON.parse`.
 * @returns {x is Record<string, unknown>} `true` si es un objeto (y no `null`).
 */
function esObjeto(x) {
  return typeof x === 'object' && x !== null;
}
