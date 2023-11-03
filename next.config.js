/** @type {import('next').NextConfig} */

const { withKumaUI } = require('@kuma-ui/next-plugin');

const nextConfig = {
  compiler: {
    styledComponents: true,
  },
  experimental: {
    esmExternals: 'loose',
    serverActions: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.scdn.co',
        port: '',
        pathname: '/image/**',
      },
      {
        protocol: 'https',
        hostname: 'mosaic.scdn.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
  env: {
    mock: true,
  },
};

module.exports = withKumaUI(nextConfig);
