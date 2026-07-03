/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: '/chat',
  transpilePackages: ['@portfolio/ui'],
  output: 'standalone',
};

module.exports = nextConfig;
