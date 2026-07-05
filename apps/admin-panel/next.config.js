/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: process.env.NEXT_PUBLIC_BASE_PATH ?? '/admin',
  transpilePackages: ['@novadesk/ui', '@novadesk/auth', '@novadesk/sdk'],
  output: 'standalone',
};

module.exports = nextConfig;
