import { test } from 'node:test';
import assert from 'node:assert/strict';
import { decidirRuta } from '../public/js/ruta.js';

test('En escritorio siempre muestra la bienvenida', () => {
  assert.equal(
    decidirRuta({ esEscritorio: true, instalada: false, haySesion: false }),
    '#/bienvenida',
  );
  assert.equal(
    decidirRuta({ esEscritorio: true, instalada: false, haySesion: true }),
    '#/bienvenida',
  );
});

test('En escritorio muestra la bienvenida aunque la app se instale desde el menú de Chrome', () => {
  assert.equal(
    decidirRuta({ esEscritorio: true, instalada: true, haySesion: false }),
    '#/bienvenida',
  );
  assert.equal(
    decidirRuta({ esEscritorio: true, instalada: true, haySesion: true }),
    '#/bienvenida',
  );
});

test('En el navegador del celular muestra la bienvenida para instalar', () => {
  assert.equal(
    decidirRuta({ esEscritorio: false, instalada: false, haySesion: false }),
    '#/bienvenida',
  );
});

test('En Android, el navegador comparte la sesión con la app: aun así muestra la bienvenida', () => {
  assert.equal(
    decidirRuta({ esEscritorio: false, instalada: false, haySesion: true }),
    '#/bienvenida',
  );
});

test('En la app instalada sin sesión muestra el login', () => {
  assert.equal(
    decidirRuta({ esEscritorio: false, instalada: true, haySesion: false }),
    '#/login',
  );
});

test('En la app instalada con sesión muestra el inicio', () => {
  assert.equal(
    decidirRuta({ esEscritorio: false, instalada: true, haySesion: true }),
    '#/inicio',
  );
});
