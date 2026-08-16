/// <reference lib="webworker" />

import type { PrecacheEntry, SerwistGlobalConfig } from 'serwist';
import {
  CacheableResponsePlugin,
  ExpirationPlugin,
  NetworkFirst,
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
      // next-pwa unshifted this rule onto whatever runtimeCaching it was given, so the
      // start URL was always covered even though plugins/pwa.plugin.js never mentioned
      // it. Precaching the prerendered pages covers the same ground today, but only for
      // as long as every route stays statically generated, so the fallback is kept.
      matcher: ({ url, sameOrigin }) => sameOrigin && url.pathname === '/',
      handler: new NetworkFirst({
        cacheName: 'start-url',
        plugins: [
          {
            // "/" redirects to "/files", and a redirected navigation request comes back
            // opaque. Left alone it would never be cached, so it is rewritten into a
            // readable 200 first -- this is what next-pwa did here.
            cacheWillUpdate: async ({ response }) => (
              response.type === 'opaqueredirect'
                ? new Response(response.body, {
                  status: 200,
                  statusText: 'OK',
                  headers: response.headers,
                })
                : response
            ),
          },
        ],
      }),
    },
    {
      // the rule plugins/pwa.plugin.js spelled out: cache every static asset, serve it
      // immediately and refresh it in the background
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
