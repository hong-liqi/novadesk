import nodeConfig from './node.js';

export default [
  ...nodeConfig,
  {
    rules: {
      '@typescript-eslint/no-extraneous-class': 'off',
    },
  },
];
