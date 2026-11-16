/**
 * @file Spanish message catalog: holds every text the user sees and
 * looks them up by key.
 */

/**
 * Texts shown to the user, by key. Keys are grouped by component or
 * screen (`button.loading`) so the catalog stays easy to scan.
 */
export const messages = {
  'button.default': 'Aceptar',
  'button.loading': 'Cargando…',
  'install.button': 'Instalar',
};

/**
 * A key that exists in the catalog. Typing it lets the editor flag a
 * misspelled key before the app runs.
 * @typedef {keyof typeof messages} MessageKey
 */

/**
 * A text from the catalog.
 * @typedef {(typeof messages)[MessageKey]} MessageText
 */

/**
 * Returns the text for a key, so the code never holds user-facing strings.
 * @param {MessageKey} key - Catalog key, e.g. `'button.loading'`.
 * @returns {MessageText} The text to show the user.
 */
export function t(key) {
  return messages[key] ?? 'no-existe';
}
