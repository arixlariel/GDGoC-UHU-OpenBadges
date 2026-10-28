#!/usr/bin/env node

/**
 * 📦 GDGoC UHU — Procesador automático de publicaciones (publish.json y carpetas publish/)
 *
 * Detecta y clasifica automáticamente:
 *   1. Archivos empaquetados `publish.json` (subidos en la raíz del repo, en publish/, en badges/ o en assertions/)
 *   2. Archivos `.json` sueltos subidos en `publish/`, `src/content/badges/publish/` o `src/content/assertions/publish/`
 *   3. Archivos `.json` de badges o certificados subidos por error directamente en la raíz del repositorio
 *
 * Además:
 *   - Evita certificados duplicados (mismo badgeId + mismo hash de destinatario)
 *   - Guarda la cola de correos en `/tmp/pending-emails.json` (fuera de ./dist para no exponer jamás emails en la web)
 *   - Elimina los archivos temporales (`publish.json`, `_pending-emails.json`) tras procesarlos
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const badgesDir = path.join(rootDir, 'src', 'content', 'badges');
const assertionsDir = path.join(rootDir, 'src', 'content', 'assertions');
const pendingEmailsTmpPath = '/tmp/pending-emails.json';

fs.mkdirSync(badgesDir, { recursive: true });
fs.mkdirSync(assertionsDir, { recursive: true });

// Cargar certificados existentes para evitar duplicados (badgeId + identity)
function getExistingAssertionsMap() {
  const map = new Map();
  const files = fs.readdirSync(assertionsDir).filter((f) => f.endsWith('.json') && !f.startsWith('_'));
  for (const file of files) {
    try {
      const fullPath = path.join(assertionsDir, file);
      const data = JSON.parse(fs.readFileSync(fullPath, 'utf-8'));
      if (data?.recipient?.identity && data?.badgeId) {
        const key = `${data.badgeId}::${data.recipient.identity}`;
        map.set(key, file.replace(/\.json$/i, ''));
      }
    } catch {
      // ignorar archivos malformados
    }
  }
  return map;
}

const existingAssertions = getExistingAssertionsMap();
const collectedEmails = [];

// Si ya existía una cola previa en /tmp/pending-emails.json, conservarla
if (fs.existsSync(pendingEmailsTmpPath)) {
  try {
    const prev = JSON.parse(fs.readFileSync(pendingEmailsTmpPath, 'utf-8'));
    if (Array.isArray(prev)) collectedEmails.push(...prev);
  } catch {
    // ignorar
  }
}

let hasRepoChanges = false;

function writeBadge(slug, badgeObj) {
  const cleanSlug = String(slug || '').replace(/\.json$/i, '').trim();
  if (!cleanSlug) return;
  const cleanBadge = {
    name: badgeObj.name || cleanSlug,
    description: badgeObj.description || '',
    image: badgeObj.image ? String(badgeObj.image).replace(/^\.\/public/, '') : `/images/badges/${cleanSlug}.png`,
    criteria: badgeObj.criteria || { narrative: '' },
    tags: Array.isArray(badgeObj.tags) ? badgeObj.tags : [],
    style: badgeObj.style || 'google',
    issuerId: badgeObj.issuerId || 'gdgoc-uhu',
  };
  const destPath = path.join(badgesDir, `${cleanSlug}.json`);
  fs.writeFileSync(destPath, JSON.stringify(cleanBadge, null, 2) + '\n', 'utf-8');
  console.log(`✅ Badge guardada en src/content/badges/${cleanSlug}.json`);
  hasRepoChanges = true;
}

function writeAssertion(id, assertionObj) {
  const cleanId = String(id || '').replace(/\.json$/i, '').trim();
  if (!cleanId || !assertionObj?.recipient?.identity || !assertionObj?.badgeId) return cleanId;

  const dupKey = `${assertionObj.badgeId}::${assertionObj.recipient.identity}`;
  if (existingAssertions.has(dupKey)) {
    const existingId = existingAssertions.get(dupKey);
    if (existingId !== cleanId) {
      console.log(`ℹ️ Certificado ya existente para ${assertionObj.recipient.name} (${existingId}), evitando duplicado.`);
      return existingId;
    }
  }

  // Asegurar que nunca se guarde el email en texto plano dentro de la aserción pública
  const safeAssertion = {
    recipient: {
      name: assertionObj.recipient.name,
      identity: assertionObj.recipient.identity,
      hashed: true,
      type: 'email',
      salt: assertionObj.recipient.salt || `gdgoc-uhu-salt-${new Date().getFullYear()}`,
    },
    badgeId: assertionObj.badgeId,
    role: assertionObj.role || 'Asistente Certificado',
    issuedOn: assertionObj.issuedOn || new Date().toISOString(),
  };
  if (assertionObj.expires) safeAssertion.expires = assertionObj.expires;
  if (assertionObj.evidence) safeAssertion.evidence = assertionObj.evidence;
  if (assertionObj.styleOverride) safeAssertion.styleOverride = assertionObj.styleOverride;

  const destPath = path.join(assertionsDir, `${cleanId}.json`);
  fs.writeFileSync(destPath, JSON.stringify(safeAssertion, null, 2) + '\n', 'utf-8');
  existingAssertions.set(dupKey, cleanId);
  console.log(`✅ Certificado guardado en src/content/assertions/${cleanId}.json`);
  hasRepoChanges = true;
  return cleanId;
}

function processSingleJsonFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  const baseName = path.basename(filePath);

  let parsed;
  try {
    parsed = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  } catch (err) {
    console.error(`⚠️ No se pudo leer JSON en ${filePath}: ${err.message}`);
    return;
  }

  // 1. Cola de correos directa (_pending-emails.json)
  if (baseName === '_pending-emails.json' && Array.isArray(parsed)) {
    collectedEmails.push(...parsed);
    fs.unlinkSync(filePath);
    hasRepoChanges = true;
    console.log(`📧 Cola de ${parsed.length} correos extraída de ${filePath}`);
    return;
  }

  // 2. Paquete unificado publish.json (generado por generador-local.html)
  if (parsed && typeof parsed === 'object' && !Array.isArray(parsed) && (Array.isArray(parsed.assertions) || Array.isArray(parsed.badges))) {
    const idRedirectMap = new Map();

    if (Array.isArray(parsed.badges)) {
      for (const b of parsed.badges) {
        if (b && b.id && b.data) {
          writeBadge(b.id, b.data);
        }
      }
    }

    if (Array.isArray(parsed.assertions)) {
      for (const a of parsed.assertions) {
        if (a && a.id && a.data) {
          const finalId = writeAssertion(a.id, a.data);
          idRedirectMap.set(a.id, finalId);
        }
      }
    }

    if (Array.isArray(parsed.pendingEmails)) {
      for (const mail of parsed.pendingEmails) {
        const finalId = idRedirectMap.get(mail.assertionId) || mail.assertionId;
        collectedEmails.push({
          ...mail,
          assertionId: finalId,
          url: `https://gdguhu.es/cert/${finalId}/`,
        });
      }
      console.log(`📧 Cola de ${parsed.pendingEmails.length} correos extraída de ${baseName}`);
    }

    fs.unlinkSync(filePath);
    hasRepoChanges = true;
    return;
  }

  // 3. Certificado individual (Assertion)
  if (parsed && typeof parsed === 'object' && parsed.recipient && parsed.badgeId) {
    const slug = baseName.replace(/\.json$/i, '');
    writeAssertion(slug, parsed);
    if (path.resolve(path.dirname(filePath)) !== path.resolve(assertionsDir)) {
      fs.unlinkSync(filePath);
      hasRepoChanges = true;
    }
    return;
  }

  // 4. Badge individual (BadgeClass)
  if (parsed && typeof parsed === 'object' && parsed.name && parsed.criteria) {
    const slug = baseName.replace(/\.json$/i, '');
    writeBadge(slug, parsed);
    if (path.resolve(path.dirname(filePath)) !== path.resolve(badgesDir)) {
      fs.unlinkSync(filePath);
      hasRepoChanges = true;
    }
    return;
  }
}

// Escanear posibles ubicaciones donde el organizador haya subido publish.json o carpetas publish/
const candidateDirs = [
  path.join(rootDir, 'publish'),
  path.join(badgesDir, 'publish'),
  path.join(assertionsDir, 'publish'),
];

for (const dir of candidateDirs) {
  if (fs.existsSync(dir) && fs.statSync(dir).isDirectory()) {
    const entries = fs.readdirSync(dir).filter((f) => f.endsWith('.json'));
    for (const entry of entries) {
      processSingleJsonFile(path.join(dir, entry));
    }
  }
}

// También comprobar si se subió publish.json (o publish (1).json, etc.) o un certificado/badge directamente en la raíz, en badges/ o en assertions/
const ignoredRootJson = new Set(['package.json', 'package-lock.json', 'tsconfig.json']);
for (const entry of fs.readdirSync(rootDir)) {
  if (entry.endsWith('.json') && !ignoredRootJson.has(entry)) {
    processSingleJsonFile(path.join(rootDir, entry));
  }
}

for (const dir of [badgesDir, assertionsDir]) {
  for (const entry of fs.readdirSync(dir)) {
    if (entry === '_pending-emails.json' || /^publish.*\.json$/i.test(entry)) {
      processSingleJsonFile(path.join(dir, entry));
    }
  }
}

// Limpiar carpeta publish/ de la raíz si se creó y quedó vacía
const rootPublishDir = path.join(rootDir, 'publish');
if (fs.existsSync(rootPublishDir) && fs.statSync(rootPublishDir).isDirectory()) {
  const remaining = fs.readdirSync(rootPublishDir);
  if (remaining.length === 0) {
    fs.rmdirSync(rootPublishDir);
    hasRepoChanges = true;
  }
}

// Guardar cola de correos pendientes en /tmp/pending-emails.json si hay destinatarios
if (collectedEmails.length > 0) {
  // Evitar enviar dos correos al mismo email + assertionId en la misma ejecución
  const uniqueMap = new Map();
  for (const item of collectedEmails) {
    if (item && item.email) {
      uniqueMap.set(`${item.email}::${item.assertionId}`, item);
    }
  }
  const finalQueue = Array.from(uniqueMap.values());
  fs.writeFileSync(pendingEmailsTmpPath, JSON.stringify(finalQueue, null, 2), 'utf-8');
  console.log(`📬 Lista final de ${finalQueue.length} correos preparada en ${pendingEmailsTmpPath}`);
}

if (hasRepoChanges) {
  console.log('✨ Archivos organizados correctamente.');
}

