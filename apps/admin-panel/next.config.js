/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: '/admin',
  transpilePackages: ['@portfolio/ui'],
  output: 'standalone',
};

module.exports = nextConfig;
