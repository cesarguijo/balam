/**
 * @file App install: catches the browser's install prompt at startup and
 * lets any screen or component use it later.
 */

/**
 * Chrome's install prompt. It is not in the standard types, so we describe
 * the parts we use.
 * @typedef {Event & {
 *   prompt: () => Promise<void>,
 *   userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
 * }} InstallPromptEvent
 */

/**
 * Name of the `localStorage` flag that remembers the app was installed. The
 * browser gives no reliable way to ask that later, so we write it down when
 * the `appinstalled` event fires.
 */
const INSTALLED_KEY = 'balam-installed';

/** @type {InstallPromptEvent | null} */
let installPrompt = null;

window.addEventListener('beforeinstallprompt', (event) => {
  event.preventDefault();
  installPrompt = /** @type {InstallPromptEvent} */ (event);
  // If the browser offers to install, the app is no longer installed.
  localStorage.removeItem(INSTALLED_KEY);
});

window.addEventListener('appinstalled', () => {
  localStorage.setItem(INSTALLED_KEY, 'yes');
});

/**
 * Tells whether the app was installed from this browser.
 * @returns {boolean}
 */
export function isInstalled() {
  return localStorage.getItem(INSTALLED_KEY) === 'yes';
}

/**
 * Tells whether the browser allows installing with a button.
 * @returns {boolean}
 */
export function canInstall() {
  return installPrompt !== null;
}

/**
 * Shows the browser's install dialog. The prompt can only be used once.
 * @returns {Promise<'accepted' | 'dismissed' | 'unavailable'>}
 */
export async function install() {
  if (!installPrompt) return 'unavailable';
  installPrompt.prompt();
  const { outcome } = await installPrompt.userChoice;
  installPrompt = null;
  return outcome;
}
