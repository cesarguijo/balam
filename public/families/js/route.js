/**
 * @file App route: decides which screen to show when Balam opens without a
 * known route. It is pure (it does not use window or document) so it can be
 * tested in Node.
 * @see docs/decisions/0011-use-without-installing.md
 */

/**
 * Decides which screen to show when Balam opens. Desktop always goes to the
 * welcome screen, which sends the person to their phone. On the phone,
 * installed or not, the family logs in and uses Balam right away: some
 * phones are too old or too full to install it (ADR 0011).
 * @param {object} context - What is known about the device and the session.
 * @param {boolean} context.isDesktop - Whether it was opened on a computer.
 * @param {boolean} context.hasSession - Whether the family has already logged in.
 * @returns {'#/welcome' | '#/login' | '#/notices'} The route to show.
 */
export function decideRoute({ isDesktop, hasSession }) {
  if (isDesktop) return '#/welcome';
  if (!hasSession) return '#/login';
  return '#/notices';
}
