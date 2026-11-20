/**
 * @file Firebase notices adapter: fulfills the notices.js contract using
 * Firestore. It only talks to the server; the rules (how many days back,
 * how the title is split) live in notice.js so they are not repeated in
 * each adapter (Firebase today, PHP tomorrow).
 *
 * Each notice is a document in the `notices` collection:
 * - `text` (string): full text; the first line is the title.
 * - `groupId` (string): the group it is for; the Firestore rules use it so
 *   each family reads only its group's notices.
 * - `authorUid` (string): who published it.
 * - `createdAt` (Timestamp): set by the server, not the phone, so a phone
 *   with the wrong clock cannot change the order.
 * - `updatedAt` (Timestamp | null): set by the server when it is edited.
 *
 * Creating a document is what triggers the Cloud Function that sends the
 * push notification (Sprint 2); editing does not.
 */

import {
  db,
  collection,
  where,
  orderBy,
  query,
  getDocs,
  addDoc,
  serverTimestamp,
  auth,
  updateDoc,
  deleteDoc,
  doc,
} from './connection.js';

// Circular import on purpose: notices.js imports this file and this one
// imports NoticeError from notices.js. It works because NoticeError is only
// used inside the functions, when both modules have finished loading.
import { NoticeError } from '../notices.js';
import { toNotice } from '../notice.js';
import { translateNoticeError } from './errors.js';

/** @typedef {import('../notices.js').Notice} Notice */
/** @typedef {import('../notices.js').NoticeDraft} NoticeDraft */

/**
 * Reads the group's notices created on or after the cutoff date, newest
 * first.
 * @param {string} groupId - The family's group.
 * @param {Date} cutoff - Oldest creation date to read; computed by notices.js.
 * @returns {Promise<Notice[]>} The notices, already validated by `toNotice`.
 *   A damaged notice is skipped (and logged), so it does not hide the rest.
 * @throws {NoticeError} If there is no internet or the rules refuse it.
 */
export async function getNoticesSince(groupId, cutoff) {
  const noticeQuery = query(
    collection(db, 'notices'),
    where('createdAt', '>=', cutoff),
    where('groupId', '==', groupId),
    orderBy('createdAt', 'desc'),
  );
  return getDocs(noticeQuery)
    .then((querySnapshot) => {
      return querySnapshot.docs.flatMap((doc) => {
        const data = doc.data();
        try {
          return [
            toNotice(doc.id, {
              ...data,
              createdAt: data.createdAt.toDate(),
              updatedAt: data.updatedAt
                ? data.updatedAt.toDate()
                : data.updatedAt,
            }),
          ];
        } catch (error) {
          console.warn(doc.id, error);
          return [];
        }
      });
    })
    .catch((error) => {
      throw new NoticeError(translateNoticeError(error.code), {
        cause: error,
      });
    });
}

/**
 * Creates a notice with the server's date and the teacher as author.
 * @param {string} groupId - The group the notice is for.
 * @param {NoticeDraft} draft - Text typed by the teacher.
 * @returns {Promise<string>} The id Firestore gave the new notice.
 * @throws {NoticeError} If there is no internet or the rules refuse it.
 */
export async function addNotice(groupId, draft) {
  const docNotice = {
    text: draft.text,
    groupId,
    authorUid: auth.currentUser.uid,
    createdAt: serverTimestamp(),
    updatedAt: null,
  };

  return addDoc(collection(db, 'notices'), docNotice)
    .then((data) => {
      return data.id;
    })
    .catch((error) => {
      throw new NoticeError(translateNoticeError(error.code), {
        cause: error,
      });
    });
}

/**
 * Saves the new text of a notice and marks when it was edited.
 * Does not touch createdAt, groupId or authorUid.
 * @param {string} id - The notice to edit.
 * @param {NoticeDraft} draft - The new text.
 * @returns {Promise<void>} Fulfills when Firestore saved it.
 * @throws {NoticeError} If there is no internet, the notice no longer exists or the rules refuse it.
 */
export async function updateNotice(id, draft) {
  const noticeRef = doc(db, 'notices', id);
  return updateDoc(noticeRef, {
    text: draft.text,
    updatedAt: serverTimestamp(),
  }).catch((error) => {
    throw new NoticeError(translateNoticeError(error.code), {
      cause: error,
    });
  });
}

/**
 * Deletes a notice from Firestore.
 * @param {string} id - The notice to delete.
 * @returns {Promise<void>} Fulfills when Firestore deleted it.
 * @throws {NoticeError} If there is no internet or the rules refuse it.
 */
export async function removeNotice(id) {
  const noticeRef = doc(db, 'notices', id);
  return deleteDoc(noticeRef).catch((error) => {
    throw new NoticeError(translateNoticeError(error.code), {
      cause: error,
    });
  });
}
