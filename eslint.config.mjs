import { FlatCompat } from '@eslint/eslintrc';
import eslint from '@eslint/js';
import prettier from 'eslint-plugin-prettier';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import { dirname } from 'path';
import tseslint from 'typescript-eslint';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
  plugins: {
    'simple-import-sort': simpleImportSort,
    prettier: prettier,
  },
});

const eslintConfig = [
  {
    ignores: [
      'node_modules/**/*',
      '.next/**/*',
      'dist/**/*',
      'build/**/*',
      'coverage/**/*',
      '*.log',
      '*.d.ts',
      '**/postcss.config.mjs',
      '**/*.config.*',
    ],
  },
  // ✅ Base configs: recommended & recommendedTypeChecked
  ...tseslint.config(
    eslint.configs.recommended,
    tseslint.configs.recommendedTypeChecked,
    {
      languageOptions: {
        parserOptions: {
          project: true,
          tsconfigRootDir: __dirname,
        },
      },
    },
  ),

  // ✅ Compat config for Prettier, import sort, etc.
  ...compat.config({
    plugins: ['prettier', 'simple-import-sort'],
    rules: {
      semi: ['error'],
      'prettier/prettier': 'warn',

      'arrow-body-style': ['error', 'as-needed'],
      'prefer-template': 'error',
      'no-console': 'warn',
      camelcase: ['warn', { ignoreDestructuring: true, properties: 'never' }],
      'no-underscore-dangle': 'warn',

      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',

      '@typescript-eslint/no-unused-vars': 'error',
      '@typescript-eslint/no-floating-promises': 'warn',
      '@typescript-eslint/await-thenable': 'error',
      '@typescript-eslint/no-misused-promises': 'off',
    },
    settings: {
      next: {
        rootDir: ['src/app/'],
      },
    },
  }),
  // ✅ Ensure type-aware linting for TS files
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: true,
        tsconfigRootDir: __dirname,
      },
    },
  },
];

export default eslintConfig;
