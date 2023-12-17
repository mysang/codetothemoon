import mdx from '@astrojs/mdx'
import { defineConfig } from 'astro/config'

import sitemap from '@astrojs/sitemap'

// https://astro.build/config
export default defineConfig({
  site:
    import.meta.env.MODE === 'development'
      ? 'http://localhost:3000'
      : 'https://codetothemoon.com',
  integrations: [mdx(), sitemap()],
  output: 'static',
})
