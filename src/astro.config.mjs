import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  integrations: [mdx(), sitemap(), tailwind(), react()],
  site: import.meta.env.MODE === 'development' ? 'http://localhost:4321' : 'https://codetothemoon.com',
  output: 'static',
  outDir: '../docs',
});
