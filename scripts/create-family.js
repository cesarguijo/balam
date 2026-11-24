/**
 * @file Family creation script: creates (or resets) a test family in
 * Firebase Auth and Firestore from the teacher's computer, because the
 * Firebase console cannot set a password by hand.
 *
 * It uses the Admin SDK, which has full permissions, so it only runs here
 * and never ships in `public/`. The private key lives in
 * `scripts/service-account.json`, which is ignored by Git.
 *
 * Usage:
 *   node scripts/create-family.js <username> <password> <childName> <grade> <section>
 * Example:
 *   node scripts/create-family.js perez1985 secret123 Ana 7 1
 * The child's groupId is built from grade and section ('7-1'), so the two
 * can never disagree (ADR 0010).
 *
 * If the user already exists, it keeps its uid and only changes the
 * password and the family document; that way it also works to reset a lost
 * password.
 */

import { readFileSync } from 'node:fs';
import { randomUUID } from 'node:crypto';
import { initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { validateCredentials } from '../public/components/login-form/validation.js';

/**
 * Domain of the made-up emails. It must match the one in
 * `public/js/firebase/session-adapter.js`, or the app will not find the user.
 */
const EMAIL_DOMAIN = 'balam.local';

const [
  rawUsername = '',
  password = '',
  childName = '',
  rawGrade = '',
  rawSection = '',
] = process.argv.slice(2);

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
const grade = Number(rawGrade);
const section = Number(rawSection);
if (
  childName === '' ||
  !Number.isInteger(grade) ||
  grade < 1 ||
  grade > 12 ||
  !Number.isInteger(section) ||
  section < 1
) {
  console.error(
    'Usage: node scripts/create-family.js <username> <password> <childName> <grade> <section>',
  );
  process.exit(1);
}

const keyUrl = new URL('./service-account.json', import.meta.url);
initializeApp({ credential: cert(JSON.parse(readFileSync(keyUrl, 'utf8'))) });

const username = validation.username;
const email = `${username}@${EMAIL_DOMAIN}`;

/**
 * Creates the Auth user, or changes its password if it already exists.
 * Updating instead of deleting keeps the uid, so `families/{uid}` stays
 * linked.
 * @returns {Promise<string>} The user's uid.
 */
async function savePassword() {
  try {
    const user = await getAuth().getUserByEmail(email);
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
const groupId = `${grade}-${section}`;
await getFirestore()
  .doc(`families/${uid}`)
  .set({
    username,
    children: [
      {
        id: randomUUID(),
        name: childName,
        grade,
        groupId,
      },
    ],
    // Repeats each child's groupId as a plain list because the Firestore
    // rules have no loops: they cannot search children[], but they can ask
    // whether a notice's groupId is `in` this list.
    groupIds: [groupId],
  });
console.log(
  `Family saved: ${username} / ${childName}, grade ${grade}, ${groupId}.`,
);
