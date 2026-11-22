import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { getAssetUrl } from '@/config/site';

const hashCache = new Map<string, string>();

/**
 * Añade automáticamente ?v=<hash8> basado en el contenido real del archivo en public/
 * durante el build estático de Astro. Así, al sustituir un logo .png, ni Cloudflare
 * ni el navegador sirven la versión antigua cacheada.
 */
export function getVersionedAssetUrl(assetPath: string): string {
  const baseUrl = getAssetUrl(assetPath);
  const cleanRel = assetPath.split('?')[0].replace(/^\/+/, '');
  if (!cleanRel) return baseUrl;

  let shortHash = hashCache.get(cleanRel);
  if (shortHash === undefined) {
    try {
      const fullPath = path.resolve(process.cwd(), 'public', cleanRel);
      const buf = fs.readFileSync(fullPath);
      shortHash = crypto.createHash('sha256').update(buf).digest('hex').slice(0, 8);
    } catch {
      shortHash = '';
    }
    hashCache.set(cleanRel, shortHash);
  }

  if (!shortHash) return baseUrl;
  const sep = baseUrl.includes('?') ? '&' : '?';
  return `${baseUrl}${sep}v=${shortHash}`;
}

/**
 * Devuelve la miniatura WebP 128x128 optimizada (si fue generada antes del build)
 * para las tarjetas 64x64 de /openbadges/, manteniendo los PNG originales intactos
 * para Open Badges 2.0/3.0, diplomas y PDFs.
 */
export function getBadgeThumbUrl(assetPath: string): string {
  const cleanRel = assetPath.split('?')[0].replace(/^\/+/, '');
  const match = cleanRel.match(/^images\/badges\/([^/]+)\.(png|jpe?g)$/i);
  if (match) {
    const thumbRel = `images/badges/thumbs/${match[1]}.webp`;
    const thumbFull = path.resolve(process.cwd(), 'public', thumbRel);
    if (fs.existsSync(thumbFull)) {
      return getVersionedAssetUrl(`/${thumbRel}`);
    }
  }
  return getVersionedAssetUrl(assetPath);
}
