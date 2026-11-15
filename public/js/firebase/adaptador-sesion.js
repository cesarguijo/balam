/**
 * @file Adaptador de sesión para Firebase: cumple el contrato de sesion.js
 * usando Firebase Auth y Firestore. Es el único archivo que importa Firebase;
 * el resto de la app no sabe que existe (ADR 0008).
 *
 * Solo habla con el servidor: guardar la familia en el teléfono lo hace
 * sesion.js, para no repetirlo en cada adaptador (Firebase hoy, PHP mañana).
 */

// Importación circular a propósito: sesion.js importa este archivo y este
// importa ErrorDeSesion de sesion.js. Funciona porque ErrorDeSesion solo se
// usa dentro de las funciones, cuando ambos módulos ya terminaron de cargar.
import { ErrorDeSesion } from '../sesion.js';
import {
  autenticacion,
  baseDeDatos,
  documento,
  iniciarSesionFirebase,
  obtenerDocumento,
} from './conexion.js';
import { traducirErrorDeFirebase } from './errores.js';
import { convertirEnFamilia } from '../familia.js';

/** @typedef {import('../sesion.js').Familia} Familia */

/**
 * Indica si hay una sesión de Firebase abierta en este teléfono. Espera a que
 * Firebase recupere la sesión guardada: antes de eso, `currentUser` es `null`
 * aunque haya sesión. No usa internet ni gasta lecturas de Firestore.
 * @returns {Promise<boolean>} `true` si hay sesión; `false` si hay que mostrar el login.
 */
export async function haySesion() {
  return autenticacion.authStateReady().then(() => {
    return autenticacion.currentUser !== null;
  });
}

/**
 * Inicia sesión en Firebase con usuario y clave, y lee una sola vez el
 * documento de la familia (`familias/{uid}`). El usuario se convierte en un
 * correo inventado (`usuario@balam.local`) porque Firebase Auth pide correo.
 * @param {string} usuario - Usuario de la familia, sin el dominio, p. ej. `perez.familia`.
 * @param {string} clave - Clave que el docente entregó en papel.
 * @returns {Promise<Familia>} La familia, ya validada por `convertirEnFamilia`.
 * @throws {ErrorDeSesion} Si la clave es incorrecta, no hay internet, la cuenta
 * está deshabilitada o el documento de la familia falta o viene mal.
 */
export async function iniciarSesion(usuario, clave) {
  const email = `${usuario.trim().toLowerCase()}@balam.local`;
  return iniciarSesionFirebase(autenticacion, email, clave)
    .then((credencialesDeUsuario) => {
      const uid = credencialesDeUsuario.user.uid;

      const referenciaDocumento = documento(baseDeDatos, `familias/${uid}`);
      return obtenerDocumento(referenciaDocumento).then((captura) => {
        if (captura.exists()) {
          return convertirEnFamilia(captura.data());
        } else {
          throw new ErrorDeSesion('desconocido');
        }
      });
    })
    .catch((error) => {
      return autenticacion.signOut().then(() => {
        throw new ErrorDeSesion(traducirErrorDeFirebase(error.code), {
          cause: error,
        });
      });
    });
}

/**
 * Cierra la sesión de Firebase en este teléfono. Borrar la familia guardada
 * no le toca: lo hace sesion.js después de que esta promesa se cumple.
 * @returns {Promise<void>} Se cumple cuando Firebase terminó de cerrar la sesión.
 */
export async function cerrarSesion() {
  return autenticacion.signOut();
}
