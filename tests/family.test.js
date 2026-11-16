import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { toFamily } from '../public/js/family.js';

describe('toFamily', () => {
  describe('returns:', () => {
    test('an equal family', () => {
      const validFamily = {
        username: 'arguijo.reyes',
        children: [
          { id: 'test-ana', grade: 7, name: 'Ana Arguijo' },
          { id: 'test-luis', grade: 8, name: 'Luis Arguijo' },
        ],
      };
      assert.deepEqual(toFamily(validFamily), validFamily);
    });

    test('a family without extra fields', () => {
      const familyWithExtraFields = {
        id: 'fwYpYoeFPFMEporvLl4e1Dr1LNF3',
        username: 'arguijo.reyes',
        children: [
          {
            id: 'test-ana',
            grade: 7,
            name: 'Ana Arguijo',
            extraField: 'text',
          },
          {
            id: 'test-luis',
            grade: 8,
            name: 'Luis Arguijo',
            extraField: 'text',
          },
        ],
      };
      const expected = {
        username: 'arguijo.reyes',
        children: [
          { id: 'test-ana', grade: 7, name: 'Ana Arguijo' },
          { id: 'test-luis', grade: 8, name: 'Luis Arguijo' },
        ],
      };
      assert.deepEqual(toFamily(familyWithExtraFields), expected);
    });
  });

  describe('throws if:', () => {
    test('the family is not an object', () => {
      assert.throws(() => toFamily('not an object'), {
        name: 'TypeError',
        message: 'The family is not an object',
      });
    });

    test('it receives null', () => {
      assert.throws(() => toFamily(null), {
        name: 'TypeError',
        message: 'The family is not an object',
      });
    });

    test('the family has no username field', () => {
      const familyWithoutUsername = {
        children: [
          { id: 'test-ana', grade: 7, name: 'Ana Arguijo' },
          { id: 'test-luis', grade: 8, name: 'Luis Arguijo' },
        ],
      };
      assert.throws(() => toFamily(familyWithoutUsername), {
        name: 'TypeError',
        message: 'The family has no text username',
      });
    });

    test('the username is empty', () => {
      const familyWithEmptyUsername = {
        username: '',
        children: [
          { id: 'test-ana', grade: 7, name: 'Ana Arguijo' },
          { id: 'test-luis', grade: 8, name: 'Luis Arguijo' },
        ],
      };
      assert.throws(() => toFamily(familyWithEmptyUsername), {
        name: 'TypeError',
        message: 'The family has no text username',
      });
    });

    test('the family has no children field', () => {
      const familyWithoutChildren = { username: 'arguijo.reyes' };
      assert.throws(() => toFamily(familyWithoutChildren), {
        name: 'TypeError',
        message: 'The family has no list with at least one child',
      });
    });

    test('the family has an empty children list', () => {
      const familyWithEmptyChildren = {
        username: 'arguijo.reyes',
        children: [],
      };
      assert.throws(() => toFamily(familyWithEmptyChildren), {
        name: 'TypeError',
        message: 'The family has no list with at least one child',
      });
    });

    test('the child is not an object', () => {
      const familyWithNonObjectChild = {
        username: 'arguijo.reyes',
        children: ['Ana'],
      };
      assert.throws(() => toFamily(familyWithNonObjectChild), {
        name: 'TypeError',
        message: 'Child 0 is not an object',
      });
    });

    test('the first child has no text id', () => {
      const familyFirstChildWithoutId = {
        username: 'arguijo.reyes',
        children: [
          { grade: 7, name: 'Ana Arguijo' },
          { id: 'test-luis', grade: 8, name: 'Luis Arguijo' },
        ],
      };
      assert.throws(() => toFamily(familyFirstChildWithoutId), {
        name: 'TypeError',
        message: 'Child 0 has no text id',
      });
    });

    test('the first child has no text name', () => {
      const familyFirstChildWithoutName = {
        username: 'arguijo.reyes',
        children: [
          { id: 'test-ana', grade: 7 },
          { id: 'test-luis', grade: 8, name: 'Luis Arguijo' },
        ],
      };
      assert.throws(() => toFamily(familyFirstChildWithoutName), {
        name: 'TypeError',
        message: 'Child 0 has no text name',
      });
    });

    test('the first child has a grade that is not a number', () => {
      const familyFirstChildWithTextGrade = {
        username: 'arguijo.reyes',
        children: [
          { id: 'test-ana', grade: '7', name: 'Ana Arguijo' },
          { id: 'test-luis', grade: 8, name: 'Luis Arguijo' },
        ],
      };
      assert.throws(() => toFamily(familyFirstChildWithTextGrade), {
        name: 'TypeError',
        message: 'Child 0 has no whole-number grade',
      });
    });

    test('the first child has a decimal grade', () => {
      const familyFirstChildWithDecimalGrade = {
        username: 'arguijo.reyes',
        children: [
          { id: 'test-ana', grade: 7.5, name: 'Ana Arguijo' },
          { id: 'test-luis', grade: 8, name: 'Luis Arguijo' },
        ],
      };
      assert.throws(() => toFamily(familyFirstChildWithDecimalGrade), {
        name: 'TypeError',
        message: 'Child 0 has no whole-number grade',
      });
    });

    test('the second child has no text id', () => {
      const familySecondChildWithoutId = {
        username: 'arguijo.reyes',
        children: [
          { id: 'test-ana', grade: 7, name: 'Ana Arguijo' },
          { grade: 8, name: 'Luis Arguijo' },
        ],
      };
      assert.throws(() => toFamily(familySecondChildWithoutId), {
        name: 'TypeError',
        message: 'Child 1 has no text id',
      });
    });
  });
});
