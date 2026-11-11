/**
 * @file Pantalla catalogo: muestra un catalogo de los elementos de la interfaz de usuario.
 */

import {esperar} from '../../js/utilidades.js';

/**
 * Muestra la pantalla catalogo dentro del contenedor.
 * @param {HTMLElement} app - Contenedor donde se dibuja la pantalla.
 */
export function mostrarCatalogo(app) {
    document.title = 'Balam - Catálogo';

    app.innerHTML = /* html */ `
        <h1>Catálogo de componentes</h1>
        <h2>Botón</h2>
        <button class="boton boton--relleno" id="prueba-carga">
            <span class="boton__cuerpo">
                <span class="boton__indicador" aria-hidden="true">
                    <span></span><span></span><span></span>
                </span>
                <span class="boton__etiqueta">Instalar</span>
            </span>
        </button>
    `;

    

    const boton = app.querySelector('#prueba-carga');
    if (!(boton instanceof HTMLButtonElement)) {
        throw new Error('No se encontró el botón #prueba-carga');
    }
    
    const etiqueta = boton.querySelector('.boton__etiqueta');
    if (!(etiqueta instanceof HTMLElement)) {
        throw new Error('No se encontró el elemento con la clase .boton__etiqueta');
    }

    boton.addEventListener('click', async () => {
       if(boton.getAttribute('aria-busy') === 'true') return;
       
       const textoOriginal = etiqueta.textContent;
       
       
       //1. Pasa a "cargando"
       boton.setAttribute('aria-busy', 'true');
       etiqueta.textContent = 'Instalando...';
       
       //2. Simula el trabajo
       await esperar(3000);

       //3. Vuelve a la normalidad
       boton.removeAttribute('aria-busy');
       etiqueta.textContent = textoOriginal;
    });
}
