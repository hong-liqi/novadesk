import nestjsConfig from '@portfolio/eslint-config/nestjs';

export default [
  { ignores: ['src/generated/**'] },
  ...nestjsConfig,
  {
    files: ['**/*.spec.ts'],
    rules: {
      '@typescript-eslint/no-unsafe-assignment': 'off',
    },
  },
];
