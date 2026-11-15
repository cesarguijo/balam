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

/** Familia válida para guardar como copia en el teléfono. */
const familiaValida = {
  usuario: 'arguijo.reyes',
  hijos: [{ id: 'prueba-ana', grado: 7, nombre: 'Ana Arguijo' }],
};

const credenciales = {
  usuario: 'arguijo-reyes',
  clave: 'clave-de-prueba',
};

const iniciarSesionDelAdaptador = mock.fn(() => Promise.resolve(familiaValida));

const haySesion = mock.fn(() => Promise.resolve(true));
const cerrarSesion = mock.fn(() => Promise.resolve());

mock.module('../public/js/firebase/adaptador-sesion.js', {
  namedExports: {
    haySesion,
    cerrarSesion,
    iniciarSesion: iniciarSesionDelAdaptador,
  },
});
const { obtenerSesion, ErrorDeSesion, iniciarSesion } =
  await import('../public/js/sesion.js');

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

describe('ErrorDeSesion (sesion.js)', () => {
  const error = new ErrorDeSesion('sin-conexion');
  test('guarda el tipo que recibe', () => {
    assert.equal(error.tipo, 'sin-conexion');
  });

  test('se llama ErrorDeSesion', () => {
    assert.equal(error.name, 'ErrorDeSesion');
  });

  test('es un Error', () => {
    assert.ok(error instanceof Error);
    assert.ok(error instanceof ErrorDeSesion);
  });

  test('guarda la causa que recibe', () => {
    const causa = new Error('error de Firebase');
    const error = new ErrorDeSesion('sin-conexion', { cause: causa });
    assert.equal(error.cause, causa);
  });
});

describe('iniciarSesion (sesion.js)', () => {
  beforeEach(() => {
    datos.clear();
    iniciarSesionDelAdaptador.mock.resetCalls();
  });

  describe('cuando el adaptador responde', () => {
    test('le pasa el usuario y la clave al adaptador', () => {
      return iniciarSesion(credenciales.usuario, credenciales.clave).then(
        () => {
          assert.deepEqual(iniciarSesionDelAdaptador.mock.calls[0].arguments, [
            credenciales.usuario,
            credenciales.clave,
          ]);
        },
      );
    });

    test('devuelve la familia', () => {
      return iniciarSesion(credenciales.usuario, credenciales.clave).then(
        (result) => {
          assert.deepEqual(result, familiaValida);
        },
      );
    });

    test('guarda la familia en el teléfono', () => {
      return iniciarSesion(credenciales.usuario, credenciales.clave).then(
        () => {
          const texto = globalThis.localStorage.getItem('familia');
          assert.ok(texto);
          const familiaLocalStorage = JSON.parse(texto);
          assert.deepEqual(familiaLocalStorage, familiaValida);
        },
      );
    });
  });

  describe('cuando el adaptador falla', () => {
    test('el error llega igual a quien llamó', () => {
      const error = new ErrorDeSesion('clave-incorrecta');
      iniciarSesionDelAdaptador.mock.mockImplementationOnce(() =>
        Promise.reject(error),
      );
      return assert.rejects(
        iniciarSesion(credenciales.usuario, credenciales.clave),
        error,
      );
    });

    test('no guarda nada en el teléfono', () => {
      iniciarSesionDelAdaptador.mock.mockImplementationOnce(() =>
        Promise.reject(new ErrorDeSesion('clave-incorrecta')),
      );
      return assert
        .rejects(iniciarSesion(credenciales.usuario, credenciales.clave))
        .then(() => {
          assert.equal(globalThis.localStorage.getItem('familia'), null);
        });
    });
  });
});
