import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { getListState } from '../public/screens/notices/list-state.js';

const notices = [
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
];

const cases = [
  {
    name: 'loading while the notices have not arrived',
    input: undefined,
    output: 'loading',
  },
  {
    name: 'ready when the server sends notices',
    input: { notices, offline: false },
    output: 'ready',
  },
  {
    name: 'cached when the notices come from the copy',
    input: { notices, offline: true },
    output: 'cached',
  },
  {
    name: 'empty when the server has no recent notices',
    input: { notices: [], offline: false },
    output: 'empty',
  },
  {
    name: 'offline when the copy has no recent notices',
    input: { notices: [], offline: true },
    output: 'offline',
  },
  {
    name: 'offline when there is no internet and no copy',
    input: { type: 'offline' },
    output: 'offline',
  },
  {
    name: 'error for any other error',
    input: { type: 'unknown' },
    output: 'error',
  },
];

describe('getListState returns', () => {
  cases.forEach(({ name, input, output }) => {
    test(name, () => {
      assert.deepEqual(getListState(input), output);
    });
  });
});
