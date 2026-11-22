/**
 * @file Spanish message catalog: holds every text the user sees and
 * looks them up by key.
 */

/**
 * Texts shown to the user, by key. Keys are grouped by component or
 * screen (`button.loading`) so the catalog stays easy to scan.
 *
 * A text may hold inline HTML (`<strong>`, `<span>`) so each sentence stays
 * whole: other languages order words differently, and gluing pieces with
 * `+` would break them. It is safe because only we write this catalog; never
 * put user input here.
 */
export const messages = {
  'button.default': 'Aceptar',
  'button.loading': 'Cargando…',

  'textField.showPassword': 'Mostrar clave',

  // Login errors: short and say what to do, because parents read them on
  // the phone with no help. 60 characters max (room in the Figma design).
  'login.error.wrongCredentials':
    'Usuario o clave incorrectos. Revise e intente nuevamente.',
  'login.error.offline': 'No tiene conexión a internet, conéctese nuevamente.',
  'login.error.accountDisabled': 'Cuenta deshabilitada. Contacte al maestro.',
  'login.error.tooManyAttempts': 'Demasiados intentos. Reintente más tarde.',
  'login.error.unknown': 'Ocurrió un error desconocido, reintente más tarde.',
  'login.error.passwordEmpty': 'Por favor ingrese su clave.',
  'login.error.usernameInvalid':
    'Se permiten letras y números sin espacios ni puntos.',
  'login.error.usernameEmpty': 'Por favor ingrese su usuario.',

  'login.subtitle': 'Inicie sesión para continuar',
  'login.username.label': 'Usuario',
  'login.username.placeholder': 'Ej. mariaperez1985',
  'login.password.label': 'Clave',
  'login.password.placeholder': 'Su clave',
  'login.button.default': 'Entrar',
  'login.button.loading': 'Entrando…',
  'login.forgotPassword': '¿Olvidó su clave? Pida una nueva al maestro',

  // Home screen
  'home.hello': 'Hola mundo',

  'identity.logoAlt': 'Logo de Balam',
  // Welcome screen. "Balam" is not here: a brand name is not translated.

  'welcome.tagline': 'La app de la clase del Prof. César',
  'welcome.feature.notices': 'Avisos y notas en tu celular',
  'welcome.feature.math': 'Matemáticas a tu ritmo',
  'welcome.feature.private': 'Privado, gratis y sin anuncios',

  // Install footer: one text per state (install, installing, installed)
  'install.button': 'Instalar',
  'install.buttonNote': 'Consume pocos datos y almacenamiento',
  'install.installing': 'Instalando…',
  'install.installingNote':
    'Esto tarda unos segundos. <br />No cierres esta página.',
  'install.installed':
    '¡Listo! Balam ya está instalada <br />Ábrela desde tu pantalla de inicio',
  'install.title': 'Instala desde tu navegador',

  // Install banner: optional, inside the app (ADR 0011)
  'installBanner.label': 'Instalar Balam',
  'installBanner.text':
    'Instala Balam para abrirla con un toque desde tu pantalla de inicio.',
  'installBanner.install': 'Instalar',
  'installBanner.dismiss': 'Ahora no',

  // Desktop: the person is sent to their phone with a QR code
  'install.desktop.title':
    'Balam funciona <span class="install-footer__underline">mejor</span> en tu celular',
  'install.desktop.qrAlt': 'Código QR para abrir Balam en tu celular',
  'install.desktop.scan': 'Escanea este código con la cámara de tu celular',

  // Manual install steps. Bold words are the browser's own menu labels, so
  // they must match the browser's language, not just be translated.
  'install.step.menuTopRight': 'Toca el menú, arriba a la derecha',
  'install.step.menuBottomRight':
    'Toca menú, abajo a la derecha, si no lo ves pasa al paso 2',
  'install.step.more': 'Toca <strong>Más</strong>',
  'install.step.share': 'Toca <strong>Compartir</strong>',
  'install.step.shareAddressBar':
    'Toca <strong>Compartir</strong>, en la barra de direcciones',
  'install.step.shareBottomCenter':
    'Toca <strong>Compartir</strong>, abajo en el centro',
  'install.step.addToHome':
    'Elige <strong>Agregar a la pantalla de inicio</strong>',
  'install.step.addAppToHome':
    'Elige <strong>Agregar app a la pantalla de inicio</strong>',
  'install.step.add': 'Toca <strong>Agregar</strong>',
  'install.step.addTopRight':
    'Toca <strong>Agregar</strong>, arriba a la derecha',
  'install.step.installShortcut':
    'Elige <strong>Instalar y crear acceso directo</strong>',
  'install.step.installIcon': 'Toca el ícono de instalar, arriba en la barra',
  'install.step.install': 'Toca <strong>Instalar</strong>',
  'install.step.openInChrome': 'Para instalar la app, ábrela en Chrome',
  'family.menu.books': 'Libros',
  'family.menu.account': 'Cuenta',
  'family.menu.install': 'Instalar app',
  'family.installing': 'Instalando Balam… Esto tarda unos segundos.',
  'family.installed':
    '¡Listo! Balam ya está instalada. Ábrela desde tu pantalla de inicio.',

  'account.title': 'Cuenta',
  'account.user': '<strong>Usuario:</strong>',
  'account.family': 'Mi familia',
  'account.app': 'App',
  'account.refresh': 'Actualizar datos',
  'account.refresh.error': 'Ocurrió un error, vuelva a intentar',
  'account.whatsapp': 'Canal de WhatsApp',
  'account.requests': 'Solicitudes y consultas',
  'account.logout': 'Cerrar sesión',
  'account.refresh.today': 'hoy',
  'account.refresh.yesterday': 'ayer',
  'account.refresh.lastTime': 'Última vez:',
  'account.refresh.noDate': 'sin registro',
};

/**
 * A key that exists in the catalog. Typing it lets the editor flag a
 * misspelled key before the app runs.
 * @typedef {keyof typeof messages} MessageKey
 */

/**
 * A text from the catalog.
 * @typedef {(typeof messages)[MessageKey]} MessageText
 */

/**
 * Returns the text for a key, so the code never holds user-facing strings.
 * @param {MessageKey} key - Catalog key, e.g. `'button.loading'`.
 * @returns {MessageText} The text to show the user.
 */
export function t(key) {
  return messages[key] ?? 'no-existe';
}
