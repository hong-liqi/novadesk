import nestjsConfig from '@novadesk/eslint-config/nestjs';

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
