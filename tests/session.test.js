import { describe, test, mock, beforeEach } from 'node:test';
import assert from 'node:assert/strict';

// The getSession tests need to replace two outside things: the adapter (so
// Firebase is not loaded) and localStorage (it does not exist in Node).
// session.js is imported AFTER registering the mock with `await import(...)`:
// if it were imported at the top, it would bring the real adapter.

/** Data of the fake localStorage; it is cleared before each test. */
const storage = new Map();

/**
 * Removes a key from the fake localStorage.
 * @param {string} key - Name of what was stored.
 */
function removeItem(key) {
  storage.delete(key);
}

/**
 * Returns the text stored under a key of the fake localStorage.
 * @param {string} key - Name of what was stored.
 * @returns {string | null} The text, or `null` if it does not exist (like the real one).
 */
function getItem(key) {
  return storage.get(key) ?? null;
}

/**
 * Stores a text under a key of the fake localStorage.
 * @param {string} key - Name of what is stored.
 * @param {string} value - Text that is stored.
 */
function setItem(key, value) {
  storage.set(key, value);
}

globalThis.localStorage = /** @type {Storage} */ ({
  getItem,
  setItem,
  removeItem,
});

/** A valid family to store as the copy on the phone. */
const validFamily = {
  username: 'arguijo.reyes',
  children: [{ id: 'test-ana', grade: 7, groupId: '7-1', name: 'Ana Arguijo' }],
};

const credentials = {
  username: 'arguijo-reyes',
  password: 'test-password',
};

const adapterLogIn = mock.fn(() => Promise.resolve(validFamily));

const hasSession = mock.fn(() => Promise.resolve(true));
const adapterLogOut = mock.fn(() => Promise.resolve());

mock.module('../public/js/firebase/session-adapter.js', {
  namedExports: {
    hasSession,
    logOut: adapterLogOut,
    logIn: adapterLogIn,
  },
});

mock.module('../public/js/firebase/notices-adapter.js');

const { getSession, SessionError, logIn, logOut } =
  await import('../public/js/session.js');

const { NOTICES_KEY } = await import('../public/js/notices.js');

describe('getSession (session.js)', () => {
  beforeEach(() => {
    storage.clear();
    hasSession.mock.resetCalls();
    adapterLogOut.mock.resetCalls();
  });

  describe('returns null without logging out when', () => {
    test('there is no session', () => {
      hasSession.mock.mockImplementationOnce(() => Promise.resolve(false));
      return getSession().then((result) => {
        assert.equal(result, null);
        assert.equal(adapterLogOut.mock.callCount(), 0);
      });
    });

    test('there is a session but no stored family', () => {
      return getSession().then((result) => {
        assert.equal(result, null);
        assert.equal(adapterLogOut.mock.callCount(), 0);
      });
    });
  });

  test('returns the family when there is a session and the copy is valid', () => {
    globalThis.localStorage.setItem('family', JSON.stringify(validFamily));
    return getSession().then((result) => {
      assert.deepEqual(result, validFamily);
      assert.equal(adapterLogOut.mock.callCount(), 0);
    });
  });

  describe('logs out and returns null when', () => {
    test('the stored family is not JSON', (t) => {
      const warning = t.mock.method(console, 'warn', () => {});
      const input = '{broken';
      globalThis.localStorage.setItem('family', input);
      return getSession().then((result) => {
        assert.equal(result, null);
        assert.equal(adapterLogOut.mock.callCount(), 1);
        assert.equal(globalThis.localStorage.getItem('family'), null);
        assert.equal(warning.mock.callCount(), 1);
      });
    });

    test('the stored family is not a valid family', (t) => {
      const warning = t.mock.method(console, 'warn', () => {});
      const input = '{"username":5}';
      globalThis.localStorage.setItem('family', input);
      return getSession().then((result) => {
        assert.equal(result, null);
        assert.equal(adapterLogOut.mock.callCount(), 1);
        assert.equal(globalThis.localStorage.getItem('family'), null);
        assert.equal(warning.mock.callCount(), 1);
      });
    });

    test('the adapter fails while checking the session', (t) => {
      const warning = t.mock.method(console, 'warn', () => {});
      hasSession.mock.mockImplementationOnce(() =>
        Promise.reject(new Error('test failure')),
      );
      return getSession().then((result) => {
        assert.equal(result, null);
        assert.equal(adapterLogOut.mock.callCount(), 1);
        assert.equal(warning.mock.callCount(), 1);
      });
    });
  });
});

describe('SessionError (session.js)', () => {
  const error = new SessionError('offline');
  test('keeps the type it receives', () => {
    assert.equal(error.type, 'offline');
  });

  test('is named SessionError', () => {
    assert.equal(error.name, 'SessionError');
  });

  test('is an Error', () => {
    assert.ok(error instanceof Error);
    assert.ok(error instanceof SessionError);
  });

  test('keeps the cause it receives', () => {
    const cause = new Error('Firebase error');
    const error = new SessionError('offline', { cause });
    assert.equal(error.cause, cause);
  });
});

describe('logIn (session.js)', () => {
  beforeEach(() => {
    storage.clear();
    adapterLogIn.mock.resetCalls();
  });

  describe('when the adapter answers', () => {
    test('passes the username and password to the adapter', () => {
      return logIn(credentials.username, credentials.password).then(() => {
        assert.deepEqual(adapterLogIn.mock.calls[0].arguments, [
          credentials.username,
          credentials.password,
        ]);
      });
    });

    test('returns the family', () => {
      return logIn(credentials.username, credentials.password).then(
        (result) => {
          assert.deepEqual(result, validFamily);
        },
      );
    });

    test('stores the family on the phone', () => {
      return logIn(credentials.username, credentials.password).then(() => {
        const text = globalThis.localStorage.getItem('family');
        assert.ok(text);
        const storedFamily = JSON.parse(text);
        assert.deepEqual(storedFamily, validFamily);
      });
    });
  });

  describe('when the adapter fails', () => {
    test('the error reaches the caller unchanged', () => {
      const error = new SessionError('wrong-credentials');
      adapterLogIn.mock.mockImplementationOnce(() => Promise.reject(error));
      return assert.rejects(
        logIn(credentials.username, credentials.password),
        error,
      );
    });

    test('stores nothing on the phone', () => {
      adapterLogIn.mock.mockImplementationOnce(() =>
        Promise.reject(new SessionError('wrong-credentials')),
      );
      return assert
        .rejects(logIn(credentials.username, credentials.password))
        .then(() => {
          assert.equal(globalThis.localStorage.getItem('family'), null);
        });
    });
  });
});

describe('logOut (session.js)', () => {
  test('removes the copy of the notices', () => {
    globalThis.localStorage.setItem(NOTICES_KEY, '[]');
    return logOut().then(() => {
      assert.equal(globalThis.localStorage.getItem(NOTICES_KEY), null);
    });
  });
});
