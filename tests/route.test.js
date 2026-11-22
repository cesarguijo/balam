import { test } from 'node:test';
import assert from 'node:assert/strict';
import { decideRoute } from '../public/js/route.js';

test('On desktop it always shows the welcome screen', () => {
  assert.equal(
    decideRoute({ isDesktop: true, hasSession: false }),
    '#/welcome',
  );
  assert.equal(decideRoute({ isDesktop: true, hasSession: true }), '#/welcome');
});

test('On the phone without a session it shows the login, even without installing', () => {
  assert.equal(decideRoute({ isDesktop: false, hasSession: false }), '#/login');
});

test('On the phone with a session it shows the notices, even without installing', () => {
  assert.equal(
    decideRoute({ isDesktop: false, hasSession: true }),
    '#/notices',
  );
});
