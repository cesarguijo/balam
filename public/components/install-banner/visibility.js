/**
 * @file Install banner visibility: decides whether to invite the family to
 * install Balam. It is pure (no browser) so it can be tested in Node.
 */

/**
 * Tells whether to show the install banner. Installing is optional (ADR
 * 0011): the banner only shows on a phone, in the browser, while the family
 * has not closed it. Once closed it does not come back, so it never nags a
 * parent whose phone cannot install.
 * @param {object} context - What is known about the device.
 * @param {boolean} context.isDesktop - Whether it was opened on a computer; desktop has its own welcome screen.
 * @param {boolean} context.installed - Whether Balam is already installed (opened as the app, or installed from this browser).
 * @param {boolean} context.dismissed - Whether the family already closed the banner on this phone.
 * @returns {boolean} `true` if the banner must be shown.
 */
export function shouldShowInstallBanner({ isDesktop, installed, dismissed }) {
  return !isDesktop && !installed && !dismissed;
}
