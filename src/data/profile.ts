// ─────────────────────────────────────────────────────────────────────────
// SINGLE SOURCE OF TRUTH for personal information.
// Everything on the site is derived from this file and ./experience.ts,
// ./projects.ts and ./skills.ts. Update your info here, see README.md
// "How to update content" for details.
// ─────────────────────────────────────────────────────────────────────────

export const profile = {
  name: 'Imran Ali Khan',
  role: 'Senior Flutter Developer',
  location: 'Lahore, Pakistan',
  email: 'imranalikhan878@gmail.com',
  phone: '+92 333 9837704',
  availability: 'Available immediately',
  yearsExperience: '4.5+ years',

  links: {
    linkedin: 'https://linkedin.com/in/imran-ali--khan',
    github: 'https://github.com/imran-ali-khan',
    // Same number as `phone` above, in wa.me click-to-chat format.
    whatsapp: 'https://wa.me/923339837704',
  },

  // Short positioning line used in <title> tags, meta description, hero eyebrow.
  tagline: 'Senior Flutter Developer who ships production apps real businesses depend on',

  // Hero headline, kept factual, no invented claims.
  heroHeadline: "I build Flutter apps that ship on time and hold up long after launch.",
  // Part of the headline shown with the blue gradient.
  heroHighlight: "ship on time",

  heroSubline:
    "I'm Imran Ali Khan, a senior Flutter developer in Lahore, Pakistan. I have 4.5+ years of experience building Android and iOS apps, from CRMs to delivery apps to a SaaS app built from zero. I also use AI tools like Claude Code and Cursor to build faster.",

  // Where Imran can work. Used in the hero, contact section, FAQ and search data.
  workModes: 'Remote for clients worldwide. Onsite in Lahore, Islamabad, the UAE, and Saudi Arabia.',

  // Path inside /public, for example 'imran.webp'. Leave empty until a photo is added.
  photo: '',

  // Longer narrative for the About / Engineering Approach section, written
  // in the user's own voice and lightly edited for the page.
  aboutNarrative: [
    "I'm a Flutter developer based in Lahore with about four and a half years of experience and a degree in Software Engineering.",
    "I started at BJS Soft Solutions, migrating legacy Windows systems to Flutter and building workforce management apps for admin, manager, supervisor, and worker roles, with hardware control through platform channels.",
    "At Senarios, I moved deeper into architecture work: offline-first storage, syncing data with the server, and real-time messaging.",
    "Most recently, at ISKAAN Tech, I built a SaaS product from scratch and upgraded several live CRM apps for clients in Dubai. The company downsized in 2025, which is why I'm available right away.",
    "For the last two years, I have used AI tools like Claude Code and Cursor to write the routine parts of the code. I guide them with clear prompts, and I check everything they write. This gives me more time to talk with the people who use the product and understand what they really need. That is why I enjoy roles where understanding the business matters as much as writing code.",
  ],

  resumeFile: 'imran-ali-khan-flutter-developer.pdf',
};

export const engineeringApproach = [
  {
    title: 'Architecture first',
    description:
      "I lean on Clean Architecture and MVC or MVVM by default, so business logic stays independent from the UI and a backend change doesn't ripple through the whole app.",
  },
  {
    title: 'Offline-first where it matters',
    description:
      'I build local storage and sync layers so an app still works without a connection, and reconciles cleanly once one comes back.',
  },
  {
    title: 'State management with intent',
    description:
      'BLoC, Provider, Riverpod, or GetX, picked per project based on team size and complexity, not out of habit.',
  },
  {
    title: 'Deployment is part of the job',
    description:
      'Comfortable owning releases end to end: Play Store, TestFlight, and Shorebird for over-the-air patches without a full store review.',
  },
  {
    title: 'AI-assisted, not AI-replaced',
    description:
      'I use Claude Code and Cursor for the mechanical parts of implementation, guided by careful prompt engineering, which frees up more time for understanding requirements and system design.',
  },
  {
    title: 'Requirements before code',
    description:
      'The last two years have shifted my focus toward working directly with stakeholders, translating real-world processes into correct technical specs before writing a line of code.',
  },
];

export const achievements = [
  {
    label: 'Production apps shipped',
    value: '17+',
    detail: 'Published to the Play Store and/or App Store',
  },
  {
    label: 'Years of experience',
    value: '4.5+',
    detail: 'Across three companies, consistently in Flutter',
  },
  {
    label: 'Live client CRMs upgraded',
    value: '5+',
    detail: 'Dubai-based real estate CRM platforms, refactored and maintained',
  },
  {
    label: 'SaaS product',
    value: '1',
    detail: 'Architected and built from scratch at ISKAAN Tech',
  },
];

// Short facts shown in the About section. Search engines and AI tools read this easily.
export const quickFacts = [
  { label: 'Role', value: 'Senior Flutter Developer' },
  { label: 'Experience', value: '4.5+ years' },
  { label: 'Based in', value: 'Lahore, Pakistan' },
  { label: 'Remote', value: 'Worldwide' },
  { label: 'Onsite', value: 'Lahore, Islamabad, UAE, Saudi Arabia' },
  { label: 'Main tools', value: 'Flutter, Dart, BLoC, Firebase' },
  { label: 'AI tools', value: 'Claude Code, Cursor' },
  { label: 'Status', value: 'Available immediately' },
];

// Questions people ask. Each answer starts with the answer itself and stands on its own.
// The same text feeds the visible FAQ section and the FAQ search data.
export const faq = [
  {
    question: 'Who is Imran Ali Khan?',
    answer:
      'Imran Ali Khan is a senior Flutter developer from Lahore, Pakistan. He has 4.5+ years of experience building Android and iOS apps, including real estate CRMs, delivery apps, a sports academy app, and a SaaS app built from zero.',
  },
  {
    question: 'Is Imran available to hire?',
    answer:
      'Yes. Imran can start right away. He works remotely for clients worldwide, and he is also open to onsite work in Lahore, Islamabad, the UAE, and Saudi Arabia.',
  },
  {
    question: 'What kind of apps does Imran build?',
    answer:
      'He builds mobile apps with Flutter and Dart for Android and iOS. His work includes CRM apps, delivery and driver apps, a sports and gaming academy app, and a SaaS product. He has shipped 17+ apps to the Play Store and App Store.',
  },
  {
    question: 'Which tools does Imran use?',
    answer:
      'He uses Flutter, Dart, BLoC, Provider, Riverpod, Firebase, REST APIs, and Google Maps. For releases he uses the Play Store, TestFlight, and Shorebird for fast updates.',
  },
  {
    question: 'How does Imran use AI in his work?',
    answer:
      'He uses AI tools like Claude Code and Cursor, with careful prompts, for the routine parts of coding. He plans the design himself, reads every line the AI writes, and tests on real devices before anything ships.',
  },
  {
    question: 'How can I contact Imran?',
    answer:
      'Email imranalikhan878@gmail.com, message him on WhatsApp at +92 333 9837704, or connect with him on LinkedIn.',
  },
];
