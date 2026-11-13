import { test } from 'node:test';
import assert from 'node:assert/strict';
import { icono, nombresDeIconos } from '../public/js/iconos.js';

test('La función icono devuelve un SVG', () => {
  const resultado = icono('menu');
  assert.match(resultado, /^<svg/);
});

test('Cada ícono tiene un dibujo distinto', () => {
  const dibujos = new Set(nombresDeIconos.map((nombre) => icono(nombre)));
  assert.equal(dibujos.size, nombresDeIconos.length);
});

test('Ningún ícono trae colores fijos', () => {
  nombresDeIconos.forEach((nombre) => {
    assert.doesNotMatch(
      icono(nombre),
      /(fill|stroke)="(?!none"|currentColor")/,
      `El ícono ${nombre} trae un color fijo`,
    );
  });
});

test('Cada ícono tiene al menos un <path>', () => {
  nombresDeIconos.forEach((nombre) => {
    assert.match(
      icono(nombre),
      /<path\s/,
      `El ícono ${nombre} no tiene ningún <path>`,
    );
  });
});

test('Si el ícono no existe se lanza un error', () => {
  assert.throws(() => icono('no-existe'), /no-existe/);
});

test('La función icono agrega aria-hidden', () => {
  const resultado = icono('menu');
  assert.ok(resultado.includes('aria-hidden="true"'));
});

test('La función icono agrega la clase icono', () => {
  const resultado = icono('menu');
  assert.ok(resultado.includes('class="icono"'));
});
