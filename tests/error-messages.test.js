import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { getErrorMessage } from '../public/screens/login/error-messages.js';

describe('getErrorMessage (login/error-messages.js)', () => {
  const types = [
    'wrong-credentials',
    'offline',
    'account-disabled',
    'too-many-attempts',
    'unknown',
    'username-empty',
    'username-invalid',
    'password-empty',
  ];
  describe('returns', () => {
    describe('a text of 60 characters or less for', () => {
      types.forEach((type) => {
        test(type, () => {
          const result = getErrorMessage(type);
          assert.ok(
            result.length <= 60,
            'Too long by ' + String(result.length - 60) + ' characters',
          );
        });
      });
    });

    describe('a non-empty text for', () => {
      types.forEach((type) => {
        test(type, () => {
          const result = getErrorMessage(type);
          assert.ok(typeof result === 'string' && result !== '');
        });
      });
    });

    describe('a catalog text, not a missing key, for', () => {
      types.forEach((type) => {
        test(type, () => {
          assert.doesNotMatch(getErrorMessage(type), /^login\.error\./);
        });
      });
    });

    test('a different message for each type', () => {
      const different = new Set(types.map((type) => getErrorMessage(type)));
      assert.equal(different.size, types.length);
    });

    describe('the unknown message when', () => {
      const cases = [
        { input: 'algo-raro', description: 'the type does not exist' },
        {
          input: 'constructor',
          description: 'the type is an inherited property (constructor)',
        },
        { input: '', description: 'the type is empty' },
        { input: undefined, description: 'the type is undefined' },
      ];
      cases.forEach(({ input, description }) => {
        test(description, () => {
          assert.equal(getErrorMessage(input), getErrorMessage('unknown'));
        });
      });
    });
  });
});
