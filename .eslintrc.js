module.exports = {
  'env': {
    'browser': true,
    'es2021': true,
  },
  'extends': [
    'airbnb-base',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
  'settings': {
    'import/resolver': {
      'typescript': {},
    },
  },
  'overrides': [
    {
      'env': {
        'node': true,
      },
      'files': [
        '.eslintrc.{js,cjs}',
      ],
      'parserOptions': {
        'sourceType': 'script',
      },
    },
  ],
  'parserOptions': {
    'ecmaVersion': 'latest',
    'sourceType': 'module',
  },
  'rules': {
    'no-shadow': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    '@typescript-eslint/no-shadow': 'off',
    'import/no-extraneous-dependencies': 'off',
    'default-param-last': 'off',
    'import/no-unresolved': 'off',
    'no-param-reassign': 'off',
    'no-unused-vars': 'off',
    'no-underscore-dangle': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    'class-methods-use-this': 'off',
    'import/prefer-default-export': 'off',
    'no-empty-function': 'off',
    'no-useless-constructor': 'off',
    'new-cap': 'warn',
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        js: 'never',
        jsx: 'never',
        ts: 'never',
        tsx: 'never',
      },
    ],
  },
};
