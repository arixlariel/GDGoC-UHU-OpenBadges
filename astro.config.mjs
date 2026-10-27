import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

// Configuración con Dominio Oficial Propio: https://gdguhu.es
const SITE_URL = process.env.SITE_URL || 'https://gdguhu.es';
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
