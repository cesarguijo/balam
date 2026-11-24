/**
 * @file Firestore rules tests: check who can read and write families and
 * notices, against the Firestore emulator.
 *
 * They do not run with `npm test`, because they need the emulator on. Run
 * them with `npm run test:rules`, which starts the emulator, runs this
 * folder and stops it.
 */

import { readFileSync } from 'node:fs';
import { after, afterEach, before, describe, test } from 'node:test';
import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
} from '@firebase/rules-unit-testing';
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';

/** @type {import('@firebase/rules-unit-testing').RulesTestEnvironment} */
let testEnv;

before(async () => {
  testEnv = await initializeTestEnvironment({
    // A project id starting with `demo-` tells Firebase it is not a real
    // project, so a mistake can never touch the real data.
    projectId: 'demo-balam',
    // Loads the rules from the file, not from the console, so the tests
    // check exactly what `firebase deploy` would publish.
    firestore: { rules: readFileSync('firestore.rules', 'utf8') },
  });
});

// Each test starts with an empty database, so one test's data cannot make
// another pass by accident.
afterEach(async () => {
  await testEnv.clearFirestore();
});

after(async () => {
  await testEnv.cleanup();
});

/**
 * Saves documents skipping the rules, the way the Admin SDK script does.
 * The tests use it to prepare the data before checking the rules.
 * @param {Record<string, object>} documents - Path → data, e.g. `{ 'families/ana': { ... } }`.
 * @returns {Promise<void>} Fulfills when every document is saved.
 */
async function seed(documents) {
  await testEnv.withSecurityRulesDisabled(async (context) => {
    const db = context.firestore();
    for (const [path, data] of Object.entries(documents)) {
      await setDoc(doc(db, path), data);
    }
  });
}

/**
 * A server with two families, one teacher, one notice per group and one
 * notice for both groups: 'ana' is in 7-1, 'luis' in 9-2 and the teacher
 * 'teacher' only teaches 7-1.
 * @returns {Promise<void>} Fulfills when everything is saved.
 */
async function seedSchool() {
  await seed({
    'families/ana': { username: 'ana', children: [], groupIds: ['7-1'] },
    'families/luis': { username: 'luis', children: [], groupIds: ['9-2'] },
    'teachers/teacher': { groupIds: ['7-1'] },
    'notices/notice71': notice(['7-1']),
    'notices/notice92': notice(['9-2']),
    'notices/shared': notice(['7-1', '9-2']),
  });
}

/**
 * Builds a notice with the shape the notices adapter saves.
 * @param {string[]} groupIds - The groups it is for, e.g. `['7-1', '8-2']`.
 * @returns {object} The notice data.
 */
function notice(groupIds) {
  return {
    text: 'Classes suspended',
    groupIds,
    authorUid: 'teacher',
    createdAt: new Date(),
    updatedAt: null,
  };
}

/**
 * Returns the Firestore of a fake user signed in with that uid.
 * @param {string} uid - E.g. 'ana' or 'teacher'.
 * @returns {ReturnType<ReturnType<RulesTestEnvironment['authenticatedContext']>['firestore']>} Their Firestore.
 */
function signedIn(uid) {
  return testEnv.authenticatedContext(uid).firestore();
}

/** @typedef {import('@firebase/rules-unit-testing').RulesTestEnvironment} RulesTestEnvironment */

describe('families', () => {
  // Complete example: read it, then follow the same pattern in the TODOs.
  test('A family reads its own document', async () => {
    // 1. Prepare: the data that already exists on the server.
    await seed({
      'families/ana': { username: 'ana', children: [], groupIds: ['7-1'] },
    });
    // 2. Act as someone: a fake user signed in with uid 'ana'.
    const db = testEnv.authenticatedContext('ana').firestore();
    // 3. Check: the rules must allow it (assertSucceeds) or refuse it
    //    (assertFails).
    await assertSucceeds(getDoc(doc(db, 'families/ana')));
  });

  test("A family cannot read another family's document", async () => {
    await seedSchool();
    await assertFails(getDoc(doc(signedIn('ana'), 'families/luis')));
  });

  test('Without a session nobody reads a family', async () => {
    await seedSchool();
    const db = testEnv.unauthenticatedContext().firestore();
    await assertFails(getDoc(doc(db, 'families/ana')));
  });

  test('A family cannot write its own document', async () => {
    await seedSchool();
    await assertFails(
      setDoc(doc(signedIn('ana'), 'families/ana'), { groupIds: ['9-2'] }),
    );
  });
});

describe('notices: read', () => {
  test('A family reads a notice of its group', async () => {
    await seedSchool();
    await assertSucceeds(getDoc(doc(signedIn('ana'), 'notices/notice71')));
  });

  test('A family cannot read a notice of another group', async () => {
    await seedSchool();
    await assertFails(getDoc(doc(signedIn('ana'), 'notices/notice92')));
  });

  test('Both families read a notice for both of their groups', async () => {
    await seedSchool();
    await assertSucceeds(getDoc(doc(signedIn('ana'), 'notices/shared')));
    await assertSucceeds(getDoc(doc(signedIn('luis'), 'notices/shared')));
  });

  // The rules use `hasAny` and the screen asks with `array-contains`:
  // Firestore must accept that the query only returns allowed notices.
  test("A family asks for its group's notices", async () => {
    await seedSchool();
    const notices = collection(signedIn('ana'), 'notices');
    await assertSucceeds(
      getDocs(query(notices, where('groupIds', 'array-contains', '7-1'))),
    );
  });

  test("A family cannot ask for another group's notices", async () => {
    await seedSchool();
    const notices = collection(signedIn('ana'), 'notices');
    await assertFails(
      getDocs(query(notices, where('groupIds', 'array-contains', '9-2'))),
    );
  });

  test('A teacher reads a notice of one of their groups', async () => {
    await seedSchool();
    await assertSucceeds(getDoc(doc(signedIn('teacher'), 'notices/notice71')));
  });

  test('A teacher cannot read a notice of another group', async () => {
    await seedSchool();
    await assertFails(getDoc(doc(signedIn('teacher'), 'notices/notice92')));
  });

  test('Without a session nobody reads a notice', async () => {
    await seedSchool();
    const db = testEnv.unauthenticatedContext().firestore();
    await assertFails(getDoc(doc(db, 'notices/notice71')));
  });

  test('A user with no family and no teacher document reads nothing', async () => {
    await seedSchool();
    await assertFails(getDoc(doc(signedIn('stranger'), 'notices/notice71')));
  });
});

describe('notices: write', () => {
  test('A teacher creates a notice in one of their groups', async () => {
    await seedSchool();
    await assertSucceeds(
      setDoc(doc(signedIn('teacher'), 'notices/new'), notice(['7-1'])),
    );
  });

  test('A teacher cannot create a notice in another group', async () => {
    await seedSchool();
    await assertFails(
      setDoc(doc(signedIn('teacher'), 'notices/new'), notice(['9-2'])),
    );
  });

  test('A teacher cannot create a notice with one group that is not theirs', async () => {
    await seedSchool();
    await assertFails(
      setDoc(doc(signedIn('teacher'), 'notices/new'), notice(['7-1', '9-2'])),
    );
  });

  test('A teacher cannot create a notice without groups', async () => {
    await seedSchool();
    await assertFails(
      setDoc(doc(signedIn('teacher'), 'notices/new'), notice([])),
    );
  });

  test('A family cannot create a notice', async () => {
    await seedSchool();
    await assertFails(
      setDoc(doc(signedIn('ana'), 'notices/new'), notice(['7-1'])),
    );
  });

  test('A teacher updates a notice of their group', async () => {
    await seedSchool();
    await assertSucceeds(
      updateDoc(doc(signedIn('teacher'), 'notices/notice71'), {
        text: 'Classes resume on Monday',
      }),
    );
  });

  test('A teacher cannot move a notice to a group that is not theirs', async () => {
    await seedSchool();
    await assertFails(
      updateDoc(doc(signedIn('teacher'), 'notices/notice71'), {
        groupIds: ['9-2'],
      }),
    );
  });

  test('A teacher cannot update a notice of another group', async () => {
    await seedSchool();
    await assertFails(
      updateDoc(doc(signedIn('teacher'), 'notices/notice92'), {
        text: 'Changed',
      }),
    );
  });

  test('A teacher cannot leave a notice without groups', async () => {
    await seedSchool();
    await assertFails(
      updateDoc(doc(signedIn('teacher'), 'notices/notice71'), {
        groupIds: [],
      }),
    );
  });

  test('A teacher cannot update a notice that also goes to another group', async () => {
    await seedSchool();
    await assertFails(
      updateDoc(doc(signedIn('teacher'), 'notices/shared'), {
        text: 'Changed',
      }),
    );
  });

  test('A family cannot update a notice of its group', async () => {
    await seedSchool();
    await assertFails(
      updateDoc(doc(signedIn('ana'), 'notices/notice71'), { text: 'Changed' }),
    );
  });

  test('A teacher deletes a notice of their group', async () => {
    await seedSchool();
    await assertSucceeds(
      deleteDoc(doc(signedIn('teacher'), 'notices/notice71')),
    );
  });

  test('A teacher cannot delete a notice of another group', async () => {
    await seedSchool();
    await assertFails(deleteDoc(doc(signedIn('teacher'), 'notices/notice92')));
  });

  test('A teacher cannot delete a notice that also goes to another group', async () => {
    await seedSchool();
    await assertFails(deleteDoc(doc(signedIn('teacher'), 'notices/shared')));
  });

  test('A family cannot delete a notice of its group', async () => {
    await seedSchool();
    await assertFails(deleteDoc(doc(signedIn('ana'), 'notices/notice71')));
  });
});
