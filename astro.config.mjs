import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';
import vercel from '@astrojs/vercel/serverless';

export default defineConfig({
  site: 'https://casefiles.dev',
  output: 'hybrid',
  adapter: vercel({
    webAnalytics: { enabled: true },
  }),

  integrations: [
    mdx(),
    tailwind(),
    react(),
  ],

  // 🔥 ADD THIS BLOCK
  markdown: {
    syntaxHighlight: 'shiki',
    shikiConfig: {
      theme: 'github-dark', // clean + professional
      wrap: true, // prevents overflow issues
    },
  },

  vite: {
    ssr: {
      noExternal: ['framer-motion'],
    },
  },
});