import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { splitNotice } from '../public/js/notice.js';

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
