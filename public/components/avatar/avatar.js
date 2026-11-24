/**
 * @file Avatar component: draws the circle with the initial of a family or
 * a child. Style-only (no Custom Element); its pure helpers are tested in Node.
 */

import { icon } from '../../js/icons.js';

/**
 * Draws the avatar: a circle with a short text or an icon.
 * With an order it takes one of the 10 colors (child or group); with an
 * icon it is the "All my groups" avatar; without either, the user's own.
 * @param {object} options
 * @param {string} [options.text] Text inside the circle: an initial or "7°-1".
 * @param {import("../../js/icons").IconName} [options.iconName] Icon name, for the "All my groups" avatar.
 * @param {'small' | 'large'} [options.size] Only the child avatar is small.
 * @param {number} [options.order] Place in the list, starting at 1.
 * @returns {string} HTML of the avatar.
 */
export function avatar({ text, iconName, size = 'large', order }) {
  const color = order ? getColorNumber(order) : iconName ? 'group' : 'user';
  const font = size === 'small' ? 'text-label' : 'text-title';
  const content = iconName ? icon(iconName) : text;

  return /* HTML */ `
    <span class="avatar avatar--${size} avatar--${color} ${font}">
      ${content}
    </span>
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
  return ((order - 1) % 10) + 1;
}
