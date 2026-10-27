#!/usr/bin/env node

/**
 * Script interactivo para emitir certificados Open Badges v2.0
 * para GDG on Campus Universidad de Huelva.
 *
 * Uso:
 *   npm run issue
 *   o
 *   node scripts/issue-badge.mjs --name "Juan Pérez" --email "juan@alu.uhu.es" --badge "hackathon-2026" --role "Ganador"
 */

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import readline from 'node:readline';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const assertionsDir = path.join(rootDir, 'src', 'content', 'assertions');
const badgesDir = path.join(rootDir, 'src', 'content', 'badges');

// Leer badges disponibles
function getAvailableBadges() {
  if (!fs.existsSync(badgesDir)) return [];
  return fs.readdirSync(badgesDir)
    .filter((f) => f.endsWith('.json'))
    .map((f) => f.replace(/\.json$/, ''));
}

function generateAssertionId() {
  // Generar ID de 24 caracteres hexadecimales (estilo MongoDB / GDG UAM)
  return crypto.randomBytes(12).toString('hex');
}

function hashEmail(email, salt) {
  const hash = crypto.createHash('sha256');
  hash.update(email.toLowerCase().trim() + salt);
  return `sha256$${hash.digest('hex')}`;
}

async function askQuestion(rl, query, defaultValue = '') {
  return new Promise((resolve) => {
    const prompt = defaultValue ? `${query} [${defaultValue}]: ` : `${query}: `;
    rl.question(prompt, (answer) => {
      resolve(answer.trim() || defaultValue);
    });
  });
}

async function main() {
  console.log('\n======================================================');
  console.log('   🎓 GDGoC UHU - Emisión de Certificado Open Badges   ');
  console.log('======================================================\n');

  const badges = getAvailableBadges();
  if (badges.length === 0) {
    console.error('Error: No se han encontrado insignias en src/content/badges/');
    process.exit(1);
  }

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  try {
    const name = await askQuestion(rl, '1. Nombre completo del destinatario (ej. Alejandro Pérez)');
    if (!name) {
      console.error('Error: El nombre es obligatorio.');
      process.exit(1);
    }

    const email = await askQuestion(rl, '2. Email del destinatario (para calcular hash criptográfico)');
    if (!email) {
      console.error('Error: El email es obligatorio.');
      process.exit(1);
    }

    console.log(`\nInsignias disponibles: ${badges.join(', ')}`);
    const defaultBadge = badges[0];
    const badgeId = await askQuestion(rl, '3. ID de la insignia', defaultBadge);

    if (!badges.includes(badgeId)) {
      console.error(`Error: La insignia "${badgeId}" no existe.`);
      process.exit(1);
    }

    const role = await askQuestion(rl, '4. Rol / Reconocimiento', 'Participante');
    const evidence = await askQuestion(rl, '5. Enlace a proyecto o evidencia (opcional, Enter para omitir)', '');

    const salt = 'gdgoc-uhu-salt-' + new Date().getFullYear();
    const identityHash = hashEmail(email, salt);
    const assertionId = generateAssertionId();
    const issuedOn = new Date().toISOString();

    const assertionData = {
      recipient: {
        name,
        identity: identityHash,
        hashed: true,
        type: 'email',
        salt,
      },
      badgeId,
      role,
      issuedOn,
    };

    if (evidence) {
      assertionData.evidence = evidence;
    }

    // Asegurar directorio
    if (!fs.existsSync(assertionsDir)) {
      fs.mkdirSync(assertionsDir, { recursive: true });
    }

    const filePath = path.join(assertionsDir, `${assertionId}.json`);
    fs.writeFileSync(filePath, JSON.stringify(assertionData, null, 2), 'utf-8');

    console.log('\n✅ ¡Certificado emitido con éxito!');
    console.log('------------------------------------------------------');
    console.log(`ID de Certificado: ${assertionId}`);
    console.log(`Archivo generado:  src/content/assertions/${assertionId}.json`);
    console.log(`Ruta Web:          /cert/${assertionId}`);
    console.log(`API Assertion:     /api/badges/assertion/${assertionId}.json`);
    console.log('------------------------------------------------------');
    console.log('Siguiente paso: Haz commit y push a tu repositorio GitHub para publicarlo.\n');
  } finally {
    rl.close();
  }
}

main().catch(console.error);

