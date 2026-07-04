/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: '/admin',
  transpilePackages: ['@portfolio/ui', '@portfolio/auth', '@portfolio/sdk'],
  output: 'standalone',
};

module.exports = nextConfig;
