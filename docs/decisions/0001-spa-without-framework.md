# 0001. SPA in plain JavaScript, without a framework

- **Date:** 2026-11-10
- **Status:** accepted

## Context

Balam will be used on low-end Android phones, with little memory and often on slow mobile data. The project is also a learning process: its author wants to master the fundamentals of the web.

## Decision

Balam is a single-page application (SPA) written in **plain JavaScript**, with modules (`import` / `export`):

- A single `index.html` with a `<main id="app">` container.
- Each screen lives in `screens/<name>/` and exports a function that draws it in `#app`.
- `js/router.js` decides which screen to show from the address, using the **hash** (`#/home`, `#/welcome`).

## Alternatives considered

- **A framework (React, Vue):** it adds 30 to 45 KB that the phone must download and run before showing anything, and it hides the fundamentals we want to learn.
- **A small framework (Lit, Preact):** light, but unnecessary while the screens stay simple.
- **A site with several HTML pages:** every screen change reloads everything and feels less like an app.
- **Routes without a hash (History API):** cleaner addresses, but Firebase and the service worker must be set up to always serve `index.html`.

## Consequences

- The first load is minimal and the app runs well on simple phones.
- Keeping the screen in sync with the data is up to our own code.
- If the teacher's panel or the parents' view become hard to maintain, **Lit** or **Preact** will be evaluated: they are built on web standards and do not force us to throw away what exists.
