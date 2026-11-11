/**
 * @file Punto de entrada de Balam: arranca el enrutador, registra el
 * service worker y guarda el aviso de instalación para usarlo después.
 */

import './enrutador.js';
import './instalacion.js';

// Registrar el service worker, que permitirá usar la app sin internet.
// Solo si el navegador lo soporta (los muy antiguos no).
if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('/sw.js')
    .then((registro) => {
      console.log('Service worker registrado en: ', registro.scope);
    })
    .catch((error) => {
      console.error('Error al registrar el service worker:', error);
    });
}
