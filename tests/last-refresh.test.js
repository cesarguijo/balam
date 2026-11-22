import { test } from 'node:test';
import assert from 'node:assert/strict';
import { formatLastRefresh } from '../public/screens/account/last-refresh.js';

// Months start at 0: 10 is November, 11 is December, 0 is January.
const cases = [
  {
    testName: 'today',
    data: new Date(2026, 10, 22, 8, 15),
    now: new Date(2026, 10, 22, 10, 0),
    expectedResult: 'hoy, 8:15',
  },
  {
    testName: 'today with minutes below 10',
    data: new Date(2026, 10, 22, 8, 5),
    now: new Date(2026, 10, 22, 10, 0),
    expectedResult: 'hoy, 8:05',
  },
  {
    testName: 'yesterday',
    data: new Date(2026, 10, 21, 14, 30),
    now: new Date(2026, 10, 22, 10, 0),
    expectedResult: 'ayer, 14:30',
  },
  {
    testName: 'yesterday just before midnight',
    data: new Date(2026, 10, 21, 23, 59),
    now: new Date(2026, 10, 22, 0, 1),
    expectedResult: 'ayer, 23:59',
  },
  {
    testName: 'yesterday in the previous month',
    data: new Date(2026, 10, 30, 18, 0),
    now: new Date(2026, 11, 1, 9, 0),
    expectedResult: 'ayer, 18:00',
  },
  {
    testName: 'yesterday in the previous year',
    data: new Date(2026, 11, 31, 20, 0),
    now: new Date(2027, 0, 1, 9, 0),
    expectedResult: 'ayer, 20:00',
  },
  {
    testName: 'two days ago',
    data: new Date(2026, 10, 20, 9, 0),
    now: new Date(2026, 10, 22, 10, 0),
    expectedResult: '20 nov',
  },
  {
    testName: 'a month ago',
    data: new Date(2026, 10, 3, 9, 0),
    now: new Date(2026, 10, 22, 10, 0),
    expectedResult: '3 nov',
  },
];

cases.forEach((value) => {
  test(value.testName, () => {
    assert.equal(
      formatLastRefresh(value.data, value.now),
      value.expectedResult,
    );
  });
});
