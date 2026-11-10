# 0002. Tokens de diseño en tres niveles, de Figma al código

- **Fecha:** 2026-11-09
- **Estado:** aceptada

## Contexto

Los colores y medidas se deciden en Figma y deben llegar al código sin errores de copia. El sistema debe permitir cambiar un color en un solo lugar y, en el futuro, agregar un modo oscuro.

## Decisión

1. **Formato:** el estándar W3C Design Tokens (DTCG 2025.10).
2. **Tres niveles de variables:**
   - **Paleta / Medidas (primitivos):** qué color o medida es, en escalas (`ambar/500`, `espacio/24`). Nunca se usan directamente en un diseño.
   - **Roles (semánticos):** para qué se usa (`accion/primaria/fondo`, `margen/pantalla`). Apuntan a los primitivos.
   - **Componentes:** solo para piezas muy específicas (`boton/faceta/izq-arriba`).
3. **Nombres:** en español, minúsculas, sin acentos, agrupados con `/`. Un grupo nunca se repite en dos colecciones.
4. **Cadena automática:** Figma → plugin TokensBrücke → `tokens/balam.tokens.json` → Style Dictionary (`npm run tokens`) → `public/css/tokens.css`.

## Alternativas consideradas

- **Escribir los colores directamente en el CSS:** rápido al principio, pero cada cambio obliga a buscarlos uno por uno.
- **Dos niveles (Paleta y Roles):** suficiente para colores simples, pero el botón facetado necesita valores muy específicos.
- **Copiar los valores a mano de Figma a `tokens.css`:** propenso a errores y a que Figma y el código se desincronicen.

## Consecuencias

- Cambiar un color es cambiar una variable en Figma y correr `npm run tokens`.
- `tokens.css` es un archivo generado: no se edita a mano.
- Agregar un modo oscuro solo requerirá un segundo modo en la colección de Roles.