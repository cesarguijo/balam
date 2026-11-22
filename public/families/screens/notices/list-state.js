/**
 * @file Notices list state: tells the screen what to draw from what it has
 * so far (nothing, a list or an error). It is pure (no Firebase, no
 * browser) so it can be tested in Node.
 */

/** @typedef {import('../../../js/notices.js').Notice} Notice */
/** @typedef {import('../../../js/notices.js').NoticeError} NoticeError */
/** @typedef {import('../../../js/notices.js').RecentNotices} RecentNotices */

/**
 * What the notices list of one tab shows.
 * - `loading`: the notices have not arrived yet (skeleton).
 * - `ready`: there are notices from the server to show.
 * - `cached`: there is no internet, but the copy on the phone has notices;
 *   they may be out of date, so the screen says so.
 * - `empty`: the teacher has not published anything recently.
 * - `offline`: there is no internet and no notices to show (no copy, or
 *   none recent in it); without internet there is no way to know if
 *   there are new ones, so it is not `empty`. The family can retry once
 *   connected.
 * - `error`: anything else; the family cannot fix it, but retrying may work.
 * @typedef {'loading' | 'ready' | 'cached' | 'empty' | 'offline' | 'error'} ListState
 */

/**
 * Returns the state of a notices list. It does not use `instanceof
 * NoticeError`: importing `notices.js` would bring Firebase along and the
 * function could no longer run in Node, so it tells a list from an error by
 * its shape.
 * @param {RecentNotices | NoticeError | undefined} result - What the screen has: `undefined` while waiting, the notices (from the server or the copy), or the error that `getRecentNotices` threw.
 * @returns {ListState} What the list should show.
 */
export function getListState(result) {
  if (result === undefined) return 'loading';
  if ('type' in result) return result.type === 'offline' ? 'offline' : 'error';
  if (result.offline) return result.notices.length > 0 ? 'cached' : 'offline';
  return result.notices.length > 0 ? 'ready' : 'empty';
}
