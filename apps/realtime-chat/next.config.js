/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: '/chat',
  transpilePackages: ['@novadesk/ui', '@novadesk/auth', '@novadesk/sdk'],
  output: 'standalone',
};

module.exports = nextConfig;
