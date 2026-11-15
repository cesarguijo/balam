import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { convertirEnFamilia } from '../public/js/familia.js';

describe('convertirEnFamilia', () => {
  describe('devuelve:', () => {
    test('una familia igual', () => {
      const familiaValida = {
        usuario: 'arguijo.reyes',
        hijos: [
          { id: 'prueba-ana', grado: 7, nombre: 'Ana Arguijo' },
          { id: 'prueba-luis', grado: 8, nombre: 'Luis Arguijo' },
        ],
      };
      assert.deepEqual(convertirEnFamilia(familiaValida), familiaValida);
    });

    test('una familia sin campos extra', () => {
      const familiaConCamposExtra = {
        id: 'fwYpYoeFPFMEporvLl4e1Dr1LNF3',
        usuario: 'arguijo.reyes',
        hijos: [
          {
            id: 'prueba-ana',
            grado: 7,
            nombre: 'Ana Arguijo',
            campoExtra: 'texto',
          },
          {
            id: 'prueba-luis',
            grado: 8,
            nombre: 'Luis Arguijo',
            campoExtra: 'texto',
          },
        ],
      };
      const valorEsperado = {
        usuario: 'arguijo.reyes',
        hijos: [
          { id: 'prueba-ana', grado: 7, nombre: 'Ana Arguijo' },
          { id: 'prueba-luis', grado: 8, nombre: 'Luis Arguijo' },
        ],
      };
      assert.deepEqual(
        convertirEnFamilia(familiaConCamposExtra),
        valorEsperado,
      );
    });
  });

  describe('lanza error si:', () => {
    test('la familia no es objeto', () => {
      const familia = 'no es un objeto';
      assert.throws(() => convertirEnFamilia(familia), {
        name: 'TypeError',
        message: 'La familia no es un objeto',
      });
    });

    test('se le pasa null', () => {
      const familia = null;
      assert.throws(() => convertirEnFamilia(familia), {
        name: 'TypeError',
        message: 'La familia no es un objeto',
      });
    });

    test('la familia no tiene el campo usuario', () => {
      const familiaSinUsuario = {
        hijos: [
          { id: 'prueba-ana', grado: 7, nombre: 'Ana Arguijo' },
          { id: 'prueba-luis', grado: 8, nombre: 'Luis Arguijo' },
        ],
      };
      assert.throws(() => convertirEnFamilia(familiaSinUsuario), {
        name: 'TypeError',
        message: 'La familia no tiene un usuario de texto',
      });
    });

    test('el usuario está vacío', () => {
      const familiaConUsuarioVacio = {
        usuario: '',
        hijos: [
          { id: 'prueba-ana', grado: 7, nombre: 'Ana Arguijo' },
          { id: 'prueba-luis', grado: 8, nombre: 'Luis Arguijo' },
        ],
      };
      assert.throws(() => convertirEnFamilia(familiaConUsuarioVacio), {
        name: 'TypeError',
        message: 'La familia no tiene un usuario de texto',
      });
    });

    test('la familia no tiene el campo hijos', () => {
      const familiaSinCampoHijo = { usuario: 'arguijo.reyes' };
      assert.throws(() => convertirEnFamilia(familiaSinCampoHijo), {
        name: 'TypeError',
        message: 'La familia no tiene una lista con al menos un hijo',
      });
    });

    test('la familia tiene campo hijo vacío', () => {
      const familiaConHijosVacio = { usuario: 'arguijo.reyes', hijos: [] };
      assert.throws(() => convertirEnFamilia(familiaConHijosVacio), {
        name: 'TypeError',
        message: 'La familia no tiene una lista con al menos un hijo',
      });
    });

    test('el hijo no es un objeto', () => {
      const familiaConHijoNoObjeto = {
        usuario: 'arguijo.reyes',
        hijos: ['Ana'],
      };
      assert.throws(() => convertirEnFamilia(familiaConHijoNoObjeto), {
        name: 'TypeError',
        message: 'El hijo 0 no es un objeto',
      });
    });

    test('el primer hijo no tiene un id de texto', () => {
      const familiaPrimerHijoSinId = {
        usuario: 'arguijo.reyes',
        hijos: [
          { grado: 7, nombre: 'Ana Arguijo' },
          { id: 'prueba-luis', grado: 8, nombre: 'Luis Arguijo' },
        ],
      };
      assert.throws(() => convertirEnFamilia(familiaPrimerHijoSinId), {
        name: 'TypeError',
        message: 'El hijo 0 no tiene un id de texto',
      });
    });

    test('el primer hijo no tiene un nombre de texto', () => {
      const familiaPrimerHijoSinNombre = {
        usuario: 'arguijo.reyes',
        hijos: [
          { id: 'prueba-ana', grado: 7 },
          { id: 'prueba-luis', grado: 8, nombre: 'Luis Arguijo' },
        ],
      };
      assert.throws(() => convertirEnFamilia(familiaPrimerHijoSinNombre), {
        name: 'TypeError',
        message: 'El hijo 0 no tiene un nombre de texto',
      });
    });

    test('el primer hijo tiene un grado que no es numérico', () => {
      const familiaPrimerHijoConGradoTexto = {
        usuario: 'arguijo.reyes',
        hijos: [
          { id: 'prueba-ana', grado: '7', nombre: 'Ana Arguijo' },
          { id: 'prueba-luis', grado: 8, nombre: 'Luis Arguijo' },
        ],
      };
      assert.throws(() => convertirEnFamilia(familiaPrimerHijoConGradoTexto), {
        name: 'TypeError',
        message: 'El hijo 0 no tiene un grado numérico entero',
      });
    });

    test('el primer hijo tiene grado decimal', () => {
      const familiaPrimerHijoConGradoDecimal = {
        usuario: 'arguijo.reyes',
        hijos: [
          { id: 'prueba-ana', grado: 7.5, nombre: 'Ana Arguijo' },
          { id: 'prueba-luis', grado: 8, nombre: 'Luis Arguijo' },
        ],
      };
      assert.throws(
        () => convertirEnFamilia(familiaPrimerHijoConGradoDecimal),
        {
          name: 'TypeError',
          message: 'El hijo 0 no tiene un grado numérico entero',
        },
      );
    });

    test('el segundo hijo no tiene un id de texto', () => {
      const familiaSegundoHijoSinId = {
        usuario: 'arguijo.reyes',
        hijos: [
          { id: 'prueba-ana', grado: 7, nombre: 'Ana Arguijo' },
          { grado: 8, nombre: 'Luis Arguijo' },
        ],
      };
      assert.throws(() => convertirEnFamilia(familiaSegundoHijoSinId), {
        name: 'TypeError',
        message: 'El hijo 1 no tiene un id de texto',
      });
    });
  });
});
