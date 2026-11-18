import { test } from 'node:test';
import assert from 'node:assert/strict';
import { t } from '../public/js/i18n/i18n.js';
import { messages } from '../public/js/i18n/es.js';

test('returns the text for a known key', () => {
  const result = t('button.loading');
  const expectedResult = messages['button.loading'];
  assert.equal(result, expectedResult);
});

test('returns the key itself when it is missing', () => {
  const result = t('nothing here');
  const expectedResult = 'nothing here';
  assert.equal(result, expectedResult);
});
