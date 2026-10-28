/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        gdg: {
          blue: '#4285F4',
          blueDark: '#1A73E8',
          blueTint: '#E8F0FE',
          red: '#EA4335',
          redDark: '#D93025',
          redTint: '#FCE8E6',
          yellow: '#FBBC04',
          yellowDark: '#F9AB00',
          yellowTint: '#FEF7E0',
          green: '#34A853',
          greenDark: '#1E8E3E',
          greenTint: '#E6F4EA',
          dark: '#202124',
          gray: '#5F6368',
          border: '#DADCE0',
          surface: '#F1F3F4',
          light: '#F8F9FA'
        },
        uhu: {
          blue: '#003366',
          gold: '#C5A059'
        }
      },
      fontFamily: {
        sans: ['"Google Sans"', '"Plus Jakarta Sans"', 'Roboto', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['"Google Sans Display"', '"Google Sans"', '"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        mono: ['"Google Sans Mono"', '"JetBrains Mono"', 'monospace']
      }
    },
  },
  plugins: [],
}
