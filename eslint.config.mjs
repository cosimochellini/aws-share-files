import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { FlatCompat } from '@eslint/eslintrc';
import nextPlugin from '@next/eslint-plugin-next';
import tsParser from '@typescript-eslint/parser';
import globals from 'globals';
import reactPlugin from 'eslint-plugin-react';

const compat = new FlatCompat({
  baseDirectory: path.dirname(fileURLToPath(import.meta.url)),
});

/**
 * `next lint` was removed in Next.js 16, so this replaces .eslintrc.json.
 *
 * The airbnb configs have no flat-config build -- 19.0.4 is from 2021 -- so they are
 * pulled in through FlatCompat, which is exactly what @eslint/eslintrc exists for. That
 * also fixes ESLint at 9.x: eslint-plugin-react, which airbnb depends on, still caps its
 * peer range at ^9.7.
 *
 * @next/eslint-plugin-next is registered directly rather than through eslint-config-next.
 * That package would bring its own copies of react, react-hooks, jsx-a11y and import,
 * which collide with the ones airbnb declares. Next's own migration guide prescribes this
 * shape for exactly that situation.
 */
export default [
  {
    ignores: [
      '.next/**',
      'out/**',
      'coverage/**',
      'public/**',
      'next-env.d.ts',
    ],
  },

  ...compat.extends(
    'airbnb',
    'airbnb/hooks',
    'plugin:@typescript-eslint/recommended',
  ),

  {
    files: ['**/*.{js,jsx,ts,tsx}'],

    languageOptions: {
      parser: tsParser,
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        project: './tsconfig.json',
      },
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },

    plugins: {
      '@next/next': nextPlugin,
    },

    settings: {
      react: { version: 'detect' },
      // airbnb-base only teaches the resolver about .mjs/.js/.json, and eslint-config-next
      // used to add the TypeScript extensions on top. Without them every extensionless
      // relative import of a .ts/.tsx file reads as unresolved.
      'import/parsers': { '@typescript-eslint/parser': ['.ts', '.tsx'] },
      'import/resolver': {
        node: { extensions: ['.mjs', '.js', '.jsx', '.json', '.ts', '.tsx'] },
      },
    },

    rules: {
      // eslint-config-next spread this on top of whatever came before it, and it was
      // listed last in the old .eslintrc.json, so it decided the final value of every
      // rule airbnb and react/recommended disagree on. Dropping it would silently turn
      // react/jsx-key and react/no-direct-mutation-state off, because airbnb sets both
      // to "off" and react/recommended is what used to turn them back on.
      ...reactPlugin.configs.recommended.rules,

      // next/core-web-vitals is the recommended set plus the core-web-vitals overrides
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs['core-web-vitals'].rules,

      // the rest of what next/core-web-vitals layered on top of the shared plugins.
      // airbnb already owns react, react-hooks, jsx-a11y and import, so only Next's
      // overrides of them are reproduced here.
      // airbnb/hooks has this at "error". eslint-config-next spread
      // eslint-plugin-react-hooks' recommended set after it, which puts it back to
      // "warn", and it was listed last -- so "warn" is the value this project has always
      // linted with. Escalating it is a separate decision, not part of a version bump.
      'react-hooks/exhaustive-deps': 'warn',

      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'react/no-unknown-property': 'off',
      'react/jsx-no-target-blank': 'off',
      'import/no-anonymous-default-export': 'warn',
      'jsx-a11y/alt-text': ['warn', { elements: ['img'], img: ['Image'] }],
      'jsx-a11y/aria-props': 'warn',
      'jsx-a11y/aria-proptypes': 'warn',
      'jsx-a11y/aria-unsupported-elements': 'warn',
      'jsx-a11y/role-has-required-aria-props': 'warn',
      'jsx-a11y/role-supports-aria-props': 'warn',

      'import/extensions': 'off',
      'react/jsx-filename-extension': [2, { extensions: ['.js', '.jsx', '.ts', '.tsx'] }],
      'react/jsx-props-no-spreading': 'off',
      'import/prefer-default-export': 'off',
      'no-use-before-define': 'off',
      'no-shadow': 'off',
      'react/require-default-props': 'off',
      '@typescript-eslint/no-unused-vars': ['error', {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_',
      }],
      'react/function-component-definition': [2, {
        namedComponents: 'arrow-function',
        unnamedComponents: 'function-expression',
      }],
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-extra-non-null-assertion': 'error',
      '@typescript-eslint/ban-ts-comment': 'warn',
      'jsx-a11y/anchor-is-valid': 'warn',
      'react/display-name': 'off',
      'no-restricted-syntax': 'off',
      'no-continue': 'warn',
      'import/order': ['error', {
        'newlines-between': 'always',
        pathGroupsExcludedImportTypes: ['builtin'],
        groups: [
          // import {useState} from 'React'
          'external',
          // import type {ReactNode} from 'React'
          // 'type',
          'internal',
          'index',
          'parent',
          'sibling',
          'builtin',
          'object',
        ],
      }],
    },
  },
];
