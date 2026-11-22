/**
 * @file Menu component: shows a ⋮ button that opens a panel of options.
 */

import { icon } from '../../js/icons.js';

/** @typedef {import('../../js/icons.js').IconName} IconName */

/**
 * One option of the menu.
 * @typedef {object} BalamMenuItem
 * @property {IconName} [icon] - Name of the icon drawn before the text.
 * @property {string} text - Visible text, already translated with t().
 * @property {() => void} [action] - What tapping the option does. Optional,
 *   so an option without it does nothing when tapped.
 */

/**
 * `<balam-menu>`: a ⋮ button and the panel it opens. The options come from
 * the `items` property, since an array cannot travel in an attribute.
 */
export class BalamMenu extends HTMLElement {
  /**
   * Options of the menu. Starts empty so the menu can be drawn even
   * before someone sets `items`.
   * @type {BalamMenuItem[]}
   */
  #items = [];

  /**
   * Draws the button and the panel when the element enters the page, and
   * wires the clicks of both.
   */
  connectedCallback() {
    this.innerHTML = /* HTML */ `
      <button data-trigger class="menu__trigger ripple icon-button">
        ${icon('dots-vertical')}
      </button>
      <div popover class="menu__panel">
        <ul data-menu-list>
          ${this.#drawItems()}
        </ul>
      </div>
    `;

    const trigger = this.querySelector('[data-trigger]');
    if (!(trigger instanceof HTMLButtonElement)) {
      throw new Error('[data-trigger] not found');
    }

    const panel = this.querySelector('[popover]');
    if (!(panel instanceof HTMLElement)) {
      throw new Error('[popover] not found');
    }

    trigger.popoverTargetElement = panel;

    const list = this.querySelector('[data-menu-list]');
    if (!(list instanceof HTMLElement)) {
      throw new Error('[data-menu-list] not found');
    }

    // One listener on the list instead of one per option (event
    // delegation): it keeps working when the setter redraws the options.
    list.addEventListener('click', (event) => {
      if (!(event.target instanceof Element)) return;
      // The tap may land on the icon or the text, so climb to the option
      const button = event.target.closest('.menu__item');
      // A tap on the list but outside every option
      if (!(button instanceof HTMLButtonElement)) return;
      // data-index is text; it points to the option in #items
      const item = this.#items[Number(button.dataset.index)];
      // Closed before the action, as any menu does, so it is not left open
      // behind the browser's install dialog or the next screen.
      panel.hidePopover();
      if (item.action) {
        item.action();
      }
    });
  }

  /**
   * Sets the options of the menu and redraws them if the menu is already
   * on the page. It is a property, not an attribute, because attributes
   * can only hold text.
   * @param {BalamMenuItem[]} value - The options, in display order.
   * @throws {Error} If value is not an array or an option has no text.
   */
  set items(value) {
    if (!Array.isArray(value)) {
      throw new Error('items has to be an array');
    }

    value.forEach((item, index) => {
      if (!('text' in item)) {
        throw new Error('item ' + index + 'does no have the property text');
      }
    });

    this.#items = value;
    // Not on the page yet: connectedCallback will draw them when it enters
    if (!this.isConnected) return;
    const list = this.querySelector('[data-menu-list]');
    // TODO: check list with instanceof and throw if missing, as in
    // connectedCallback.

    if (!(list instanceof HTMLElement)) {
      throw new Error('[data-menu-list] not found');
    }
    list.innerHTML = this.#drawItems();
  }

  /**
   * Draws one `<li>` with its button per option.
   * @returns {string} HTML of the options.
   */
  #drawItems() {
    let htmlItems = ``;
    this.#items.forEach((item, index) => {
      htmlItems += /* HTML */ `
        <li>
          <button data-index="${index}" class="menu__item text-body ripple">
            <span class="menu__icon-container">
              ${item.icon ? icon(item.icon) : ''}
            </span>
            ${item.text}
          </button>
        </li>
      `;
    });
    return htmlItems;
  }
}

customElements.define('balam-menu', BalamMenu);
