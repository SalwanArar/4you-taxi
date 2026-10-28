/**
 * All editable content for the site lives in this file.
 * Change a phone number, a sentence or a translation here; components read from it.
 * Anything written as [[LIKE_THIS]] is a placeholder waiting for real content.
 */

export const locales = ['sv', 'en', 'ar'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'sv';

/** Settings per language: its name, written in that language, and text direction. */
export const localeInfo: Record<Locale, { label: string; dir: 'ltr' | 'rtl' }> = {
  sv: { label: 'Svenska', dir: 'ltr' },
  en: { label: 'English', dir: 'ltr' },
  ar: { label: 'العربية', dir: 'rtl' },
};

/** Facts that are the same in every language. */
export const business = {
  name: 'Länstaxi Jönköping',
  phone: {
    /** How the number is shown on the page. */
    display: '+46 73 725 01 75',
    /** Used in tel: and sms: links. No spaces. */
    e164: '+46737250175',
  },
  /** WhatsApp number: country code and number, digits only (used in https://wa.me/…). */
  whatsapp: '46737250175',
  /** Company email. Leave '' to hide the email button and row until there is one. */
  email: '' as string,
  region: 'Jönköpings län',
  country: 'SE',
} as const;

/** Who designed and built the site, credited in the footer. */
export const designer = {
  name: 'Salwan Arar',
  url: 'https://salwanarar.github.io/Portfolio/',
} as const;

/** The car. Only confirmed facts (see CLAUDE.md §1). */
export const car = {
  model: 'Škoda Octavia',
} as const;

/** Car rotation frames in public/car360/v3/. Update `count` if frames are added or removed. When the
 * frames change, put them in a new folder (v4, …) so phones don't keep showing cached old ones. */
export const carFrames = {
  basePath: '/car360/v3/frame_',
  extension: '.webp',
  count: 120,
  width: 884,
  height: 437,
} as const;

/** Icons available for the car features list (Lucide icon names). */
export type FeatureIcon = 'seats' | 'child-seat' | 'luggage' | 'four-wheel-drive';

interface Content {
  meta: { title: string; description: string };
  skipLink: string;
  languageSwitcherLabel: string;
  tagline: string;
  hero: { title: string; subtitle: string };
  /**
   * The opening, told as one ride in five scenes while the visitor scrolls (see Hero.astro).
   * `call` shows the phone number under it; `drive` shows the car facts; `arrival` the call buttons.
   */
  story: {
    night: { line: string; sub: string };
    call: { line: string };
    pickup: { line: string; sub: string };
    drive: { line: string };
    arrival: { line: string; sub: string };
    /** Shown with an arrow at the end of the story, so visitors know the page goes on. */
    more: string;
  };
  actions: { call: string; callShort: string; whatsapp: string; sms: string; email: string };
  car: {
    heading: string;
    alt: string;
    /** Accessible name of the rotating car. */
    rotatingLabel: string;
    /** Small hint shown until the visitor starts scrolling through the car. */
    scrollHint: string;
  };
  /**
   * Car details section: 4 to 6 short, confirmed facts. `text` is the full fact (also used for the
   * captions while the car turns); `figure` is shown large and `label` small under it.
   */
  carFeatures: { icon: FeatureIcon; text: string; figure: string; label: string }[];
  /** About the company: one large line, then the languages spoken. */
  about: {
    heading: string;
    languagesLabel: string;
    languagesSpoken: string;
    /** Shown large. Placeholder lines until the owner writes their own; '' hides it. */
    bio: string;
  };
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
  footer: { rights: string; designedBy: string };
}

/** Text per language. Swedish and Arabic are drafts and should be checked by a native speaker. */
export const content: Record<Locale, Content> = {
  sv: {
    meta: {
      title: 'Länstaxi Jönköping – Taxi i Jönköpings län',
      description:
        'Ring Länstaxi Jönköping för en trygg resa i Jönköpings län. Vi talar svenska, engelska och arabiska.',
    },
    skipLink: 'Hoppa till innehållet',
    languageSwitcherLabel: 'Välj språk',
    tagline: 'Säker. Snabb. Pålitlig.',
    hero: {
      title: 'Taxi i Jönköpings län',
      subtitle: 'Säker. Snabb. Pålitlig.',
    },
    story: {
      night: { line: 'Sen kväll i Jönköping.', sub: 'Bussen har gått. Du behöver en bil.' },
      call: { line: 'Du ringer.' },
      pickup: { line: 'Vi svarar.', sub: 'Ingen växel, ingen kö. Bilen är på väg.' },
      drive: { line: 'Gott om plats.' },
      arrival: { line: 'Säker. Snabb. Pålitlig.', sub: 'Vi kör dig hela vägen.' },
      more: 'Mer om bilen och oss',
    },
    actions: {
      call: 'Ring nu',
      callShort: 'Ring',
      whatsapp: 'WhatsApp',
      sms: 'Skicka SMS',
      email: 'Skicka e-post',
    },
    car: {
      heading: 'Plats för alla',
      alt: 'Vit Škoda Octavia-taxi',
      rotatingLabel: 'Vit Škoda Octavia-taxi som snurrar när du skrollar',
      scrollHint: 'Skrolla för att följa resan',
    },
    carFeatures: [
      { icon: 'seats', text: '4 platser', figure: '4', label: 'platser' },
      {
        icon: 'child-seat',
        text: 'Barnstol kan monteras',
        figure: 'Barnstol',
        label: 'kan monteras',
      },
      { icon: 'luggage', text: 'Stort bagageutrymme', figure: 'Stort', label: 'bagageutrymme' },
      {
        icon: 'four-wheel-drive',
        text: 'Fyrhjulsdrift (4x4)',
        figure: '4x4',
        label: 'fyrhjulsdrift',
      },
    ],
    about: {
      heading: 'Om oss',
      languagesLabel: 'Vi talar',
      languagesSpoken: 'Svenska, engelska och arabiska',
      bio: 'Du ringer, vi svarar. Ingen växel och ingen kö.',
    },
    contact: {
      heading: 'Din resa är ett samtal bort.',
      intro: 'Ring eller skriv till oss direkt, på svenska, engelska eller arabiska.',
      phoneLabel: 'Telefon',
      emailLabel: 'E-post',
      areaLabel: 'Område',
      availabilityLabel: 'Tillgänglighet',
      qrLabel: 'Skanna för att ringa',
    },
    quickContactLabel: 'Snabbkontakt',
    serviceArea: 'Jönköpings län',
    availability: 'Kör på beställning',
    footer: { rights: 'Alla rättigheter förbehållna.', designedBy: 'Webbplats av' },
  },
  en: {
    meta: {
      title: 'Länstaxi Jönköping – Taxi in Jönköping County',
      description:
        'Call Länstaxi Jönköping for a safe ride in Jönköping County. We speak Swedish, English and Arabic.',
    },
    skipLink: 'Skip to content',
    languageSwitcherLabel: 'Choose language',
    tagline: 'Safe. Fast. Reliable.',
    hero: {
      title: 'Taxi in Jönköping County',
      subtitle: 'Safe. Fast. Reliable.',
    },
    story: {
      night: { line: 'Late evening in Jönköping.', sub: 'The bus has gone. You need a ride.' },
      call: { line: 'You call.' },
      pickup: { line: 'We answer.', sub: 'No call centre, no queue. The car is on its way.' },
      drive: { line: 'Plenty of room.' },
      arrival: { line: 'Safe. Fast. Reliable.', sub: 'We take you all the way.' },
      more: 'More about the car and us',
    },
    actions: {
      call: 'Call now',
      callShort: 'Call',
      whatsapp: 'WhatsApp',
      sms: 'Send SMS',
      email: 'Send email',
    },
    car: {
      heading: 'Room for everyone',
      alt: 'White Škoda Octavia taxi',
      rotatingLabel: 'White Škoda Octavia taxi, rotating as you scroll',
      scrollHint: 'Scroll to follow the ride',
    },
    carFeatures: [
      { icon: 'seats', text: '4 seats', figure: '4', label: 'seats' },
      {
        icon: 'child-seat',
        text: 'Child seat can be fitted',
        figure: 'Child seat',
        label: 'can be fitted',
      },
      { icon: 'luggage', text: 'Large luggage space', figure: 'Large', label: 'luggage space' },
      {
        icon: 'four-wheel-drive',
        text: 'Four-wheel drive (4x4)',
        figure: '4x4',
        label: 'four-wheel drive',
      },
    ],
    about: {
      heading: 'About us',
      languagesLabel: 'We speak',
      languagesSpoken: 'Swedish, English and Arabic',
      bio: 'You call, we answer. No call centre and no queue.',
    },
    contact: {
      heading: 'Your ride is one call away.',
      intro: 'Call or message us directly, in Swedish, English or Arabic.',
      phoneLabel: 'Phone',
      emailLabel: 'Email',
      areaLabel: 'Area',
      availabilityLabel: 'Availability',
      qrLabel: 'Scan to call',
    },
    quickContactLabel: 'Quick contact',
    serviceArea: 'Jönköping County',
    availability: 'Available on call',
    footer: { rights: 'All rights reserved.', designedBy: 'Website by' },
  },
  ar: {
    meta: {
      title: 'Länstaxi Jönköping – تاكسي في مقاطعة يونشوبينغ',
      description:
        'اتصل بـ Länstaxi Jönköping لرحلة آمنة في مقاطعة يونشوبينغ. نتكلم العربية والسويدية والإنجليزية.',
    },
    skipLink: 'انتقل إلى المحتوى',
    languageSwitcherLabel: 'اختر اللغة',
    tagline: 'آمن. سريع. موثوق.',
    hero: {
      title: 'تاكسي في مقاطعة يونشوبينغ',
      subtitle: 'آمن. سريع. موثوق.',
    },
    story: {
      night: { line: 'آخر الليل بيونشوبينغ.', sub: 'راح آخر باص، وبدك سيارة.' },
      call: { line: 'بتتصل.' },
      pickup: { line: 'منرد عليك.', sub: 'بلا مركز اتصالات وبلا انتظار. السيارة جاية لعندك.' },
      drive: { line: 'في محل للكل.' },
      arrival: { line: 'آمن. سريع. موثوق.', sub: 'منوصلك لآخر الطريق.' },
      more: 'المزيد عن السيارة وعنّا',
    },
    actions: {
      call: 'اتصل الآن',
      callShort: 'اتصل',
      whatsapp: 'واتساب',
      sms: 'رسالة نصية',
      email: 'بريد إلكتروني',
    },
    car: {
      heading: 'مكان للجميع',
      alt: 'سيارة تاكسي سكودا أوكتافيا بيضاء',
      rotatingLabel: 'سيارة تاكسي سكودا أوكتافيا بيضاء تدور أثناء التمرير',
      scrollHint: 'مرّر لتكمل الرحلة',
    },
    carFeatures: [
      { icon: 'seats', text: '4 مقاعد', figure: '4', label: 'مقاعد' },
      {
        icon: 'child-seat',
        text: 'يمكن تركيب مقعد للأطفال',
        figure: 'مقعد أطفال',
        label: 'يمكن تركيبه',
      },
      { icon: 'luggage', text: 'مساحة كبيرة للأمتعة', figure: 'مساحة كبيرة', label: 'للأمتعة' },
      { icon: 'four-wheel-drive', text: 'دفع رباعي (4x4)', figure: '4x4', label: 'دفع رباعي' },
    ],
    about: {
      heading: 'من نحن',
      languagesLabel: 'نتكلم',
      languagesSpoken: 'العربية والسويدية والإنجليزية',
      bio: 'بتتصل، ومنرد عليك. بلا مركز اتصالات وبلا انتظار.',
    },
    contact: {
      heading: 'رحلتك على بُعد مكالمة.',
      intro: 'اتصل بنا أو راسلنا مباشرة، بالعربية أو السويدية أو الإنجليزية.',
      phoneLabel: 'الهاتف',
      emailLabel: 'البريد الإلكتروني',
      areaLabel: 'المنطقة',
      availabilityLabel: 'التوفر',
      qrLabel: 'امسح الرمز للاتصال',
    },
    quickContactLabel: 'اتصال سريع',
    serviceArea: 'مقاطعة يونشوبينغ',
    availability: 'متوفر عند الطلب',
    footer: { rights: 'جميع الحقوق محفوظة.', designedBy: 'تصميم الموقع:' },
  },
};
