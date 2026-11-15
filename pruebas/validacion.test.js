import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { validarCredenciales } from '../public/pantallas/login/validacion.js';

describe('validarCredenciales', () => {
  describe('usuarios válidos (normalización)', () => {
    const casos = [
      {
        usuario: 'mariaperez1985',
        clave: 'abc123',
        esperado: {
          valido: true,
          usuario: 'mariaperez1985',
        },
        prueba: 'Caso base',
      },
      {
        usuario: 'Mariaperez1985',
        clave: 'abc123',
        esperado: {
          valido: true,
          usuario: 'mariaperez1985',
        },
        prueba: 'mayúscula automática del teclado',
      },
      {
        usuario: ' mariaperez1985 ',
        clave: 'abc123',
        esperado: {
          valido: true,
          usuario: 'mariaperez1985',
        },
        prueba: 'espacio del autocorrector',
      },
      {
        usuario: 'mariapérez1985',
        clave: 'abc123',
        esperado: {
          valido: true,
          usuario: 'mariaperez1985',
        },
        prueba: 'tildes',
      },
      {
        usuario: 'muñoz1990',
        clave: 'abc123',
        esperado: {
          valido: true,
          usuario: 'munoz1990',
        },
        prueba: 'la ñ',
      },
      {
        usuario: ' MÚÑOZ1990 ',
        clave: 'abc123',
        esperado: {
          valido: true,
          usuario: 'munoz1990',
        },
        prueba: 'todo junto',
      },
    ];
    casos.forEach((caso) => {
      test(caso.prueba, () => {
        const validacion = validarCredenciales(caso.usuario, caso.clave);
        assert.deepStrictEqual(validacion, caso.esperado);
      });
    });
  });

  describe('errores del usuario', () => {
    const casos = [
      {
        usuario: '',
        clave: 'abc123',
        esperado: {
          valido: false,
          error: 'usuario-vacio',
        },
        prueba: 'Error de usuario vacío',
      },
      {
        usuario: '     ',
        clave: 'abc123',
        esperado: {
          valido: false,
          error: 'usuario-vacio',
        },
        prueba: 'Usuario de solo espacios',
      },
      {
        usuario: 'maria perez',
        clave: 'abc123',
        esperado: {
          valido: false,
          error: 'usuario-invalido',
        },
        prueba: 'Usuario con espacios en medio',
      },
      {
        usuario: 'maria.perez',
        clave: 'abc123',
        esperado: {
          valido: false,
          error: 'usuario-invalido',
        },
        prueba: 'Usuario con punto en medio',
      },
      {
        usuario: 'maria@gmail.com',
        clave: 'abc123',
        esperado: {
          valido: false,
          error: 'usuario-invalido',
        },
        prueba: 'El padre escribió su correo',
      },
    ];
    casos.forEach((caso) => {
      test(caso.prueba, () => {
        const validacion = validarCredenciales(caso.usuario, caso.clave);
        assert.deepStrictEqual(validacion, caso.esperado);
      });
    });
  });

  describe('clave', () => {
    const casos = [
      {
        usuario: 'mariaperez1985',
        clave: '',
        esperado: { valido: false, error: 'clave-vacia' },
        prueba: 'Error de clave vacía',
      },
      {
        usuario: 'mariaperez1985',
        clave: '     ',
        esperado: { valido: false, error: 'clave-vacia' },
        prueba: 'Solo espacios cuenta como clave vacía',
      },
      {
        usuario: 'mariaperez1985',
        clave: '  abc123  ',
        esperado: { valido: true, usuario: 'mariaperez1985' },
        prueba: 'No rechaza una clave con espacios alrededor',
      },
    ];
    casos.forEach((caso) => {
      test(caso.prueba, () => {
        const validacion = validarCredenciales(caso.usuario, caso.clave);
        assert.deepStrictEqual(validacion, caso.esperado);
      });
    });
  });

  describe('orden de los errores', () => {
    const casos = [
      {
        usuario: '',
        clave: '',
        esperado: { valido: false, error: 'usuario-vacio' },
        prueba: 'Usuario vacío gana a clave vacía',
      },
      {
        usuario: 'maria perez',
        clave: '',
        esperado: { valido: false, error: 'usuario-invalido' },
        prueba: 'Usuario inválido gana a clave vacía',
      },
    ];
    casos.forEach((caso) => {
      test(caso.prueba, () => {
        const validacion = validarCredenciales(caso.usuario, caso.clave);
        assert.deepStrictEqual(validacion, caso.esperado);
      });
    });
  });
});
