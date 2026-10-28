#!/usr/bin/env node

/**
 * 🎓 GDGoC UHU — Emisión MASIVA de Certificados desde CSV
 *
 * Compatible tanto con:
 * 1. El CSV oficial exportado desde Bevy / GDG Community Platform (gdg.community.dev)
 *    (columnas: First Name, Last Name, Email, Checkin Date (UTC), etc.)
 * 2. Un CSV estándar personalizado (columnas: nombre, email, badgeId, role, evidence)
 *
 * USO:
 *   npm run bulk -- asistentes.csv --badge capture-the-flag-reversing-de-binarios --role "Asistente Certificado"
 *   node scripts/bulk-issue.mjs asistentes.csv --badge workshop-ai-cloud
 *
 * PARÁMETROS OPCIONALES:
 *   --badge <badgeId>       Insignia a otorgar a todos los del CSV (si el CSV no tiene columna badgeId)
 *   --role <role>           Rol por defecto (ej: "Asistente Certificado", por defecto "Participante")
 *   --only-checked-in       Solo emitir certificados a quienes tengan fecha de Check-in en Bevy
 *   --output-list <path>    Guardar lista de emisión temporal con emails para envío posterior
 */

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const assertionsDir = path.join(rootDir, 'src', 'content', 'assertions');
const badgesDir = path.join(rootDir, 'src', 'content', 'badges');

// Función para poner nombres en Title Case elegante (ej: "CARLOS PÉREZ" -> "Carlos Pérez")
function toTitleCase(str) {
  if (!str) return '';
  const lowerWords = ['de', 'del', 'la', 'las', 'los', 'y', 'e', 'el', 'da', 'do', 'dos', 'das', 'von', 'van'];
  return str
    .toLowerCase()
    .trim()
    .split(/\s+/)
    .map((word, index) => {
      if (index > 0 && lowerWords.includes(word)) {
        return word;
      }
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(' ');
}

// Limpiar nombres duplicados (como "Álvaro Ortiz" + "Ortiz")
function cleanFullName(firstName, lastName) {
  const f = (firstName || '').trim();
  const l = (lastName || '').trim();

  if (!l) return toTitleCase(f);
  if (!f) return toTitleCase(l);

  // Si First Name ya termina con Last Name o son iguales, evitar duplicar
  if (f.toLowerCase() === l.toLowerCase()) {
    return toTitleCase(f);
  }
  if (f.toLowerCase().endsWith(l.toLowerCase())) {
    return toTitleCase(f);
  }

  return toTitleCase(`${f} ${l}`);
}

function getAvailableBadges() {
  if (!fs.existsSync(badgesDir)) return [];
  return fs.readdirSync(badgesDir)
    .filter((f) => f.endsWith('.json'))
    .map((f) => f.replace(/\.json$/, ''));
}

function generateAssertionId() {
  return crypto.randomBytes(12).toString('hex');
}

function hashEmail(email, salt) {
  const hash = crypto.createHash('sha256');
  hash.update(email.toLowerCase().trim() + salt);
  return `sha256$${hash.digest('hex')}`;
}

// Cargar certificados existentes para evitar emitir duplicados (mismo email o nombre + misma insignia)
function loadExistingAssertions() {
  if (!fs.existsSync(assertionsDir)) return [];
  const files = fs.readdirSync(assertionsDir).filter((f) => f.endsWith('.json'));
  const existing = [];
  for (const file of files) {
    try {
      const raw = fs.readFileSync(path.join(assertionsDir, file), 'utf-8');
      const data = JSON.parse(raw);
      existing.push({
        id: file.replace(/\.json$/, ''),
        badgeId: data.badgeId,
        nameNorm: (data.recipient?.name || '').toLowerCase().trim(),
        identity: data.recipient?.identity || '',
        salt: data.recipient?.salt || '',
      });
    } catch {
      // Ignorar archivos corruptos
    }
  }
  return existing;
}

function findDuplicateAssertion(existingList, email, nombre, badgeId) {
  const nameNorm = (nombre || '').toLowerCase().trim();
  const emailNorm = (email || '').toLowerCase().trim();

  for (const item of existingList) {
    if (item.badgeId !== badgeId) continue;
    if (item.salt && emailNorm) {
      const candidateHash = hashEmail(emailNorm, item.salt);
      if (candidateHash === item.identity) {
        return item.id;
      }
    }
    if (nameNorm && item.nameNorm === nameNorm) {
      return item.id;
    }
  }
  return null;
}

// Parser CSV robusto compatible con comas entre comillas
function parseCSV(content) {
  const lines = content.trim().split(/\r?\n/);
  if (lines.length < 2) {
    throw new Error('El archivo CSV debe tener una fila de cabecera y al menos una fila de datos.');
  }

  function splitLine(line) {
    const values = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        if (inQuotes && line[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        values.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    values.push(current.trim());
    return values;
  }

  const header = splitLine(lines[0]).map((h) => h.trim().toLowerCase());
  const rows = [];

  for (let i = 1; i < lines.length; i++) {
    const rawLine = lines[i].trim();
    if (!rawLine) continue;
    const values = splitLine(rawLine);
    const rowObj = {};
    for (let j = 0; j < header.length; j++) {
      rowObj[header[j]] = values[j] !== undefined ? values[j] : '';
    }
    rows.push(rowObj);
  }

  return { header, rows };
}

// Procesar asistentes detectando formato Bevy o genérico
function extractAttendees(parsed, defaultBadge, defaultRole, onlyCheckedIn = false) {
  const { header, rows } = parsed;
  const isBevy = header.includes('first name') && header.includes('email');
  const attendees = [];

  for (let idx = 0; idx < rows.length; idx++) {
    const r = rows[idx];

    let nombre = '';
    let email = '';
    let badgeId = defaultBadge || '';
    let role = defaultRole || 'Participante';
    let evidence = '';
    let checkedIn = false;

    if (isBevy) {
      // Formato oficial Bevy / GDG Community
      const firstName = r['first name'] || '';
      const lastName = r['last name'] || '';
      nombre = cleanFullName(firstName, lastName);
      email = (r['email'] || '').trim();
      const checkinCol = r['checkin date (utc)'] || r['checkin date'] || '';
      checkedIn = Boolean(checkinCol && checkinCol.trim().length > 0);

      // Si el evento tiene ticket title específico
      if (!badgeId && r['ticket title']) {
        // Puede usarse de pista o default
      }
    } else {
      // Formato genérico
      nombre = toTitleCase(r['nombre'] || r['name'] || r['alumno'] || r['estudiante'] || '');
      email = (r['email'] || r['correo'] || r['mail'] || '').trim();
      badgeId = r['badgeid'] || r['badge'] || r['insignia'] || defaultBadge || '';
      role = r['role'] || r['rol'] || defaultRole || 'Participante';
      evidence = r['evidence'] || r['evidencia'] || r['proyecto'] || '';
      checkedIn = true;
    }

    if (!email || !nombre) {
      continue;
    }

    // Filtrar si el usuario pidió solo quienes tienen check-in
    if (onlyCheckedIn && !checkedIn) {
      continue;
    }

    attendees.push({
      nombre,
      email,
      badgeId,
      role,
      evidence,
      checkedIn,
    });
  }

  return attendees;
}

// ── Ejecución Principal ──

async function main() {
  console.log('\n══════════════════════════════════════════════════════════');
  console.log('   🎓 GDGoC UHU — Emisión Masiva de Certificados Open Badges');
  console.log('══════════════════════════════════════════════════════════\n');

  const args = process.argv.slice(2);
  let csvPath = '';
  let defaultBadge = '';
  let defaultRole = 'Asistente Certificado';
  let onlyCheckedIn = false;
  let outputList = '';

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--badge' && args[i + 1]) {
      defaultBadge = args[i + 1];
      i++;
    } else if (args[i] === '--role' && args[i + 1]) {
      defaultRole = args[i + 1];
      i++;
    } else if (args[i] === '--only-checked-in') {
      onlyCheckedIn = true;
    } else if (args[i] === '--output-list' && args[i + 1]) {
      outputList = args[i + 1];
      i++;
    } else if (!args[i].startsWith('--') && !csvPath) {
      csvPath = args[i];
    }
  }

  if (!csvPath) {
    console.error('❌ Error: Falta el archivo CSV.');
    console.error('\nUso:');
    console.error('  npm run bulk -- asistentes.csv --badge <badgeId> [--role <rol>]');
    console.error('  node scripts/bulk-issue.mjs archivo.csv --badge workshop-ai-cloud\n');
    process.exit(1);
  }

  const resolvedPath = path.resolve(csvPath);
  if (!fs.existsSync(resolvedPath)) {
    console.error(`❌ Error: El archivo "${resolvedPath}" no existe.`);
    process.exit(1);
  }

  const availableBadges = getAvailableBadges();
  if (availableBadges.length === 0) {
    console.error('❌ Error: No hay insignias creadas en src/content/badges/.');
    process.exit(1);
  }

  if (defaultBadge && !availableBadges.includes(defaultBadge)) {
    console.error(`❌ Error: La insignia "${defaultBadge}" no existe.`);
    console.error(`   Insignias disponibles: ${availableBadges.join(', ')}`);
    process.exit(1);
  }

  console.log(`📂 Archivo: ${resolvedPath}`);
  const csvContent = fs.readFileSync(resolvedPath, 'utf-8');
  const parsed = parseCSV(csvContent);
  const attendees = extractAttendees(parsed, defaultBadge, defaultRole, onlyCheckedIn);

  if (attendees.length === 0) {
    console.error('❌ No se encontraron asistentes válidos con nombre y email en el CSV.');
    process.exit(1);
  }

  console.log(`👥 ${attendees.length} asistentes listos para recibir certificado.`);
  if (!defaultBadge && attendees.some((a) => !a.badgeId)) {
    console.error('❌ Error: Debes especificar la insignia con --badge <nombre_insignia>.');
    console.error(`   Insignias disponibles: ${availableBadges.join(', ')}`);
    process.exit(1);
  }

  if (!fs.existsSync(assertionsDir)) {
    fs.mkdirSync(assertionsDir, { recursive: true });
  }

  const existingAssertions = loadExistingAssertions();
  const salt = 'gdgoc-uhu-salt-' + new Date().getFullYear();
  const issuedOn = new Date().toISOString();
  const results = [];
  let emitted = 0;
  let skippedDuplicates = 0;

  for (const a of attendees) {
    const duplicateId = findDuplicateAssertion(existingAssertions, a.email, a.nombre, a.badgeId);
    if (duplicateId) {
      console.log(`  ⏭️  Omitido (duplicado): ${a.nombre} ya tiene este certificado → https://gdguhu.es/cert/${duplicateId}`);
      skippedDuplicates++;
      continue;
    }

    const assertionId = generateAssertionId();
    const identityHash = hashEmail(a.email, salt);

    const assertionData = {
      recipient: {
        name: a.nombre,
        identity: identityHash,
        hashed: true,
        type: 'email',
        salt,
      },
      badgeId: a.badgeId,
      role: a.role,
      issuedOn,
    };

    if (a.evidence) {
      assertionData.evidence = a.evidence;
    }

    const filePath = path.join(assertionsDir, `${assertionId}.json`);
    fs.writeFileSync(filePath, JSON.stringify(assertionData, null, 2), 'utf-8');

    // Añadir a la lista en memoria para evitar también duplicados dentro del mismo CSV
    existingAssertions.push({
      id: assertionId,
      badgeId: a.badgeId,
      nameNorm: a.nombre.toLowerCase().trim(),
      identity: identityHash,
      salt,
    });

    results.push({
      nombre: a.nombre,
      email: a.email,
      assertionId,
      badgeId: a.badgeId,
      role: a.role,
      url: `https://gdguhu.es/cert/${assertionId}`,
    });

    console.log(`  ✅ ${a.nombre} → https://gdguhu.es/cert/${assertionId}`);
    emitted++;
  }

  // Guardar lista temporal para envío automático de emails al hacer commit/push
  if (results.length > 0) {
    const publishDir = path.join(assertionsDir, 'publish');
    if (!fs.existsSync(publishDir)) {
      fs.mkdirSync(publishDir, { recursive: true });
    }
    const pendingEmailsPath = path.join(publishDir, '_pending-emails.json');
    let existingPending = [];
    if (fs.existsSync(pendingEmailsPath)) {
      try {
        existingPending = JSON.parse(fs.readFileSync(pendingEmailsPath, 'utf-8'));
      } catch {
        existingPending = [];
      }
    }
    fs.writeFileSync(pendingEmailsPath, JSON.stringify([...existingPending, ...results], null, 2), 'utf-8');
  }

  if (outputList) {
    const listPath = path.resolve(outputList);
    fs.writeFileSync(listPath, JSON.stringify(results, null, 2), 'utf-8');
  }

  console.log('\n══════════════════════════════════════════════════════════');
  console.log(`  🎉 ¡ÉXITO! Se han generado ${emitted} certificados nuevos.`);
  if (skippedDuplicates > 0) {
    console.log(`  🛡️  Duplicados evitados automáticamente: ${skippedDuplicates}`);
  }
  console.log('══════════════════════════════════════════════════════════\n');
  console.log('  Pasos para publicarlos:');
  console.log('    git add .');
  console.log('    git commit -m "feat(cert): emitir certificados para ' + (defaultBadge || 'evento') + '"');
  console.log('    git push origin main\n');
}

main().catch(console.error);
