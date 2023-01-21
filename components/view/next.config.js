/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // experimental: {
  //   appDir: true,
  // },
  eslint: {
    dirs: ['components/view/pages', 'components/view/src'],
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'aerial-challenge.s3.ap-northeast-1.amazonaws.com',
      }
    ]
  }
};

module.exports = nextConfig;
