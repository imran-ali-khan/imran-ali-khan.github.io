// ─────────────────────────────────────────────────────────────────────────
// PROJECTS DATA
// `caseStudies` = deep write-ups for the strongest, most differentiated work.
// `shipped`     = every other published app, shown as a compact trust grid
//                 (real store links, no invented descriptions).
//
// To add a new case study: copy an object in `caseStudies` and fill it in.
// To add a quick "also shipped" entry: add an object to `shipped`.
// See README.md, "How to add a new project" for the full guide.
// ─────────────────────────────────────────────────────────────────────────

export type StoreLinks = {
  playStore?: string;
  appStore?: string;
};

export type CaseStudy = {
  slug: string;
  name: string;
  tagline: string;
  role: string;
  company?: string;
  product: string;
  problem: string;
  approach: string[];
  architecture: string;
  challenge: string;
  result: string;
  tech: string[];
  links?: StoreLinks;
  // A real store screenshot, stored in /public/apps. Shown under the tags.
  image?: { src: string; alt: string };
};

export const caseStudies: CaseStudy[] = [
  {
    slug: 'iskaan-saas',
    name: 'SaaS Product, Built from Scratch',
    tagline: 'New SaaS platform, architected and built end to end at ISKAAN Tech',
    role: 'Software Engineer (Flutter)',
    company: 'ISKAAN Tech',
    product: 'A new SaaS product built from a blank repository, with the architecture and the integrations owned end to end.',
    problem:
      'ISKAAN needed a new SaaS product with no existing codebase to build on. Every decision, from the folder structure to state management and the API layer, had to be made and explained from day one.',
    approach: [
      "Set up the app's architecture and project structure from scratch, settling on BLoC and Provider for state management.",
      'Built the API layer on Dio and connected every part of the app to it.',
      'Leaned on AI coding tools like Claude Code and Cursor, guided by careful prompt engineering, to move faster through the mechanical parts of the build and spend more time on architecture and requirements.',
      'Turned wireframes and design guidelines into responsive UI screens, keeping the experience consistent across Android and iOS.',
    ],
    architecture:
      'A feature-first structure with a Dio-based API layer, and BLoC or Provider for the parts of the app that needed predictable state changes.',
    challenge:
      "With a blank repository there is no old code to copy. The structure, the state management choice, and the API layer all had to be right early, because every later screen depends on them.",
    result:
      'Shipped a working SaaS product to production on the Play Store and TestFlight, with Shorebird set up for fast over-the-air updates.',
    tech: ['Flutter', 'Dart', 'BLoC', 'Provider', 'Dio', 'Shorebird', 'Claude Code', 'Prompt Engineering'],
  },
  {
    slug: 'rrr-arena',
    name: 'RRR Arena',
    tagline: 'A sports and gaming academy app, in English and Arabic',
    role: 'Flutter Developer',
    product: 'An app where people find academies, join tournaments, read articles, watch videos, and shop for gear.',
    problem:
      'People who train in martial arts and gaming had no single place to find an academy, see tournaments, and sign up. The app also had to work well in English and in Arabic.',
    approach: [
      'Built the belts feature from start to finish, on the app and on the backend, and connected it to onboarding and profile editing.',
      'Added polls, a map location feature, and the tournament leaderboard.',
      'Fixed Apple sign-in and the Google sign-in setup on iPhone.',
      'Fixed push notifications, including a problem on newer Android phones (see below).',
      'Handled the Android and iOS release work: permissions, signing keys, and version updates.',
    ],
    architecture:
      'Clean Architecture with MVVM. Riverpod for state, get_it for dependency injection, go_router for navigation, Dio for the API, and easy_localization for English and Arabic text.',
    challenge:
      'Some Android users never got push notifications, and there was no error. Firebase did not always match the real Android permission, so the permission box sometimes never showed and the phone was never registered for pushes. I now ask for and check the permission through the Android notifications plugin, and I save the token again every time the home screen opens.',
    result:
      'Live on the Play Store and the App Store, with academies, tournaments, an explore feed, a store, and full Arabic support.',
    tech: ['Flutter', 'Riverpod', 'go_router', 'Firebase', 'Google Maps', 'Dio', 'Arabic and RTL'],
    links: {
      playStore: 'https://play.google.com/store/apps/details?id=com.vga.rrrarena',
      appStore: 'https://apps.apple.com/us/app/rrrarena/id6749176887',
    },
    image: { src: 'apps/rrr-home.webp', alt: 'RRR Arena home screen' },
  },
  {
    slug: 'deliverix',
    name: 'DeliveriX',
    tagline: 'Two delivery apps: one for customers and one for drivers',
    role: 'Flutter Developer',
    product: 'A customer app to place and follow deliveries, and a driver app to take jobs, drive, and track earnings.',
    problem:
      'A customer waits for a driver while drivers get offers, drive, and earn. Two apps have to agree on the state of every order, all the time.',
    approach: [
      'Split the project into two Flutter apps, one for users and one for drivers, and built the driver app screens and features.',
      'Connected the driver app to the live backend, with earnings, notifications, and job offers.',
      'Added Firebase push notifications, social sign-in, Google Maps directions, and account deletion.',
      'Built the live "searching for a driver" screen, past orders with paging, and wallet transactions.',
      'Made sign-in safer: Kuwait phone number checks, OTP codes, and a clean log out when a session ends or is turned off.',
      'Added crash reporting and tests.',
    ],
    architecture:
      'Two apps built the same way: Riverpod for state, go_router for navigation, get_it for dependency injection, Dio for the API, live updates over websockets, and English and Arabic text.',
    challenge:
      'While a customer waits, both apps must show the same order state, even when a driver search fails and starts again. Phone sign-in codes and driver GPS also needed fixes after real testing.',
    result: 'Both apps are on the App Store, and the driver app is also on Google Play, with orders, a wallet, and live driver tracking.',
    tech: ['Flutter', 'Riverpod', 'go_router', 'Firebase', 'Google Maps', 'Websockets', 'Crashlytics'],
    links: {
      appStore: 'https://apps.apple.com/us/app/deliverix-user/id6748141981',
    },
    image: { src: 'apps/cards/deliverix-user-1.webp', alt: 'DeliveriX customer app, place an order screen' },
  },
  {
    slug: 'bjs-workforce',
    name: 'Workforce Management Suite',
    tagline: 'Migrated from legacy Windows software to Flutter, with hardware control via platform channels',
    role: 'Software Engineer (Flutter)',
    company: 'BJS Soft Solutions',
    product:
      'A multi-role workforce management system (Admin, Manager, Supervisor, Worker) migrated from a legacy Windows product, plus AR-enabled sales applications.',
    problem:
      "An existing Windows product needed to become a modern, mobile-first Flutter app. A separate module also needed direct hardware interaction, something standard Flutter APIs simply don't expose.",
    approach: [
      'Bridged Flutter and native Android code with Platform Channels to get hardware control, since no existing plugin covered what was needed.',
      'Migrated the codebase from GetX to BLoC for better modularity as the app grew to cover four distinct user roles.',
      'Used clean architecture (MVC) for the AR-enabled sales app, and MVVM with Dio-based API modules for the task and workflow management app.',
      'Built permission-based access control so Admins, Managers, Supervisors, and Workers each only saw the data and actions relevant to them.',
      'Contributed to the Journey Planner and Task Assignment modules with real-time APIs for supervisor and worker coordination, and supported e-learning and certification-tracking features.',
    ],
    architecture:
      'MVC for the AR sales app, MVVM with Dio for the task and workflow modules, and BLoC for cross-cutting state, all sitting behind a role-based permission layer for Admin, Manager, Supervisor, and Worker.',
    challenge:
      "Platform Channels require writing and maintaining native-side code alongside Dart, and getting hardware state changes to propagate back into Flutter's widget tree without janky UI updates took deliberate architecture work.",
    result:
      'Delivered a production multi-role workforce app with working hardware integration and structured, secure data visibility per role. I also led a two-person dev team on this codebase, handling task allocation and code review.',
    tech: ['Flutter', 'Dart', 'Platform Channels', 'BLoC', 'MVC', 'MVVM', 'Dio', 'REST APIs'],
  },
  {
    slug: 'stovoo',
    name: 'Stovoo',
    tagline: 'Single-app, multi-role food delivery platform',
    role: 'Flutter Developer',
    product: 'A single-app food delivery system covering customer ordering, rider tracking, and restaurant control in one codebase.',
    problem:
      'Three very different user journeys (ordering, delivering, and restaurant management) needed to live inside one app without turning into an unmaintainable tangle of conditionals.',
    approach: [
      'Built the core modules for customer ordering, real-time rider tracking, and restaurant-side order control, all using GetX.',
      'Integrated Google Maps for live location tracking and tuned the REST API calls to keep things responsive during peak ordering hours.',
    ],
    architecture: 'A single, role-driven codebase using GetX for state and navigation, with Google Maps and a tuned RESTful API layer handling real-time location data.',
    challenge:
      'Real-time location updates for riders need to stay accurate and battery-efficient without flooding the UI with re-renders, which meant scoping GetX state carefully.',
    result: 'Shipped to both the Play Store and App Store, with all three role-based modules functioning in a single production app.',
    tech: ['Flutter', 'GetX', 'Google Maps API', 'REST APIs', 'Real-Time Location'],
    links: {
      playStore: 'https://play.google.com/store/apps/details?id=com.mightysofts.stovoo&hl=en',
      appStore: 'https://apps.apple.com/us/app/stovoo/id6443545690',
    },
  },
  {
    slug: 'reloradar',
    name: 'ReloRadar',
    tagline: 'US-based real estate platform with tour scheduling and behavior tracking',
    role: 'Flutter Developer',
    product: 'A US real estate platform enabling property purchases, direct mailing, and scheduled multi-home tours with agents.',
    problem:
      'Buyers needed one coordinated flow to research properties, get contacted about them, and schedule tours with agents, without pushing all the scheduling and tracking logic onto the backend.',
    approach: [
      'Used BLoC to keep state predictable across property search, mailing, and tour-scheduling flows.',
      'Used Dio for API integration, plus deep linking to route users straight into a specific property or tour view.',
      'Integrated Google Maps for property locations and Mixpanel to track user behavior.',
      'Wired up Firebase for social logins and dynamic links so property listings could be shared directly.',
    ],
    architecture: 'BLoC-driven state management, Dio handling networking, Firebase covering auth and dynamic links, and Mixpanel instrumenting the whole funnel from browsing to a scheduled tour.',
    challenge:
      "Coordinating multi-home tour scheduling with multiple agents' availability, inside a mobile UI that still needed to feel simple to a home buyer, required careful state and UX design.",
    result: 'Delivered a working buyer-facing platform for property discovery, direct mailing, and scheduled multi-home agent tours.',
    tech: ['Flutter', 'BLoC', 'Dio', 'Deep Linking', 'Google Maps API', 'Mixpanel', 'Firebase'],
  },
  {
    slug: 'hunt-and-harris',
    name: 'Hunt & Harris RE',
    tagline: 'Dubai real estate CRM with property management and permission-based module switching',
    role: 'Flutter Developer',
    product: 'A Dubai real estate app combining Property Management and CRM modules behind a single permission-based login.',
    problem:
      'Agents and admins needed one app that could switch between property-management and CRM contexts depending on their role and permissions, without maintaining two separate apps.',
    approach: [
      'Built an MVVM architecture with Provider for state management, keeping the property-management and CRM modules cleanly separated, but switchable at runtime.',
      'Integrated REST APIs for leads, listings, viewings, tasks, notes, schedules, and a calendar view.',
      'Wired up FCM for push notifications so agents get real-time updates on lead and task activity.',
      "Implemented permission-based login so the same app surfaces different modules and data depending on the logged-in user's role.",
    ],
    architecture: 'MVVM with Provider, a REST API layer, FCM for push notifications, and a role-based module-switching layer that gates access between Property Management and CRM.',
    challenge:
      'Switching entire feature modules in and out based on runtime permissions, without duplicating navigation or state logic, required a deliberate MVVM boundary between modules.',
    result: 'Live production CRM used by Dubai-based real estate agents, covering the full lead-to-close workflow: leads, listings, viewings, tasks, notes, schedules, and calendar.',
    tech: ['Flutter', 'MVVM', 'Provider', 'REST APIs', 'FCM', 'Role-Based Access'],
    links: {
      playStore: 'https://play.google.com/store/apps/details?id=com.huntandharrisre.erpapp&hl=en',
      appStore: 'https://apps.apple.com/us/app/hunt-and-harris-re/id6468483431',
    },
    image: { src: 'apps/hh-dashboard.webp', alt: 'Hunt and Harris RE dashboard screen' },
  },
  {
    slug: 'amr',
    name: 'AMR',
    tagline: 'A home and event services app with vendors and products',
    role: 'Flutter Developer',
    product: 'An app to book home and event services and buy products from different vendors.',
    problem:
      'Customers wanted to find services for an event, compare vendors, and order, all in one app, in English and Arabic.',
    approach: [
      'Worked on the service and category screens, and the "select event type" screen.',
      'Built the consultation API, the forgot password flow, and guest mode.',
      'Updated how order status is shown.',
      'Fixed bugs from QA and made the app faster, and fixed the Play Store release problem.',
    ],
    architecture:
      'Riverpod for state, go_router for navigation, get_it for dependency injection, Dio for the API, and Firebase for push notifications. The code is split by feature: auth, services, products, vendors, cart, orders, and loyalty.',
    challenge:
      'Guest mode means every screen has to work for signed-in users and for guests, and ask for sign-in only when it is really needed.',
    result: 'Live on the Play Store and the App Store.',
    tech: ['Flutter', 'Riverpod', 'go_router', 'Dio', 'Firebase', 'Arabic and English'],
    links: {
      playStore: 'https://play.google.com/store/apps/details?id=com.vga.amr',
      appStore: 'https://apps.apple.com/us/app/amr-%D8%A2%D9%85%D8%B1/id6766049292',
    },
    image: { src: 'apps/amr-events.webp', alt: 'AMR app, select event type screen' },
  },
  {
    slug: 'kiddocanvas',
    name: 'KiddoCanvas',
    tagline: 'A calm coloring app for kids that parents can trust',
    role: 'Flutter Developer (solo project)',
    product: 'A coloring app where a child taps a picture to fill it with color.',
    problem:
      'A kids app has to be calm and safe: no ads, no tracking, and no way for a child to buy something by mistake.',
    approach: [
      'Built the coloring canvas, where one tap fills a shape with color, and a gallery that saves finished pictures on the phone.',
      'Added picture packs like letters, animals, nature, and vehicles, with free and premium pages, plus puzzles and games.',
      'Added a grown-up check before every purchase, and one purchase that unlocks everything, with in-app purchases.',
      'Added session limits and a simple first-time guide for new users.',
      'Made the gallery safe with a storage version number, and made it recover from a bad record. Wrote unit tests for the purchase and session logic.',
      'Used real open line-art for the pictures, and shipped with no ads and no tracking.',
    ],
    architecture:
      'Code split by feature. Riverpod for state, go_router for navigation, get_it for dependency injection, and Hive for storage on the device.',
    challenge:
      'A child must never buy something by mistake, and a saved drawing must never be lost. So every purchase sits behind a grown-up math check, and the gallery saves with a version number and can recover from a bad record.',
    result: 'Released on Google Play, with no ads and no tracking.',
    tech: ['Flutter', 'Riverpod', 'go_router', 'Hive', 'In-app purchases', 'Parental gate'],
    links: {
      playStore: 'https://play.google.com/store/apps/details?id=com.handyhive.kiddocanvas',
    },
    image: { src: 'apps/cards/kiddocanvas-1.webp', alt: 'KiddoCanvas app, coloring an elephant' },
  },
  {
    slug: 'bodinar',
    name: 'Bodinar',
    tagline: 'A family shopping app in Arabic and English',
    role: 'Flutter Developer',
    product: 'A shopping app where families browse products, fill a cart, and check out.',
    problem:
      'The app had to feel local: Arabic first, an address form for Iraq, local prices, and sign-in with phone codes.',
    approach: [
      'Built and improved the home, search, product list, and product variant screens.',
      'Built the checkout: an address form for Iraq, a web-style checkout, payment method badges, and an order summary that shows the coupon amount.',
      'Made Arabic work well: Arabic digits in sign-in codes, a tab bar fix for Arabic, and local prices and currency.',
      'Made layouts safe for big phone fonts, so size chips and screens do not break.',
      'Cleared the old account data when someone switches accounts, and fixed the sign-up and forgot-password screens.',
    ],
    architecture:
      'Code split by feature. Riverpod for state, go_router for navigation, get_it for dependency injection, Dio for the API, and easy_localization for Arabic and English.',
    challenge:
      'A shop has many small details that break in Arabic: numbers, tab bars, prices, and big phone fonts. Each one needed its own fix and its own testing.',
    result: 'Live on the App Store and Google Play.',
    tech: ['Flutter', 'Riverpod', 'go_router', 'Dio', 'Firebase', 'Arabic and RTL'],
    links: {
      playStore: 'https://play.google.com/store/apps/details?id=com.tocaan.bodinar&hl=en',
      appStore: 'https://apps.apple.com/us/app/bodinar-%D8%A8%D9%88%D8%AF%D9%8A%D9%86%D8%A7%D8%B1/id6752568435',
    },
    image: { src: 'apps/cards/bodinar-1.webp', alt: 'Bodinar app, home screen with products' },
  },
];

// Every other published app, shown as a card with one real store screenshot,
// a title, and a short plain description. Images live in /public/apps/cards.
export type ShippedApp = {
  name: string;
  description: string;
  image?: string;
  links: StoreLinks;
};

const shot = (slug: string) => `apps/cards/${slug}-1.webp`;

export const shipped: ShippedApp[] = [
  {
    name: 'RRR Arena',
    description: 'A sports and gaming academy app with academies, tournaments, articles, videos, and a store.',
    image: shot('rrr-arena'),
    links: {
      playStore: 'https://play.google.com/store/apps/details?id=com.vga.rrrarena',
      appStore: 'https://apps.apple.com/us/app/rrrarena/id6749176887',
    },
  },
  {
    name: 'Bodinar',
    description: 'A family shopping app in Arabic and English. Browse categories, search and filter products, and check out.',
    image: shot('bodinar'),
    links: {
      playStore: 'https://play.google.com/store/apps/details?id=com.tocaan.bodinar&hl=en',
      appStore: 'https://apps.apple.com/us/app/bodinar-%D8%A8%D9%88%D8%AF%D9%8A%D9%86%D8%A7%D8%B1/id6752568435',
    },
  },
  {
    name: 'KiddoCanvas',
    description: 'A coloring app for kids. Tap to fill a picture with color. No ads, no tracking, and a grown-up check before any purchase.',
    image: shot('kiddocanvas'),
    links: {
      playStore: 'https://play.google.com/store/apps/details?id=com.handyhive.kiddocanvas',
    },
  },
  {
    name: 'Sure CRM',
    description: 'A real estate CRM for agents in Dubai. Manage leads, listings, and your daily schedule.',
    image: shot('sure-crm'),
    links: {
      playStore: 'https://play.google.com/store/apps/details?id=com.app.sureCrm&hl=en',
      appStore: 'https://apps.apple.com/us/app/sure-crm/id6743427892',
    },
  },
  {
    name: 'Creative Homes CRM',
    description: 'A real estate CRM for Dubai agents. Track leads, tasks, and your schedule in one app.',
    image: shot('creative-homes-crm'),
    links: {
      playStore: 'https://play.google.com/store/apps/details?id=com.creativehomes.crmapp',
      appStore: 'https://apps.apple.com/us/app/creative-homes-crm/id6468985460',
    },
  },
  {
    name: 'GPG Global CRM',
    description: 'A real estate CRM for Dubai teams. Handle leads, listings, and viewings from one dashboard.',
    image: shot('gpg-global-crm'),
    links: {
      playStore: 'https://play.google.com/store/apps/details?id=com.app.gpgGlobalCrm',
      appStore: 'https://apps.apple.com/us/app/gpg-global-crm/id6743427839',
    },
  },
  {
    name: 'Stanford Properties CRM',
    description: 'A real estate CRM with a dashboard, leads, and company listings for the sales team.',
    image: shot('stanford-properties-crm'),
    links: {
      playStore: 'https://play.google.com/store/apps/details?id=com.stanford.crmapp.stanford_properties_crm_mobile',
    },
  },
  {
    name: 'Doted Driver',
    description: 'An app for drivers. Follow tickets, collect signatures, and share live location in the background.',
    image: shot('doted-driver'),
    links: {
      playStore: 'https://play.google.com/store/apps/details?id=com.dotedco.dotedDriver',
      appStore: 'https://apps.apple.com/app/doted-driver/id6739454766',
    },
  },
  {
    name: 'DeliveriX User App',
    description: 'Place a delivery order in seconds, then follow your driver on the map until it arrives.',
    image: shot('deliverix-user'),
    links: {
      appStore: 'https://apps.apple.com/us/app/deliverix-user/id6748141981',
    },
  },
  {
    name: 'DeliveriX Driver App',
    description: 'An app for delivery drivers. See your jobs, follow each step on the map, and track your earnings.',
    image: shot('deliverix-driver'),
    links: {
      playStore: 'https://play.google.com/store/apps/details?id=com.vga.deliverix.driver',
      appStore: 'https://apps.apple.com/us/app/deliverix-driver/id6748141427',
    },
  },
  {
    name: 'CarHelp',
    description: 'A car help app that connects drivers with service vendors. Compare vendors, order, and track the order.',
    image: shot('carhelp'),
    links: {
      playStore: 'https://play.google.com/store/apps/details?id=com.vga.carhelp',
      appStore: 'https://apps.apple.com/us/app/car-help-%D9%83%D8%A7%D8%B1-%D9%87%D9%8A%D9%84%D8%A8/id6755152556',
    },
  },
  {
    name: 'AMR',
    description: 'A home and event services app. Pick a service, choose your event type, and book it.',
    image: 'apps/amr-events.webp',
    links: {
      playStore: 'https://play.google.com/store/apps/details?id=com.vga.amr',
      appStore: 'https://apps.apple.com/us/app/amr-%D8%A2%D9%85%D8%B1/id6766049292',
    },
  },
  {
    name: 'AllOut',
    description: 'Find trips and activities across the UAE, with a map to see what is nearby.',
    image: shot('allout'),
    links: {
      playStore: 'https://play.google.com/store/apps/details?id=com.AllOut.app',
    },
  },
  {
    name: 'Fire Kirin Guide',
    description: 'A guide app with tips and strategies for players, with a Firestore-backed support section.',
    image: shot('fire-kirin-guide'),
    links: {
      playStore: 'https://play.google.com/store/apps/details?id=com.firekirin.guide',
    },
  },
];
