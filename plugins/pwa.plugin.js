const withPWA = require('next-pwa')({
  dest: 'public',
  runtimeCaching: [
    {
      // Cache all static files
      urlPattern: /^https?.*\.(png|jpg|jpeg|gif|webp|svg|ico|css|js|woff|woff2|json)/,
      // Apply stale-while-revalidate strategy
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'static-cache',
        expiration: {
          maxAgeSeconds: 60 * 60 * 24 * 30,
        },
        cacheableResponse: {
          statuses: [200],
        },
      },
    },
  ],
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
});

module.exports = { withPWA };
