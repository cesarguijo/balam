# 0004. Code and spell checking with two tools

- **Date:** 2026-11-10
- **Status:** accepted

> **Note:** since ADR 0009, code and comments are in English, so the accent problem described here now only applies to the message catalog (`js/i18n/es.js`). The examples keep the Spanish names the code had at the time.

## Context

The project is in Spanish, but code names (variables, functions, classes) have no accents or ñ, because the project's naming convention asks for it. JSDoc and user-facing texts, on the other hand, must have correct accents ("botón", "instalación").

The VS Code spell checker (Code Spell Checker) checks the whole file with the same rules. With the Spanish dictionary, it flags `avisoInstalacion` as a mistake because of the missing accent. If `instalacion` is added to the list of accepted words, it stops flagging that same mistake in comments. A single tool cannot apply different rules to the names and the comments of the same file.

## Decision

Each part of the code is checked by a different tool:

| What is checked                       | Tool                                   | Rule                                           |
| ------------------------------------- | -------------------------------------- | ---------------------------------------------- |
| Comments (JSDoc) and texts            | Code Spell Checker (VS Code extension) | Strict Spanish, with accents                   |
| Variable, function and property names | ESLint with `@cspell/eslint-plugin`    | No accents or ñ, according to `code-words.txt` |

- `.vscode/settings.json` limits the spell checker to comments and texts (`includeRegExpList`).
- `eslint.config.mjs` turns on spell checking only for names (`checkIdentifiers: true`, `checkComments: false`, `checkStrings: false`).
- `code-words.txt` is the code glossary: one word per line, without accents. Every new word used in a name is added there.
- ESLint also uses its recommended rules (`@eslint/js`), which catch common mistakes such as unused variables.
- `npm run lint` checks all the code in `public/`.

## Alternatives considered

- **Only Code Spell Checker, adding the words without accents as valid:** the accent check in the documentation is lost.
- **Only Code Spell Checker, without checking names:** typos in names (`avisoInstlacion`) go through unnoticed.
- **Turn spell checking off:** simpler, but the documentation is part of the project's value for whoever inherits it.

## Consequences

- Documentation is checked with accents and names without them, in the same file.
- ESLint also warns about programming mistakes, not only spelling.
- There are two tools and two config files to maintain.
- Every new word in a name must be added to `code-words.txt`; in exchange, that file documents the code's vocabulary.
- English technical terms that appear in texts (such as `'beforeinstallprompt'`) are added to `cSpell.words` in `.vscode/settings.json`, never Spanish words without accents.
