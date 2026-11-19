/**
 * @file Balam notices: connects the app with the notices service (Firebase
 * today, PHP tomorrow). It is the only thing the screens import for notices;
 * it follows the same pattern as session.js (ADR 0008).
 *
 * Every notice is urgent: the families get a push notification when it is
 * created (never when it is edited). Anything that is not urgent goes in the
 * students' notebooks.
 */

import * as adapter from './firebase/notices-adapter.js';
import { getCutoffDate } from './notice.js';

/**
 * How important a notice is. Both send a push notification.
 * - `urgent`: the family has to know today, e.g. "no classes tomorrow".
 * - `emergency`: the family has to know right now, e.g. "the children
 *   already left". The notification stays on screen until it is touched
 *   (`requireInteraction`, Android and computer only). The card looks the
 *   same as an urgent one: every notice matters, only the push differs.
 * @typedef {'urgent' | 'emergency'} NoticeLevel
 */

/**
 * A notice from the teacher to the families of a group.
 * @typedef {object} Notice
 * @property {string} id - Identifies the notice; used to edit or delete it.
 * @property {string} text - Full text; the first line is the title (see `splitNotice`).
 * @property {NoticeLevel} level - Whether it is urgent or an emergency.
 * @property {Date} createdAt - When it was published; sorts the list and decides whether it is recent.
 * @property {Date | null} updatedAt - When it was last edited, or `null` if never; the card shows "Editado".
 */

/**
 * What the teacher fills in to publish or edit a notice. The rest (dates,
 * group, author) is added by the adapter.
 * @typedef {object} NoticeDraft
 * @property {string} text - Full text; the first line is the title.
 * @property {NoticeLevel} level - Whether it is urgent or an emergency.
 */

/**
 * Notice error types. The screens show a different message for each.
 * - `offline`: there is no internet.
 * - `not-allowed`: the server refused it (e.g. a family trying to publish).
 * - `not-found`: the notice was already deleted, e.g. from another phone.
 * - `unknown`: any other server error.
 * @typedef {'offline' | 'not-allowed' | 'not-found' | 'unknown'} NoticeErrorType
 */

/**
 * Notice error, with its type so the screen knows what to show. The adapters
 * (Firebase, PHP) throw it instead of their own errors.
 */
export class NoticeError extends Error {
  /**
   * @param {NoticeErrorType} type - What went wrong.
   * @param {ErrorOptions} [options] - Extra details, such as the `cause` of the error.
   */
  constructor(type, options) {
    super(`Notice failed: ${type}`, options);
    this.name = 'NoticeError';
    this.type = type;
  }
}

/**
 * Returns the group's notices from the last `RECENT_DAYS` days, newest
 * first. The cutoff date is computed here, not in the adapter, so the rule
 * is not repeated when moving to PHP.
 * @param {string} groupId - The family's group.
 * @returns {Promise<Notice[]>} The recent notices; empty if there are none.
 * @throws {NoticeError} If there is no internet or the server refuses it.
 */
export async function getRecentNotices(groupId) {
  const cutoff = getCutoffDate(new Date());
  return adapter.getNoticesSince(groupId, cutoff);
}

// TODO: decide whether the text is checked before sending (not empty, maximum
// length), with a pure function in notice.js and its tests.
/**
 * Publishes a new notice for the group. Creating it is what sends the push
 * notification to the families.
 * @param {string} groupId - The group the notice is for.
 * @param {NoticeDraft} draft - Text and level typed by the teacher.
 * @returns {Promise<string>} The id of the new notice.
 * @throws {NoticeError} If there is no internet or the account is not the teacher's.
 */
export async function publishNotice(groupId, draft) {
  return adapter.addNotice(groupId, draft);
}

/**
 * Changes the text or the level of a notice. Does not send a new push
 * notification: if the correction is critical, the teacher publishes a new
 * notice instead.
 * @param {string} id - The notice to edit.
 * @param {NoticeDraft} draft - The new text and level.
 * @returns {Promise<void>} Fulfills when the server saved it.
 * @throws {NoticeError} If there is no internet, the notice no longer exists or the account is not the teacher's.
 */
export async function editNotice(id, draft) {
  return adapter.updateNotice(id, draft);
}

/**
 * Deletes a notice for good. The screen asks for confirmation first, because
 * a deleted notice cannot be recovered.
 * @param {string} id - The notice to delete.
 * @returns {Promise<void>} Fulfills when the server deleted it.
 * @throws {NoticeError} If there is no internet or the account is not the teacher's.
 */
export async function deleteNotice(id) {
  return adapter.removeNotice(id);
}
