# 0001. SPA con JavaScript puro, sin framework

- **Fecha:** 2026-11-10
- **Estado:** aceptada

## Contexto

Balam se usará en celulares Android de gama baja, con poca memoria y muchas veces con datos móviles lentos. Además, el proyecto es también un proceso de aprendizaje: su autor quiere dominar los fundamentos de la web.

## Decisión

Balam es una aplicación de una sola página (SPA) escrita en **JavaScript puro**, con módulos (`import` / `export`):

- Un solo `index.html` con un contenedor `<main id="app">`.
- Cada pantalla vive en `pantallas/nombre/` y exporta una función que la dibuja en `#app`.
- `js/enrutador.js` decide qué pantalla mostrar según la dirección, usando el **hash** (`#/inicio`, `#/bienvenida`).

## Alternativas consideradas

- **Un framework (React, Vue):** agrega entre 30 y 45 KB que el celular debe descargar y ejecutar antes de mostrar nada, y esconde los fundamentos que se quieren aprender.
- **Un framework pequeño (Lit, Preact):** ligero, pero innecesario mientras las pantallas sean sencillas.
- **Un sitio con varias páginas HTML:** cada cambio de pantalla recarga todo y se siente menos como una app.
- **Rutas sin hash (History API):** direcciones más limpias, pero exigen configurar Firebase y el service worker para entregar siempre `index.html`.

## Consecuencias

- La primera carga es mínima y la app funciona bien en celulares sencillos.
- Mantener sincronizada la pantalla con los datos queda a cargo del código propio.
- Si en el futuro el panel del docente o la consulta de padres se vuelven difíciles de mantener, se evaluará **Lit** o **Preact**, que se basan en estándares de la web y no obligan a tirar lo hecho.