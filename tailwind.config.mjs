/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        gdg: {
          blue: '#4285F4',
          red: '#EA4335',
          yellow: '#FBBC04',
          green: '#34A853',
          dark: '#1F1F1F',
          gray: '#5F6368',
          light: '#F8F9FA'
        },
        uhu: {
          blue: '#003366',
          gold: '#C5A059'
        }
      },
      fontFamily: {
        sans: ['"Google Sans"', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace']
      }
    },
  },
  plugins: [],
}

