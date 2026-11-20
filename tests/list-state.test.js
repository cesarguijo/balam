import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { getListState } from '../public/screens/notices/list-state.js';

const cases = [
  { input: undefined, output: 'loading' },
  {
    input: [
      {
        id: 'first-id',
        text: 'Hi\nThis is a message',
        createdAt: new Date(),
        updatedAt: null,
      },
      {
        id: 'second-id',
        text: 'Hi\nThis is another message',
        createdAt: new Date(),
        updatedAt: null,
      },
    ],
    output: 'ready',
  },
  { input: [], output: 'empty' },
  { input: { type: 'offline' }, output: 'offline' },
  { input: { type: 'unknown' }, output: 'error' },
];

describe('getListState returns', () => {
  cases.forEach(({ input, output }) => {
    test(output + ' properly', () => {
      assert.deepEqual(getListState(input), output);
    });
  });
});
