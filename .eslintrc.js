'use strict';

module.exports = {
  parser: require.resolve('@typescript-eslint/parser'),
  extends: [
    'plugin:node/recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:react/recommended',
    'prettier',
  ],
  plugins: [
    'node',
    'prettier',
    'import',
    '@typescript-eslint',
    'react',
    'react-hooks',
  ],
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  env: {
    node: true,
    es6: true,
  },
  rules: {
    '@typescript-eslint/array-type': ['error', { default: 'array-simple' }],
    '@typescript-eslint/no-require-imports': 'error',
    '@typescript-eslint/ban-ts-ignore': 'warn',
    '@typescript-eslint/ban-types': 'error',
    '@typescript-eslint/no-unused-vars': 'error',
    'no-else-return': 'error',
    'no-negated-condition': 'error',
    eqeqeq: ['error', 'smart'],
    strict: 'error',
    'prefer-template': 'warn',
    'object-shorthand': ['warn', 'always', { avoidExplicitReturnArrows: true }],
    'prefer-destructuring': [
      'error',
      { VariableDeclarator: { array: true, object: true } },
    ],
    'sort-imports': ['error', { ignoreDeclarationSort: true }],
    'prettier/prettier': 'error',
    // TS covers this
    'node/no-missing-import': 'off',
    'node/no-unsupported-features/es-syntax': 'off',
    'node/no-unsupported-features/es-builtins': 'error',
    'import/no-commonjs': 'error',
    'import/no-duplicates': 'error',
    'import/no-extraneous-dependencies': 'error',
    'import/no-unused-modules': 'error',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'error',
    // handled by TS
    'react/prop-types': 'off',
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  overrides: [
    {
      files: '*.js',
      rules: {
        '@typescript-eslint/no-require-imports': 'off',
      },
    },
    {
      files: ['*.ts', '*.tsx'],
      parserOptions: {
        sourceType: 'module',
      },
    },
    {
      files: ['.eslintrc.js', 'babel.config.js'],
      rules: {
        '@typescript-eslint/no-require-imports': 'off',
        'import/no-commonjs': 'off',
      },
    },
  ],
};
