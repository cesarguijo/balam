# 0005. Componentes con Custom Elements

- **Fecha:** 2026-11-10
- **Estado:** aceptada

## Contexto

Al usar el componente botón, noté que la lógica del estado «cargando» quedó escrita en `catalogo.js`. Esto es un problema porque otras pantallas, como la bienvenida, también necesitan botones con ese comportamiento. Además, al obtener el botón se obtiene un `HTMLButtonElement` genérico; me hubiera gustado obtener un tipo propio, como `BotonBalam`.

## Decisión

Los componentes con comportamiento propio se construyen como **Custom Elements** (el estándar del navegador), con una clase que extiende `HTMLElement` y una etiqueta propia, como `<balam-boton>`.

- **Sin Shadow DOM**, para que `boton.css` y `base.css` sigan aplicándose igual.
- **Con un `<button>` real por dentro**, para conservar lo que el navegador da gratis: teclado, foco y lectores de pantalla.

Los componentes que solo tienen estilos, sin comportamiento, siguen siendo HTML con clases BEM.

## Alternativas consideradas

- **Funciones sueltas en `boton.js`:** no hay un tipo propio, y cada pantalla tiene que buscar el botón y llamar a las funciones.
- **Clase envoltorio (`new Boton(elemento)`):** cada pantalla tiene que crear el objeto a mano después del `innerHTML`; si se olvida, el botón no funciona.
- **Una librería ligera como Lit:** contradice la decisión 0001 (sin frameworks) y agrega una dependencia.

## Consecuencias

- La lógica de cada componente vive en su carpeta, junto a su CSS, y las pantallas solo le dicen qué hacer (`boton.cargando = true`).
- Los componentes se activan solos: basta con escribir `<balam-boton>` en un `innerHTML`, sin código extra en la pantalla.
- Cada componente tiene su propio tipo, que VS Code reconoce y que se puede comprobar con `instanceof`.
- Hay conceptos nuevos que aprender: clases, `customElements.define` y el ciclo de vida (`connectedCallback`).
- Las etiquetas propias deben llevar un guion (`balam-boton`), porque el navegador lo exige para distinguirlas de las suyas.
- Cada componente debe importarse una vez para que el navegador conozca su etiqueta.