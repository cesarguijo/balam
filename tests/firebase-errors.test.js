import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { translateFirebaseError } from '../public/js/firebase/errors.js';

describe('translateFirebaseError (firebase/errors.js)', () => {
  describe('returns', () => {
    const expected = {
      'auth/wrong-password': 'wrong-credentials',
      'auth/invalid-credential': 'wrong-credentials',
      'auth/user-not-found': 'wrong-credentials',
      'auth/invalid-email': 'wrong-credentials',
      'auth/missing-password': 'wrong-credentials',
      'auth/network-request-failed': 'offline',
      'auth/timeout': 'offline',
      'auth/user-disabled': 'account-disabled',
      'auth/too-many-requests': 'too-many-attempts',
    };
    Object.entries(expected).forEach(([code, type]) => {
      test(type + ' when the error is ' + code, () => {
        assert.equal(translateFirebaseError(code), type);
      });
    });
    describe('unknown when', () => {
      const cases = [
        { input: 'something-odd', description: 'the code does not exist' },
        { input: '', description: 'the text is empty' },
        { input: undefined, description: 'undefined is passed' },
        {
          input: 'constructor',
          description: 'the code is an inherited property (constructor)',
        },
        {
          input: 'toString',
          description: 'the code is an inherited property (toString)',
        },
      ];
      cases.forEach(({ input, description }) => {
        test(description, () => {
          assert.equal(translateFirebaseError(input), 'unknown');
        });
      });
    });
  });
});
