module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
      'airbnb-base',
      'eslint:recommended',
      'prettier',
      'plugin:import/recommended',
      'plugin:@typescript-eslint/recommended',
  ],
  parserOptions: {
    files: ['(src|tests)/**/*.ts', '(src|tests)/**/*.d.ts', '(src|tests)/**/*.js'],
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  settings: {
    'import/resolver': {
      typescript: true,
    }
  },
  plugins: ['jest', '@typescript-eslint'],
  rules: {
      'linebreak-style': 'off',
      'no-return-await': 'error',
      'object-shorthand': ['error', 'always', { avoidExplicitReturnArrows: true }],
      'class-methods-use-this': 'off',
      'default-param-last': 'warn',
      'no-template-curly-in-string': 'warn',
      'func-names': 0,
      'import/extensions': 0,
      '@typescript-eslint/explicit-module-boundary-types': 0,
      'import/prefer-default-export': 0,
      // enforce explicit Typescript typing
  },
  env: {
      node: true,
      es6: true,
      jest: true,
  },
};
