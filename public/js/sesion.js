/**
 * @file Sesión de Balam: conecta la app con el servicio de inicio de sesión
 * (Firebase hoy, PHP mañana). Es lo único que el resto de la app importa
 * para la sesión; ver ADR 0008.
 */

import * as adaptador from './firebase/adaptador-sesion.js';
import { convertirEnFamilia } from './familia.js';

/**
 * Nombre con el que se guarda la familia en `localStorage`. Es una constante
 * porque se usa al guardar, leer y borrar: un error de escritura en una sola
 * de ellas no daría error, simplemente no encontraría nada.
 */
const CLAVE_FAMILIA = 'familia';

/**
 * Tipos de error al iniciar sesión. La pantalla de login muestra un mensaje
 * distinto para cada uno.
 * - `clave-incorrecta`: el usuario o la clave están mal escritos (nunca se dice cuál).
 * - `sin-conexion`: no hay internet.
 * - `cuenta-deshabilitada`: el docente deshabilitó la cuenta.
 * - `demasiados-intentos`: hubo muchos errores seguidos; hay que esperar.
 * - `desconocido`: cualquier otro error del servidor.
 * @typedef {'clave-incorrecta' | 'sin-conexion' | 'cuenta-deshabilitada' | 'demasiados-intentos' | 'desconocido'} TipoDeErrorDeSesion
 */

/**
 * Error al iniciar sesión, con su tipo para que la pantalla sepa qué mostrar.
 * Lo lanzan los adaptadores (Firebase, PHP) en lugar de sus propios errores.
 */
export class ErrorDeSesion extends Error {
  /**
   * @param {TipoDeErrorDeSesion} tipo - Qué salió mal.
   * @param {ErrorOptions} [opciones] - Detalles extra, como la causa (`cause`) del error.
   */
  constructor(tipo, opciones) {
    super(`No se pudo iniciar sesión: ${tipo}`, opciones);
    this.name = 'ErrorDeSesion';
    this.tipo = tipo;
  }
}

/**
 * Un hijo de la familia que estudia en la escuela. Solo trae lo necesario al
 * abrir la app; sus notas y avisos los pide cada pantalla (ADR 0008).
 * @typedef {object} Hijo
 * @property {string} id - Identifica al hijo; las pantallas lo usan para pedir sus datos.
 * @property {string} nombre - Nombre del hijo, para que el padre lo elija en la app.
 * @property {number} grado - Grado en que está matriculado este año; el inicio lo usa para pedir los avisos del docente.
 */

/**
 * Cuenta de una familia: la comparten los padres o tutores de uno o varios
 * hijos de la escuela. No lleva un id propio: el servidor ya sabe quién es
 * por la sesión.
 * @typedef {object} Familia
 * @property {string} usuario - Nombre con el que la familia inicia sesión, p. ej. `perez.familia`.
 * @property {Hijo[]} hijos - Uno o más hijos matriculados en la escuela.
 */

/**
 * Cierra la sesión en este teléfono y borra la familia guardada. La próxima
 * vez que se abra la app, mostrará el login. Borra la copia solo después de
 * que el adaptador cerró la sesión, para no quedar con sesión y sin familia.
 * @returns {Promise<void>} Se cumple cuando la sesión y la copia ya no existen.
 */
export function cerrarSesion() {
  return adaptador.cerrarSesion().then(() => {
    localStorage.removeItem(CLAVE_FAMILIA);
  });
}

/**
 * Devuelve la familia que tiene la sesión abierta en este teléfono, o `null`
 * si no hay sesión. Primero pregunta al adaptador si la sesión sigue viva
 * (es la que reconoce el servidor) y luego lee la copia que guardó
 * `iniciarSesion`, para que abrir la app no gaste lecturas del servidor.
 *
 * Si la copia está dañada o es de una versión vieja de la app, cierra la
 * sesión en vez de fallar: así el padre vuelve al login y no queda trabado.
 * @returns {Promise<Familia | null>} La familia, o `null` si hay que mostrar el login.
 */
export function obtenerSesion() {
  const texto = localStorage.getItem(CLAVE_FAMILIA);
  return adaptador
    .haySesion()
    .then((haySesion) => {
      if (!haySesion || texto === null) return null;
      return convertirEnFamilia(JSON.parse(texto));
    })
    .catch((error) => {
      console.warn('La familia guardada no sirve; se cierra la sesión.', error);
      return cerrarSesion().then(() => null);
    });
}

/**
 * Inicia sesión en este teléfono. La sesión queda guardada: el padre no tiene
 * que volver a escribir su clave.
 * @param {string} usuario - Usuario de la familia, ya normalizado por `validarCredenciales`, p. ej. `mariaperez1985`.
 * @param {string} clave - Clave que el docente entregó en papel.
 * @returns {Promise<Familia>} La familia que inició sesión.
 * @throws {ErrorDeSesion} Si la clave es incorrecta, no hay internet o la
 * cuenta está deshabilitada (ver `TipoDeErrorDeSesion`).
 */
export async function iniciarSesion(usuario, clave) {
  const familia = await adaptador.iniciarSesion(usuario, clave);
  localStorage.setItem(CLAVE_FAMILIA, JSON.stringify(familia));
  return familia;
}
