/**
 * @file Platform detection: recognizes the browser and the system from its
 * user agent string. It does not use the browser directly, so it can be
 * tested in Node.
 */

/**
 * A platform Balam knows how to install on. The values match the Figma
 * variant names of the install footer.
 * @typedef {'samsung' | 'ios-chrome' | 'ios-safari' | 'ios-safari-legacy' | 'firefox' | 'other' | 'android-chrome' | 'desktop'} Platform
 */

/**
 * Identifies the browser and system, to show the right install instructions.
 * @param {string} userAgent - The browser's identification string (navigator.userAgent).
 * @param {number} [maxTouchPoints=0] - navigator.maxTouchPoints; it tells iPads apart, because they identify themselves as a Mac.
 * @returns {Platform}
 */
export function detectPlatform(userAgent, maxTouchPoints = 0) {
  if (userAgent.includes('SamsungBrowser')) return 'samsung';
  if (userAgent.includes('CriOS')) return 'ios-chrome';
  if (
    userAgent.includes('iPhone') ||
    userAgent.includes('iPad') ||
    (userAgent.includes('Macintosh') && maxTouchPoints > 1)
  ) {
    const version = Number(userAgent.match(/Version\/(\d+)/)?.[1]);
    if (version >= 26) return 'ios-safari';
    return 'ios-safari-legacy';
  }
  if (userAgent.includes('Android')) {
    if (userAgent.includes('Firefox')) return 'firefox';
    if (userAgent.includes('EdgA') || userAgent.includes('OPR')) return 'other';
    return 'android-chrome';
  }
  return 'desktop';
}
