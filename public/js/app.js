/**
 * @file Balam entry point: starts the router, registers the service worker
 * and keeps the install prompt to use it later.
 */

import './router.js';
import './install.js';

// Registers the service worker, which will let the app work offline.
// Only if the browser supports it (very old ones do not).
if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('/sw.js')
    .then((registration) => {
      console.log('Service worker registered at:', registration.scope);
    })
    .catch((error) => {
      console.error('Service worker registration failed:', error);
    });
}
