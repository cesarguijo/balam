/**
 * @file Balam entry point: starts the router, registers the service worker,
 * keeps the install prompt to use it later and listens for the ripples of
 * every screen.
 */

import './router.js';
import './install.js';
import { listenRipples } from '../components/ripple/ripple.js';

// Here and not in a screen, so it runs once and works on any first screen
listenRipples();

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
