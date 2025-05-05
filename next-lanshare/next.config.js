/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Configure to allow serving files from the uploads directory
  async headers() {
    return [
      {
        source: '/uploads/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, must-revalidate',
          },
        ],
      },
    ];
  },
  // Configure static file serving for uploads
  output: 'standalone',
  experimental: {
    outputFileTracingExcludes: {
      '*': ['node_modules/**/*'],
    },
  },
};

module.exports = nextConfig;
