module.exports = {
  root: true,
  env: {
    commonjs: true,
    es6: true,
    node: true,
    browser: true,
  },
  parserOptions: {
    ecmaVersion: 2020,
  },
  plugins: ['eslint-plugin-prettier'],
  extends: [
    'eslint:recommended',
    'eslint-config-prettier',
    'plugin:prettier/recommended', // Prettier plugin
  ],
  rules: {
    'no-console': 'off',
    'prettier/prettier': [
      'error',
      {
        singleQuote: true,
        semi: true,
        useTabs: false,
        tabWidth: 2,
        trailingComma: 'all',
        printWidth: 80,
        bracketSpacing: true,
        arrowParens: 'avoid',
      },
    ],
  },
  ignorePatterns: ['node_modules/', 'dist/'],
};
