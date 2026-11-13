# 0006. Íconos dibujados con JavaScript

- **Fecha:** 2026-11-12
- **Estado:** aceptada

## Contexto

Los íconos vivían en un sprite (`img/iconos.svg`) y se usaban con `<use href="/img/iconos.svg#nombre">`. Al escribir `iconos.svg#` no había forma de saber qué nombres existían: tenía que abrir el sprite y buscar los `id`. Además, un nombre mal escrito fallaba en silencio: el ícono simplemente no aparecía y no había ningún error.

Las condiciones que importaban: son pocos íconos (unos 10), el proyecto no tiene paso de compilación, y los íconos los copio como SVG desde Tabler Icons o desde Figma.

## Decisión

Los íconos pasan a un módulo JavaScript (`js/iconos.js`): un objeto guarda el interior de cada ícono (sus `<path>`) y una función `icono(nombre)` devuelve el `<svg>` completo, listo para usarse en las plantillas con `${icono('megafono')}`.

## Alternativas consideradas

- **Mantener el sprite y agregar un snippet de VS Code con la lista de nombres:** es rápido, pero la lista se mantiene a mano y se desactualiza al agregar íconos. Tampoco detecta nombres mal escritos.
- **Mantener el sprite y generar un tipo JSDoc con un script:** da autocompletado, pero agrega un script y un archivo generado que mantener, demasiado para tan pocos íconos.
- **Un componente `<balam-icono nombre="...">`:** dentro de una plantilla el atributo es solo texto, así que se pierde el autocompletado. Además, un ícono no tiene comportamiento; no justifica un Custom Element.
- **Seguir dibujando en `iconos.svg` y generar `iconos.js` con un script:** como copio los íconos como texto SVG, pegarlos directo en el JS es igual de fácil y evita el paso de generación.

## Consecuencias

**Ganamos:**

- Autocompletado de nombres: el parámetro de `icono()` usa el tipo `keyof typeof` del objeto, así que VS Code sugiere los nombres sin mantener ninguna lista.
- Detección de nombres mal escritos (con `checkJs`).
- Todos los íconos salen con los mismos atributos (`viewBox`, trazo, `class="icono"`, `aria-hidden="true"`), porque los pone la función y no cada plantilla.
- Una petición de red menos: los íconos llegan con el JS.
- `icono()` es una función pura, así que se puede probar en Node.

**Aceptamos:**

- Todos los íconos son de línea (`stroke="currentColor"`, 24×24). `instalar-app` y `check` deben rehacerse en Figma o cambiarse por equivalentes de Tabler antes de migrarlos.
- El dibujo se repite en el HTML cada vez que se usa un ícono.
- Hay que migrar los usos actuales del sprite y borrar `img/iconos.svg` al terminar.

**Revisar la decisión si:** el número de íconos crece mucho (cientos) o un mismo ícono se repite muchas veces en una pantalla, porque entonces el peso del HTML importa y el sprite vuelve a convenir; o si se necesitan íconos rellenos, porque la función tendría que aceptar más de un estilo.
