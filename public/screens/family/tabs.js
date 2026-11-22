/**
 * @file Notices screen tabs: turns the family's children into one tab per
 * child. It is pure (no Firebase, no browser) so it can be tested in Node.
 */

/** @typedef {import('../../js/session.js').Child} Child */

/**
 * One tab of the notices screen. The parent sees the child's name, not the
 * group (`7-1` tells them little); the screen uses `groupId` to ask for the
 * notices.
 * @typedef {object} NoticeTab
 * @property {string} id - The child's id, so each tab has a stable key.
 * @property {string} label - The child's first name, e.g. `Ana` for `Ana Reyes`; the full name does not fit in a tab.
 * @property {string} initial
 * @property {string} groupId - Group whose notices the tab shows, e.g. `'7-1'`.
 */

/**
 * Builds the notices screen tabs, one per child, in the same order as
 * `children`. Even with a single child it returns one tab: seeing the
 * child's name is nice for the parent; the screen decides whether to draw
 * real tabs (two or more) or just the name (one).
 * @param {Child[]} children - The family's children.
 * @returns {NoticeTab[]} The tabs; empty if there are no children.
 */
export function getNoticeTabs(children) {
  return children.map((child) => {
    const [firstName] = child.name.split(' ');
    const initial = firstName.slice(0, 1);

    return {
      id: child.id,
      label: firstName,
      initial,
      groupId: child.groupId,
    };
  });
}
