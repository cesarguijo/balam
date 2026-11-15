import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { traducirErrorDeFirebase } from '../public/js/firebase/errores.js';

describe('traducirErrorDeFirebase (firebase/errores.js)', () => {
  describe('devuelve', () => {
    const esperados = {
      'auth/wrong-password': 'clave-incorrecta',
      'auth/invalid-credential': 'clave-incorrecta',
      'auth/user-not-found': 'clave-incorrecta',
      'auth/invalid-email': 'clave-incorrecta',
      'auth/missing-password': 'clave-incorrecta',
      'auth/network-request-failed': 'sin-conexion',
      'auth/timeout': 'sin-conexion',
      'auth/user-disabled': 'cuenta-deshabilitada',
      'auth/too-many-requests': 'demasiados-intentos',
    };
    Object.entries(esperados).forEach(([codigo, tipo]) => {
      test(tipo + ' cuando el error es ' + codigo, () => {
        assert.equal(traducirErrorDeFirebase(codigo), tipo);
      });
    });
    describe('desconocido cuando', () => {
      const esperados = [
        { prueba: 'algo-raro', mensaje: 'un código no existe' },
        { prueba: '', mensaje: 'un texto está vacío' },
        { prueba: undefined, mensaje: 'se pasa undefined' },
        {
          prueba: 'constructor',
          mensaje: 'el código es una propiedad heredada (constructor)',
        },
        {
          prueba: 'toString',
          mensaje: 'el código es una propiedad heredada (toString)',
        },
      ];
      esperados.forEach((esperado) => {
        test(esperado.mensaje, () => {
          assert.equal(traducirErrorDeFirebase(esperado.prueba), 'desconocido');
        });
      });
    });
  });
});
