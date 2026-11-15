import { describe, test, mock, beforeEach } from 'node:test';
import assert from 'node:assert/strict';

// Las pruebas de obtenerSesion necesitan reemplazar dos cosas de afuera:
// el adaptador (para no cargar Firebase) y localStorage (no existe en Node).
// sesion.js se importa DESPUÉS de registrar el mock con `await import(...)`:
// si se importara arriba, traería el adaptador real.

/** Datos del localStorage falso; se vacía antes de cada prueba. */
const datos = new Map();

/**
 * Borra una clave del localStorage falso.
 * @param {string} clave - Nombre de lo guardado.
 */
function removeItem(clave) {
  datos.delete(clave);
}

/**
 * Devuelve el texto guardado en una clave del localStorage falso.
 * @param {string} clave - Nombre de lo guardado.
 * @returns {string | null} El texto, o `null` si no existe (como el real).
 */
function getItem(clave) {
  return datos.get(clave) ?? null;
}

/**
 * Guarda un texto en una clave del localStorage falso.
 * @param {string} clave - Nombre de lo guardado.
 * @param {string} valor - Texto que se guarda.
 */
function setItem(clave, valor) {
  datos.set(clave, valor);
}

globalThis.localStorage = /** @type {Storage} */ ({
  getItem,
  setItem,
  removeItem,
});

const haySesion = mock.fn(() => Promise.resolve(true));
const cerrarSesion = mock.fn(() => Promise.resolve());

mock.module('../public/js/firebase/adaptador-sesion.js', {
  namedExports: { haySesion, cerrarSesion },
});
const { obtenerSesion } = await import('../public/js/sesion.js');

/** Familia válida para guardar como copia en el teléfono. */
const familiaValida = {
  usuario: 'arguijo.reyes',
  hijos: [{ id: 'prueba-ana', grado: 7, nombre: 'Ana Arguijo' }],
};

describe('obtenerSesion (sesion.js)', () => {
  beforeEach(() => {
    datos.clear();
    haySesion.mock.resetCalls();
    cerrarSesion.mock.resetCalls();
  });

  describe('devuelve null sin cerrar sesión cuando', () => {
    test('no hay sesión', () => {
      haySesion.mock.mockImplementationOnce(() => Promise.resolve(false));
      return obtenerSesion().then((result) => {
        assert.equal(result, null);
        assert.equal(cerrarSesion.mock.callCount(), 0);
      });
    });

    test('hay sesión pero no hay familia guardada', () => {
      return obtenerSesion().then((result) => {
        assert.equal(result, null);
        assert.equal(cerrarSesion.mock.callCount(), 0);
      });
    });
  });

  test('devuelve la familia cuando hay sesión y la copia es válida', () => {
    globalThis.localStorage.setItem('familia', JSON.stringify(familiaValida));
    return obtenerSesion().then((result) => {
      assert.deepEqual(result, familiaValida);
      assert.equal(cerrarSesion.mock.callCount(), 0);
    });
  });

  describe('cierra sesión y devuelve null cuando', () => {
    test('la familia guardada no es JSON', (t) => {
      const aviso = t.mock.method(console, 'warn', () => {});
      const prueba = '{roto';
      globalThis.localStorage.setItem('familia', prueba);
      return obtenerSesion().then((result) => {
        assert.equal(result, null);
        assert.equal(cerrarSesion.mock.callCount(), 1);
        assert.equal(globalThis.localStorage.getItem('familia'), null);
        assert.equal(aviso.mock.callCount(), 1);
      });
    });

    test('la familia guardada no es una familia válida', (t) => {
      const aviso = t.mock.method(console, 'warn', () => {});
      const prueba = '{"usuario":5}';
      globalThis.localStorage.setItem('familia', prueba);
      return obtenerSesion().then((result) => {
        assert.equal(result, null);
        assert.equal(cerrarSesion.mock.callCount(), 1);
        assert.equal(globalThis.localStorage.getItem('familia'), null);
        assert.equal(aviso.mock.callCount(), 1);
      });
    });

    test('el adaptador falla al revisar la sesión', (t) => {
      const aviso = t.mock.method(console, 'warn', () => {});
      haySesion.mock.mockImplementationOnce(() =>
        Promise.reject(new Error('falla de prueba')),
      );
      return obtenerSesion().then((result) => {
        assert.equal(result, null);
        assert.equal(cerrarSesion.mock.callCount(), 1);
        assert.equal(aviso.mock.callCount(), 1);
      });
    });
  });
});
