// @ts-nocheck — VS Code mistakes self for window; it will be solved when the offline mode is built.
/**
 * @file Balam service worker: the go-between for the app and the network.
 * For now its handlers are empty; they will hold the offline cache.
 */

self.addEventListener('install', function () {
  //console.log('[Service Worker] Installing Service Worker...', event);
});

self.addEventListener('activate', function () {
  // console.log('[Service Worker] Activating Service Worker...', event);
  return self.clients.claim();
});

self.addEventListener('fetch', function () {
  //console.log('[Service Worker] Fetching resource...', event);
});
