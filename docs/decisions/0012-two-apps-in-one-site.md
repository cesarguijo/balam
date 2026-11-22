# 0012. Two apps in one site: families and teachers

- **Date:** 2026-11-22
- **Status:** accepted

## Context

Balam needs screens for teachers (publishing notices, groups). They are different screens from the families' ones; the two only share the data (Firestore, ADR 0010). Families should never download teacher screens, and each kind of user should install only their own app.

For now only one teacher (the author) uses the teacher side. The app is not in production yet, so the URLs can still change without migrating anyone. The project has no bundler (ADR 0001), so shared code must be served as it is.

## Decision

Two PWAs in the same Firebase site and the same repository, each in its own folder with its own manifest, service worker and scope. What both use stays at the root of `public/`.

```
public/
  css/  fonts/  img/  components/   → shared
  js/                               → shared logic, adapters, generic router
    i18n/                           → shared catalog (common texts)
  families/                         → index.html, manifest.json, sw.js, app.js, screens/, i18n/
  teachers/                         → index.html, manifest.json, sw.js, app.js, screens/, i18n/
tests/                              → shared; families/ and teachers/ for each app
```

- **Root:** `/` redirects to `/families/` with a `redirect` in `firebase.json`.
- **Manifests:** each one sets its own `id` (`/families/`, `/teachers/`), name and icon, so they look different on the home screen.
- **Service workers:** each one has its own cache name (`balam-families-…`, `balam-teachers-…`) and only precaches its own files plus the shared ones it uses.
- **Router:** `js/router.js` becomes generic; each `app.js` passes its own route table. The welcome screen (ADR 0011) is only for families; the teacher app opens on the login.
- **Sessions:** `connection.js` exports `connect(name)` instead of creating one connection. Each app calls it once with its own name, so Firebase keeps each session apart even in the same browser. The adapters stay shared and receive the connection.
- **Texts (ADR 0009):** three catalogs: the shared one in `js/i18n/` and one in each app.
- **Login:** each app has its own login screen. Both use a shared `<login-form>` component: it owns the fields, validation and the loading and error states, and fires a `login-submit` event with the username and password. Each screen decides what to do with it (for example, check that `teachers/{uid}` exists) and passes errors back through an attribute.
- **Users:** everyone, families and teachers, logs in with a username. Password recovery is a separate decision.
- **Security** stays in the Firestore rules: the teacher app only checks `teachers/{uid}` to show the right message.

## Alternatives considered

- **One PWA with roles:** one icon for everyone, and the teacher screens live inside the families' app.
- **`/` for families and `/maestros/` for teachers:** the families' scope would contain the teachers' one.
- **Two Hosting sites in the same project:** each site only serves its own folder, so without a bundler the shared code would have to be copied by a script.
- **Two Firebase projects:** two Auth user lists, the notices would live in the other project, and everything shared would be duplicated by hand.
- **APK (TWA on Play Store):** only Android, and its advantages are about distribution and trust, which one teacher does not need. It can wrap the teacher app later without changing this decision.
- **A "Soy maestro" switch in the families' login, or detecting the role after login:** both put teacher code in the families' app, and a switch protects nothing.
- **Custom claims for the role:** they need the Admin SDK for every teacher; worth it only with many teachers.
- **One login screen with an `if` per role:** harder to read and to test than one small screen per app around a shared form.
- **One i18n catalog:** families would cache the teachers' texts.

## Consequences

**We gain:**

- Families only download and install their app; the teacher only installs theirs.
- Shared code is written, fixed and tested once, without a build step, and one `firebase deploy` publishes both.
- A change only in `teachers/` does not affect families, and the other way around.
- The structure works with any backend later: the login per app and the role check on the server stay the same idea.

**We accept:**

- Moving the current screens, `index.html`, `manifest.json` and `sw.js` into `families/`, and splitting `router.js`, `connection.js` and the catalog.
- A change in shared code can break both apps.
- The families' URL becomes `/families/` (the root redirects there). Live Server does not read `firebase.json`, so locally we open `/families/` directly.
- `npm test` must also find the tests in `tests/families/` and `tests/teachers/`, without including `tests/rules/`.

**Revisit the decision if:** the teacher app needs its own domain (move to two Hosting sites, adding a copy step) or many teachers use it (custom claims, Play Store).
