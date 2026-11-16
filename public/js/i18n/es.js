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

  // Install footer: one text per state (install, installing, installed)
  'install.button': 'Instalar',
  'install.buttonNote': 'Consume pocos datos y almacenamiento',
  'install.installing': 'Instalando…',
  'install.installingNote':
    'Esto tarda unos segundos. <br />No cierres esta página.',
  'install.installed':
    '¡Listo! Balam ya está instalada <br />Ábrela desde tu pantalla de inicio',
  'install.title': 'Instala desde tu navegador',

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
