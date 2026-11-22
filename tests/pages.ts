import { business, locales, localeInfo, type Locale } from '../src/data/site';

/** The address of each language's page, as built by Astro (Swedish is the default, at /). */
export const pages: { locale: Locale; path: string; dir: 'ltr' | 'rtl' }[] = locales.map(
  (locale) => ({
    locale,
    path: locale === 'sv' ? '/' : `/${locale}/`,
    dir: localeInfo[locale].dir,
  }),
);

export { business };
