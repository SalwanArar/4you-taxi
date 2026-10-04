// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  // Set this to the real address once there is a domain, e.g. 'https://4youtaxi.se'.
  // Canonical and hreflang links are only output when `site` is set.
  // site: '',
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
