const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
  runtimeCaching: [
    {
      urlPattern: /^https?.*/,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'offlineCache',
        expiration: {
          maxEntries: 200,
        },
      },
    },
  ],
});

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer(
  withPWA({
    reactStrictMode: true,
    swcMinify: true,
    images: {
      domains: ['localhost'],
      formats: ['image/webp', 'image/avif'],
    },
    experimental: {
      optimizeCss: true,
      scrollRestoration: true,
    },
    compiler: {
      removeConsole: process.env.NODE_ENV === 'production',
    },
    webpack: (config, { dev, isServer }) => {
      // Optimisations webpack
      if (!dev && !isServer) {
        config.optimization.splitChunks.cacheGroups = {
          ...config.optimization.splitChunks.cacheGroups,
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
        };
      }
      return config;
    },
  })
);
