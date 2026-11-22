/**
 * @file Ripple component: starts the wave of every `.ripple` element as soon
 * as the finger touches it. It uses pointerdown and not :active, because on
 * phones the browser applies :active late and the wave showed after the
 * action (e.g. after the menu panel opened).
 */

/**
 * Listens for presses on the whole page and runs the wave on the pressed
 * `.ripple` element. One listener on `document` covers every ripple, even the
 * ones drawn later by the router, so no screen has to set it up.
 */
export function listenRipples() {
  document.addEventListener('pointerdown', (event) => {
    const target = event.target;
    if (target instanceof Element) {
      const rippleElement = target.closest('.ripple');

      if (rippleElement) {
        rippleElement.classList.add('ripple_active');
        rippleElement.addEventListener(
          'animationend',
          () => {
            rippleElement.classList.remove('ripple_active');
          },
          { once: true },
        );
      }
    }
  });
}
