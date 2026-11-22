/**
 * @file Switch component: draws an on/off control on a native checkbox, so
 * the keyboard, forms and screen readers work without extra code.
 */

/**
 * Draws a switch. The parameters only set how it starts: after that the
 * input itself keeps track of whether it is on.
 * @param {boolean} checked - Whether it starts on.
 * @param {boolean} disabled - Whether it cannot be changed.
 * @returns {string} HTML of the switch.
 */
export function drawSwitch(checked, disabled) {
  return /* HTML */ `
    <input
      ${checked ? 'checked' : ''}
      ${disabled ? 'disabled' : ''}
      class="switch"
      role="switch"
      type="checkbox"
    />
  `;
}
