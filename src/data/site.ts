/**
 * All editable content for the site lives in this file.
 * Change a phone number, a sentence or a translation here; components read from it.
 * Anything written as [[LIKE_THIS]] is a placeholder waiting for real content.
 */

export const locales = ['sv', 'en', 'ar'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'sv';

/**
 * Settings per language: full name, short name shown in the language switcher on small screens,
 * and text direction.
 */
export const localeInfo: Record<Locale, { label: string; short: string; dir: 'ltr' | 'rtl' }> = {
  sv: { label: 'Svenska', short: 'SV', dir: 'ltr' },
  en: { label: 'English', short: 'EN', dir: 'ltr' },
  ar: { label: 'العربية', short: 'ع', dir: 'rtl' },
};

/** Facts that are the same in every language. */
export const business = {
  name: '4you Taxi',
  driverName: 'Rashid Alkanafani',
  /** Shown in the round badge until there is a driver photo. */
  driverInitials: 'RA',
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

/** Icons available for the car features list (Lucide icon names). */
export type FeatureIcon = 'seats' | 'child-seat' | 'luggage' | 'four-wheel-drive';

interface Content {
  meta: { title: string; description: string };
  skipLink: string;
  languageSwitcherLabel: string;
  tagline: string;
  hero: { title: string; subtitle: string };
  actions: { call: string; callShort: string; whatsapp: string; sms: string; email: string };
  car: { heading: string; alt: string };
  /** Car details section: 4 to 6 short, confirmed facts. */
  carFeatures: { icon: FeatureIcon; text: string }[];
  driver: { heading: string; languagesLabel: string; languagesSpoken: string; bio: string };
  contact: {
    heading: string;
    intro: string;
    phoneLabel: string;
    emailLabel: string;
    areaLabel: string;
    availabilityLabel: string;
    /** Caption under the QR code, which opens a phone call when scanned. */
    qrLabel: string;
  };
  /** Accessible name for the fixed Call/WhatsApp bar on phones. */
  quickContactLabel: string;
  serviceArea: string;
  availability: string;
  footer: { rights: string };
}

/** Text per language. Swedish and Arabic are drafts and should be checked by a native speaker. */
export const content: Record<Locale, Content> = {
  sv: {
    meta: {
      title: '4you Taxi – Taxi i Jönköpings län',
      description:
        'Ring 4you Taxi för en trygg resa i Jönköpings län. Föraren talar svenska, engelska och arabiska.',
    },
    skipLink: 'Hoppa till innehållet',
    languageSwitcherLabel: 'Välj språk',
    tagline: 'Säker. Snabb. Pålitlig.',
    hero: {
      title: 'Taxi i Jönköpings län',
      subtitle: 'Säker. Snabb. Pålitlig. Ring eller skriv när du behöver åka.',
    },
    actions: {
      call: 'Ring nu',
      callShort: 'Ring',
      whatsapp: 'WhatsApp',
      sms: 'Skicka SMS',
      email: 'Skicka e-post',
    },
    car: {
      heading: 'Bilen',
      alt: 'Vit Škoda Octavia-taxi',
    },
    carFeatures: [
      { icon: 'seats', text: '4 platser' },
      { icon: 'child-seat', text: 'Barnstol kan monteras' },
      { icon: 'luggage', text: 'Stort bagageutrymme' },
      { icon: 'four-wheel-drive', text: 'Fyrhjulsdrift (4x4)' },
    ],
    driver: {
      heading: 'Din förare',
      languagesLabel: 'Talar',
      languagesSpoken: 'Svenska, engelska och arabiska',
      bio: '',
    },
    contact: {
      heading: 'Boka en resa',
      intro: 'Ring, skicka SMS eller skriv på WhatsApp.',
      phoneLabel: 'Telefon',
      emailLabel: 'E-post',
      areaLabel: 'Område',
      availabilityLabel: 'Tillgänglighet',
      qrLabel: 'Skanna för att ringa',
    },
    quickContactLabel: 'Snabbkontakt',
    serviceArea: 'Jönköpings län',
    availability: 'Tillgänglig vid beställning',
    footer: { rights: 'Alla rättigheter förbehållna.' },
  },
  en: {
    meta: {
      title: '4you Taxi – Taxi in Jönköping County',
      description:
        'Call 4you Taxi for a safe ride in Jönköping County. The driver speaks Swedish, English and Arabic.',
    },
    skipLink: 'Skip to content',
    languageSwitcherLabel: 'Choose language',
    tagline: 'Safe. Fast. Reliable.',
    hero: {
      title: 'Taxi in Jönköping County',
      subtitle: 'Safe. Fast. Reliable. Call or message whenever you need a ride.',
    },
    actions: {
      call: 'Call now',
      callShort: 'Call',
      whatsapp: 'WhatsApp',
      sms: 'Send SMS',
      email: 'Send email',
    },
    car: {
      heading: 'The car',
      alt: 'White Škoda Octavia taxi',
    },
    carFeatures: [
      { icon: 'seats', text: '4 seats' },
      { icon: 'child-seat', text: 'Child seat can be fitted' },
      { icon: 'luggage', text: 'Large luggage space' },
      { icon: 'four-wheel-drive', text: 'Four-wheel drive (4x4)' },
    ],
    driver: {
      heading: 'Your driver',
      languagesLabel: 'Speaks',
      languagesSpoken: 'Swedish, English and Arabic',
      bio: '',
    },
    contact: {
      heading: 'Book a ride',
      intro: 'Call, send an SMS or message on WhatsApp.',
      phoneLabel: 'Phone',
      emailLabel: 'Email',
      areaLabel: 'Area',
      availabilityLabel: 'Availability',
      qrLabel: 'Scan to call',
    },
    quickContactLabel: 'Quick contact',
    serviceArea: 'Jönköping County',
    availability: 'Available on call',
    footer: { rights: 'All rights reserved.' },
  },
  ar: {
    meta: {
      title: '4you Taxi – تاكسي في مقاطعة يونشوبينغ',
      description:
        'اتصل بـ 4you Taxi لرحلة آمنة في مقاطعة يونشوبينغ. السائق يتحدث السويدية والإنجليزية والعربية.',
    },
    skipLink: 'انتقل إلى المحتوى',
    languageSwitcherLabel: 'اختر اللغة',
    tagline: 'آمن. سريع. موثوق.',
    hero: {
      title: 'تاكسي في مقاطعة يونشوبينغ',
      subtitle: 'آمن. سريع. موثوق. اتصل أو أرسل رسالة متى احتجت إلى رحلة.',
    },
    actions: {
      call: 'اتصل الآن',
      callShort: 'اتصل',
      whatsapp: 'واتساب',
      sms: 'أرسل رسالة نصية',
      email: 'أرسل بريدًا إلكترونيًا',
    },
    car: {
      heading: 'السيارة',
      alt: 'سيارة تاكسي سكودا أوكتافيا بيضاء',
    },
    carFeatures: [
      { icon: 'seats', text: '4 مقاعد' },
      { icon: 'child-seat', text: 'يمكن تركيب مقعد للأطفال' },
      { icon: 'luggage', text: 'مساحة كبيرة للأمتعة' },
      { icon: 'four-wheel-drive', text: 'دفع رباعي (4x4)' },
    ],
    driver: {
      heading: 'سائقك',
      languagesLabel: 'يتحدث',
      languagesSpoken: 'السويدية والإنجليزية والعربية',
      bio: '',
    },
    contact: {
      heading: 'احجز رحلة',
      intro: 'اتصل أو أرسل رسالة نصية أو راسلنا على واتساب.',
      phoneLabel: 'الهاتف',
      emailLabel: 'البريد الإلكتروني',
      areaLabel: 'المنطقة',
      availabilityLabel: 'التوفر',
      qrLabel: 'امسح الرمز للاتصال',
    },
    quickContactLabel: 'اتصال سريع',
    serviceArea: 'مقاطعة يونشوبينغ',
    availability: 'متاح عند الطلب',
    footer: { rights: 'جميع الحقوق محفوظة.' },
  },
};
