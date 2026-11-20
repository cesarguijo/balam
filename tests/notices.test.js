import { beforeEach, describe, mock, test } from 'node:test';
import assert from 'node:assert/strict';

/** @typedef {import('../public/js/notices.js').Notice} Notice */

const NOTICES_KEY = 'notices';

const validNotices = [
  {
    id: 'fist-id-notice',
    text: 'This is a message',
    createdAt: new Date(new Date(new Date().setDate(new Date().getDate() - 6))),
    updatedAt: null,
  },
  {
    id: 'second-id-notice',
    text: 'This is another message',
    createdAt: new Date(new Date(new Date().setDate(new Date().getDate() - 4))),
    updatedAt: null,
  },
];

const getNoticesSince = mock.fn(() => Promise.resolve(validNotices));

mock.module('../public/js/firebase/notices-adapter.js', {
  namedExports: { getNoticesSince },
});

const { getRecentNotices, clearNotices, NoticeError } =
  await import('../public/js/notices.js');

// localStorage does not exist in Node, so the tests use a fake one. Its data
// lives in this Map.
/** Data of the fake localStorage. */
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

describe('getRecentNotices', () => {
  beforeEach(() => {
    storage.clear();
    getNoticesSince.mock.resetCalls();
  });
  test('there is internet so saves a copy of notices and returns { notices, offline: false }', () => {
    const expectedResult = {
      notices: validNotices,
      offline: false,
    };
    return getRecentNotices('a group Id').then((result) => {
      assert.deepEqual(result, expectedResult);
      assert.equal(
        localStorage.getItem(NOTICES_KEY),
        JSON.stringify(validNotices),
      );
    });
  });

  test('there is no internet and there is a copy of notices so returns { notices: filtered copy, offline: true }', () => {
    const notices = [
      ...validNotices,
      {
        id: 'old-id-notice',
        text: 'This is another message',
        createdAt: new Date(
          new Date(new Date().setDate(new Date().getDate() - 8)),
        ),
        updatedAt: null,
      },
    ];

    globalThis.localStorage.setItem(NOTICES_KEY, JSON.stringify(notices));
    getNoticesSince.mock.mockImplementationOnce(() =>
      Promise.reject(new NoticeError('offline')),
    );
    return getRecentNotices('any Id').then((recentNotices) => {
      assert.deepEqual(recentNotices, { notices: validNotices, offline: true });
    });
  });

  test('there is no internet and there is no copy so throws a NoticeError("offline")', () => {
    getNoticesSince.mock.mockImplementationOnce(() =>
      Promise.reject(new NoticeError('offline')),
    );
    return assert.rejects(getRecentNotices('any-id'), {
      name: 'NoticeError',
      type: 'offline',
    });
  });

  test('there is another error so throws the same error and does not use the copy', () => {
    getNoticesSince.mock.mockImplementationOnce(() =>
      Promise.reject(new NoticeError('not-allowed')),
    );
    return assert.rejects(getRecentNotices('any-id'), {
      name: 'NoticeError',
      type: 'not-allowed',
    });
  });
});

describe('clearNotices', () => {
  test('removes the saved copy of notices', () => {
    globalThis.localStorage.setItem(NOTICES_KEY, JSON.stringify(validNotices));
    clearNotices();
    assert.equal(globalThis.localStorage.getItem(NOTICES_KEY), null);
  });
});
