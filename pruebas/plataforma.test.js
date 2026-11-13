import { test } from 'node:test';
import assert from 'node:assert/strict';
import { detectarPlataforma } from '../public/js/plataforma.js';

test('Safari en iOS 26 devuelve ios-safari', () => {
  const agente =
    'Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1';
  assert.equal(detectarPlataforma(agente), 'ios-safari');
});

test('Chrome en Android devuelve android-chrome', () => {
  const agente =
    'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Mobile Safari/537.36';
  assert.equal(detectarPlataforma(agente), 'android-chrome');
});

test('Samsung Browser en móviles samsung devuelve samsung', () => {
  const agente =
    'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/30.0 Chrome/143.0.0.0 Mobile Safari/537.36';
  assert.equal(detectarPlataforma(agente), 'samsung');
});

test('Firefox en Android devuelve firefox', () => {
  const agente =
    'Mozilla/5.0 (Android 16; Mobile; rv:155.0) Gecko/155.0 Firefox/155.0';
  assert.equal(detectarPlataforma(agente), 'firefox');
});

test('Edge en Android devuelve otro', () => {
  const agente =
    'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Mobile Safari/537.36 EdgA/152.0.0.0';
  assert.equal(detectarPlataforma(agente), 'otro');
});

test('Opera en Android devuelve otro', () => {
  const agente =
    'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Mobile Safari/537.36 OPR/101.0.0.0';
  assert.equal(detectarPlataforma(agente), 'otro');
});

test('Chrome en un iPhone devuelve ios-chrome', () => {
  const agente =
    'Mozilla/5.0 (iPhone; CPU iPhone OS 26_6_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/153.0.8010.24 Mobile/15E148 Safari/604.1';
  assert.equal(detectarPlataforma(agente), 'ios-chrome');
});

test('Safari en iOS antiguos devuelve ios-safari-clasico', () => {
  const agente =
    'Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.7.5 Mobile/15E148 Safari/604.1';
  assert.equal(detectarPlataforma(agente), 'ios-safari-clasico');
});

test('iPad que se hace pasar por Mac', () => {
  const agente =
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Safari/605.1.15';
  assert.equal(detectarPlataforma(agente, 5), 'ios-safari');
});

test('Mac de verdad', () => {
  const agente =
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Safari/605.1.15';
  assert.equal(detectarPlataforma(agente, 0), 'escritorio');
});

test('Chrome en windows devuelve escritorio', () => {
  const agente =
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36';
  assert.equal(detectarPlataforma(agente), 'escritorio');
});
