import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { getNoticeTabs } from '../../public/families/screens/family/tabs.js';

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
        initial: 'A',
        groupId: '7-1',
      },
      {
        id: 'second-child-id',
        label: 'Carlos',
        initial: 'C',
        groupId: '8-2',
      },
    ];
    assert.deepEqual(getNoticeTabs(children), expectedResult);
  });

  test('no tabs when there are no children', () => {
    /** @type {import('../../public/js/family.js').Child[]} */
    const children = [];

    /** @type {import('../../public/js/family.js').Child[]} */
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
        initial: 'A',
        groupId: '7-1',
      },
    ];
    assert.deepEqual(getNoticeTabs(children), expectedResult);
  });
});
