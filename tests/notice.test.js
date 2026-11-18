import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { getCutoffDate, splitNotice, toNotice } from '../public/js/notice.js';

describe('splitNotice', () => {
  test('One line text', () => {
    const result = splitNotice('All classes are cancelled');
    const expectedResult = {
      title: 'All classes are cancelled',
      body: '',
    };
    assert.deepEqual(result, expectedResult);
  });

  test('Several lines text', () => {
    const result = splitNotice(
      'Classes suspended.\nThere are no classes tomorrow due to the holiday.',
    );
    const expectedResult = {
      title: 'Classes suspended.',
      body: 'There are no classes tomorrow due to the holiday.',
    };
    assert.deepEqual(result, expectedResult);
  });

  test('Blank lines at the beginning of the text', () => {
    const result = splitNotice(
      '\n\nClasses suspended.\nThere are no classes tomorrow.',
    );
    const expectedResult = {
      title: 'Classes suspended.',
      body: 'There are no classes tomorrow.',
    };
    assert.deepEqual(result, expectedResult);
  });

  test('Spaces around the title and the body.', () => {
    const result = splitNotice(
      '  Classes suspended.  \n  There are no classes tomorrow.  ',
    );
    const expectedResult = {
      title: 'Classes suspended.',
      body: 'There are no classes tomorrow.',
    };
    assert.deepEqual(result, expectedResult);
  });

  test('One line with spaces', () => {
    const result = splitNotice(' Classes suspended. ');
    const expectedResult = {
      title: 'Classes suspended.',
      body: '',
    };
    assert.deepEqual(result, expectedResult);
  });

  test('Line breaks in Windows', () => {
    const result = splitNotice(
      'Classes suspended.\r\nThere are no classes tomorrow.',
    );
    const expectedResult = {
      title: 'Classes suspended.',
      body: 'There are no classes tomorrow.',
    };
    assert.deepEqual(result, expectedResult);
  });

  test('Empty text or text containing only spaces', () => {
    const result = splitNotice('   ');
    const expectedResult = {
      title: '',
      body: '',
    };
    assert.deepEqual(result, expectedResult);
    assert.deepEqual(splitNotice(''), expectedResult);
  });
});

describe('getCutoffDate', () => {
  test('Normal case', () => {
    const testDate = new Date(2026, 10, 18, 10, 0, 0, 0);
    const result = getCutoffDate(testDate);
    const expectedResult = new Date(2026, 10, 11, 10, 0, 0);
    assert.deepEqual(result, expectedResult);
  });
  test('now does not change', () => {
    const now = new Date();
    const nowAgain = new Date(now);
    getCutoffDate(now);
    assert.deepEqual(now, nowAgain);
  });
  test('change the month', () => {
    const now = new Date(2026, 11, 3, 10, 0, 0, 0);
    const expectedResult = new Date(2026, 10, 26, 10, 0, 0, 0);
    const result = getCutoffDate(now);
    assert.deepEqual(result, expectedResult);
  });
});

describe('toNotice', () => {
  const validData = {
    text: 'Classes suspended.\nThere are no classes tomorrow.',
    level: 'urgent',
    createdAt: new Date(2026, 10, 10, 10, 0, 0, 0),
    updatedAt: null,
    groupId: 'id-group',
    authorUid: 'id-author',
  };
  test('A valid notice', () => {
    const result = toNotice('an-id', validData);
    const expected = {
      id: 'an-id',
      text: 'Classes suspended.\nThere are no classes tomorrow.',
      level: 'urgent',
      createdAt: new Date(2026, 10, 10, 10, 0, 0, 0),
      updatedAt: null,
    };
    assert.deepEqual(result, expected);
  });

  describe('throws TypeError if', () => {
    test('data is not an object', () => {
      assert.throws(() => toNotice('an-id', null), {
        name: 'TypeError',
        message: 'The notice is not an object',
      });
    });

    test('data has no text', () => {
      assert.throws(() => toNotice('an-id', { ...validData, text: 42 }), {
        name: 'TypeError',
        message: 'The notice has no text',
      });
    });

    test('data has an empty text', () => {
      assert.throws(() => toNotice('an-id', { ...validData, text: '' }), {
        name: 'TypeError',
        message: 'The notice has no text',
      });
      assert.throws(() => toNotice('an-id', { ...validData, text: '   ' }), {
        name: 'TypeError',
        message: 'The notice has no text',
      });
    });

    test('level has no a valid NoticeLevel', () => {
      assert.throws(
        () => toNotice('an-id', { ...validData, level: 'something-strange' }),
        {
          name: 'TypeError',
          message: 'The notice has an unknown level',
        },
      );
    });

    test('createdAt is not a date', () => {
      assert.throws(
        () => toNotice('an-id', { ...validData, createdAt: '2026-11-10' }),
        {
          name: 'TypeError',
          message: 'The notice has no valid creation date',
        },
      );
      assert.throws(
        () =>
          toNotice('an-id', {
            ...validData,
            createdAt: new Date('not a date'),
          }),
        {
          name: 'TypeError',
          message: 'The notice has no valid creation date',
        },
      );
    });

    test('updatedAt is not a date', () => {
      assert.throws(
        () =>
          toNotice('an-id', {
            ...validData,
            updatedAt: new Date('not a date'),
          }),
        {
          name: 'TypeError',
          message: 'The notice has no valid edit date',
        },
      );
    });
  });
});
