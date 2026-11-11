/**
 * @file Pantalla catálogo: muestra un catálogo de los elementos de la interfaz de usuario.
 */

import {esperar} from '../../js/utilidades.js';
import { BotonBalam } from '../../componentes/boton/boton.js';

/**
 * Muestra la pantalla catálogo dentro del contenedor.
 * @param {HTMLElement} app - Contenedor donde se dibuja la pantalla.
 */
export function mostrarCatalogo(app) {
    document.title = 'Balam - Catálogo';

    app.innerHTML = /* html */ `
        <h1>Catálogo de componentes</h1>
        <h2>Botón</h2>
        <balam-boton texto="Instalar"></balam-boton>
    `;

    
    const boton = app.querySelector('balam-boton');
    if(!(boton instanceof BotonBalam)){
        throw new Error('No se encontró instancia de BotonBalam');
    }

    boton.addEventListener('click', async () => {
       if(boton.cargando) return;
       boton.cargando = true;
       await esperar(3000);
       boton.cargando = false;
    });
}
