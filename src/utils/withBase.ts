/** Prefixes a public/ path with the base path (e.g. /4you-taxi on GitHub Pages). */
export const withBase = (path: string): string =>
  `${import.meta.env.BASE_URL.replace(/\/$/, '')}${path}`;
