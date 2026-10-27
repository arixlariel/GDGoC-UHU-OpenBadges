import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

// Configuración para GitHub Pages
// Repositorio: https://github.com/arixlariel/GDGoC-UHU-OpenBadges
const SITE_URL = process.env.SITE_URL || 'https://arixlariel.github.io';
const BASE_PATH = process.env.BASE_PATH || '/GDGoC-UHU-OpenBadges/';

export default defineConfig({
  site: SITE_URL,
  base: BASE_PATH,
  integrations: [tailwind()],
  output: 'static',
  build: {
    format: 'file' // Genera archivos limpios como /api/badges/issuer.json directamente
  }
});
