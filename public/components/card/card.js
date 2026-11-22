/**
 * @file Card component: draws the white box that groups related content.
 * Style-only (no Custom Element).
 */

/**
 * Draws a card around the given content. The card only sets the box
 * (background, border, corners, padding); what goes inside is up to
 * each screen.
 * @param {string} content HTML to show inside the card.
 * @param {'borderless'} [variant] Look of the card; without it, the card
 * has a border. Borderless suits content to read, such as notices.
 * @returns {string} HTML of the card.
 */
export function card(content, variant) {
  if (variant) {
    return /* HTML */ ` <div class="card card--${variant}">${content}</div> `;
  }
  return /* HTML */ ` <div class="card">${content}</div> `;
}
