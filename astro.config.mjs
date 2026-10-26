import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

// Update this once a custom domain is purchased (see README "Custom domain" section).
// Account renamed to match the repo, so this is now a GitHub Pages root
// user site, no base path needed.
const SITE_URL = 'https://imran-ali-khan.github.io';

export default defineConfig({
  site: SITE_URL,
  integrations: [
    tailwind({ applyBaseStyles: false }),
  ],
  compressHTML: true,
  build: {
    inlineStylesheets: 'always',
  },
});
