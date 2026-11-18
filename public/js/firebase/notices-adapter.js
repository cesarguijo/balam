/**
 * @file Firebase notices adapter: fulfills the notices.js contract using
 * Firestore. It only talks to the server; the rules (how many days back,
 * how the title is split) live in notice.js so they are not repeated in
 * each adapter (Firebase today, PHP tomorrow).
 *
 * Each notice is a document in the `notices` collection:
 * - `text` (string): full text; the first line is the title.
 * - `level` ('urgent' | 'emergency').
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

// TODO: remove this line once every function below is implemented; it only
// silences the warnings for the parameters the placeholders do not use yet.
/* eslint-disable no-unused-vars */

import {
  db,
  collection,
  where,
  orderBy,
  query,
  getDocs,
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
 * @throws {NoticeError} If there is no internet or the rules refuse it.
 */
export async function getNoticesSince(groupId, cutoff) {
  // TODO: implement getNoticesSince.
  // - query(collection(db, 'notices'), where('groupId', '==', groupId),
  //   where('createdAt', '>=', cutoff), orderBy('createdAt', 'desc')).
  // - Firestore asks for a composite index (groupId + createdAt) the first
  //   time: the error message brings the link to create it. Save it in
  //   firestore.indexes.json so it is in the repository.
  // - Convert createdAt and updatedAt from Timestamp to Date (.toDate())
  //   before calling toNotice, so notice.js does not know Firebase.
  // - Translate the Firebase errors into NoticeError.
  const noticeQuery = query(
    collection(db, 'notices'),
    where('createdAt', '>=', cutoff),
    where('groupId', '==', groupId),
    orderBy('createdAt', 'desc'),
  );
  return getDocs(noticeQuery)
    .then((querySnapshot) => {
      return querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return toNotice(doc.id, {
          ...data,
          createdAt: data.createdAt.toDate(),
          updatedAt: data.updatedAt ? data.updatedAt.toDate() : data.updatedAt,
        });
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
 * @param {NoticeDraft} draft - Text and level typed by the teacher.
 * @returns {Promise<string>} The id Firestore gave the new notice.
 * @throws {NoticeError} If there is no internet or the rules refuse it.
 */
export async function addNotice(groupId, draft) {
  // TODO: implement addNotice.
  // - addDoc with text, level, groupId, authorUid (auth.currentUser.uid),
  //   createdAt: serverTimestamp() and updatedAt: null.
  // - Return the new document's id.
  throw new Error('Not implemented');
}

/**
 * Saves the new text and level of a notice and marks when it was edited.
 * Does not touch createdAt, groupId or authorUid.
 * @param {string} id - The notice to edit.
 * @param {NoticeDraft} draft - The new text and level.
 * @returns {Promise<void>} Fulfills when Firestore saved it.
 * @throws {NoticeError} If there is no internet, the notice no longer exists or the rules refuse it.
 */
export async function updateNotice(id, draft) {
  // TODO: implement updateNotice.
  // - updateDoc(doc(db, `notices/${id}`), { text, level, updatedAt: serverTimestamp() }).
  // - updateDoc fails with 'not-found' if the notice was deleted.
  throw new Error('Not implemented');
}

/**
 * Deletes a notice from Firestore.
 * @param {string} id - The notice to delete.
 * @returns {Promise<void>} Fulfills when Firestore deleted it.
 * @throws {NoticeError} If there is no internet or the rules refuse it.
 */
export async function removeNotice(id) {
  // TODO: implement removeNotice with deleteDoc(doc(db, `notices/${id}`)).
  throw new Error('Not implemented');
}
