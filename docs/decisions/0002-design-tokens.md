# 0002. Design tokens in three levels, from Figma to code

- **Date:** 2026-11-09
- **Status:** accepted

## Context

Colors and sizes are decided in Figma and must reach the code without copy mistakes. The system must allow changing a color in a single place and, in the future, adding a dark mode.

## Decision

1. **Format:** the W3C Design Tokens standard (DTCG 2025.10).
2. **Three levels of variables:**
   - **Palette / Measures (primitives):** which color or size it is, in scales (`amber/500`, `space/24`). Never used directly in a design.
   - **Roles (semantic):** what it is used for (`action/primary/background`, `margin/screen`). They point to the primitives.
   - **Components:** only for very specific pieces (`button/facet/top-left`).
3. **Names:** lowercase, without accents, grouped with `/`. A group never repeats in two collections. They were in Spanish until ADR 0009 moved them to English.
4. **Automatic chain:** Figma → TokensBrücke plugin → `tokens/balam.tokens.json` → Style Dictionary (`npm run tokens`) → `public/css/tokens.css`.

## Alternatives considered

- **Write the colors directly in the CSS:** fast at first, but every change means hunting them down one by one.
- **Two levels (Palette and Roles):** enough for simple colors, but the faceted button needs very specific values.
- **Copy the values by hand from Figma to `tokens.css`:** error-prone, and Figma and the code drift apart.

## Consequences

- Changing a color means changing a variable in Figma and running `npm run tokens`.
- `tokens.css` is a generated file: it is not edited by hand.
- Adding a dark mode will only need a second mode in the Roles collection.
