/**
 * @file Last refresh text: formats when the family was last read from the
 * server ("hoy, 8:15", "ayer, 14:30", "3 nov"). It is pure, so it can be
 * tested in Node.
 */

import { t } from '../../js/i18n/es.js';

// is the day before, and 'D mmm' for older dates. Write the tests first.
/**
 * Formats the date of the last refresh relative to now.
 * @param {Date} date - When the family was last read from the server.
 * @param {Date} now - The current date. It is a parameter (not `new Date()`
 * inside) so the tests always give the same result.
 * @returns {string} The text to show after "Última vez:".
 */
export function formatLastRefresh(date, now) {
  if (isToday(date, now)) {
    return t('account.refresh.today') + ', ' + getHour(date);
  }

  if (wasYesterday(date, now)) {
    return t('account.refresh.yesterday') + ', ' + getHour(date);
  }
  return formatDayMonth(date);
}

/**
 * Checks whether a date falls on the calendar day before now. It moves `now`
 * back one day with `setDate` (not by subtracting 24 hours), so the change of
 * month or year is handled by `Date`.
 * @param {Date} date - The date to check.
 * @param {Date} now - The current date.
 * @returns {boolean} `true` if `date` was yesterday.
 */
function wasYesterday(date, now) {
  const yesterday = new Date(now.getTime());
  yesterday.setDate(yesterday.getDate() - 1);

  return (
    date.getFullYear() === yesterday.getFullYear() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getDate() === yesterday.getDate()
  );
}

/**
 * Checks whether a date falls on the same calendar day as now.
 * @param {Date} date - The date to check.
 * @param {Date} now - The current date.
 * @returns {boolean} `true` if `date` is today.
 */
function isToday(date, now) {
  return (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()
  );
}

/**
 * Formats a date as day and short month, e.g. "3 nov". The words come from
 * `toLocaleDateString`, so the code holds no user-facing text.
 * @param {Date} date - The date to format.
 * @returns {string} The day and the short month.
 */
function formatDayMonth(date) {
  return date.toLocaleDateString('es', {
    day: 'numeric',
    month: 'short',
  });
}

/**
 * Formats the time of a date as H:MM, e.g. "8:05".
 * @param {Date} date - The date to take the time from.
 * @returns {string} The hour and the minutes with two digits.
 */
function getHour(date) {
  return `${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`;
}
