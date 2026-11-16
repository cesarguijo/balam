[English](CONTRIBUTING.md) | **Español**

# Cómo trabajar en Balam

Esta guía explica las convenciones del proyecto. Las razones detrás de cada una están en [docs/decisions](docs/decisions/) (en inglés).

## Antes de empezar

Trae siempre los últimos cambios antes de editar:

```bash
git pull
```

## El flujo de cada tarea

1. **Entender:** ¿qué necesita el alumno o la familia? ¿En qué pantalla aparece?
2. **Aprender lo justo:** solo lo que la tarea requiere.
3. **Lógica primero:** escribir las funciones puras con sus pruebas (`npm test`). La lógica bien definida dice qué estados y mensajes debe tener el diseño.
4. **Diseñar en Figma:** explorar con colores sueltos, crear el componente y sus variantes (una por cada estado que pide la lógica), probar el prototipo y, al final, conectar todo a variables.
5. **Construir:** exportar los tokens (`npm run tokens`), escribir el HTML y el CSS, y conectar la lógica a la pantalla.
6. **Probar:** en un celular real y en pantalla de 320 px de ancho.
7. **Cerrar:** commit, `firebase deploy` y actualizar la documentación.

Si al diseñar aparece lógica que faltaba (un estado "cargando", un botón para mostrar la clave), se vuelve al paso 3 y se agrega con su prueba.

### Una tarea está terminada cuando…

- [ ] La lógica pura tiene sus pruebas y `npm test` pasa.
- [ ] `npm run lint` pasa.
- [ ] Usa solo variables de diseño (ningún color o medida suelta).
- [ ] Todo texto que ve el usuario sale del catálogo (`t('clave')`).
- [ ] Funciona en un celular real, con 320 px de ancho.
- [ ] El texto tiene contraste de al menos 4.5:1 y los elementos táctiles miden 48 px o más.
- [ ] Está en GitHub y publicada en Firebase.
- [ ] Las decisiones importantes quedaron documentadas.

## Idioma

- **Código, comentarios, JSDoc, commits y documentación:** en inglés ([ADR 0009](docs/decisions/0009-english-code-and-i18n.md)).
- **Texto que ve el usuario:** en español, solo en el catálogo de mensajes (`public/js/i18n/es.js`).
- README y CONTRIBUTING tienen versión en español (`.es.md`). Actualiza las dos en cada cambio.

## Nombres

- **Archivos y carpetas:** en inglés, minúsculas, palabras separadas con guion medio (`install-footer`, `0002-design-tokens.md`).
- **El mismo nombre en todas partes:** un componente se llama igual en Figma, en su carpeta, en su clase CSS y en su etiqueta (`button` → `components/button/` → `.button` → `<balam-button>`).
- **Las variantes de Figma** usan las mismas claves que el código (`android-chrome`, `ios-safari`, `desktop`…).
- **Pantallas en Figma:** `pantalla/tamaño/estado` (por ejemplo `welcome/320x568/install`).

## CSS

### Clases con BEM

| Qué es                     | Cómo se escribe    | Ejemplo                                |
| -------------------------- | ------------------ | -------------------------------------- |
| **Bloque** (el componente) | `nombre`           | `button`                               |
| **Elemento** de adentro    | `bloque__elemento` | `button__body`, `button__loader`       |
| **Modificador** (variante) | `bloque--variante` | `button--primary`, `button--secondary` |

Los **estados** no llevan clase: se usan los del navegador (`:active`, `:disabled`, `:focus-visible`, `[aria-busy="true"]`).

Los **ids** solo sirven para que JavaScript encuentre un elemento; nunca se usan para dar estilo.

### Capas y orden

`index.html` enlaza solo `css/styles.css`, que importa todo en capas:

```css
@layer tokens, base, components, screens;
```

Cada componente o pantalla nueva agrega su línea `@import` en `styles.css`. No envuelvas los archivos en `@layer`: `styles.css` ya la asigna.

### Variables

- Se usan siempre las variables de `tokens.css` (`var(--action-primary-background)`), nunca colores escritos a mano.
- `tokens.css` **se genera** con `npm run tokens`; los cambios empiezan en Figma.
- Dentro de un componente, las variables locales empiezan con guion bajo (`--_strip-top`) y cada variante solo cambia esas variables.
- Para el texto, usa las clases de tipografía: `.text-display`, `.text-title`, `.text-body`, `.text-label`.

Cada archivo CSS de componente empieza con un comentario que lista sus partes, variantes y estados.

## JavaScript

- JavaScript moderno, sin frameworks, con módulos (`import` / `export`).
- Cada pantalla vive en `screens/<nombre>/` y exporta una función que la dibuja dentro de `#app`.
- Los componentes con comportamiento son Custom Elements sin Shadow DOM, con un `<button>` real por dentro ([ADR 0005](docs/decisions/0005-components-with-custom-elements.md)).
- La lógica (calcular, decidir) se separa de la pantalla (dibujar), en funciones puras que se pueden probar en Node.
- Cada función lleva un comentario [JSDoc](https://jsdoc.app), en inglés, que empieza con un verbo en tercera persona:

  ```js
  /**
   * Draws the playground screen.
   * @param {HTMLElement} app - The container where the screen is drawn.
   */
  ```

- Íconos: `${icon('nombre')}` de `js/icons.js` ([ADR 0006](docs/decisions/0006-icons-drawn-with-js.md)).
- Las plantillas HTML en JS empiezan con el comentario `/* HTML */`, para que Prettier las formatee.

### Texto que ve el usuario

Nunca se escribe en el código. Agrega una clave a `js/i18n/es.js` y usa `t('clave')`:

```js
// es.js
'login.error.offline': 'No tiene conexión a internet, conéctese nuevamente.',

// login.js
message.textContent = t('login.error.offline');
```

Las claves van en inglés y agrupadas por pantalla o componente. Cada texto es una oración completa; se permite HTML en línea (`<strong>`, `<br />`) dentro de él.

## Commits

En inglés, con un título corto en imperativo que diga qué cambia:

```
Add loading state to the button
```

Si hace falta explicar, agrega una descripción después de una línea en blanco, con el porqué.

## Documentar una decisión

Cuando tomes una decisión que afecte al proyecto, crea un archivo en `docs/decisions/` con el siguiente número (`0010-…`), en inglés, usando la [plantilla](docs/decisions/template.md).
