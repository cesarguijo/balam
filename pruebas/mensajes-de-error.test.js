import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { obtenerMensajeDeError } from '../public/pantallas/login/mensajes-de-error.js';

describe('obtenerMensajeDeError (login/mensajes-de-error.js)', () => {
  const tipos = [
    'clave-incorrecta',
    'sin-conexion',
    'cuenta-deshabilitada',
    'demasiados-intentos',
    'desconocido',
  ];

  describe('devuelve un texto no vacío para', () => {
    tipos.forEach((tipo) => {
      test(tipo, () => {
        const resultado = obtenerMensajeDeError(tipo);
        assert.ok(typeof resultado === 'string' && resultado !== '');
      });
    });
  });

  test('devuelve un mensaje distinto para cada tipo', () => {
    const diferentes = new Set(
      tipos.map((tipo) => obtenerMensajeDeError(tipo)),
    );
    assert.equal(diferentes.size, tipos.length);
  });

  describe('devuelve el mensaje de desconocido cuando', () => {
    const casos = [
      { prueba: 'algo-raro', descripcion: 'el tipo no existe' },
      {
        prueba: 'constructor',
        descripcion: 'el tipo es una propiedad heredada (constructor)',
      },
      { prueba: '', descripcion: 'el tipo está vacío' },
      { prueba: undefined, descripcion: 'el tipo es undefined' },
    ];
    casos.forEach(({ prueba, descripcion }) => {
      test(descripcion, () => {
        assert.equal(
          obtenerMensajeDeError(prueba),
          obtenerMensajeDeError('desconocido'),
        );
      });
    });
  });
});
