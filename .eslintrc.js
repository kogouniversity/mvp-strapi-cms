module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
      'prettier',
      'plugin:@typescript-eslint/recommended',
  ],
  parserOptions: {
    files: ['(src|tests)/**/*.ts', '(src|tests)/**/*.d.ts', '(src|tests)/**/*.js'],
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  ignorePatterns: ["*.tsx"],
  plugins: ['jest', '@typescript-eslint'],
  rules: {
      'linebreak-style': 'off',
      'func-names': 0,
      'import/prefer-default-export': 0,
      // enforce explicit Typescript typing
      '@typescript-eslint/explicit-module-boundary-types': 'error',
  },
  env: {
      node: true,
  },
};
