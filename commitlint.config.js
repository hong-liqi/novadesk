module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'scope-enum': [
      2,
      'always',
      [
        'auth',
        'gateway',
        'notification',
        'helpdesk',
        'analytics',
        'chat',
        'admin',
        'website',
        'ui',
        'shared',
        'logger',
        'config',
        'eslint-config',
        'tsconfig',
        'infra',
        'docs',
        'deps',
      ],
    ],
    'header-max-length': [2, 'always', 100],
  },
};
