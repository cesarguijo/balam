/**
 *
 * @param {string} name
 * @param {number} order
 */
export function avatar(name, order) {}

/**
 * Gets the uppercase first letter of a name, without its accent.
 * Falls back to "B" (for Balam) so the avatar is never empty.
 * @param {string | null | undefined} name Name or username, as stored.
 * @returns {string} One uppercase letter.
 */
export function getInitial(name) {
  return name?.normalize('NFD').trim().at(0)?.toUpperCase() ?? 'B';
}
