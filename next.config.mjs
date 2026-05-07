/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactCompiler: true,
  eslint :{
    ignoreDuringBuilds : true,
  },
    images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname:
          'cdn.simpleicons.org',
      },
    ],
  },
};


export default nextConfig;
