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

/** Who designed and built the site, credited in the footer. */
export const designer = {
  name: 'Salwan Arar',
  url: 'https://salwanarar.github.io/Portfolio/',
} as const;

/** The car. Only confirmed facts (see CLAUDE.md §1). */
export const car = {
  model: 'Škoda Octavia',
} as const;

/** Car rotation frames in public/car360/. Update `count` if frames are added or removed. */
export const carFrames = {
  basePath: '/car360/frame_',
  extension: '.webp',
  count: 73,
  width: 884,
  height: 436,
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
  driver: {
    heading: string;
    languagesLabel: string;
    languagesSpoken: string;
    /** Shown large. Placeholder lines until Rashid writes his own; '' hides it. */
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
      title: '4you Taxi – Taxi i Jönköpings län',
      description:
        'Ring 4you Taxi för en trygg resa i Jönköpings län. Föraren talar svenska, engelska och arabiska.',
    },
    skipLink: 'Hoppa till innehållet',
    languageSwitcherLabel: 'Välj språk',
    tagline: 'Säker. Snabb. Pålitlig.',
    hero: {
      title: 'Taxi i Jönköpings län',
      subtitle: 'Säker. Snabb. Pålitlig. En bil och en förare, Rashid.',
    },
    story: {
      night: { line: 'Sen kväll i Jönköping.', sub: 'Bussen har gått. Du behöver en bil.' },
      call: { line: 'Du ringer.' },
      pickup: { line: 'Rashid svarar.', sub: 'En bil, en förare. Han är på väg.' },
      drive: { line: 'Gott om plats.' },
      arrival: { line: 'Säker. Snabb. Pålitlig.', sub: 'En bil och en förare, Rashid.' },
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
    driver: {
      heading: 'Mannen bakom ratten',
      languagesLabel: 'Talar',
      languagesSpoken: 'Svenska, engelska och arabiska',
      bio: 'Du ringer, Rashid svarar. Ingen växel och ingen kö, bara föraren själv.',
    },
    contact: {
      heading: 'Din resa är ett samtal bort.',
      intro: 'Ring eller skriv till Rashid direkt, på svenska, engelska eller arabiska.',
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
      title: '4you Taxi – Taxi in Jönköping County',
      description:
        'Call 4you Taxi for a safe ride in Jönköping County. The driver speaks Swedish, English and Arabic.',
    },
    skipLink: 'Skip to content',
    languageSwitcherLabel: 'Choose language',
    tagline: 'Safe. Fast. Reliable.',
    hero: {
      title: 'Taxi in Jönköping County',
      subtitle: 'Safe. Fast. Reliable. One car and one driver, Rashid.',
    },
    story: {
      night: { line: 'Late evening in Jönköping.', sub: 'The bus has gone. You need a ride.' },
      call: { line: 'You call.' },
      pickup: { line: 'Rashid answers.', sub: "One car, one driver. He's on his way." },
      drive: { line: 'Plenty of room.' },
      arrival: { line: 'Safe. Fast. Reliable.', sub: 'One car and one driver, Rashid.' },
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
    driver: {
      heading: 'The man behind the wheel',
      languagesLabel: 'Speaks',
      languagesSpoken: 'Swedish, English and Arabic',
      bio: 'You call, Rashid answers. No call centre and no queue, just the driver himself.',
    },
    contact: {
      heading: 'Your ride is one call away.',
      intro: 'Call or message Rashid directly, in Swedish, English or Arabic.',
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
      title: '4you Taxi – تاكسي في مقاطعة يونشوبينغ',
      description:
        'اتصل بـ 4you Taxi لرحلة آمنة في مقاطعة يونشوبينغ. السائق يتحدث السويدية والإنجليزية والعربية.',
    },
    skipLink: 'انتقل إلى المحتوى',
    languageSwitcherLabel: 'اختر اللغة',
    tagline: 'آمن. سريع. موثوق.',
    hero: {
      title: 'تاكسي في مقاطعة يونشوبينغ',
      subtitle: 'آمن. سريع. موثوق. سيارة واحدة وسائق واحد، رشيد.',
    },
    story: {
      night: { line: 'مساء متأخر في يونشوبينغ.', sub: 'الحافلة غادرت. تحتاج إلى سيارة.' },
      call: { line: 'تتصل.' },
      pickup: { line: 'رشيد يجيب.', sub: 'سيارة واحدة وسائق واحد. إنه في الطريق.' },
      drive: { line: 'متسع للجميع.' },
      arrival: { line: 'آمن. سريع. موثوق.', sub: 'سيارة واحدة وسائق واحد، رشيد.' },
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
      scrollHint: 'مرّر لتتابع الرحلة',
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
    driver: {
      heading: 'الرجل خلف المقود',
      languagesLabel: 'يتحدث',
      languagesSpoken: 'السويدية والإنجليزية والعربية',
      bio: 'تتصل، فيجيب رشيد. لا مركز اتصال ولا انتظار، فقط السائق نفسه.',
    },
    contact: {
      heading: 'رحلتك على بُعد مكالمة واحدة.',
      intro: 'اتصل برشيد أو راسله مباشرة، بالسويدية أو الإنجليزية أو العربية.',
      phoneLabel: 'الهاتف',
      emailLabel: 'البريد الإلكتروني',
      areaLabel: 'المنطقة',
      availabilityLabel: 'التوفر',
      qrLabel: 'امسح الرمز للاتصال',
    },
    quickContactLabel: 'اتصال سريع',
    serviceArea: 'مقاطعة يونشوبينغ',
    availability: 'متاح عند الطلب',
    footer: { rights: 'جميع الحقوق محفوظة.', designedBy: 'تصميم الموقع:' },
  },
};
