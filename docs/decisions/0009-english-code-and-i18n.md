# 0009. Code and docs in English, user-facing text through i18n

- **Date:** 2026-11-15
- **Status:** accepted

## Context

Balam was written in Spanish: identifiers, folders, CSS classes, JSDoc, commits and documentation. The app's users (families and students in Honduras) read Spanish, and for now the app will only be shown in Spanish.

English is the industry standard for source code. It makes the project readable for any developer, reviewer or recruiter, and opens the door to outside contributions. The question was how to move the code to English without the user seeing English, and without mixing the two languages in the same files.

## Decision

**Code, comments and project docs are written in English. Every text the user sees lives in a message catalog, outside the code.**

| What                                                                 | Language                                        |
| -------------------------------------------------------------------- | ----------------------------------------------- |
| Identifiers, files, folders, CSS classes (BEM), Custom Element names | English                                         |
| JSDoc, comments, `TODO:` / `FIXME:`                                  | English                                         |
| Commit messages                                                      | English                                         |
| ADRs, CLAUDE.md, generated docs (`docs/todos.md`)                    | English only                                    |
| README, CONTRIBUTING                                                 | English (source of truth) + Spanish translation |
| Text shown in the app                                                | Spanish, from the catalog                       |

**Internationalization (i18n):**

- The catalog is a JS module per language (`es.js` for now) that exports an object of **key → text**. Keys are in English and grouped by screen or component with dots: `login.error.passwordRequired`.
- The code asks for text with `t(key)`, never with a literal string. `t` is a pure function, so it can be tested in Node.
- If a key is missing, `t` returns the key itself. A missing translation shows up on screen instead of failing silently.
- Numbers, dates and plurals use the browser's `Intl` API (`Intl.NumberFormat`, `Intl.DateTimeFormat`, `Intl.PluralRules`) with the `es` locale, instead of formatting them by hand.
- `<html lang="es">` stays, since it describes the content, not the code.

**Translated docs:** one file per language, side by side (`README.md` and `README.es.md`). The first line of each one links to the other: `**English** | [Español](README.es.md)`.

**Migration:** gradual, one component or screen per commit, starting with the i18n logic and its tests. Existing ADRs are translated as part of the migration.

## Alternatives considered

- **Keep everything in Spanish:** valid for a Spanish-speaking team, but it limits who can read and contribute to the project, and it is not what the industry expects.
- **Code in English with Spanish strings inline:** simpler today, but it mixes two languages in every file, and adding a second app language later would mean touching every component.
- **An i18n library (i18next or similar):** it is the standard in large projects, but it adds a dependency to a project without a framework (ADR 0001). A small `t()` plus `Intl` covers what Balam needs. It can be revisited if the needs grow.
- **Translate every document, ADRs included:** each translation must be kept in sync by hand. ADRs are historical records that rarely change, so translating them does not pay off.

## Consequences

**We gain:**

- The code follows industry practice and can be read by anyone.
- All user-facing text is in one place: reviewing tone, spelling or wording no longer means searching the code.
- Adding a second app language means writing a new catalog file, without touching the logic.

**We accept:**

- A large migration: folders (`componentes/`, `pantallas/`, `pruebas/`, `docs/decisiones/`), components, CSS classes, tests, the cSpell dictionary and the Figma variant names (they must keep matching the code).
- Renaming the keys stored in `localStorage` logs families out once. ADR 0008 already handles invalid stored data by closing the session, so nobody gets stuck.
- README and CONTRIBUTING must be updated in both languages on every change.
- One more step when writing UI: add the key to the catalog before using it.

**Revisit the decision if:** the app needs more than one language (the language selection and the loading of catalogs would have to be designed), or if plural and formatting rules outgrow `t()` plus `Intl`.
