export class BotonBalam extends HTMLElement {
    connectedCallback() {
        
        const variante = this.getAttribute('variante') ?? 'relleno';
        const texto = this.getAttribute('texto') ?? 'Aceptar';

        this.innerHTML = /* html */ `
            <button class="boton boton--${variante}">
                <span class="boton__cuerpo">
                    <span class="boton__indicador" aria-hidden="true">
                        <span></span><span></span><span></span>
                    </span>
                    <span class="boton__etiqueta">${texto}</span>
                </span>
            </button>
        `;
    }

    get cargando() {
        const boton = this.querySelector('button')
        if(!(boton instanceof HTMLButtonElement)) {
            throw new Error('No se encontró el botón')
        }
        return (boton.getAttribute('aria-busy') === 'true')
    }

    /** @param {boolean} valor */
    set cargando(valor) {
        const boton = this.querySelector('button');
        if (!(boton instanceof HTMLButtonElement)) {
            throw new Error('No se encontró el botón');
        }
        
        const etiqueta = this.querySelector('.boton__etiqueta');
        if (!(etiqueta instanceof HTMLElement)) {
            throw new Error('No se encontró el elemento con la clase .boton__etiqueta');
        }

        
        if(valor) {
            boton.setAttribute('aria-busy', 'true');
            etiqueta.textContent = 'Cargando...';
        } else {
            boton.removeAttribute('aria-busy')
            etiqueta.textContent = this.getAttribute('texto') ?? 'Aceptar';
        }
    }
}

customElements.define('balam-boton', BotonBalam);
