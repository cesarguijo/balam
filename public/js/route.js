/**
 * @file App route: decides which screen to show based on where Balam was
 * opened and whether there is a session. It is pure (it does not use window
 * or document) so it can be tested in Node.
 * @see docs/decisions/0007-entry-flow.md
 */

/**
 * Decides which screen to show when Balam opens. Desktop and the browser
 * always go to the welcome screen, because Balam is used installed on the
 * phone.
 * @param {object} context - What is known about the device and the session.
 * @param {boolean} context.isDesktop - Whether it was opened on a computer.
 * @param {boolean} context.installed - Whether it was opened as an installed app and not in the browser.
 * @param {boolean} context.hasSession - Whether the family has already logged in.
 * @returns {'#/welcome' | '#/login' | '#/notices'} The route to show.
 */
export function decideRoute({ isDesktop, installed, hasSession }) {
  if (isDesktop) return '#/welcome';
  if (!installed) return '#/welcome';
  if (!hasSession) return '#/login';
  return '#/notices';
}
