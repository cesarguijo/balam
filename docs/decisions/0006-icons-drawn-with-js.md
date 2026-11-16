# 0006. Icons drawn with JavaScript

- **Date:** 2026-11-12
- **Status:** accepted

## Context

Icons lived in a sprite (`img/iconos.svg`) and were used with `<use href="/img/iconos.svg#name">`. When typing `iconos.svg#` there was no way to know which names existed: I had to open the sprite and look for the `id`s. Also, a misspelled name failed silently: the icon just did not show up, and there was no error.

The conditions that mattered: there are few icons (about 10), the project has no build step, and I copy the icons as SVG from Tabler Icons or from Figma.

## Decision

Icons move to a JavaScript module (`js/icons.js`): an object stores the inside of each icon (its `<path>`s) and an `icon(name)` function returns the full `<svg>`, ready to use in templates with `${icon('megaphone')}`.

## Alternatives considered

- **Keep the sprite and add a VS Code snippet with the list of names:** it is quick, but the list is kept by hand and goes stale when icons are added. It does not catch misspelled names either.
- **Keep the sprite and generate a JSDoc type with a script:** it gives autocompletion, but adds a script and a generated file to maintain, too much for so few icons.
- **A `<balam-icon name="...">` component:** inside a template the attribute is just text, so autocompletion is lost. Also, an icon has no behavior; it does not justify a Custom Element.
- **Keep drawing in `iconos.svg` and generate `icons.js` with a script:** since I copy the icons as SVG text, pasting them straight into the JS is just as easy and avoids the generation step.

## Consequences

**We gain:**

- Name autocompletion: the parameter of `icon()` uses the object's `keyof typeof` type, so VS Code suggests the names without keeping any list.
- Detection of misspelled names (with `checkJs`).
- Every icon comes out with the same attributes (`viewBox`, stroke, `class="icon"`, `aria-hidden="true"`), because the function sets them, not each template.
- One network request less: the icons arrive with the JS.
- `icon()` is a pure function, so it can be tested in Node.

**We accept:**

- Every icon is a line icon (`stroke="currentColor"`, 24×24). `app-install` and `check` must be redrawn in Figma or replaced with Tabler equivalents before migrating them.
- The drawing is repeated in the HTML every time an icon is used.
- The current uses of the sprite must be migrated, and `img/iconos.svg` deleted at the end.

**Revisit the decision if:** the number of icons grows a lot (hundreds) or the same icon repeats many times on a screen, because then the weight of the HTML matters and the sprite pays off again; or if filled icons are needed, because the function would have to accept more than one style.
