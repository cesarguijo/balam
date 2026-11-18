/**
 * @file Notice rules: splits a notice's text into title and body, computes
 * how far back the families see notices and turns unknown data into a clean
 * Notice. It is pure (it does not import Firebase or use the browser) so it
 * can be tested in Node, and the rules are not repeated in each adapter
 * (Firebase today, PHP tomorrow).
 */

// TODO: remove this line once every function below is implemented; it only
// silences the warnings for the parameters the placeholders do not use yet.
/* eslint-disable no-unused-vars */

/** @typedef {import('./notices.js').Notice} Notice */
/** @typedef {import('./notices.js').NoticeLevel} NoticeLevel */

/**
 * How many days back the families see notices. Notices are urgent by
 * nature: an older one is no longer news, and anything that is not urgent
 * goes in the students' notebooks.
 */
export const RECENT_DAYS = 7;

/**
 * Title and body of a notice, as the notice card shows them.
 * @typedef {object} NoticeParts
 * @property {string} title - First line with text, e.g. `Suspensión de clases`.
 * @property {string} body - The rest of the text; empty if the notice has a single line.
 */

/**
 * Splits a notice's text into title and body. The first line is the title,
 * like an email subject: the teacher does not have to remember any symbol,
 * just press Enter after the title. Only the full text is stored, so editing
 * loads it as it is.
 * @param {string} text - The notice as the teacher typed it.
 * @returns {NoticeParts} The title and the body.
 */
export function splitNotice(text) {
  const cleanText = text.trim();
  const index = cleanText.indexOf('\n');
  if (index === -1) return { title: cleanText, body: '' };
  const title = cleanText.slice(0, index);
  const body = cleanText.slice(index + 1);
  const cleanTitle = title.trim();
  const cleanBody = body.trim();
  return {
    title: cleanTitle,
    body: cleanBody,
  };
}

/**
 * Returns the oldest moment a notice can have and still be shown: `now`
 * minus `RECENT_DAYS`. Counting days back, and not "this week", keeps a
 * Friday night notice visible on Monday morning.
 * @param {Date} now - Current moment; received as a parameter so the tests can pick it.
 * @returns {Date} The cutoff date; notices created on or after it are shown.
 */
export function getCutoffDate(now) {
  // TODO: implement getCutoffDate.
  // - Return a new Date; do not change `now` (whoever called still uses it).
  // - Tests: a notice from 6 days ago is shown, one from 8 days ago is not,
  //   and exactly 7 days ago is the edge (decide and write it down in a test).
  throw new Error('Not implemented');
}

/**
 * Turns the data of a notice, as it came from the server, into a clean
 * Notice with only what the app uses. Same idea as `toFamily`: if the data
 * is wrong it throws, so a damaged notice does not show up half empty.
 * @param {string} id - The notice id, given by the server.
 * @param {unknown} data - The notice's fields, with the dates already as `Date` (the adapter converts them).
 * @returns {Notice} The validated notice.
 * @throws {TypeError} If a field is missing or has the wrong type.
 */
export function toNotice(id, data) {
  // TODO: implement toNotice, following the style of toFamily in family.js.
  // - Check that `data` is an object.
  // - `text`: non-empty string.
  // - `level`: only 'urgent' or 'emergency'.
  // - `createdAt`: a valid Date. `updatedAt`: a valid Date or null.
  // - Return only id, text, level, createdAt and updatedAt (not groupId or
  //   authorUid: the screens do not use them).
  // - Tests: a valid notice, each field missing or wrong, an unknown level.
  throw new Error('Not implemented');
}
