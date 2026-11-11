// @ts-nocheck — VS Code confunde self con window; se resolverá al programar el modo sin conexión.
/** 
 * @file Service Worker de Balam: intermediario entre la app y la red.
 * Por ahora solo avisa en consola cada vez que ocurre uno de sus eventos.
 */

self.addEventListener('install', function(event) {
    console.log('[Service Worker] Installing Service Worker...', event);
});

self.addEventListener('activate', function(event) {
    console.log('[Service Worker] Activating Service Worker...', event);
    return self.clients.claim();
});

self.addEventListener('fetch', function(event) {
    console.log('[Service Worker] Fetching resource...', event);
});