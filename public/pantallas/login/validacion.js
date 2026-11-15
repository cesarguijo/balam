/**
 * @file Validación del login: revisa el usuario y la clave antes de llamar al
 * servidor, para no gastar una llamada que de todos modos fallaría y para dar
 * un mensaje claro al padre. Es pura (no toca el DOM) para poder probarla en
 * Node. Es una comodidad, no una protección: quien decide si la clave es
 * correcta es siempre el servidor.
 */

/**
 * Tipos de error de validación. A diferencia de `TipoDeErrorDeSesion`, se
 * detectan al instante en el teléfono, sin esperar al servidor.
 * - `usuario-vacio`: no escribió usuario (o solo espacios).
 * - `usuario-invalido`: después de normalizar, quedan caracteres que no son letras `a-z` ni números.
 * - `clave-vacia`: no escribió clave (o solo espacios).
 * @typedef {'usuario-vacio' | 'usuario-invalido' | 'clave-vacia'} TipoDeErrorDeValidacion
 */

/**
 * Resultado de validar. Tiene dos formas que se distinguen por `valido`.
 * @typedef {{ valido: true, usuario: string } | { valido: false, error: TipoDeErrorDeValidacion }} ResultadoDeValidacion
 */

/**
 * Limpia el usuario de lo que el teléfono o el padre agregan sin querer:
 * tildes y ñ, espacios en los extremos y mayúsculas. No revisa si el
 * resultado es válido; eso lo hace `errorUsuario`.
 * @param {string} usuario - El usuario tal como lo escribió el padre, p. ej. ` MÚÑOZ1990 `.
 * @returns {string} El usuario limpio, p. ej. `munoz1990`.
 */
function normalizar(usuario) {
  // NFD significa Normalization Form Descomposition. Separa cada letra de sus marcas (tildes, virgulilla, dieresis, etc.)
  // En /\p{M}/gu \p{M} significa busca marcas que se dibujan sobre la letra, la g de global significa todas y la u de unicode sin la u no funciona
  // trim() quita los espacios de los extremos
  return usuario.normalize('NFD').replace(/\p{M}/gu, '').trim().toLowerCase();
}
/**
 * Busca el primer error del usuario: primero si está vacío y luego si tiene
 * algo que no sea letra `a-z` o número. Espera el usuario ya normalizado, por
 * eso no acepta mayúsculas ni tildes.
 * @param {string} usuarioNormalizado - El usuario que devolvió `normalizar`.
 * @returns {TipoDeErrorDeValidacion | null} El error, o `null` si el usuario es válido.
 */
function errorUsuario(usuarioNormalizado) {
  if (usuarioNormalizado === '') return 'usuario-vacio';
  else if (!/^[a-z0-9]+$/.test(usuarioNormalizado)) return 'usuario-invalido';
  return null;
}

/**
 * Revisa si la clave está vacía o tiene solo espacios. Usa `trim` solo para
 * revisar: la clave no se modifica, porque un espacio puede ser parte de ella.
 * @param {string} clave - La clave tal como la escribió el padre.
 * @returns {TipoDeErrorDeValidacion | null} `clave-vacia`, o `null` si la clave tiene algo.
 */
function errorClave(clave) {
  if (clave.trim() === '') return 'clave-vacia';
  return null;
}

/**
 * Revisa el usuario y la clave que escribió el padre. Corrige lo que se puede
 * arreglar sin dudas (mayúscula automática del teclado, espacio del
 * autocorrector, tildes) y rechaza solo lo que sigue mal después de corregir:
 * así el padre no recibe un error por algo que no fue culpa suya.
 * @param {string} usuario - El usuario tal como lo escribió el padre, p. ej. ` María1985`.
 * @param {string} clave - La clave tal como la escribió el padre.
 * @returns {ResultadoDeValidacion} El usuario normalizado, o el primer error encontrado.
 */
export function validarCredenciales(usuario, clave) {
  const usuarioNormalizado = normalizar(usuario);
  const error = errorUsuario(usuarioNormalizado) ?? errorClave(clave);
  if (error) return { valido: false, error: error };
  return { valido: true, usuario: usuarioNormalizado };
}
