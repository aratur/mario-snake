module.exports = {
  env: {
    browser: true,
    es2020: true,
    jest: true,
  },
  extends: [
    'plugin:react/recommended',
    'plugin:testing-library/react',
    'plugin:testing-library/recommended',
    'plugin:jest-dom/recommended',
    'airbnb',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:@typescript-eslint/eslint-recommended",
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 11,
    sourceType: 'module',
  },
  plugins: [
    'react',
    'testing-library',
    'jest-dom',
    '@typescript-eslint',
  ],
  rules: {
    "@typescript-eslint/rule-name": "error",
    'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx', '.tsx', '.ts'] }],
    'no-console': 'off',
    'no-plusplus': ['error', { 'allowForLoopAfterthoughts': true }],
  },
};
