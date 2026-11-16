# 0008. Session with an adapter: Firebase today, PHP tomorrow

- **Date:** 2026-11-13
- **Status:** accepted

## Context

Login will be done with Firebase, but later Balam will have a PHP backend. The change must not force us to rewrite the screens, the components or the router.

We also had to decide what the accounts look like. The conditions that mattered:

- The student has no phone: the account lives on the parent's phone, and a parent can have several children in the class.
- Many parents do not use email, or do not remember it.
- Only the families of the class get in: there is no open sign-up.
- Mobile data and Firestore reads must be saved.

## Decision

**The accounts:** one account per family, with its children inside. The teacher creates the accounts and hands out on paper, at the start of the year, a username (e.g. `perez.familia`) and a password. If someone loses it, they go to the school and the teacher generates a new password; the old one stops working. Passwords do not expire.

**The session and the adapter:** the rest of the app only imports `js/session.js`. That file hands what touches the server to an adapter (`js/firebase/session-adapter.js` today, `js/php/session-adapter.js` tomorrow). Only the `js/firebase/` folder imports Firebase.

The work is split like this:

- **The adapter only talks to the server.** Every adapter fulfills this contract:

  ```js
  hasSession(); // → Promise<boolean>, with no internet or reads
  logIn(username, password); // → Promise<Family>, or SessionError
  logOut(); // → Promise<void>
  ```

- **`session.js` owns the phone.** It stores the family in `localStorage` on login, reads it when the app opens and removes it on logout. What it offers the app:

  ```js
  getSession(); // → Promise<Family | null>
  logIn(username, password); // → Promise<Family>, or SessionError
  logOut(); // → Promise<void>
  ```

  This way, storing on the phone is written only once, and not in every adapter.

- **`js/family.js` is the customs checkpoint.** `toFamily` validates and cleans everything that claims to be a family, whether it comes from the server or from the phone. It is pure, so it can be tested in Node.

Also:

- `Family` is a type of our own (`username` and `children`, each child with `id`, `name` and `grade`). Firebase's `User` is never returned.
- `SessionError` is an error of our own with a type (`'wrong-credentials'`, `'offline'`…), so the login screen shows the right message without knowing Firebase's or PHP's errors. Each adapter translates its own errors (Firebase does it in `js/firebase/errors.js`).
- **The session says who you are, not everything you have.** `logIn` reads the family document only once, and `session.js` stores the children list on the phone. `getSession` does not query Firestore. The data of each screen (grades, notices) is requested by the screen, through another adapter that will be designed when needed.
- If the stored family is damaged or comes from an old version of the app, `getSession` logs out and returns `null`: the parent goes back to the login instead of getting stuck.
- The child the parent is viewing is a preference stored on the phone, not part of the session.

## Alternatives considered

- **Use Firebase directly in the screens:** faster today, but the move to PHP would touch every file.
- **One account per student:** with siblings you would have to switch accounts, and Firebase handles only one session at a time.
- **A one-time code that expires in a month:** Firebase does not offer it. It would have to be built with Cloud Functions, which needs the paid plan.
- **Log in with the student's ID number:** it is not secret (it appears on many documents) and it is sensitive data about a minor that is better not stored.
- **Recover the account with a form and a photo of the student:** photos of minors would have to be stored and checked by hand. Going to the school is simpler and safer.
- **Reset the password from the Firebase console:** the console sends an email, and these accounts use a made-up email (`username@balam.local`) that never receives it. Passwords are changed with a local script that uses the Firebase Admin SDK, which is free.

## Consequences

**We gain:**

- Moving to PHP means writing `js/php/session-adapter.js`, changing one line in `session.js` and deleting the `js/firebase/` folder.
- Family validation and phone handling are not repeated when migrating: adapters only bring the data.
- The session persists on the phone, as in WhatsApp: the parent logs in only once.
- Opening the app costs no Firestore reads.
- Username and password is the most standard model in PHP: the migration does not change the parents' experience.

**We accept:**

- One more layer of code: the adapter translates data and errors.
- A circular import: `session.js` imports the adapter and the adapter imports `SessionError` from `session.js`. It works because `SessionError` is only used inside functions, but it must be kept in mind when moving code.
- If the teacher adds a child to a family, the phone does not find out until the list is refreshed (how is still to be decided).
- Accounts cannot be created from the app: they are created with a script on the teacher's computer.
- Mom and dad share the same account if each has their own phone.

**Revisit the decision if:** Balam opens to other schools (accounts could not depend on a single teacher), or if passkeys are added, which change how login works but not the contract.
