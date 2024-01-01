import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';

import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
  site:
    import.meta.env.MODE === 'development'
      ? 'http://localhost:3000'
      : 'https://codetothemoon.com',
  integrations: [mdx(), sitemap(), tailwind()],
  output: 'static',
});
