var deferredPrompt;

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js')
    .then(function(registration) {
        console.log(registration);

    });
}
/*
window.addEventListener('beforeinstallprompt', function(event) {
  console.log('beforeinstallprompt', event);
  event.preventDefault();
  window.deferredPrompt = event;
  deferredPrompt = event;
  return false;
  
});

*/
const texto = document.getElementById('texto');
const boton = document.getElementById('installButton');
boton.addEventListener('click', function(event) {
  texto.appendChild(document.createTextNode('Instalando...'));
  /*if(deferredPrompt) {
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then(function(choiceResult) {
      console.log(choiceResult.outcome);
      if (choiceResult.outcome === 'dismissed') {
        console.log('User cancelled installation');
      } else {
        console.log('User added to home screen');
      }
    });
  }

  deferredPrompt = null;*/
});