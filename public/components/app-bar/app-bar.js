/**
 * @file App bar component: draws the blue top bar with the amber curve that
 * the screens share. Each screen passes what goes inside, so the bar does not
 * know about any screen.
 */

/**
 * Builds the app bar HTML with the given content on each side.
 * @param {string} [start] - HTML for the left side, e.g. the logo and the app name, or the back arrow and the title.
 * @param {string} [end] - HTML for the right side, e.g. the menu. Empty by default, because not every screen has something there.
 * @returns {string} HTML of the app bar.
 */
export function drawAppBar(start = ``, end = ``) {
  return /* HTML */ `
    <div class="app-bar">
      <div class="app-bar__app-bar">
        <div class="app-bar__start">${start}</div>
        <div class="app-bar__end">${end}</div>
      </div>

      <svg
        class="app-bar__curve"
        viewBox="0 0 320 16"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path class="app-bar__curve-fill" d="M0 4 Q160 16 320 4 V16 H0 Z" />
        <path
          class="app-bar__curve-line"
          d="M0 4 Q160 16 320 4"
          vector-effect="non-scaling-stroke"
        />
      </svg>
    </div>
  `;
}
