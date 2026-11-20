/**
 * @file Notice rules: splits a notice's text into title and body, computes
 * how far back the families see notices and turns unknown data into a clean
 * Notice. It is pure (it does not import Firebase or use the browser) so it
 * can be tested in Node, and the rules are not repeated in each adapter
 * (Firebase today, PHP tomorrow).
 */

/** @typedef {import('./notices.js').Notice} Notice */

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
  const date = new Date(now);
  const day = date.getDate();
  date.setDate(day - RECENT_DAYS);
  return date;
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
  const validData = validateNotice(data);

  return {
    id,
    ...validData,
  };
}

/**
 * Checks the fields of a notice and copies only the ones the app uses, so
 * extra fields from the server (`groupId`, `authorUid`) do not leak into
 * the screens. Shared by `toNotice` and `fromJsonToNotice`, so the server
 * data and the offline copy follow the same rules.
 * @param {unknown} data - The notice's fields, with the dates already as `Date`.
 * @returns {Omit<Notice, 'id'>} The validated fields, without the id.
 * @throws {TypeError} If a field is missing or has the wrong type.
 */
function validateNotice(data) {
  if (!isObject(data)) {
    throw new TypeError('The notice is not an object');
  }

  if (typeof data.text !== 'string' || data.text.trim() === '') {
    throw new TypeError('The notice has no text');
  }

  if (!isValidDate(data.createdAt)) {
    throw new TypeError('The notice has no valid creation date');
  }

  if (!isValidDate(data.updatedAt) && data.updatedAt !== null) {
    throw new TypeError('The notice has no valid edit date');
  }

  return {
    text: data.text,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  };
}

/**
 * Tells whether a value is a real date. `instanceof Date` alone is not
 * enough: `new Date('hello')` is a Date too, but a broken one (`Invalid
 * Date`), and its time is `NaN`.
 * @param {unknown} possibleDate - Any value, e.g. a field of a notice.
 * @returns {possibleDate is Date} `true` if it is a Date with a valid time.
 */
function isValidDate(possibleDate) {
  return possibleDate instanceof Date && !Number.isNaN(possibleDate.getTime());
}

/**
 * Tells whether a value is an object with properties that can be checked.
 * The return type teaches TypeScript that, when it is `true`, reading
 * `data.text` is allowed (its value is still `unknown` until checked).
 * @param {unknown} data - Any value, e.g. the notice as it came from the server.
 * @returns {data is Record<string, unknown>} `true` if it is an object (and not `null`).
 */
function isObject(data) {
  return typeof data === 'object' && data !== null;
}

/**
 * Turns the offline copy of the notices (the text saved in `localStorage`)
 * back into Notices. It throws if the copy is damaged, so the caller can
 * treat it the same as having no copy.
 * @param {string} json - The copy, as `JSON.stringify(notices)` saved it.
 * @returns {Notice[]} The validated notices.
 * @throws {SyntaxError} If the text is not valid JSON.
 * @throws {TypeError} If it is not an array or a notice is wrong.
 */
export function fromArrayJsonToNotice(json) {
  const newJson = JSON.parse(json);
  if (Array.isArray(newJson)) {
    return newJson.map(fromJsonToNotice);
  } else {
    throw new TypeError('The JSON is not a Notice[]');
  }
}

/**
 * Turns one notice of the offline copy back into a Notice. `JSON.stringify`
 * saved the dates as text, so they are turned into `Date` before checking
 * them. `updatedAt` stays `null` when it is `null`: `new Date(null)` would
 * give January 1, 1970, a valid date.
 * @param {unknown} json - One element of the parsed array.
 * @returns {Notice} The validated notice.
 * @throws {TypeError} If a field is missing or has the wrong type.
 */
function fromJsonToNotice(json) {
  if (!isObject(json)) {
    throw new TypeError('The notice is not an object');
  }

  if (typeof json.id !== 'string' || json.id === '') {
    throw new TypeError('The notice has no id');
  }

  const data = {
    ...json,
    createdAt: new Date(String(json.createdAt)),
    updatedAt:
      json.updatedAt === null ? null : new Date(String(json.updatedAt)),
  };
  const validNotice = validateNotice(data);
  return {
    ...validNotice,
    id: json.id,
  };
}
