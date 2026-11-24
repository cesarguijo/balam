/**
 * @typedef {object} NavItem
 * @property {string} href
 * @property {import("../../js/icons").IconName} icon
 * @property {string} label
 */

import { icon } from '../../js/icons.js';

/**
 * @param {NavItem[]} items
 * @returns {string}
 */
export function drawNavbar(items) {
  const links = items.map((item) => {
    const isActive = item.href === location.hash;
    return /* HTML */ `
      <a
        class="nav-bar__item ${isActive ? 'nav-bar__item_active' : ''}"
        href="${item.href}"
        ${isActive ? 'aria-current="page"' : ''}
      >
        <span class="nav-bar__icon">${icon(item.icon)}</span>
        ${item.label}
      </a>
    `;
  });

  return `<nav class="nav-bar">${links.join('')}</nav>`;
}
