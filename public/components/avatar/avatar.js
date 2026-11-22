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

/**
 * Gets the avatar color of a child from their place in the family.
 * There are 4 colors; from the 5th child on they start over at 1.
 * @param {number} order Place of the child in the family, starting at 1.
 * @returns {number} Color number, from 1 to 4.
 */
export function getColorNumber(order) {
  return ((order - 1) % 4) + 1;
}
