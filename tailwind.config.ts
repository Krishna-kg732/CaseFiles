import type { Config } from 'tailwindcss';

export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        manila: {
          50:  '#fdf8f0',
          100: '#faefd9',
          200: '#f4ddb2',
          300: '#edc882',
          400: '#e4ae52',
          500: '#db9a2f',
          600: '#c47d22',
          700: '#a3601f',
          800: '#854d20',
          900: '#6d401d',
          950: '#3d200e',
        },
        'stamp-red': {
          DEFAULT: '#9b1b1b',
          light:   '#c53030',
          dark:    '#742a2a',
          muted:   '#a04040',
        },
        'stamp-amber': {
          DEFAULT: '#b45309',
          light:   '#d97706',
          dark:    '#92400e',
          muted:   '#a87235',
        },
        'stamp-green': {
          DEFAULT: '#166534',
          light:   '#15803d',
          dark:    '#14532d',
          muted:   '#2d6a4f',
        },
        ink: {
          DEFAULT: '#1a1410',
          light:   '#3d3428',
          muted:   '#6b5e4f',
          faint:   '#a89880',
        },
        dark: {
          bg:     '#1a1a18',
          card:   '#2a2520',
          border: '#3d3530',
          text:   '#e8e0d4',
          muted:  '#a09888',
        },
      },
      fontFamily: {
        mono:  ['JetBrains Mono', 'Fira Code', 'ui-monospace', 'monospace'],
        serif: ['Playfair Display', 'Georgia', 'Cambria', 'serif'],
        sans:  ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'stamp':       'stamp 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
        'fade-in':     'fadeIn 0.4s ease-out forwards',
        'slide-up':    'slideUp 0.4s ease-out forwards',
        'draw-line':   'drawLine 1s ease-out forwards',
        'stamp-read':  'stampRead 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
      },
      keyframes: {
        stamp: {
          '0%':   { transform: 'scale(1.4) rotate(-8deg)', opacity: '0' },
          '60%':  { transform: 'scale(0.95) rotate(2deg)', opacity: '1' },
          '100%': { transform: 'scale(1) rotate(-3deg)', opacity: '1' },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%':   { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        drawLine: {
          '0%':   { strokeDashoffset: '1000' },
          '100%': { strokeDashoffset: '0' },
        },
        stampRead: {
          '0%':   { transform: 'scale(2) rotate(-15deg)', opacity: '0' },
          '50%':  { transform: 'scale(0.9) rotate(3deg)', opacity: '0.8' },
          '100%': { transform: 'scale(1) rotate(-5deg)', opacity: '0.6' },
        },
      },
      typography: {
        casefile: {
          css: {
            '--tw-prose-body':    '#1a1410',
            '--tw-prose-headings': '#1a1410',
            '--tw-prose-links':   '#9b1b1b',
            '--tw-prose-code':    '#854d20',
            'code': {
              fontFamily: 'JetBrains Mono, Fira Code, monospace',
            },
          },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
