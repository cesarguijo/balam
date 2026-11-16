[English](README.md) | **Español**

# Balam 🐆

**La app de la clase del Prof. César.** Una aplicación web progresiva (PWA), gratuita y sin anuncios, para que los alumnos aprendan matemáticas a su ritmo y para mantener comunicadas a las familias con la clase (avisos, notas y asistencia).

Está pensada para celulares Android sencillos: es ligera, se instala desde el navegador y funciona con poco internet.

> **Estado:** en desarrollo (Sprint 0). Por ahora existen la estructura de la app, el sistema de diseño, los componentes de botón y pie de instalación, y la lógica de la sesión.

## Cómo ponerla a funcionar en tu computadora

Necesitas [Node.js](https://nodejs.org) (versión LTS) y [Git](https://git-scm.com).

```bash
git clone https://github.com/cesarguijo/balam.git
cd balam
npm install
```

Para verla, abre la carpeta `public/` con un servidor local. La forma más sencilla es la extensión **Live Server** de VS Code: abre `public/index.html` y haz clic en **Go Live**.

Pantallas disponibles:

| Dirección      | Pantalla                                  |
| -------------- | ----------------------------------------- |
| `#/home`       | Inicio de la app                          |
| `#/welcome`    | Invitación a instalar la app              |
| `#/playground` | Catálogo de componentes (para desarrollo) |

## Comandos útiles

| Comando            | Qué hace                                                        |
| ------------------ | --------------------------------------------------------------- |
| `npm test`         | Corre las pruebas                                               |
| `npm run coverage` | Corre las pruebas con informe de cobertura (en `coverage/`)     |
| `npm run lint`     | Revisa el código con ESLint y la ortografía de los nombres      |
| `npm run tokens`   | Genera `public/css/tokens.css` a partir de los tokens de diseño |
| `npm run todos`    | Genera `docs/todos.md` con los `TODO:` y `FIXME:` del código    |

## Cómo actualizar los colores y medidas

Los colores y medidas se diseñan en Figma y llegan al código automáticamente. **No edites `public/css/tokens.css` a mano.**

1. En Figma, exporta las variables con el plugin **TokensBrücke** (formato DTCG, con _Omit collection names_ activado).
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
├── css/              estilos globales (styles.css es el índice)
├── components/       un componente por carpeta (button/, install-footer/…)
├── screens/          una pantalla por carpeta (home/, welcome/…)
├── js/               lógica que no es visual (app.js, router.js, session.js…)
│   └── i18n/         los textos que ve el usuario (es.js)
├── fonts/            Atkinson Hyperlegible Next, auto-alojada
└── img/              íconos e imágenes de la app
tests/                pruebas con node:test
tokens/               variables exportadas de Figma
docs/decisions/       por qué el proyecto es como es
```

El código, sus comentarios y las decisiones están en inglés ([ADR 0009](docs/decisions/0009-english-code-and-i18n.md)). Las convenciones para trabajar en el código están en [CONTRIBUTING.es.md](CONTRIBUTING.es.md), y las decisiones importantes, con sus razones, en [docs/decisions](docs/decisions/).

## Licencias

- El **código** está bajo la licencia [AGPL-3.0](LICENSE): cualquiera puede usarlo, estudiarlo y mejorarlo, siempre que lo que haga con él siga siendo libre y abierto.
- El **contenido educativo** (lecciones, ejercicios, textos e imágenes) está bajo [CC BY-NC-SA 4.0](LICENCIA-CONTENIDO.md): se puede adaptar dando crédito, sin venderlo y compartiéndolo con la misma licencia.

Los materiales de terceros y las referencias están en [CREDITOS.md](CREDITOS.md).
