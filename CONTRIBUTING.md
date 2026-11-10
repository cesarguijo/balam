# Cómo trabajar en Balam

Esta guía explica las convenciones del proyecto. Las razones detrás de cada una están en [docs/decisiones](docs/decisiones/).

## Antes de empezar

Trae siempre los últimos cambios antes de editar:

```bash
git pull
```

## El flujo de cada tarea

1. **Entender:** ¿qué necesita el alumno o la familia? ¿En qué pantalla aparece?
2. **Aprender lo justo:** solo lo que la tarea requiere.
3. **Diseñar en Figma:** explorar con colores sueltos, crear el componente y sus variantes, probar el prototipo y, al final, conectar todo a variables.
4. **Construir:** exportar los tokens (`npm run tokens`), escribir el CSS y, si hace falta, el JavaScript.
5. **Probar:** en un celular real y en pantalla de 320 px de ancho.
6. **Cerrar:** commit, `firebase deploy` y actualizar la documentación.

### Una tarea está terminada cuando…

- [ ] Usa solo variables de diseño (ningún color o medida suelta).
- [ ] Funciona en un celular real, con 320 px de ancho.
- [ ] El texto tiene contraste de al menos 4.5:1 y los elementos táctiles miden 48 px o más.
- [ ] Está en GitHub y publicada en Firebase.
- [ ] Las decisiones importantes quedaron documentadas.

## Nombres

- **Archivos y carpetas:** minúsculas, sin acentos ni ñ, palabras separadas con guion medio (`pie-instalacion`, `0002-tokens-de-diseno.md`).
- **El mismo nombre en todas partes:** un componente se llama igual en Figma, en su carpeta y en su clase CSS (`boton` → `componentes/boton/` → `.boton`).
- **Pantallas en Figma:** `pantalla/tamaño/estado` (por ejemplo `bienvenida/320x568/instalar`).

## CSS

### Clases con BEM

| Qué es | Cómo se escribe | Ejemplo |
| --- | --- | --- |
| **Bloque** (el componente) | `nombre` | `boton` |
| **Parte** de adentro | `bloque__parte` | `boton__cuerpo`, `boton__etiqueta` |
| **Variante** | `bloque--variante` | `boton--relleno`, `boton--contorno` |

Los **estados** no llevan clase: se usan los del navegador (`:active`, `:disabled`, `:focus-visible`, `[aria-busy="true"]`).

Los **ids** solo sirven para que JavaScript encuentre un elemento; nunca se usan para dar estilo.

### Capas y orden

`index.html` enlaza solo `css/estilos.css`, que importa todo en capas:

```css
@layer tokens, base, componentes, pantallas;
```

Cada componente o pantalla nueva agrega su línea `@import` en `estilos.css`.

### Variables

- Se usan siempre las variables de `tokens.css` (`var(--accion-primaria-fondo)`), nunca colores escritos a mano.
- `tokens.css` **se genera** con `npm run tokens`; los cambios empiezan en Figma.
- Dentro de un componente, las variables locales empiezan con guion bajo (`--_fondo`) y cada variante solo cambia esas variables.

Cada archivo CSS de componente empieza con un comentario que lista sus partes, variantes y estados.

## JavaScript

- JavaScript moderno, sin frameworks, con módulos (`import` / `export`).
- Cada pantalla vive en `pantallas/nombre/` y exporta una función que la dibuja dentro de `#app`.
- Las funciones exportadas llevan un comentario [JSDoc](https://jsdoc.app):

  ```js
  /**
   * Dibuja la pantalla del catálogo.
   * @param {HTMLElement} app - El contenedor donde se dibuja la pantalla.
   */
  ```

- La lógica (calcular, decidir) se separa de la pantalla (dibujar), para poder probarla.

## Commits

En español, explicando qué cambia y por qué:

```
Botón: agrega el estado cargando con indicador de pirámide
```

## Documentar una decisión

Cuando tomes una decisión que afecte al proyecto, crea un archivo en `docs/decisiones/` con el siguiente número (`0004-…`) usando la [plantilla](docs/decisiones/plantilla.md).