// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  // Where the site is published. Set by the GitHub Pages workflow (.github/workflows/deploy.yml);
  // unset locally, so `npm run dev` serves from the root. Once there is a domain, set it here,
  // e.g. site: 'https://4youtaxi.se'. Canonical and hreflang links are only output when `site` is set.
  site: process.env.SITE_URL || undefined,
  base: process.env.BASE_PATH || undefined,
  // The sitemap needs `site`, so it is only generated for published builds.
  integrations: process.env.SITE_URL ? [sitemap()] : [],
  // The CSS is small, so inline it and save a render-blocking request.
  build: { inlineStylesheets: 'always' },
  i18n: {
    locales: ['sv', 'en', 'ar'],
    defaultLocale: 'sv',
    routing: {
      prefixDefaultLocale: false,
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
