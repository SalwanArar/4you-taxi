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

/** True while a value is still a [[PLACEHOLDER]] waiting for the owner's real data. */
export const isPlaceholder = (value: string) => value.startsWith('[[');

/**
 * The registered company, shown in the footer. Use the exact name and numbers from the
 * registration papers. Leave a value '' to hide that line.
 */
export const company = {
  /** Registered company name (as at Bolagsverket). */
  legalName: '[[COMPANY_NAME]]',
  /** Organisationsnummer, for example 559999-9999. */
  orgNumber: '[[ORG_NR]]',
  /** Taxi licence number (tillstånd för taxitrafik, from Transportstyrelsen). */
  licence: '[[TAXI_LICENCE_NR]]',
} as const;

/**
 * Prices, written exactly as they should be shown, for example '345 kr'. Including VAT.
 * Leave a value '' to hide that row.
 */
export const prices = {
  /** Jämförpris: the price for a 10 km, 15 minute trip, the same figure as on the car. */
  comparison: '[[JAMFORPRIS]]' as string,
  meter: {
    start: '[[START_FEE]]' as string,
    perKm: '[[PRICE_PER_KM]]' as string,
    perMinute: '[[PRICE_PER_MINUTE]]' as string,
  },
  /** Fixed prices to popular places. Names per language are in content.prices.fixed. */
  fixed: {
    airport: '[[PRICE_AIRPORT]]' as string,
    station: '[[PRICE_STATION]]' as string,
  },
};

/** Ways to pay. Labels per language are in content.prices.methods. */
export type PaymentMethod = 'card' | 'swish' | 'mobilePay' | 'cash' | 'invoice';

/**
 * The ways customers can pay, in the order they are shown. Empty until the owner confirms;
 * the page then shows a [[PAYMENT_METHODS]] placeholder.
 * For example: ['card', 'swish', 'mobilePay', 'cash', 'invoice']
 */
export const paymentMethods: PaymentMethod[] = [];

/** Who designed and built the site, credited in the footer. */
export const designer = {
  name: 'Salwan Arar',
  url: 'https://salwanarar.github.io/Portfolio/',
} as const;

/** The car. Only confirmed facts (see CLAUDE.md §1). */
export const car = {
  model: 'Škoda Octavia',
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
    /** Small hint shown until the visitor starts scrolling through the story. */
    scrollHint: string;
  };
  /**
   * Car details section: 4 to 6 short, confirmed facts. `text` is the full fact; `figure` is
   * shown large and `label` small under it.
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
  /**
   * Book ahead: a short form that writes a WhatsApp or SMS message for the visitor to send.
   * Nothing is stored or sent by the site; the driver confirms the ride by replying.
   */
  booking: {
    heading: string;
    intro: string;
    date: string;
    time: string;
    pickup: string;
    destination: string;
    childSeat: string;
    sendWhatsapp: string;
    sendSms: string;
    note: string;
    /** The message that is written for the visitor. Lines in order; each label is followed by the answer. */
    message: {
      greeting: string;
      date: string;
      time: string;
      pickup: string;
      destination: string;
      childSeat: string;
      yes: string;
      no: string;
    };
  };
  /** Prices and payment. Amounts are in `prices` above; only words are here. */
  prices: {
    heading: string;
    comparisonLabel: string;
    comparisonNote: string;
    meterHeading: string;
    start: string;
    perKm: string;
    perMinute: string;
    fixedHeading: string;
    fixed: { airport: string; station: string };
    /** Where the fixed prices start from. '' hides it. */
    fixedNote: string;
    paymentHeading: string;
    methods: Record<PaymentMethod, string>;
    vatNote: string;
  };
  /** Accessible name for the fixed Call/WhatsApp bar on phones. */
  quickContactLabel: string;
  serviceArea: string;
  availability: string;
  footer: { rights: string; designedBy: string; orgNumber: string; licence: string };
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
    booking: {
      heading: 'Boka i förväg',
      intro: 'Ska du till flyget eller tåget? Fyll i, så skrivs ett meddelande till oss.',
      date: 'Datum',
      time: 'Tid',
      pickup: 'Hämtning',
      destination: 'Destination',
      childSeat: 'Jag behöver barnstol',
      sendWhatsapp: 'Skicka via WhatsApp',
      sendSms: 'Skicka via SMS',
      note: 'Inget sparas på webbplatsen. Resan är bokad när vi har svarat och bekräftat.',
      message: {
        greeting: 'Hej! Jag vill boka en taxi.',
        date: 'Datum',
        time: 'Tid',
        pickup: 'Hämtning',
        destination: 'Destination',
        childSeat: 'Barnstol',
        yes: 'Ja',
        no: 'Nej',
      },
    },
    quickContactLabel: 'Snabbkontakt',
    serviceArea: 'Jönköpings län',
    availability: 'Kör på beställning',
    prices: {
      heading: 'Priser',
      comparisonLabel: 'Jämförpris',
      comparisonNote: 'för en resa på 10 km och 15 minuter',
      meterHeading: 'Taxameter',
      start: 'Startavgift',
      perKm: 'Per km',
      perMinute: 'Per minut',
      fixedHeading: 'Fasta priser',
      fixed: { airport: 'Jönköping Airport (Axamo)', station: 'Resecentrum' },
      fixedNote: '[[FIXED_PRICES_FROM]]',
      paymentHeading: 'Betala med',
      methods: {
        card: 'Kort',
        swish: 'Swish',
        mobilePay: 'Apple Pay och Google Pay',
        cash: 'Kontanter',
        invoice: 'Faktura',
      },
      vatNote: 'Alla priser inklusive moms.',
    },
    footer: {
      rights: 'Alla rättigheter förbehållna.',
      designedBy: 'Webbplats av',
      orgNumber: 'Org.nr',
      licence: 'Taxitillstånd',
    },
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
    booking: {
      heading: 'Book ahead',
      intro: 'Catching a flight or a train? Fill this in and a message to us is written for you.',
      date: 'Date',
      time: 'Time',
      pickup: 'Pickup',
      destination: 'Destination',
      childSeat: 'I need a child seat',
      sendWhatsapp: 'Send via WhatsApp',
      sendSms: 'Send via SMS',
      note: 'Nothing is saved on this site. Your ride is booked once we reply and confirm.',
      message: {
        greeting: 'Hi! I would like to book a taxi.',
        date: 'Date',
        time: 'Time',
        pickup: 'Pickup',
        destination: 'Destination',
        childSeat: 'Child seat',
        yes: 'Yes',
        no: 'No',
      },
    },
    quickContactLabel: 'Quick contact',
    serviceArea: 'Jönköping County',
    availability: 'Available on call',
    prices: {
      heading: 'Prices',
      comparisonLabel: 'Comparison price',
      comparisonNote: 'for a 10 km, 15 minute trip',
      meterHeading: 'Meter',
      start: 'Start fee',
      perKm: 'Per km',
      perMinute: 'Per minute',
      fixedHeading: 'Fixed prices',
      fixed: { airport: 'Jönköping Airport (Axamo)', station: 'Travel Centre (Resecentrum)' },
      fixedNote: '[[FIXED_PRICES_FROM]]',
      paymentHeading: 'Pay by',
      methods: {
        card: 'Card',
        swish: 'Swish',
        mobilePay: 'Apple Pay and Google Pay',
        cash: 'Cash',
        invoice: 'Invoice',
      },
      vatNote: 'All prices include VAT.',
    },
    footer: {
      rights: 'All rights reserved.',
      designedBy: 'Website by',
      orgNumber: 'Org. no.',
      licence: 'Taxi licence',
    },
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
    booking: {
      heading: 'احجز مسبقاً',
      intro: 'رايح عالمطار أو عالقطار؟ عبّي المعلومات، ومنكتبلك رسالة جاهزة تبعتها إلنا.',
      date: 'التاريخ',
      time: 'الوقت',
      pickup: 'مكان الانطلاق',
      destination: 'الوجهة',
      childSeat: 'بحتاج مقعد أطفال',
      sendWhatsapp: 'إرسال عبر واتساب',
      sendSms: 'إرسال برسالة نصية',
      note: 'ما منحفظ شي على الموقع. الحجز بيتأكد لما نرد عليك.',
      message: {
        greeting: 'مرحبا! بدي احجز تاكسي.',
        date: 'التاريخ',
        time: 'الوقت',
        pickup: 'مكان الانطلاق',
        destination: 'الوجهة',
        childSeat: 'مقعد أطفال',
        yes: 'نعم',
        no: 'لا',
      },
    },
    quickContactLabel: 'اتصال سريع',
    serviceArea: 'مقاطعة يونشوبينغ',
    availability: 'متوفر عند الطلب',
    prices: {
      heading: 'الأسعار',
      comparisonLabel: 'السعر المرجعي',
      comparisonNote: 'لرحلة مسافتها 10 كم ومدتها 15 دقيقة',
      meterHeading: 'العدّاد',
      start: 'رسم البدء',
      perKm: 'لكل كيلومتر',
      perMinute: 'لكل دقيقة',
      fixedHeading: 'أسعار ثابتة',
      fixed: { airport: 'مطار يونشوبينغ (Axamo)', station: 'محطة القطار والباص (Resecentrum)' },
      fixedNote: '[[FIXED_PRICES_FROM]]',
      paymentHeading: 'طرق الدفع',
      methods: {
        card: 'بطاقة',
        swish: 'Swish',
        mobilePay: 'Apple Pay و Google Pay',
        cash: 'نقداً',
        invoice: 'فاتورة',
      },
      vatNote: 'جميع الأسعار تشمل ضريبة القيمة المضافة.',
    },
    footer: {
      rights: 'جميع الحقوق محفوظة.',
      designedBy: 'تصميم الموقع:',
      orgNumber: 'رقم المنشأة',
      licence: 'رخصة التاكسي',
    },
  },
};
