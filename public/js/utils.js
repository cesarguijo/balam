/**
 * @file General-purpose helpers shared by several screens.
 */

/**
 * Pauses the code for the given time.
 * @param {number} ms - Waiting time in milliseconds.
 * @returns {Promise<void>} A promise that fulfills when the wait is over.
 */
export function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
