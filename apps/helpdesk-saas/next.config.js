/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: '/helpdesk',
  transpilePackages: ['@portfolio/ui'],
  output: 'standalone',
};

module.exports = nextConfig;
