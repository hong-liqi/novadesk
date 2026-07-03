/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: '/analytics',
  transpilePackages: ['@portfolio/ui'],
  output: 'standalone',
};

module.exports = nextConfig;
