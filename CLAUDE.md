# Balam

PWA gratuita para aprender matemáticas y comunicarse con las familias. JavaScript puro (sin framework), alojada en Firebase (`balam-math.web.app`). Autor: César Arguijo, docente de matemáticas en Honduras.

## Cómo trabajamos

- **César escribe el código.** Claude explica, da pistas y revisa. Da ejemplos más completos solo cuando César está trabado o lo pide.
- **No edites archivos ni hagas commits** salvo que César lo pida explícitamente. Siempre con permiso, sin excepciones: si Claude escribe algo sin que César se dé cuenta, César no aprende y pierde el control del proyecto.
- **Documentos** (ADR, guías) que resumen algo ya discutido: Claude puede ofrecerse a redactarlos (con permiso) y César los revisa, para no reescribir lo que ya se habló.
- **Vamos por partes**: poca información a la vez, un paso, luego el siguiente. Enseña como en una clase.
- Todo en **español**. Prácticas estándar de la industria.
- Al revisar: primero lo que está bien, luego los errores de más a menos importante.

## Estructura

```
public/                  → lo que se publica
  componentes/<nombre>/  → Custom Elements (<nombre>.js, <nombre>.css y archivos propios)
  pantallas/<nombre>/    → una pantalla por carpeta
  js/                    → lógica compartida (enrutador, instalación, plataforma, íconos, utilidades)
  css/                   → estilos.css importa todo con @layer; tokens.css es GENERADO
pruebas/                 → pruebas con node:test (*.test.js)
tokens/                  → tokens de diseño DTCG (fuente de tokens.css)
docs/decisiones/         → ADR numerados; plantilla.md es el formato
```

## Convenciones

- **Nombres**: carpeta + nombre dicen qué es. Sufijos solo cuando una herramienta los necesita (`.test.js`, `.tokens.json`). Lo que usa un solo componente vive en su carpeta.
- **Componentes** (ADR 0005): Custom Elements sin Shadow DOM, con un `<button>` real dentro. Atributos como entradas, `#privados`, nada de `id` dentro del componente. Los componentes solo de estilo son HTML + CSS con BEM.
- **CSS**: BEM, tokens (`var(--...)`), nada de valores fijos. No envolver archivos en `@layer` (ya lo asigna `estilos.css`).
- **Íconos** (ADR 0006): `${icono('nombre')}` desde `js/iconos.js`. Solo de línea, 24×24; se guarda solo el interior (`<path>`).
- **HTML en JS**: plantillas con el comentario `/* HTML */` para que Prettier las formatee.
- **Funciones puras** (sin `window`, `document`, `navigator`) en su propio archivo, para poder probarlas en Node.
- **JSDoc** en todo: `@file` con la forma "[qué es]: [verbo]…"; funciones empiezan con verbo en tercera persona; los comentarios explican el _por qué_.
- **Pendientes de código**: `// TODO:` o `// FIXME:` en su propia línea, justo arriba del código (o arriba de su JSDoc). leasot ignora los que van al final de una línea con código. Pendientes grandes van a Notion.

## Comandos

- `npm test`: pruebas
- `npm run cobertura`: cobertura con c8 (reporte en `coverage/`, no se sube)
- `npm run lint`: ESLint + cSpell en identificadores
- `npm run docs`: genera `docs/codigo.md` desde JSDoc
- `npm run tokens`: genera `public/css/tokens.css` (no editarlo a mano)
- `npm run pendientes`: genera `docs/pendientes.md` con los `TODO:` y `FIXME:` de `public/` (con leasot)
- Live Server con raíz `/public`

## Fuentes de verdad

- **Notion**: planificación, pendientes, investigación.
- **Figma**: diseño (archivo "Balam"). Las variantes usan las mismas claves que el código (`android-chrome`, `ios-safari`…).
- **docs/decisiones/**: por qué se hizo cada cosa.
