# Balam 🐆

**La app de la clase del Prof. César.** Una aplicación web progresiva (PWA), gratuita y sin anuncios, para que los alumnos aprendan matemáticas a su ritmo y para mantener comunicadas a las familias con la clase (avisos, notas y asistencia).

Está pensada para celulares Android sencillos: es ligera, se instala desde el navegador y funciona con poco internet.

> **Estado:** en desarrollo (Sprint 0). Por ahora existen la estructura de la app, el sistema de diseño y el componente de botón.

## Cómo ponerla a funcionar en tu computadora

Necesitas [Node.js](https://nodejs.org) (versión LTS) y [Git](https://git-scm.com).

```bash
git clone https://github.com/cesarguijo/balam.git
cd balam
npm install
```

Para verla, abre la carpeta `public/` con un servidor local. La forma más sencilla es la extensión **Live Server** de VS Code: abre `public/index.html` y haz clic en **Go Live**.

Pantallas disponibles:

| Dirección | Pantalla |
| --- | --- |
| `#/inicio` | Inicio de la app |
| `#/bienvenida` | Invitación a instalar la app |
| `#/catalogo` | Catálogo de componentes (para desarrollo) |

## Cómo actualizar los colores y medidas

Los colores y medidas se diseñan en Figma y llegan al código automáticamente. **No edites `public/css/tokens.css` a mano.**

1. En Figma, exporta las variables con el plugin **TokensBrücke** (formato DTCG, con *Omit collection names* activado).
2. Reemplaza `tokens/balam.tokens.json` con el archivo exportado.
3. Genera el CSS:

   ```bash
   npm run tokens
   ```

## Cómo publicarla

La app se publica en Firebase Hosting:

```bash
firebase deploy
```

## Cómo está organizada

```
public/
├── index.html        un solo HTML: es una SPA
├── css/              estilos globales (estilos.css es el índice)
├── componentes/      un componente por carpeta (boton/, boton-texto/…)
├── pantallas/        una pantalla por carpeta (inicio/, bienvenida/…)
├── js/               lógica que no es visual (app.js, enrutador.js…)
├── fuentes/          Atkinson Hyperlegible Next, auto-alojada
└── img/              íconos de la app
tokens/               variables exportadas de Figma
docs/decisiones/      por qué el proyecto es como es
```

Las convenciones para trabajar en el código están en [CONTRIBUTING.md](CONTRIBUTING.md), y las decisiones importantes, con sus razones, en [docs/decisiones](docs/decisiones/).

## Licencias

- El **código** está bajo la licencia [AGPL-3.0](LICENSE): cualquiera puede usarlo, estudiarlo y mejorarlo, siempre que lo que haga con él siga siendo libre y abierto.
- El **contenido educativo** (lecciones, ejercicios, textos e imágenes) está bajo [CC BY-NC-SA 4.0](LICENCIA-CONTENIDO.md): se puede adaptar dando crédito, sin venderlo y compartiéndolo con la misma licencia.

Los materiales de terceros y las referencias están en [CREDITOS.md](CREDITOS.md).