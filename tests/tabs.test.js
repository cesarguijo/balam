import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { getNoticeTabs } from '../public/screens/notices/tabs.js';

describe('getNoticeTabs returns', () => {
  test('one tab per child, in order, with their first name', () => {
    const children = [
      {
        id: 'first-child-id',
        name: 'Argelia Waleska Reyes',
        grade: 7,
        groupId: '7-1',
      },
      {
        id: 'second-child-id',
        name: 'Carlos Maricio Montoya',
        grade: 8,
        groupId: '8-2',
      },
    ];
    const expectedResult = [
      {
        id: 'first-child-id',
        label: 'Argelia',
        groupId: '7-1',
      },
      {
        id: 'second-child-id',
        label: 'Carlos',
        groupId: '8-2',
      },
    ];
    assert.deepEqual(getNoticeTabs(children), expectedResult);
  });

  test('no tabs when there are no children', () => {
    const children = [];
    const expectedResult = [];
    assert.deepEqual(getNoticeTabs(children), expectedResult);
  });

  test('the whole name when it is a single word', () => {
    const children = [
      {
        id: 'first-child-id',
        name: 'Ana',
        grade: 7,
        groupId: '7-1',
      },
    ];
    const expectedResult = [
      {
        id: 'first-child-id',
        label: 'Ana',
        groupId: '7-1',
      },
    ];
    assert.deepEqual(getNoticeTabs(children), expectedResult);
  });
});
