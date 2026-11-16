# Balam

Free PWA to learn math and communicate with families. Plain JavaScript (no framework), hosted on Firebase (`balam-math.web.app`). Author: César Arguijo, math teacher in Honduras.

## How we work

- **César writes the code.** Claude explains, gives hints and reviews. It gives fuller examples only when César is stuck or asks for them.
- **Do not edit files or make commits** unless César explicitly asks. Always with permission, no exceptions: if Claude writes something without César noticing, César does not learn and loses control of the project.
- **Documents** (ADRs, guides) that sum up something already discussed: Claude may offer to draft them (with permission) and César reviews them, so what was already discussed is not rewritten.
- **Claude writes the `TODO:`s** when preparing a new file (placeholder functions with their pending work), based on what was already discussed. César implements each `TODO:` and deletes it when done.
- **Order of every task**: pure logic with tests → design in Figma → HTML and CSS (details in `CONTRIBUTING.md`). The logic defines which states the design needs; if the design reveals missing logic, go back to the logic.
- **One step at a time**: little information at once, one step, then the next. Teach it like a class.
- **Talk to César in Spanish.** Code, comments, docs and commits are in English (ADR 0009). Standard industry practices.
- When reviewing: first what is good, then the errors from most to least important.

## Structure

```
public/                  → what gets published
  components/<name>/     → Custom Elements (<name>.js, <name>.css and their own files)
  screens/<name>/        → one screen per folder
  js/                    → shared logic (router, install, platform, icons, session, utils)
  js/i18n/               → message catalog (es.js) and t()
  css/                   → styles.css imports everything with @layer; tokens.css is GENERATED
tests/                   → tests with node:test (*.test.js)
tokens/                  → DTCG design tokens (source of tokens.css); motion.tokens.json is hand-written
docs/decisions/          → numbered ADRs; template.md is the template
```

## Conventions

- **Names**: folder + name say what it is. Suffixes only when a tool needs them (`.test.js`, `.tokens.json`). What only one component uses lives in its folder.
- **Components** (ADR 0005): Custom Elements without Shadow DOM, with a real `<button>` inside. Attributes as inputs (kebab-case, e.g. `loading-text`), `#private` members, no `id` inside the component. Style-only components are HTML + CSS with BEM.
- **CSS**: BEM, tokens (`var(--...)`), no fixed values. Do not wrap files in `@layer` (`styles.css` already assigns it).
- **Text styles**: `.text-display`, `.text-title`, `.text-body`, `.text-label` (from `typography.css`, built on the `font.*` tokens).
- **Icons** (ADR 0006): `${icon('name')}` from `js/icons.js`. Line icons only, 24×24; only the inside (`<path>`) is stored. Names describe the drawing, not its use (`eye-off`, not `hide`).
- **User-facing text** (ADR 0009): never in the code. Add a key to `js/i18n/es.js` and use `t('key')`. Keys in English, grouped by screen or component (`login.error.offline`). Whole sentences only; inline HTML (`<strong>`, `<br />`) is allowed inside a text. Whoever creates a component translates its attributes (`text="${t('install.button')}"`).
- **HTML in JS**: templates with the `/* HTML */` comment so Prettier formats them.
- **Pure functions** (no `window`, `document`, `navigator`) in their own file, so they can be tested in Node.
- **JSDoc** everywhere: `@file` in the form "[what it is]: [verb]…"; functions start with a third-person verb; comments explain the _why_.
- **Code to-dos**: `// TODO:` or `// FIXME:` on their own line, right above the code (or above its JSDoc). leasot ignores the ones at the end of a line with code. Big to-dos go to Notion.

## Commands

- `npm test`: tests
- `npm run coverage`: coverage with c8 (report in `coverage/`, not committed)
- `npm run lint`: ESLint + cSpell on identifiers (`public/` and `tests/`; extra words in `code-words.txt`)
- `npm run tokens`: generates `public/css/tokens.css` (do not edit it by hand)
- `npm run todos`: generates `docs/todos.md` with the `TODO:` and `FIXME:` in `public/` (with leasot)
- Live Server with `/public` as root

## Sources of truth

- **Notion**: planning, to-dos, research.
- **Figma**: design ("Balam" file). Variants use the same keys as the code (`android-chrome`, `ios-safari`, `desktop`…). Variables are the design tokens; export them to `tokens/balam.tokens.json`.
- **Firestore**: family data lives in `families/{uid}` (`username`, `children[]` with `id`, `name`, `grade`).
- **docs/decisions/**: why each thing was done.
