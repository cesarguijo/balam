/**
 * @file Detección de plataforma: reconoce el navegador y el sistema a partir de su
 * texto de identificación. No usa el navegador directamente para poder probarse en Node.
 */

/**
 * Identifica el navegador y sistema para mostrar las instrucciones de instalación correctas.
 * @param {string} textoAgente - El texto de identificación del navegador (navigator.userAgent).
 * @param {number} [puntosTactiles=0] - navigator.maxTouchPoints; sirve para reconocer los iPad, que se identifican como Mac.
 * @returns {'samsung' | 'ios-chrome' | 'ios-safari' | 'ios-safari-clasico' | 'firefox' | 'otro' | 'android-chrome' | 'escritorio'}
 */
export function detectarPlataforma(textoAgente, puntosTactiles = 0) {
  if (textoAgente.includes('SamsungBrowser')) return 'samsung';
  if (textoAgente.includes('CriOS')) return 'ios-chrome';
  if (
    textoAgente.includes('iPhone') ||
    textoAgente.includes('iPad') ||
    (textoAgente.includes('Macintosh') && puntosTactiles > 1)
  ) {
    const version = Number(textoAgente.match(/Version\/(\d+)/)?.[1]);
    if (version >= 26) return 'ios-safari';
    return 'ios-safari-clasico';
  }
  if (textoAgente.includes('Android')) {
    if (textoAgente.includes('Firefox')) return 'firefox';
    if (textoAgente.includes('EdgA') || textoAgente.includes('OPR'))
      return 'otro';
    return 'android-chrome';
  }
  return 'escritorio';
}
