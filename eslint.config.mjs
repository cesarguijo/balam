// ESLint config ("flat config" format, the standard since ESLint 9).
import js from '@eslint/js';
import globals from 'globals';
import cspell from '@cspell/eslint-plugin';

export default [
  // 1. Recommended rules for any JavaScript.
  js.configs.recommended,

  // 2. Rules for the app code.
  {
    files: ['public/**/*.js'],

    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module', // we use import/export
      globals: {
        ...globals.browser, // window, document, navigator…
        ...globals.serviceworker, // self, caches… (for sw.js)
      },
    },

    plugins: { '@cspell': cspell },

    rules: {
      // Spelling of names ONLY (variables, functions, properties).
      // Comments and strings are checked by the VS Code extension.
      '@cspell/spellchecker': [
        'warn',
        {
          checkIdentifiers: true,
          checkComments: false,
          checkStrings: false,
          checkStringTemplates: false,
          customWordListFile: './code-words.txt',
        },
      ],
    },
  },
  // 3. Rules for the tests (they run in Node).
  {
    files: ['tests/**/*.js'],
    languageOptions: {
      globals: { ...globals.node },
    },
  },
];
