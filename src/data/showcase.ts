import { caseStudies, shipped, type StoreLinks } from './projects';

// Real screens used in the hero and in the "real screens" section.
// Images are store screenshots, stored in /public/apps.

export type Shot = { src: string; alt: string };

// The three phones at the top of the page. Each one is a different app.
export type HeroShot = Shot & { app: string; kind: string; accent: string; drawStatusBar: boolean };

export const heroShots: { left: HeroShot; center: HeroShot; right: HeroShot } = {
  left: {
    src: 'apps/amr-events.webp',
    alt: 'AMR app, select event type screen',
    app: 'AMR',
    kind: 'Event services',
    accent: '#818cf8',
    drawStatusBar: false,
  },
  center: {
    src: 'apps/rrr-home.webp',
    alt: 'RRR Arena app, home screen with upcoming tournaments',
    app: 'RRR Arena',
    kind: 'Sports academy',
    accent: '#f43f5e',
    drawStatusBar: false,
  },
  right: {
    src: 'apps/hh-dashboard.webp',
    alt: 'Hunt and Harris RE app, dashboard screen',
    app: 'Hunt & Harris RE',
    kind: 'Real estate CRM',
    accent: '#34d399',
    drawStatusBar: true,
  },
};

export type ShowcaseStep = {
  app: string;
  title: string;
  text: string;
  tags: string[];
  shot: Shot;
  // Store screenshots from some apps do not include a phone status bar, so we draw one.
  drawStatusBar: boolean;
  links?: StoreLinks;
};

const rrrLinks = shipped.find((a) => a.name === 'RRR Arena')?.links;
const amrLinks = shipped.find((a) => a.name === 'AMR')?.links;
const hhLinks = caseStudies.find((c) => c.slug === 'hunt-and-harris')?.links;

// One screen for each app.
export const showcaseSteps: ShowcaseStep[] = [
  {
    app: 'RRR Arena',
    title: 'Read, watch, and shop',
    text: 'A sports and gaming academy app. Besides academies and tournaments, it has articles, videos, and a store for gear, in English and Arabic.',
    tags: ['Flutter', 'Riverpod', 'Firebase', 'Google Maps'],
    shot: { src: 'apps/rrr-explore.webp', alt: 'RRR Arena explore screen with articles and videos' },
    drawStatusBar: false,
    links: rrrLinks,
  },
  {
    app: 'AMR',
    title: 'Book home and event services',
    text: 'A services app for homes and events. People sign in with their phone number and book from many vendors.',
    tags: ['Flutter', 'Riverpod', 'Firebase', 'Arabic and English'],
    shot: { src: 'apps/amr-login.webp', alt: 'AMR app, sign in screen' },
    drawStatusBar: false,
    links: amrLinks,
  },
  {
    app: 'Hunt & Harris RE',
    title: 'Every listing, easy to scan',
    text: 'A real estate app for agents in Dubai. Agents can browse company listings and see the status and price of each one right away.',
    tags: ['Flutter', 'MVVM', 'Provider', 'FCM'],
    shot: { src: 'apps/hh-listings.webp', alt: 'Hunt and Harris RE listings screen' },
    drawStatusBar: true,
    links: hhLinks,
  },
];
