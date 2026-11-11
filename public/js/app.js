/**
 * @file Punto de entrada de Balam: arranca el enrutador, registra el
 * service worker y guarda el aviso de instalación para usarlo después.
 */

import './enrutador.js';

/**
 * El aviso de instalación que ofrece el navegador, guardado para mostrarlo
 * cuando el usuario toque "Instalar". Es null mientras no haya aviso.
 * @type {Event|null}
 */
let avisoInstalacion = null;


// Registrar el service worker, que permitirá usar la app sin internet.
// Solo si el navegador lo soporta (los muy antiguos no).
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js')
    .then( (registration) =>{
        console.log(registration);
    })
    .catch( (error) => {
        console.log('Error al registrar el service worker:', error);
    });
}


// Cuando el navegador avise que la app se puede instalar, guarda ese aviso
// en lugar de mostrarlo: lo mostrará el boton "Instalar" de la bienvenida.
window.addEventListener('beforeinstallprompt', (evento) => {
  evento.preventDefault();
  avisoInstalacion = evento;
});