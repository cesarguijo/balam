**English** | [Español](CONTRIBUTING.es.md)

# Working on Balam

This guide explains the project's conventions. The reasons behind each one are in [docs/decisions](docs/decisions/).

## Before you start

Always pull the latest changes before editing:

```bash
git pull
```

## The flow of every task

1. **Understand:** what does the student or the family need? On which screen does it appear?
2. **Learn just enough:** only what the task requires.
3. **Logic first:** write the pure functions with their tests (`npm test`). Well-defined logic tells which states and messages the design must have.
4. **Design in Figma:** explore with loose colors, create the component and its variants (one per state the logic asks for), test the prototype and, at the end, connect everything to variables.
5. **Build:** export the tokens (`npm run tokens`), write the HTML and CSS, and connect the logic to the screen.
6. **Test:** on a real phone and on a 320 px wide screen.
7. **Close:** commit, `firebase deploy` and update the documentation.

If the design reveals missing logic (a "loading" state, a button to show the password), go back to step 3 and add it with its test.

### A task is done when…

- [ ] The pure logic has its tests and `npm test` passes.
- [ ] `npm run lint` passes.
- [ ] It uses only design variables (no loose color or size).
- [ ] Every text the user sees comes from the catalog (`t('key')`).
- [ ] It works on a real phone, 320 px wide.
- [ ] Text has a contrast of at least 4.5:1 and touch targets are 48 px or larger.
- [ ] It is on GitHub and published on Firebase.
- [ ] Important decisions are documented.

## Language

- **Code, comments, JSDoc, commits and docs:** in English ([ADR 0009](docs/decisions/0009-english-code-and-i18n.md)).
- **Text the user sees:** in Spanish, only in the message catalog (`public/js/i18n/es.js`).
- README and CONTRIBUTING have a Spanish version (`.es.md`). Update both on every change.

## Names

- **Files and folders:** lowercase, words separated with a hyphen (`install-footer`, `0002-design-tokens.md`).
- **The same name everywhere:** a component has the same name in Figma, in its folder, in its CSS class and in its tag (`button` → `components/button/` → `.button` → `<balam-button>`).
- **Figma variants** use the same keys as the code (`android-chrome`, `ios-safari`, `desktop`…).
- **Screens in Figma:** `screen/size/state` (e.g. `welcome/320x568/install`).

## CSS

### BEM classes

| What it is                | How it is written | Example                                |
| ------------------------- | ----------------- | -------------------------------------- |
| **Block** (the component) | `name`            | `button`                               |
| Inner **element**         | `block__element`  | `button__body`, `button__loader`       |
| **Modifier** (variant)    | `block--modifier` | `button--primary`, `button--secondary` |

**States** have no class: use the browser's own (`:active`, `:disabled`, `:focus-visible`, `[aria-busy="true"]`).

**ids** are only for JavaScript to find an element; they are never used for styling.

### Layers and order

`index.html` links only `css/styles.css`, which imports everything in layers:

```css
@layer tokens, base, components, screens;
```

Every new component or screen adds its `@import` line to `styles.css`. Do not wrap files in `@layer`: `styles.css` already assigns it.

### Variables

- Always use the variables from `tokens.css` (`var(--action-primary-background)`), never colors written by hand.
- `tokens.css` **is generated** with `npm run tokens`; changes start in Figma.
- Inside a component, local variables start with an underscore (`--_strip-top`) and each variant only changes those variables.
- For text, use the typography classes: `.text-display`, `.text-title`, `.text-body`, `.text-label`.

Every component CSS file starts with a comment that lists its parts, variants and states.

## JavaScript

- Modern JavaScript, without frameworks, with modules (`import` / `export`).
- Each screen lives in `screens/<name>/` and exports a function that draws it inside `#app`.
- Components with behavior are Custom Elements without Shadow DOM, with a real `<button>` inside ([ADR 0005](docs/decisions/0005-components-with-custom-elements.md)).
- Logic (calculating, deciding) is kept apart from the screen (drawing), in pure functions that can be tested in Node.
- Every function has a [JSDoc](https://jsdoc.app) comment that starts with a third-person verb:

  ```js
  /**
   * Draws the playground screen.
   * @param {HTMLElement} app - The container where the screen is drawn.
   */
  ```

- Icons: `${icon('name')}` from `js/icons.js` ([ADR 0006](docs/decisions/0006-icons-drawn-with-js.md)).
- HTML templates in JS start with the `/* HTML */` comment, so Prettier formats them.

### Text the user sees

Never write it in the code. Add a key to `js/i18n/es.js` and use `t('key')`:

```js
// es.js
'login.error.offline': 'No tiene conexión a internet, conéctese nuevamente.',

// login.js
message.textContent = t('login.error.offline');
```

Keys are in English and grouped by screen or component. Each text is a whole sentence; inline HTML (`<strong>`, `<br />`) is allowed inside it.

## Commits

In English, with a short title in the imperative that says what changes:

```
Add loading state to the button
```

If it needs explaining, add a description after a blank line with the why.

## Documenting a decision

When you make a decision that affects the project, create a file in `docs/decisions/` with the next number (`0010-…`) using the [template](docs/decisions/template.md).
