#!/usr/bin/env node
/**
 * Genera un par de claves criptográficas Ed25519 para firmar credenciales Open Badges 3.0
 * (W3C Verifiable Credentials con DataIntegrityProof / eddsa-rdfc-2022) bajo did:web:gdguhu.com.
 *
 * Uso:
 *   node scripts/generate-ob3-key.mjs           # Muestra did.json y clave privada PEM por pantalla
 *   node scripts/generate-ob3-key.mjs --write   # Actualiza public/.well-known/did.json y muestra la clave privada
 *
 * IMPORTANTE: Nunca guardes ni subas la clave privada al repositorio Git.
 * Guárdala únicamente en GitHub -> Settings -> Secrets and variables -> Actions -> OB3_PRIVATE_KEY.
 */
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

const BASE58_ALPHABET = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
const DID = 'did:web:gdguhu.com';
const KEY_ID = `${DID}#key-1`;

function base58btcEncode(bytes) {
  let leadingZeros = 0;
  while (leadingZeros < bytes.length && bytes[leadingZeros] === 0) {
    leadingZeros++;
  }
  let num = 0n;
  for (const byte of bytes) {
    num = (num << 8n) + BigInt(byte);
  }
  let encoded = '';
  while (num > 0n) {
    const remainder = Number(num % 58n);
    num /= 58n;
    encoded = BASE58_ALPHABET[remainder] + encoded;
  }
  return '1'.repeat(leadingZeros) + encoded;
}

const { publicKey, privateKey } = crypto.generateKeyPairSync('ed25519');

// Extraer los 32 bytes crudos de la clave pública desde SPKI DER (prefijo de 12 bytes para Ed25519)
const spkiDer = publicKey.export({ type: 'spki', format: 'der' });
const rawPubKey = spkiDer.subarray(spkiDer.length - 32);

// Multicodec Ed25519 public key prefix: 0xed 0x01
const multicodecPubKey = Buffer.concat([Buffer.from([0xed, 0x01]), rawPubKey]);
const publicKeyMultibase = `z${base58btcEncode(multicodecPubKey)}`;

const didDocument = {
  '@context': [
    'https://www.w3.org/ns/did/v1',
    'https://w3id.org/security/multikey/v1',
  ],
  id: DID,
  verificationMethod: [
    {
      id: KEY_ID,
      type: 'Multikey',
      controller: DID,
      publicKeyMultibase,
    },
  ],
  authentication: [KEY_ID],
  assertionMethod: [KEY_ID],
};

const privateKeyPem = privateKey.export({ type: 'pkcs8', format: 'pem' }).toString();

if (process.argv.includes('--write')) {
  const didPath = path.resolve(process.cwd(), 'public/.well-known/did.json');
  fs.mkdirSync(path.dirname(didPath), { recursive: true });
  fs.writeFileSync(didPath, `${JSON.stringify(didDocument, null, 2)}\n`, 'utf8');
  console.log(`✅ Documento DID actualizado en: ${didPath}\n`);
} else {
  console.log('=== public/.well-known/did.json ===');
  console.log(JSON.stringify(didDocument, null, 2));
  console.log('');
}

console.log('=== SECRETO DE GITHUB ACTIONS: OB3_PRIVATE_KEY (NO SUBIR A GIT) ===');
console.log(privateKeyPem.trim());
console.log('===================================================================');
console.log('\nPasos siguientes:');
console.log('1. Copia el bloque PEM completo en GitHub -> Settings -> Secrets and variables -> Actions -> OB3_PRIVATE_KEY.');
console.log('2. Sube public/.well-known/did.json al repositorio para publicar la nueva clave pública.');
