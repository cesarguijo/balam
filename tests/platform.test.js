import { test } from 'node:test';
import assert from 'node:assert/strict';
import { detectPlatform } from '../public/js/platform.js';

test('Safari on iOS 26 returns ios-safari', () => {
  const userAgent =
    'Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1';
  assert.equal(detectPlatform(userAgent), 'ios-safari');
});

test('Chrome on Android returns android-chrome', () => {
  const userAgent =
    'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Mobile Safari/537.36';
  assert.equal(detectPlatform(userAgent), 'android-chrome');
});

test('Samsung Browser on Samsung phones returns samsung', () => {
  const userAgent =
    'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/30.0 Chrome/143.0.0.0 Mobile Safari/537.36';
  assert.equal(detectPlatform(userAgent), 'samsung');
});

test('Firefox on Android returns firefox', () => {
  const userAgent =
    'Mozilla/5.0 (Android 16; Mobile; rv:155.0) Gecko/155.0 Firefox/155.0';
  assert.equal(detectPlatform(userAgent), 'firefox');
});

test('Edge on Android returns other', () => {
  const userAgent =
    'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Mobile Safari/537.36 EdgA/152.0.0.0';
  assert.equal(detectPlatform(userAgent), 'other');
});

test('Opera on Android returns other', () => {
  const userAgent =
    'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Mobile Safari/537.36 OPR/101.0.0.0';
  assert.equal(detectPlatform(userAgent), 'other');
});

test('Chrome on an iPhone returns ios-chrome', () => {
  const userAgent =
    'Mozilla/5.0 (iPhone; CPU iPhone OS 26_6_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/153.0.8010.24 Mobile/15E148 Safari/604.1';
  assert.equal(detectPlatform(userAgent), 'ios-chrome');
});

test('Safari on older iOS returns ios-safari-legacy', () => {
  const userAgent =
    'Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.7.5 Mobile/15E148 Safari/604.1';
  assert.equal(detectPlatform(userAgent), 'ios-safari-legacy');
});

test('An iPad that pretends to be a Mac', () => {
  const userAgent =
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Safari/605.1.15';
  assert.equal(detectPlatform(userAgent, 5), 'ios-safari');
});

test('A real Mac', () => {
  const userAgent =
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Safari/605.1.15';
  assert.equal(detectPlatform(userAgent, 0), 'desktop');
});

test('Chrome on Windows returns desktop', () => {
  const userAgent =
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36';
  assert.equal(detectPlatform(userAgent), 'desktop');
});
