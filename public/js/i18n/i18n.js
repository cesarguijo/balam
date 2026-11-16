/**
 * @file Text lookup: finds the text for a key in the message catalog, so
 * the code never holds user-facing strings. It is pure (no `window` or
 * `document`) so it can be tested in Node.
 */

import { messages } from './es.js';

/** @typedef {import('./es.js').MessageKey} MessageKey */

// TODO: return the text from `messages`, or the key itself if it is missing
/**
 * Returns the text for a key. If the key is missing, it returns the key
 * itself, so the screen shows exactly which text is missing from the catalog.
 * @param {MessageKey} key - Catalog key, e.g. `'button.loading'`.
 * @returns {string} The text to show the user, or the key if it is missing.
 */
export function t(key) {
  throw new Error('Not implemented');
}
