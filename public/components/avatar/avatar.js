/**
 * @file Avatar component: draws the circle with the initial of a family or
 * a child. Style-only (no Custom Element); its pure helpers are tested in Node.
 */

/**
 * Draws the avatar: a circle with the initial of a name. With an order it is
 * a child's avatar, colored by their place in the family; without one it is
 * the family's own avatar, bigger and in amber.
 * @param {string | null | undefined} name Name or username, as stored.
 * @param {number} [order] Place of the child in the family, starting at 1.
 * @returns {string} HTML of the avatar.
 */
export function avatar(name, order) {
  if (order) {
    return /* HTML */ `
      <span
        class="avatar avatar--child avatar--child-${getColorNumber(order)} text-label"
      >
        ${getInitial(name)}
      </span>
    `;
  }
  return /* HTML */ `
    <span class="avatar avatar--family text-title"> ${getInitial(name)} </span>
  `;
}

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
