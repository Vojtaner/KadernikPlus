import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import pluginReact from 'eslint-plugin-react';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    plugins: { js },
    extends: ['js/recommended'],
    ignores: ['dist/**'],
  },
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    languageOptions: { globals: globals.browser },
    ignores: ['dist/**'],
  },
  { ignores: ['.config/', 'dist/', 'tsconfig.json'] },
  tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  {
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      'prefer-const': 'error',
      'react/react-in-jsx-scope': 'off',
      'react/jsx-curly-brace-presence': ['error', { props: 'never', children: 'never' }],
      curly: ['error', 'all'],

      // Konzistentní uvozovky
      quotes: ['error', 'single', { avoidEscape: true }],

      // Středníky
      semi: ['error', 'always'],
      'no-extra-semi': 'error',
      //problém u definicí s typy ve funkci
      // 'no-unused-vars': [
      //   'error',
      //   {
      //     argsIgnorePattern: '^_',
      //     varsIgnorePattern: '^_',
      //     ignoreRestSiblings: true,
      //   },
      // ],

      // Prázdné funkce
      'no-empty-function': 'error',

      // Odsazení po return
      'no-unreachable': 'error',
      'no-unreachable-loop': 'error',

      indent: 'off',

      // Mezery a formátování
      'space-before-blocks': 'error',
      'space-infix-ops': 'error',
      'object-curly-spacing': ['error', 'always'],
      'array-bracket-spacing': ['error', 'never'],

      // Čárky
      'comma-dangle': ['error', 'always-multiline'],
      'comma-spacing': ['error', { before: false, after: true }],
      'jsx-quotes': ['error', 'prefer-double'],
      // Zbytečné závorky v JSX

      'react/self-closing-comp': [
        'error',
        {
          component: true,
          html: true,
        },
      ],

      // Key prop
      'react/jsx-key': [
        'error',
        {
          checkFragmentShorthand: true,
        },
      ],
      // Hooks pravidla
      // 'react-hooks/rules-of-hooks': 'error',
      // 'react-hooks/exhaustive-deps': 'warn',

      // React moderne

      'react/prop-types': 'off',

      // === BEZPEČNOSTNÍ PRAVIDLA ===

      // Zakázat eval
      'no-eval': 'error',
      'no-implied-eval': 'error',

      // Zakázat console (s výjimkami)
      'no-console': ['warn', { allow: ['warn', 'error'] }],

      // Zakázat debugger
      'no-debugger': 'error',

      // === KVALITA KÓDU ===

      // Komplexita
      // komplexita funkcí na 10 řádků
      // complexity: ['error', 10],
      'max-depth': ['error', 4],
      // 'max-lines-per-function': ['error', 50],

      // Porovnávání
      eqeqeq: ['error', 'always'],

      // 'import/no-duplicates': 'error',
      // 'import/order': [
      //   'error',
      //   {
      //     groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
      //     'newlines-between': 'always',
      //     alphabetize: {
      //       order: 'asc',
      //       caseInsensitive: true,
      //     },
      //   },
      // ],
    },
  },
]);
