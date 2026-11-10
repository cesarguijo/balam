export function mostrarCatalogo(app) {
    document.title = 'Balam - Catálogo';

    app.innerHTML = `
        <h1>Catálogo de componentes</h1>

        <h2>Botón</h2>
        <button class="boton boton-relleno" id="prueba-carga">
            <span class="boton-cuerpo">
                <span class="boton-indicador" aria-hidden="true">
                    <span></span><span></span><span></span>
                </span>
                <span class="boton-tiqueta">Cargando...</span>
            </span>
        </button>
    `;

    function esperar(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    const boton = app.querySelector('#prueba-carga');
    const etiqueta = boton.querySelector('.boton-tiqueta');

    boton.addEventListener('click', async () => {
       if(boton.getAttribute('aria-busy') === 'true') return;
       
       const textoOriginal = etiqueta.textContent;
       
       //1. Pasa a "cargando"
       boton.setAttribute('aria-busy', 'true');
       etiqueta.textContent = 'Cargando...';
       
       //2. Simula el trabajo
       await esperar(3000);

       //3. Vuelve a la normalidad
       boton.removeAttribute('aria-busy');
       etiqueta.textContent = textoOriginal;
    });
}
