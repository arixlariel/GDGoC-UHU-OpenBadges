import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

// Configuración para GitHub Pages o Dominio personalizado
// Si se usa GitHub Pages sin dominio: base = '/<nombre-repositorio>/'
// Si se usa dominio personalizado (ej. badges.gdgocuhu.es): base = '/'
const SITE_URL = process.env.SITE_URL || 'https://arixlariel.github.io';
const BASE_PATH = process.env.BASE_PATH || '/';

export default defineConfig({
  site: SITE_URL,
  base: BASE_PATH,
  integrations: [tailwind()],
  output: 'static',
  build: {
    format: 'file' // Genera archivos limpios como /api/badges/issuer.json directamente
  }
});

