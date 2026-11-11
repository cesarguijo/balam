// Configuración de ESLint (formato "flat config", el estándar desde ESLint 9).
import js from '@eslint/js';
import globals from 'globals';
import cspell from '@cspell/eslint-plugin';

export default [
  // 1. Reglas recomendadas para cualquier JavaScript.
  js.configs.recommended,

  // 2. Reglas para el código de la app.
  {
    files: ['public/**/*.js'],

    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module', // usamos import/export
      globals: {
        ...globals.browser,       // window, document, navigator…
        ...globals.serviceworker, // self, caches… (para sw.js)
      },
    },

    plugins: { '@cspell': cspell },

    rules: {
      // Ortografía SOLO de nombres (variables, funciones, propiedades).
      // Los comentarios y textos los revisa la extensión de VS Code, con tildes.
      '@cspell/spellchecker': ['warn', {
        checkIdentifiers: true,
        checkComments: false,
        checkStrings: false,
        checkStringTemplates: false,
        customWordListFile: './palabras-codigo.txt',
      }],
    },
  },
];