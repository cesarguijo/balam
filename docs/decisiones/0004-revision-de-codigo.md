# 0004. Revisión de código y ortografía con dos herramientas

- **Fecha:** 2026-11-10
- **Estado:** aceptada

## Contexto

El proyecto está en español, pero los nombres del código (variables, funciones, clases) no llevan tildes ni ñ, porque así lo pide la convención de nombres del proyecto. En cambio, la documentación JSDoc y los textos que ve el usuario sí deben llevar tildes correctas ("botón", "instalación").

El corrector de VS Code (Code Spell Checker) revisa todo el archivo con las mismas reglas. Con el diccionario de español, marca `avisoInstalacion` como error por la falta de tilde. Si se agrega `instalacion` a la lista de palabras aceptadas, deja de marcar esa misma falta en los comentarios. Una sola herramienta no puede aplicar reglas distintas a los nombres y a los comentarios del mismo archivo.

## Decisión

Cada parte del código la revisa una herramienta distinta:

| Qué se revisa | Herramienta | Regla |
| --- | --- | --- |
| Comentarios (JSDoc) y textos | Code Spell Checker (extensión de VS Code) | Español estricto, con tildes |
| Nombres de variables, funciones y propiedades | ESLint con `@cspell/eslint-plugin` | Sin tildes ni ñ, según `palabras-codigo.txt` |

- `.vscode/settings.json` limita el corrector a comentarios y textos (`includeRegExpList`).
- `eslint.config.mjs` activa la revisión ortográfica solo para nombres (`checkIdentifiers: true`, `checkComments: false`, `checkStrings: false`).
- `palabras-codigo.txt` es el glosario del código: una palabra por línea, sin tildes. Cada palabra nueva que se use en un nombre se agrega ahí.
- ESLint usa además sus reglas recomendadas (`@eslint/js`), que detectan errores comunes como variables que no se usan.
- `npm run lint` revisa todo el código de `public/`.

## Alternativas consideradas

- **Solo Code Spell Checker, agregando las palabras sin tilde como válidas:** se pierde la revisión de tildes en la documentación.
- **Solo Code Spell Checker, sin revisar los nombres:** los errores de dedo en nombres (`avisoInstlacion`) pasan sin aviso.
- **Desactivar la revisión ortográfica:** más simple, pero la documentación es parte del valor del proyecto para quienes lo hereden.

## Consecuencias

- La documentación se revisa con tildes y los nombres sin ellas, en el mismo archivo.
- ESLint también avisa de errores de programación, no solo de ortografía.
- Hay dos herramientas y dos archivos de configuración que mantener.
- Hay que agregar cada palabra nueva de los nombres a `palabras-codigo.txt`; a cambio, ese archivo documenta el vocabulario del código.
- Los términos técnicos en inglés que aparecen en textos (como `'beforeinstallprompt'`) se agregan a `cSpell.words` en `.vscode/settings.json`, nunca palabras en español sin tilde.