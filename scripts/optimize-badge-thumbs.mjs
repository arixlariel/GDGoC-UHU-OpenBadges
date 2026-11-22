#!/usr/bin/env node
/**
 * Genera miniaturas WebP 128x128 (2x Retina para tarjetas 64x64 en /openbadges/)
 * a partir de public/images/badges/*.png sin modificar jamás los PNG originales
 * referenciados por las credenciales Open Badges 2.0/3.0.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const badgesDir = path.resolve(__dirname, '..', 'public', 'images', 'badges');
const thumbsDir = path.join(badgesDir, 'thumbs');

async function main() {
  if (!fs.existsSync(badgesDir)) return;

  let sharp;
  try {
    const mod = await import('sharp');
    sharp = mod.default || mod;
  } catch {
    console.log('[thumbs] sharp no disponible en este entorno; se usarán los PNG originales.');
    return;
  }

  fs.mkdirSync(thumbsDir, { recursive: true });
  const files = fs.readdirSync(badgesDir).filter((f) => /\.(png|jpe?g)$/i.test(f));

  let totalIn = 0;
  let totalOut = 0;
  for (const file of files) {
    const src = path.join(badgesDir, file);
    const slug = file.replace(/\.(png|jpe?g)$/i, '');
    const dest = path.join(thumbsDir, `${slug}.webp`);
    const inSize = fs.statSync(src).size;
    await sharp(src)
      .resize(128, 128, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 84, effort: 5 })
      .toFile(dest);
    const outSize = fs.statSync(dest).size;
    totalIn += inSize;
    totalOut += outSize;
    console.log(`[thumbs] ${file} (${Math.round(inSize / 1024)} KB) -> thumbs/${slug}.webp (${Math.round(outSize / 1024)} KB)`);
  }

  if (totalIn > 0) {
    const savedPct = (((totalIn - totalOut) / totalIn) * 100).toFixed(1);
    console.log(`[thumbs] Total: ${Math.round(totalIn / 1024)} KB -> ${Math.round(totalOut / 1024)} KB (-${savedPct}%)`);
  }
}

main().catch((err) => {
  console.warn('[thumbs] Aviso no bloqueante generando miniaturas:', err.message);
});
