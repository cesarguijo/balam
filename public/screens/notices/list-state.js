/**
 * @file Notices list state: tells the screen what to draw from what it has
 * so far (nothing, a list or an error). It is pure (no Firebase, no
 * browser) so it can be tested in Node.
 */

/** @typedef {import('../../js/notices.js').Notice} Notice */
/** @typedef {import('../../js/notices.js').NoticeError} NoticeError */

/**
 * What the notices list of one tab shows.
 * - `loading`: the notices have not arrived yet (skeleton).
 * - `ready`: there are notices to show.
 * - `empty`: the teacher has not published anything recently.
 * - `offline`: there is no internet; the family can retry once connected.
 * - `error`: anything else; the family cannot fix it, but retrying may work.
 * @typedef {'loading' | 'ready' | 'empty' | 'offline' | 'error'} ListState
 */

/**
 * Returns the state of a notices list. It does not use `instanceof
 * NoticeError`: importing `notices.js` would bring Firebase along and the
 * function could no longer run in Node, so it tells a list from an error by
 * its shape.
 * @param {Notice[] | NoticeError | undefined} result - What the screen has: `undefined` while waiting, the notices, or the error that `getRecentNotices` threw.
 * @returns {ListState} What the list should show.
 */
export function getListState(result) {
  if (result === undefined) return 'loading';
  if (Array.isArray(result)) {
    if (result.length === 0) return 'empty';
    return 'ready';
  }
  if (result.type === 'offline') return 'offline';
  return 'error';
}
