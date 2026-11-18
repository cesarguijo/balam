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
 *   node scripts/create-teacher.js <username> <password> <groupId...>
 * Example:
 *   node scripts/create-teacher.js arguijo secret123 7-1 8-2
 * Each groupId is "grade-section". It is rebuilt from its numbers, so
 * '07-1' is saved as '7-1' and always matches the families' groupId
 * (ADR 0010).
 *
 * If the user already exists, it keeps its uid and only changes the
 * password and the teacher document; that way it also works to reset a lost
 * password or to change the teacher's groups.
 */

import { readFileSync } from 'node:fs';
import { initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { validateCredentials } from '../public/screens/login/validation.js';

/**
 * Domain of the made-up emails. It must match the one in
 * `public/js/firebase/session-adapter.js`, or the app will not find the user.
 */
const EMAIL_DOMAIN = 'balam.local';

const USAGE =
  'Usage: node scripts/create-teacher.js <username> <password> <groupId...>';

const [rawUsername = '', password = '', ...rawGroupIds] =
  process.argv.slice(2);

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
if (rawGroupIds.length === 0) {
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

/** @type {string[]} */
const groupIds = [];
for (const raw of rawGroupIds) {
  const groupId = toGroupId(raw);
  if (groupId === null) {
    console.error(`Invalid groupId "${raw}". Use grade-section, e.g. 7-1.`);
    process.exit(1);
  }
  // A repeated group would not break the rules, but it is noise in the data.
  if (!groupIds.includes(groupId)) groupIds.push(groupId);
}

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
// Being in `teachers` is what makes the account a teacher, so the document
// only needs the groups the rules check.
await getFirestore().doc(`teachers/${uid}`).set({ groupIds });
console.log(`Teacher saved: ${username}, groups ${groupIds.join(', ')}.`);
