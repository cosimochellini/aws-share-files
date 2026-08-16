/**
 * The browser half of the configuration.
 *
 * Everything read here is inlined into the client bundle: next.config.mjs allowlists these
 * exact variable names under its `env` key, and Next.js substitutes them at build time.
 * Nothing else from .env reaches the browser any more.
 *
 * Never add a credential to this file. Secrets belong in env.ts, which is only ever
 * imported from server-side code (pages/api/**, the services behind it, and the build
 * scripts). Adding one here republishes it to every visitor.
 */
export const publicEnv = {
  info: {
    appTitle: process.env.APP_TITLE as string,
    appLogoUrl: process.env.APP_LOGO_URL as string,
    appIconUrl: process.env.APP_ICON_URL as string,
  },

  content: {
    invalidWords: (process.env.CONTENT_INVALID_WORDS as string).split(','),
  },

  // lives here rather than in env.ts because scripts/generate.manifest.node.ts is its only
  // consumer and the manifest is, by definition, public
  get defaultManifest() {
    const { info } = this;
    return {
      name: info.appTitle,
      short_name: info.appTitle,
      start_url: '/files/',
      display: 'standalone',
      orientation: 'portrait',
      icons: [
        {
          src: info.appLogoUrl,
          sizes: '192x192',
          type: 'image/png',
        },
      ],
    };
  },
} as const;
