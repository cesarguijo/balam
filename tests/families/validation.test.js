import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { validateCredentials } from '../../public/families/screens/login/validation.js';

describe('validateCredentials', () => {
  describe('valid usernames (normalization)', () => {
    const cases = [
      {
        username: 'mariaperez1985',
        password: 'abc123',
        expected: { valid: true, username: 'mariaperez1985' },
        description: 'base case',
      },
      {
        username: 'Mariaperez1985',
        password: 'abc123',
        expected: { valid: true, username: 'mariaperez1985' },
        description: "the keyboard's automatic capital",
      },
      {
        username: ' mariaperez1985 ',
        password: 'abc123',
        expected: { valid: true, username: 'mariaperez1985' },
        description: "the autocorrect's space",
      },
      {
        username: 'mariapérez1985',
        password: 'abc123',
        expected: { valid: true, username: 'mariaperez1985' },
        description: 'accents',
      },
      {
        username: 'muñoz1990',
        password: 'abc123',
        expected: { valid: true, username: 'munoz1990' },
        description: 'the ñ',
      },
      {
        username: ' MÚÑOZ1990 ',
        password: 'abc123',
        expected: { valid: true, username: 'munoz1990' },
        description: 'all together',
      },
    ];
    cases.forEach((c) => {
      test(c.description, () => {
        assert.deepStrictEqual(
          validateCredentials(c.username, c.password),
          c.expected,
        );
      });
    });
  });

  describe('username errors', () => {
    const cases = [
      {
        username: '',
        password: 'abc123',
        expected: { valid: false, error: 'username-empty' },
        description: 'empty username',
      },
      {
        username: '     ',
        password: 'abc123',
        expected: { valid: false, error: 'username-empty' },
        description: 'username with only spaces',
      },
      {
        username: 'maria perez',
        password: 'abc123',
        expected: { valid: false, error: 'username-invalid' },
        description: 'username with a space in the middle',
      },
      {
        username: 'maria.perez',
        password: 'abc123',
        expected: { valid: false, error: 'username-invalid' },
        description: 'username with a dot in the middle',
      },
      {
        username: 'maria@gmail.com',
        password: 'abc123',
        expected: { valid: false, error: 'username-invalid' },
        description: 'the parent typed their email',
      },
    ];
    cases.forEach((c) => {
      test(c.description, () => {
        assert.deepStrictEqual(
          validateCredentials(c.username, c.password),
          c.expected,
        );
      });
    });
  });

  describe('password', () => {
    const cases = [
      {
        username: 'mariaperez1985',
        password: '',
        expected: { valid: false, error: 'password-empty' },
        description: 'empty password',
      },
      {
        username: 'mariaperez1985',
        password: '     ',
        expected: { valid: false, error: 'password-empty' },
        description: 'only spaces counts as an empty password',
      },
      {
        username: 'mariaperez1985',
        password: '  abc123  ',
        expected: { valid: true, username: 'mariaperez1985' },
        description: 'does not reject a password with spaces around it',
      },
    ];
    cases.forEach((c) => {
      test(c.description, () => {
        assert.deepStrictEqual(
          validateCredentials(c.username, c.password),
          c.expected,
        );
      });
    });
  });

  describe('order of the errors', () => {
    const cases = [
      {
        username: '',
        password: '',
        expected: { valid: false, error: 'username-empty' },
        description: 'empty username wins over empty password',
      },
      {
        username: 'maria perez',
        password: '',
        expected: { valid: false, error: 'username-invalid' },
        description: 'invalid username wins over empty password',
      },
    ];
    cases.forEach((c) => {
      test(c.description, () => {
        assert.deepStrictEqual(
          validateCredentials(c.username, c.password),
          c.expected,
        );
      });
    });
  });
});
