import './enrutador.js';

var deferredPrompt;

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js')
    .then(function(registration) {
        console.log(registration);

    });
}

window.addEventListener('beforeinstallprompt', function(event) {
  console.log('beforeinstallprompt', event);
  event.preventDefault();
  deferredPrompt = event;
  return false;
});