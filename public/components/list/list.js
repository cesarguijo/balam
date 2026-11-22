/**
 * @file List component: draws a list of rows, each with an optional start
 * (icon or avatar), the main text and an optional end. `list()` draws the
 * `<ul>` and `listItem()` each row inside it. Style-only (no Custom Element).
 */

/**
 * Parts of a row. The tag changes with what the row does, while the look
 * stays the same.
 * @typedef {object} ListItemOptions
 * @property {string} [leading] HTML at the start, such as an icon or an avatar.
 * @property {string} content Main text of the row.
 * @property {string} [trailing] HTML at the end, such as a grade or a switch.
 * @property {'div' | 'button' | 'label' | 'a'} [tag] `div` only shows data,
 * `button` does something when tapped, `label` wraps a switch so tapping
 * anywhere on the row flips it, `a` takes to another page, outside Balam.
 * @property {string} [selector] Data attribute to find the row from the
 * screen's JS, such as `data-account-refresh`.
 * @property {string} [link] Address the row opens, only with `tag: 'a'`.
 * It opens in a new window so the installed app stays open.
 */

/**
 * Draws a row of a list.
 * @param {ListItemOptions} options Parts of the row.
 * @returns {string} HTML of the row.
 */
function listItem({
  leading,
  content,
  trailing,
  tag = 'div',
  selector = '',
  link = '',
}) {
  const item = /* HTML */ `
    <li>
        <${tag} ${tag === 'a' ? `href="${link}" target="_blank" rel="noopener"` : ''} ${selector} class="list-item ${tag === 'button' || tag === 'label' || tag === 'a' ? 'ripple' : ''} ">
          <span class="list-item__leading">${leading}</span>
          <span class="list-item__content">${content}</span>
          ${trailing ? '<span class="list-item__trailing">' + trailing + '</span>' : ``}
        </${tag}>
    </li>
  `;

  return item;
}

/**
 * Draws a list with one row per item. It writes the `<ul>` itself so the
 * `list` class is never forgotten and each `<li>` is always inside a list.
 * @param {ListItemOptions[]} listItems Parts of each row, in order.
 * @returns {string} HTML of the list.
 */
export function list(listItems) {
  let list = `<ul class="list">`;
  listItems.forEach((value) => {
    list += listItem(value);
  });
  list += '</ul>';
  return list;
}
