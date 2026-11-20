import { test } from 'node:test';
import assert from 'node:assert/strict';
import { decideRoute } from '../public/js/route.js';

test('On desktop it always shows the welcome screen', () => {
  assert.equal(
    decideRoute({ isDesktop: true, installed: false, hasSession: false }),
    '#/welcome',
  );
  assert.equal(
    decideRoute({ isDesktop: true, installed: false, hasSession: true }),
    '#/welcome',
  );
});

test("On desktop it shows the welcome screen even if the app is installed from Chrome's menu", () => {
  assert.equal(
    decideRoute({ isDesktop: true, installed: true, hasSession: false }),
    '#/welcome',
  );
  assert.equal(
    decideRoute({ isDesktop: true, installed: true, hasSession: true }),
    '#/welcome',
  );
});

test("In the phone's browser it shows the welcome screen to install", () => {
  assert.equal(
    decideRoute({ isDesktop: false, installed: false, hasSession: false }),
    '#/welcome',
  );
});

test('On Android the browser shares the session with the app: it still shows the welcome screen', () => {
  assert.equal(
    decideRoute({ isDesktop: false, installed: false, hasSession: true }),
    '#/welcome',
  );
});

test('In the installed app without a session it shows the login', () => {
  assert.equal(
    decideRoute({ isDesktop: false, installed: true, hasSession: false }),
    '#/login',
  );
});

test('In the installed app with a session it shows notices', () => {
  assert.equal(
    decideRoute({ isDesktop: false, installed: true, hasSession: true }),
    '#/notices',
  );
});
