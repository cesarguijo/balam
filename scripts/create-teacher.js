/**
 * @file Teacher creation script: creates (or resets) a teacher account in
 * Firebase Auth and its `teachers/{uid}` document in Firestore, from the
 * teacher's computer.
 *
 * It uses the Admin SDK, which has full permissions, so it only runs here
 * and never ships in `public/`. The private key lives in
 * `scripts/service-account.json`, which is ignored by Git.
 *
 * Usage:
 *   node scripts/create-teacher.js <username> <password> [--homeroom <groupId>] <subject:groupId...>
 * Example:
 *   node scripts/create-teacher.js arguijo secret123 --homeroom 7-1 math:7-1 math:7-2 science:8-1
 * Each class is "subject:grade-section". The subject is lowercase letters
 * (`math`, `science`). The groupId is rebuilt from its numbers, so '07-1'
 * is saved as '7-1' and always matches the families' groupId (ADR 0010).
 * `--homeroom` is optional: only teachers with a homeroom group use it.
 *
 * If the user already exists, it keeps its uid and only changes the
 * password and the teacher document; that way it also works to reset a lost
 * password or to change the teacher's classes.
 */

import { readFileSync } from 'node:fs';
import { initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { validateCredentials } from '../public/components/login-form/validation.js';

/**
 * Domain of the made-up emails. It must match the one in
 * `public/js/firebase/session-adapter.js`, or the app will not find the user.
 */
const EMAIL_DOMAIN = 'balam.local';

const USAGE =
  'Usage: node scripts/create-teacher.js <username> <password> [--homeroom <groupId>] <subject:groupId...>';

const [rawUsername = '', password = '', ...rest] = process.argv.slice(2);

// `--homeroom <groupId>` can go anywhere after the password; it is taken
// out so the rest are only classes.
const homeroomIndex = rest.indexOf('--homeroom');
/** @type {string | null} */
let rawHomeroom = null;
if (homeroomIndex !== -1) {
  rawHomeroom = rest[homeroomIndex + 1] ?? '';
  rest.splice(homeroomIndex, 2);
}
const rawClasses = rest;

// The same check as the login screen: a username the app would reject is
// not created, so no test account is born unusable.
const validation = validateCredentials(rawUsername, password);
if (!validation.valid) {
  console.error(`Invalid credentials: ${validation.error}`);
  process.exit(1);
}
// Firebase Auth rejects passwords shorter than 6 characters.
if (password.length < 6) {
  console.error('The password must have at least 6 characters.');
  process.exit(1);
}
if (rawClasses.length === 0) {
  console.error(USAGE);
  process.exit(1);
}

/**
 * Turns "grade-section" into a clean groupId, or null if it is not valid.
 * Rebuilding it from numbers avoids '07-1' or ' 7-1', which would never
 * match a family's '7-1' in the rules.
 * @param {string} raw Text typed in the command line.
 * @returns {string | null} The groupId, such as '7-1', or null.
 */
function toGroupId(raw) {
  const match = /^(\d+)-(\d+)$/.exec(raw.trim());
  if (match === null) return null;
  const grade = Number(match[1]);
  const section = Number(match[2]);
  if (grade < 1 || grade > 12 || section < 1) return null;
  return `${grade}-${section}`;
}

/**
 * A class the teacher teaches: one subject in one group.
 * @typedef {object} TeacherClass
 * @property {string} id - Subject and group together, e.g. `'math-7-1'`.
 * @property {string} subject - Lowercase subject, e.g. `'math'`.
 * @property {string} groupId - Grade and section, e.g. `'7-1'`.
 */

/** @type {TeacherClass[]} */
const classes = [];
for (const raw of rawClasses) {
  const [subject = '', rawGroupId = ''] = raw.split(':');
  const groupId = toGroupId(rawGroupId);
  if (!/^[a-z]+$/.test(subject) || groupId === null) {
    console.error(
      `Invalid class "${raw}". Use subject:grade-section, e.g. math:7-1.`,
    );
    process.exit(1);
  }
  const id = `${subject}-${groupId}`;
  // A repeated class would show twice in the app.
  if (!classes.some((teacherClass) => teacherClass.id === id)) {
    classes.push({ id, subject, groupId });
  }
}

/** @type {string | null} */
let homeroomGroupId = null;
if (rawHomeroom !== null) {
  homeroomGroupId = toGroupId(rawHomeroom);
  if (homeroomGroupId === null) {
    console.error(
      `Invalid homeroom "${rawHomeroom}". Use grade-section, e.g. 7-1.`,
    );
    process.exit(1);
  }
}

// Repeats the groups as a plain list because the Firestore rules have no
// loops: they cannot search classes[], but they can ask whether a notice's
// groupId is `in` this list. The homeroom group is included so the teacher
// can also send notices to it. A Set drops the repeated groups.
const groupIds = [
  ...new Set([
    ...classes.map((teacherClass) => teacherClass.groupId),
    ...(homeroomGroupId === null ? [] : [homeroomGroupId]),
  ]),
];

const keyUrl = new URL('./service-account.json', import.meta.url);
initializeApp({ credential: cert(JSON.parse(readFileSync(keyUrl, 'utf8'))) });

const username = validation.username;
const email = `${username}@${EMAIL_DOMAIN}`;

/**
 * Creates the Auth user, or changes its password if it already exists.
 * Updating instead of deleting keeps the uid, so `teachers/{uid}` stays
 * linked.
 * @returns {Promise<string>} The user's uid.
 */
async function savePassword() {
  try {
    const user = await getAuth().getUserByEmail(email);
    // A family account must not become a teacher by mistake: with both
    // documents, the same login would read and write notices as a teacher.
    // It is checked before touching the password, so the family's login
    // keeps working.
    const family = await getFirestore().doc(`families/${user.uid}`).get();
    if (family.exists) {
      console.error(
        `${username} is a family account; choose another username for the teacher.`,
      );
      process.exit(1);
    }
    await getAuth().updateUser(user.uid, { password });
    console.log(`User existed; password updated (${user.uid}).`);
    return user.uid;
  } catch (error) {
    if (
      /** @type {{ code?: string }} */ (error).code !== 'auth/user-not-found'
    ) {
      throw error;
    }
    const user = await getAuth().createUser({ email, password });
    console.log(`User created (${user.uid}).`);
    return user.uid;
  }
}

const uid = await savePassword();
// Being in `teachers` is what makes the account a teacher.
await getFirestore()
  .doc(`teachers/${uid}`)
  .set({ classes, homeroomGroupId, groupIds });
console.log(
  `Teacher saved: ${username}, classes ${classes.map((c) => c.id).join(', ')}, homeroom ${homeroomGroupId ?? 'none'}.`,
);
