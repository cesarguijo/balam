/**
 * @file Funciones de uso general, compartidas por varias pantallas.
 */
/**
 * Pausa el código durante el tiempo indicado.
 * @param {number} ms - Tiempo de espera en milisegundos.
 * @returns {Promise<void>} - Promesa que avisa cuando termina la espera. 
 */
export function esperar(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}