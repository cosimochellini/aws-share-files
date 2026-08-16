/// <reference lib="webworker" />

import type { PrecacheEntry, SerwistGlobalConfig } from 'serwist';
import {
  CacheableResponsePlugin,
  ExpirationPlugin,
  Serwist,
  StaleWhileRevalidate,
} from 'serwist';

declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    // injected by @serwist/next at build time, so the name is not ours to choose
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

declare const self: ServiceWorkerGlobalScope;

const thirtyDays = 60 * 60 * 24 * 30;

const serwist = new Serwist({
  // eslint-disable-next-line no-underscore-dangle -- name is chosen by @serwist/next
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  runtimeCaching: [
    {
      // the single rule next-pwa used to be configured with: cache every static asset,
      // serve it immediately and refresh it in the background
      matcher: /^https?.*\.(png|jpg|jpeg|gif|webp|svg|ico|css|js|woff|woff2|json)/,
      handler: new StaleWhileRevalidate({
        cacheName: 'static-cache',
        plugins: [
          new ExpirationPlugin({ maxAgeSeconds: thirtyDays }),
          new CacheableResponsePlugin({ statuses: [200] }),
        ],
      }),
    },
  ],
});

serwist.addEventListeners();
