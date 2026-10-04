/**
 * All editable content for the site lives in this file.
 * Change a phone number, a sentence or a translation here; components read from it.
 * Anything written as [[LIKE_THIS]] is a placeholder waiting for real content.
 */

export const locales = ['sv', 'en', 'ar'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'sv';

/** Settings per language: name shown in the language switcher, and text direction. */
export const localeInfo: Record<Locale, { label: string; dir: 'ltr' | 'rtl' }> = {
  sv: { label: 'Svenska', dir: 'ltr' },
  en: { label: 'English', dir: 'ltr' },
  ar: { label: 'العربية', dir: 'rtl' },
};

/** Facts that are the same in every language. */
export const business = {
  name: '4you Taxi',
  driverName: 'Rashid Alkanafani',
  phone: {
    /** How the number is shown on the page. */
    display: '+46 73 725 01 75',
    /** Used in tel: and sms: links. No spaces. */
    e164: '+46737250175',
  },
  /** WhatsApp number: country code and number, digits only (used in https://wa.me/…). */
  whatsapp: '46737250175',
  email: 'rashidalkanafani@gmail.com',
  region: 'Jönköpings län',
  country: 'SE',
} as const;

/** The car. Only confirmed facts (see CLAUDE.md §1). */
export const car = {
  model: 'Škoda Octavia',
} as const;

/** Car rotation frames in public/car360/. Update `count` if frames are added or removed. */
export const carFrames = {
  basePath: '/car360/frame_',
  extension: '.webp',
  count: 145,
  width: 1280,
  height: 720,
} as const;

/** Text per language. Swedish and Arabic are drafts and should be checked by a native speaker. */
export const content: Record<
  Locale,
  {
    meta: { title: string; description: string };
    tagline: string;
    availability: string;
    serviceArea: string;
    languagesSpoken: string;
    languageSwitcherLabel: string;
    /** Car details section: 4 to 6 short, confirmed facts. */
    carFeatures: string[];
  }
> = {
  sv: {
    meta: {
      title: '4you Taxi – Taxi i Jönköpings län',
      description:
        'Ring 4you Taxi för en trygg resa i Jönköpings län. Föraren talar svenska, engelska och arabiska.',
    },
    tagline: 'Säker. Snabb. Pålitlig.',
    availability: 'Tillgänglig vid beställning – ring eller skriv.',
    serviceArea: 'Jönköpings län',
    languagesSpoken: 'Svenska, engelska och arabiska',
    languageSwitcherLabel: 'Välj språk',
    carFeatures: [
      '4 platser',
      'Barnstol kan monteras',
      'Stort bagageutrymme',
      'Fyrhjulsdrift (4x4)',
    ],
  },
  en: {
    meta: {
      title: '4you Taxi – Taxi in Jönköping County',
      description:
        'Call 4you Taxi for a safe ride in Jönköping County. The driver speaks Swedish, English and Arabic.',
    },
    tagline: 'Safe. Fast. Reliable.',
    availability: 'Available on call. Ring or message to book.',
    serviceArea: 'Jönköping County',
    languagesSpoken: 'Swedish, English and Arabic',
    languageSwitcherLabel: 'Choose language',
    carFeatures: [
      '4 seats',
      'Child seat can be fitted',
      'Large luggage space',
      'Four-wheel drive (4x4)',
    ],
  },
  ar: {
    meta: {
      title: '4you Taxi – تاكسي في مقاطعة يونشوبينغ',
      description:
        'اتصل بـ 4you Taxi لرحلة آمنة في مقاطعة يونشوبينغ. السائق يتحدث السويدية والإنجليزية والعربية.',
    },
    tagline: 'آمن. سريع. موثوق.',
    availability: 'متاح عند الطلب. اتصل أو أرسل رسالة للحجز.',
    serviceArea: 'مقاطعة يونشوبينغ',
    languagesSpoken: 'السويدية والإنجليزية والعربية',
    languageSwitcherLabel: 'اختر اللغة',
    carFeatures: ['4 مقاعد', 'يمكن تركيب مقعد للأطفال', 'مساحة كبيرة للأمتعة', 'دفع رباعي (4x4)'],
  },
};
