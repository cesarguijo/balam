# 0005. Components with Custom Elements

- **Date:** 2026-11-10
- **Status:** accepted

## Context

When using the button component, I noticed that the logic of the "loading" state ended up written in the playground screen (`playground.js`). This is a problem because other screens, such as the welcome screen, also need buttons with that behavior. Also, getting the button returns a generic `HTMLButtonElement`; I would have liked to get a type of its own, such as `BalamButton`.

## Decision

Components with their own behavior are built as **Custom Elements** (the browser standard), with a class that extends `HTMLElement` and a tag of its own, such as `<balam-button>`.

- **Without Shadow DOM**, so that `button.css` and `base.css` keep applying as before.
- **With a real `<button>` inside**, to keep what the browser gives for free: keyboard, focus and screen readers.

Components that only have styles, without behavior, stay as HTML with BEM classes.

## Alternatives considered

- **Loose functions in `button.js`:** there is no type of its own, and every screen has to find the button and call the functions.
- **A wrapper class (`new Button(element)`):** every screen has to create the object by hand after `innerHTML`; if it forgets, the button does not work.
- **A light library such as Lit:** it goes against decision 0001 (no frameworks) and adds a dependency.

## Consequences

- Each component's logic lives in its folder, next to its CSS, and screens only tell it what to do (`button.loading = true`).
- Components switch themselves on: writing `<balam-button>` in an `innerHTML` is enough, with no extra code in the screen.
- Each component has its own type, which VS Code recognizes and which can be checked with `instanceof`.
- There are new concepts to learn: classes, `customElements.define` and the lifecycle (`connectedCallback`).
- Custom tags must have a hyphen (`balam-button`), because the browser requires it to tell them apart from its own.
- Each component must be imported once so the browser knows its tag.
