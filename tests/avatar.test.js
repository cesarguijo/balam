import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import {
  getColorNumber,
  getInitial,
} from '../public/components/avatar/avatar.js';

describe('getInitial', () => {
  const cases = [
    {
      testName: 'return the first letter of the name',
      data: 'ángel',
      expectedResult: 'A',
    },
    {
      testName: 'return B if the name is empty',
      data: '',
      expectedResult: 'B',
    },
    {
      testName: 'return B if the name is null',
      data: null,
      expectedResult: 'B',
    },
    {
      testName: 'return B if the name is undefined',
      data: undefined,
      expectedResult: 'B',
    },
    {
      testName: 'return the first letter if the name start with spaces',
      data: '  Luis',
      expectedResult: 'L',
    },
  ];
  cases.forEach((value) => {
    test(value.testName, () => {
      assert.equal(getInitial(value.data), value.expectedResult);
    });
  });
});

describe('getColorNumber', () => {
  const cases = [
    {
      testName: 'return 1 for the first child',
      data: 1,
      expectedResult: 1,
    },

    {
      testName: 'return 4 for the fourth child',
      data: 4,
      expectedResult: 4,
    },

    {
      testName: 'return 1 for the fifth child',
      data: 5,
      expectedResult: 1,
    },

    {
      testName: 'return 4 for the eighth child',
      data: 8,
      expectedResult: 4,
    },
  ];
  cases.forEach((value) => {
    test(value.testName, () => {
      assert.equal(getColorNumber(value.data), value.expectedResult);
    });
  });
});
