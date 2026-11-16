**English** | [Español](README.es.md)

# Balam 🐆

**Prof. César's class app.** A free, ad-free progressive web app (PWA) that helps students learn math at their own pace and keeps families in touch with the class (notices, grades and attendance).

It is built for simple Android phones: it is light, installs from the browser and works with little internet.

> **Status:** in development (Sprint 0). For now there is the app structure, the design system, the button and install footer components, and the session logic.

## Running it on your computer

You need [Node.js](https://nodejs.org) (LTS version) and [Git](https://git-scm.com).

```bash
git clone https://github.com/cesarguijo/balam.git
cd balam
npm install
```

To see it, serve the `public/` folder with a local server. The easiest way is the VS Code **Live Server** extension: open `public/index.html` and click **Go Live**.

Available screens:

| Address        | Screen                              |
| -------------- | ----------------------------------- |
| `#/home`       | App home                            |
| `#/welcome`    | Invitation to install the app       |
| `#/playground` | Component catalog (for development) |

## Useful commands

| Command            | What it does                                                   |
| ------------------ | -------------------------------------------------------------- |
| `npm test`         | Runs the tests                                                 |
| `npm run coverage` | Runs the tests with a coverage report (in `coverage/`)         |
| `npm run lint`     | Checks the code with ESLint and the spelling of names          |
| `npm run tokens`   | Generates `public/css/tokens.css` from the design tokens       |
| `npm run todos`    | Generates `docs/todos.md` with the code's `TODO:` and `FIXME:` |

## Updating colors and sizes

Colors and sizes are designed in Figma and reach the code automatically. **Do not edit `public/css/tokens.css` by hand.**

1. In Figma, export the variables with the **TokensBrücke** plugin (DTCG format, with _Omit collection names_ turned on).
2. Replace `tokens/balam.tokens.json` with the exported file.
3. Generate the CSS:

   ```bash
   npm run tokens
   ```

## Publishing it

The app is published on Firebase Hosting:

```bash
firebase deploy
```

## How it is organized

```
public/
├── index.html        a single HTML file: it is an SPA
├── css/              global styles (styles.css is the index)
├── components/       one component per folder (button/, install-footer/…)
├── screens/          one screen per folder (home/, welcome/…)
├── js/               non-visual logic (app.js, router.js, session.js…)
│   └── i18n/         the texts the user sees (es.js)
├── fonts/            Atkinson Hyperlegible Next, self-hosted
└── img/              app icons and images
tests/                tests with node:test
tokens/               variables exported from Figma
docs/decisions/       why the project is the way it is
```

The conventions for working on the code are in [CONTRIBUTING.md](CONTRIBUTING.md), and the important decisions, with their reasons, in [docs/decisions](docs/decisions/).

## Licenses

- The **code** is under the [AGPL-3.0](LICENSE) license: anyone can use, study and improve it, as long as what they do with it stays free and open.
- The **educational content** (lessons, exercises, texts and images) is under [CC BY-NC-SA 4.0](LICENCIA-CONTENIDO.md): it can be adapted with credit, without selling it and sharing it under the same license.

Third-party materials and references are in [CREDITOS.md](CREDITOS.md).
