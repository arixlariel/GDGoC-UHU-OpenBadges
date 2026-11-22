#!/usr/bin/env node

/**
 * GDGoC UHU — Copia de seguridad incremental en Firebase Cloud Firestore
 *
 * Sincroniza automáticamente (sin dependencias npm externas, solo Node 20+):
 *   1. `badges`       <- src/content/badges/*.json
 *   2. `assertions`   <- src/content/assertions/*.json (siempre hasheadas, jamás emails en plano)
 *   3. `badge_assets` <- public/images/badges/*.{png,jpg,jpeg,webp,svg} (sin thumbs/)
 *   4. `sync_meta/latest` <- resumen de la última sincronización
 *
 * Seguridad ante pérdidas accidentales:
 *   - Nunca borra documentos de Firestore si desaparecen de Git; los marca con `_meta.inGit = false`
 *     conservando intacto su contenido original (`rawJson` / `data`).
 *   - Incremental: compara `contentHash` / `sha256` antes de escribir para minimizar escrituras y ancho de banda.
 *
 * Uso:
 *   FIREBASE_SERVICE_ACCOUNT='{"type":"service_account",...}' node scripts/sync-firebase-backup.mjs
 *   node scripts/sync-firebase-backup.mjs --key /ruta/service-account.json [--dry-run]
 *   node scripts/sync-firebase-backup.mjs --key /ruta/service-account.json --restore [--include-archived]
 */

import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const BADGES_DIR = path.join(rootDir, 'src', 'content', 'badges');
const ASSERTIONS_DIR = path.join(rootDir, 'src', 'content', 'assertions');
const BADGE_IMAGES_DIR = path.join(rootDir, 'public', 'images', 'badges');

const DEFAULT_DATABASE_ID = process.env.FIREBASE_DATABASE_ID || 'content';
const SITE_URL = (process.env.SITE_URL || 'https://gdguhu.com').replace(/\/+$/, '');
const REPO_NAME = process.env.GITHUB_REPOSITORY || 'arixlariel/GDGoC-UHU-OpenBadges';

// Firestore tiene un límite estricto de 1 MiB (1.048.576 bytes) por documento.
// Si una imagen supera 850 KB en bruto, se divide automáticamente en chunks de 700 KB.
const MAX_INLINE_ASSET_BYTES = 850 * 1024;
const ASSET_CHUNK_SIZE = 700 * 1024;

const IMAGE_MIME_BY_EXT = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
};

function parseCliArgs(argv) {
  const opts = {
    keyPath: process.env.FIREBASE_SERVICE_ACCOUNT_FILE || '',
    databaseId: DEFAULT_DATABASE_ID,
    dryRun: false,
    restore: false,
    includeArchived: false,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--key' && argv[i + 1]) {
      opts.keyPath = argv[++i];
    } else if (arg === '--database' && argv[i + 1]) {
      opts.databaseId = argv[++i];
    } else if (arg === '--dry-run') {
      opts.dryRun = true;
    } else if (arg === '--restore') {
      opts.restore = true;
    } else if (arg === '--include-archived') {
      opts.includeArchived = true;
    }
  }
  return opts;
}

function loadServiceAccount(keyPath) {
  const rawEnv = process.env.FIREBASE_SERVICE_ACCOUNT?.trim();
  let rawJson = '';

  if (keyPath) {
    rawJson = fs.readFileSync(path.resolve(keyPath), 'utf-8');
  } else if (rawEnv) {
    if (rawEnv.startsWith('{')) {
      rawJson = rawEnv;
    } else if (fs.existsSync(rawEnv)) {
      rawJson = fs.readFileSync(rawEnv, 'utf-8');
    } else {
      // Permitir también JSON codificado en base64
      rawJson = Buffer.from(rawEnv, 'base64').toString('utf-8');
    }
  } else {
    throw new Error(
      'Falta FIREBASE_SERVICE_ACCOUNT (o --key /ruta/service-account.json). Saltando copia en Firestore.'
    );
  }

  const sa = JSON.parse(rawJson);
  if (!sa.project_id || !sa.client_email || !sa.private_key) {
    throw new Error('La credencial de Firebase no contiene project_id, client_email o private_key.');
  }
  return sa;
}

function base64Url(input) {
  return Buffer.from(input)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

async function getAccessToken(sa) {
  const now = Math.floor(Date.now() / 1000);
  const tokenUri = sa.token_uri || 'https://oauth2.googleapis.com/token';

  const header = base64Url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const payload = base64Url(
    JSON.stringify({
      iss: sa.client_email,
      scope: 'https://www.googleapis.com/auth/datastore',
      aud: tokenUri,
      iat: now,
      exp: now + 3600,
    })
  );

  const signingInput = `${header}.${payload}`;
  const signer = crypto.createSign('RSA-SHA256');
  signer.update(signingInput);
  signer.end();
  const signature = base64Url(signer.sign(sa.private_key));
  const assertion = `${signingInput}.${signature}`;

  const body = new URLSearchParams({
    grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
    assertion,
  });

  const resp = await fetch(tokenUri, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });

  if (!resp.ok) {
    const errText = await resp.text();
    throw new Error(`Error autenticando con Google OAuth2 (${resp.status}): ${errText.slice(0, 300)}`);
  }

  const data = await resp.json();
  if (!data.access_token) {
    throw new Error('Google OAuth2 no devolvió access_token.');
  }
  return data.access_token;
}

function sha256Hex(bufferOrString) {
  return crypto.createHash('sha256').update(bufferOrString).digest('hex');
}

function getCommitSha() {
  try {
    const sha = execSync('git rev-parse HEAD', { cwd: rootDir, stdio: ['ignore', 'pipe', 'ignore'] })
      .toString('utf-8')
      .trim();
    if (sha) return sha;
  } catch {
    // fallback a GITHUB_SHA
  }
  return process.env.GITHUB_SHA || 'local';
}

// --- Serialización / Deserialización Firestore REST API v1 ---

function ts(isoString) {
  return { __firestoreType: 'timestamp', value: isoString };
}

function bytes(buffer) {
  return { __firestoreType: 'bytes', value: Buffer.from(buffer) };
}

function toFirestoreValue(val) {
  if (val === null || val === undefined) {
    return { nullValue: null };
  }
  if (val && typeof val === 'object' && val.__firestoreType === 'timestamp') {
    return { timestampValue: val.value };
  }
  if (val && typeof val === 'object' && val.__firestoreType === 'bytes') {
    return { bytesValue: val.value.toString('base64') };
  }
  if (Buffer.isBuffer(val) || val instanceof Uint8Array) {
    return { bytesValue: Buffer.from(val).toString('base64') };
  }
  if (typeof val === 'boolean') {
    return { booleanValue: val };
  }
  if (typeof val === 'number') {
    if (Number.isInteger(val)) {
      return { integerValue: String(val) };
    }
    return { doubleValue: val };
  }
  if (typeof val === 'string') {
    return { stringValue: val };
  }
  if (Array.isArray(val)) {
    return {
      arrayValue: {
        values: val.map((item) => toFirestoreValue(item)),
      },
    };
  }
  if (typeof val === 'object') {
    const fields = {};
    for (const [k, v] of Object.entries(val)) {
      if (v !== undefined) {
        fields[k] = toFirestoreValue(v);
      }
    }
    return { mapValue: { fields } };
  }
  return { stringValue: String(val) };
}

function toFirestoreFields(obj) {
  const fields = {};
  for (const [k, v] of Object.entries(obj)) {
    if (v !== undefined) {
      fields[k] = toFirestoreValue(v);
    }
  }
  return fields;
}

function fromFirestoreValue(fv) {
  if (!fv || typeof fv !== 'object') return null;
  if ('nullValue' in fv) return null;
  if ('booleanValue' in fv) return Boolean(fv.booleanValue);
  if ('integerValue' in fv) return Number(fv.integerValue);
  if ('doubleValue' in fv) return Number(fv.doubleValue);
  if ('stringValue' in fv) return fv.stringValue;
  if ('timestampValue' in fv) return fv.timestampValue;
  if ('bytesValue' in fv) return Buffer.from(fv.bytesValue, 'base64');
  if ('arrayValue' in fv) {
    return (fv.arrayValue.values || []).map((v) => fromFirestoreValue(v));
  }
  if ('mapValue' in fv) {
    const out = {};
    for (const [k, v] of Object.entries(fv.mapValue.fields || {})) {
      out[k] = fromFirestoreValue(v);
    }
    return out;
  }
  return null;
}

function fromFirestoreDoc(doc) {
  const out = {};
  for (const [k, v] of Object.entries(doc.fields || {})) {
    out[k] = fromFirestoreValue(v);
  }
  const parts = String(doc.name || '').split('/');
  const id = parts[parts.length - 1] || '';
  return { id, data: out };
}

// --- Cliente mínimo de Firestore REST API v1 ---

class FirestoreClient {
  constructor(projectId, databaseId, accessToken) {
    this.projectId = projectId;
    this.databaseId = databaseId;
    this.accessToken = accessToken;
    this.baseUrl = `https://firestore.googleapis.com/v1/projects/${encodeURIComponent(
      projectId
    )}/databases/${encodeURIComponent(databaseId)}/documents`;
  }

  encodePath(docPath) {
    return docPath
      .split('/')
      .filter(Boolean)
      .map((seg) => encodeURIComponent(seg))
      .join('/');
  }

  async request(method, relativePath, { query = null, body = null } = {}) {
    let url = `${this.baseUrl}/${this.encodePath(relativePath)}`;
    if (query) {
      const params = new URLSearchParams();
      for (const [k, v] of query) {
        params.append(k, v);
      }
      const qs = params.toString();
      if (qs) url += `?${qs}`;
    }

    const headers = {
      Authorization: `Bearer ${this.accessToken}`,
    };
    let payload;
    if (body !== null) {
      headers['Content-Type'] = 'application/json';
      payload = JSON.stringify(body);
    }

    const resp = await fetch(url, { method, headers, body: payload });
    const text = await resp.text();
    let json = null;
    if (text) {
      try {
        json = JSON.parse(text);
      } catch {
        json = text;
      }
    }

    if (!resp.ok) {
      const err = new Error(
        `Firestore ${method} ${relativePath} -> HTTP ${resp.status}: ${
          typeof json === 'string' ? json.slice(0, 300) : JSON.stringify(json).slice(0, 300)
        }`
      );
      err.status = resp.status;
      err.body = json;
      throw err;
    }
    return json;
  }

  async listCollection(collectionPath, maskFields = []) {
    const docs = [];
    let pageToken = '';

    do {
      const query = [['pageSize', '300']];
      for (const f of maskFields) {
        query.push(['mask.fieldPaths', f]);
      }
      if (pageToken) {
        query.push(['pageToken', pageToken]);
      }

      let res;
      try {
        res = await this.request('GET', collectionPath, { query });
      } catch (err) {
        if (err.status === 404) return [];
        throw err;
      }

      for (const doc of res?.documents || []) {
        docs.push(fromFirestoreDoc(doc));
      }
      pageToken = res?.nextPageToken || '';
    } while (pageToken);

    return docs;
  }

  async setDocument(docPath, dataObj, updateMaskFields = []) {
    const query = updateMaskFields.map((f) => ['updateMask.fieldPaths', f]);
    return this.request('PATCH', docPath, {
      query: query.length > 0 ? query : null,
      body: { fields: toFirestoreFields(dataObj) },
    });
  }

  async deleteDocument(docPath) {
    try {
      await this.request('DELETE', docPath);
    } catch (err) {
      if (err.status !== 404) throw err;
    }
  }
}

// --- Lectura local de badges, assertions e imágenes ---

function readLocalBadges() {
  const items = new Map();
  if (!fs.existsSync(BADGES_DIR)) return items;

  const files = fs
    .readdirSync(BADGES_DIR, { withFileTypes: true })
    .filter((d) => d.isFile() && d.name.endsWith('.json') && !d.name.startsWith('_'))
    .map((d) => d.name)
    .sort();

  for (const file of files) {
    const slug = file.replace(/\.json$/i, '');
    const fullPath = path.join(BADGES_DIR, file);
    const rawText = fs.readFileSync(fullPath, 'utf-8');
    const parsed = JSON.parse(rawText);
    const canonicalJson = JSON.stringify(parsed, null, 2) + '\n';
    items.set(slug, {
      id: slug,
      sourcePath: `src/content/badges/${file}`,
      contentHash: sha256Hex(canonicalJson),
      parsed,
      rawJson: canonicalJson,
    });
  }
  return items;
}

function sanitizeAssertion(parsed) {
  // Garantizar que jamás se suba ningún email en texto plano a Firestore
  const recipient = parsed.recipient || {};
  const safeRecipient = {
    name: recipient.name || '',
    identity: recipient.identity || '',
    hashed: recipient.hashed !== false,
    type: recipient.type || 'email',
  };
  if (recipient.salt) safeRecipient.salt = recipient.salt;

  const safe = {
    recipient: safeRecipient,
    badgeId: parsed.badgeId || '',
    role: parsed.role || 'Asistencia certificada',
    issuedOn: parsed.issuedOn || '',
  };
  if (parsed.expires) safe.expires = parsed.expires;
  if (parsed.evidence) safe.evidence = parsed.evidence;
  if (parsed.styleOverride) safe.styleOverride = parsed.styleOverride;
  if (typeof parsed.showcase === 'boolean') safe.showcase = parsed.showcase;
  return safe;
}

function readLocalAssertions() {
  const items = new Map();
  if (!fs.existsSync(ASSERTIONS_DIR)) return items;

  const files = fs
    .readdirSync(ASSERTIONS_DIR, { withFileTypes: true })
    .filter((d) => d.isFile() && d.name.endsWith('.json') && !d.name.startsWith('_'))
    .map((d) => d.name)
    .sort();

  for (const file of files) {
    const id = file.replace(/\.json$/i, '');
    const fullPath = path.join(ASSERTIONS_DIR, file);
    const parsed = JSON.parse(fs.readFileSync(fullPath, 'utf-8'));
    const safe = sanitizeAssertion(parsed);
    const canonicalJson = JSON.stringify(safe, null, 2) + '\n';
    items.set(id, {
      id,
      sourcePath: `src/content/assertions/${file}`,
      contentHash: sha256Hex(canonicalJson),
      parsed: safe,
      rawJson: canonicalJson,
    });
  }
  return items;
}

function readLocalBadgeAssets() {
  const items = new Map();
  if (!fs.existsSync(BADGE_IMAGES_DIR)) return items;

  // Solo archivos directos de public/images/badges/ (ignora subcarpetas como thumbs/)
  const files = fs
    .readdirSync(BADGE_IMAGES_DIR, { withFileTypes: true })
    .filter((d) => d.isFile() && IMAGE_MIME_BY_EXT[path.extname(d.name).toLowerCase()])
    .map((d) => d.name)
    .sort();

  for (const file of files) {
    const ext = path.extname(file).toLowerCase();
    const stem = file.slice(0, -ext.length);
    const docId = ext === '.png' ? stem : `${stem}--${ext.slice(1)}`;
    const fullPath = path.join(BADGE_IMAGES_DIR, file);
    const buf = fs.readFileSync(fullPath);

    items.set(docId, {
      id: docId,
      filename: file,
      publicPath: `/images/badges/${file}`,
      sourcePath: `public/images/badges/${file}`,
      mimeType: IMAGE_MIME_BY_EXT[ext],
      sizeBytes: buf.length,
      sha256: sha256Hex(buf),
      buffer: buf,
    });
  }
  return items;
}

// --- Sincronización hacia Firestore (Backup incremental, sin borrado destructivo) ---

async function syncCollection({
  client,
  collectionName,
  localMap,
  buildDocPayload,
  afterWrite = null,
  nowIso,
  commitSha,
  dryRun,
}) {
  const remoteDocs = await client.listCollection(collectionName, ['_meta']);
  const remoteMap = new Map(remoteDocs.map((d) => [d.id, d.data]));

  let written = 0;
  let skipped = 0;
  let archived = 0;
  let totalArchived = 0;

  for (const [id, item] of localMap.entries()) {
    const existingMeta = remoteMap.get(id)?._meta || null;
    const expectedHash = item.contentHash || item.sha256;
    const unchanged =
      existingMeta &&
      existingMeta.contentHash === expectedHash &&
      existingMeta.inGit === true;

    if (unchanged) {
      skipped += 1;
      continue;
    }

    const payload = buildDocPayload(item, nowIso, commitSha);
    if (dryRun) {
      console.log(`  [dry-run] PUT ${collectionName}/${id}`);
    } else {
      await client.setDocument(`${collectionName}/${id}`, payload);
      if (afterWrite) {
        await afterWrite(item, nowIso, commitSha);
      }
    }
    written += 1;
    console.log(`  ✅ ${collectionName}/${id} sincronizado`);
  }

  // Backup seguro: nunca borramos docs de Firestore si faltan en Git; solo los marcamos como inGit=false
  for (const [remoteId, remoteData] of remoteMap.entries()) {
    if (localMap.has(remoteId)) continue;
    const prevMeta = remoteData._meta || {};
    if (prevMeta.inGit !== false) {
      const updatedMeta = {
        ...prevMeta,
        ...(typeof prevMeta.syncedAt === 'string' ? { syncedAt: ts(prevMeta.syncedAt) } : {}),
        inGit: false,
        archivedAt: ts(nowIso),
        lastSeenMissingCommit: commitSha,
      };
      if (dryRun) {
        console.log(`  [dry-run] ARCHIVE ${collectionName}/${remoteId} (inGit=false)`);
      } else {
        await client.setDocument(
          `${collectionName}/${remoteId}`,
          { _meta: updatedMeta },
          ['_meta']
        );
      }
      archived += 1;
      console.log(`  📦 ${collectionName}/${remoteId} preservado en Firestore (marcado inGit=false)`);
    }
    totalArchived += 1;
  }

  return {
    activeCount: localMap.size,
    written,
    skipped,
    archived,
    totalArchived,
  };
}

async function runBackup(client, opts) {
  const nowIso = new Date().toISOString();
  const commitSha = getCommitSha();

  const localBadges = readLocalBadges();
  const localAssertions = readLocalAssertions();
  const localAssets = readLocalBadgeAssets();

  console.log(
    `🔄 Sincronizando copia de seguridad con Firestore (proyecto=${client.projectId}, db=${client.databaseId}, commit=${commitSha.slice(0, 7)})`
  );
  console.log(
    `   Local: ${localBadges.size} badges, ${localAssertions.size} assertions, ${localAssets.size} imágenes`
  );

  // 1. Badges
  const badgesRes = await syncCollection({
    client,
    collectionName: 'badges',
    localMap: localBadges,
    nowIso,
    commitSha,
    dryRun: opts.dryRun,
    buildDocPayload: (item) => ({
      id: item.id,
      ...item.parsed,
      rawJson: item.rawJson,
      _meta: {
        sourcePath: item.sourcePath,
        contentHash: item.contentHash,
        inGit: true,
        syncedAt: ts(nowIso),
        commitSha,
      },
    }),
  });

  // 2. Assertions
  const assertionsRes = await syncCollection({
    client,
    collectionName: 'assertions',
    localMap: localAssertions,
    nowIso,
    commitSha,
    dryRun: opts.dryRun,
    buildDocPayload: (item) => ({
      id: item.id,
      ...item.parsed,
      certUrl: `${SITE_URL}/openbadges/cert/${item.id}/`,
      rawJson: item.rawJson,
      _meta: {
        sourcePath: item.sourcePath,
        contentHash: item.contentHash,
        inGit: true,
        syncedAt: ts(nowIso),
        commitSha,
      },
    }),
  });

  // 3. Imágenes de badges (public/images/badges/*.png)
  const assetsRes = await syncCollection({
    client,
    collectionName: 'badge_assets',
    localMap: localAssets,
    nowIso,
    commitSha,
    dryRun: opts.dryRun,
    buildDocPayload: (item) => {
      const needsChunking = item.sizeBytes > MAX_INLINE_ASSET_BYTES;
      const chunkCount = needsChunking ? Math.ceil(item.sizeBytes / ASSET_CHUNK_SIZE) : 0;
      const doc = {
        id: item.id,
        filename: item.filename,
        publicPath: item.publicPath,
        mimeType: item.mimeType,
        sizeBytes: item.sizeBytes,
        sha256: item.sha256,
        chunked: needsChunking,
        chunkCount,
        _meta: {
          sourcePath: item.sourcePath,
          contentHash: item.sha256,
          inGit: true,
          syncedAt: ts(nowIso),
          commitSha,
        },
      };
      if (!needsChunking) {
        doc.data = bytes(item.buffer);
      }
      return doc;
    },
    afterWrite: async (item) => {
      const chunksPath = `badge_assets/${item.id}/chunks`;
      if (item.sizeBytes > MAX_INLINE_ASSET_BYTES) {
        const chunkCount = Math.ceil(item.sizeBytes / ASSET_CHUNK_SIZE);
        for (let i = 0; i < chunkCount; i += 1) {
          const slice = item.buffer.subarray(i * ASSET_CHUNK_SIZE, (i + 1) * ASSET_CHUNK_SIZE);
          const chunkId = String(i).padStart(3, '0');
          await client.setDocument(`${chunksPath}/${chunkId}`, {
            index: i,
            sizeBytes: slice.length,
            sha256: sha256Hex(slice),
            data: bytes(slice),
          });
        }
        // Limpiar chunks sobrantes si la imagen anterior era mayor
        const existingChunks = await client.listCollection(chunksPath, ['index']);
        for (const c of existingChunks) {
          if (Number(c.data.index) >= chunkCount) {
            await client.deleteDocument(`${chunksPath}/${c.id}`);
          }
        }
      }
    },
  });

  // 4. Metadatos de estado de copia (`sync_meta/latest`)
  const totalWritten = badgesRes.written + assertionsRes.written + assetsRes.written;
  const totalSkipped = badgesRes.skipped + assertionsRes.skipped + assetsRes.skipped;
  const totalArchived =
    badgesRes.totalArchived + assertionsRes.totalArchived + assetsRes.totalArchived;

  const metaDoc = {
    project: client.projectId,
    databaseId: client.databaseId,
    repository: REPO_NAME,
    siteUrl: SITE_URL,
    commitSha,
    lastSyncAt: ts(nowIso),
    counts: {
      badges: badgesRes.activeCount,
      assertions: assertionsRes.activeCount,
      badgeAssets: assetsRes.activeCount,
      archivedInFirestore: totalArchived,
    },
    lastRun: {
      written: totalWritten,
      skipped: totalSkipped,
      newlyArchived: badgesRes.archived + assertionsRes.archived + assetsRes.archived,
    },
  };

  if (opts.dryRun) {
    console.log('  [dry-run] PUT sync_meta/latest');
  } else {
    await client.setDocument('sync_meta/latest', metaDoc);
  }

  console.log(
    `✨ Backup en Firestore completado: ${totalWritten} actualizados, ${totalSkipped} sin cambios, ${totalArchived} archivados preservados.`
  );
}

// --- Restauración desde Firestore (`--restore`) ---

async function runRestore(client, opts) {
  console.log(
    `♻️ Restaurando copia desde Firestore (proyecto=${client.projectId}, db=${client.databaseId}, includeArchived=${opts.includeArchived})`
  );

  fs.mkdirSync(BADGES_DIR, { recursive: true });
  fs.mkdirSync(ASSERTIONS_DIR, { recursive: true });
  fs.mkdirSync(BADGE_IMAGES_DIR, { recursive: true });

  const shouldRestore = (docData) => opts.includeArchived || docData?._meta?.inGit !== false;

  // 1. Badges
  const remoteBadges = await client.listCollection('badges');
  let restoredBadges = 0;
  for (const { id, data } of remoteBadges) {
    if (!shouldRestore(data)) continue;
    const content =
      typeof data.rawJson === 'string' && data.rawJson.trim()
        ? data.rawJson
        : JSON.stringify(
            {
              name: data.name,
              description: data.description,
              image: data.image,
              criteria: data.criteria,
              tags: data.tags || [],
              style: data.style || 'google',
              issuerId: data.issuerId || 'gdgoc-uhu',
            },
            null,
            2
          ) + '\n';
    const dest = path.join(BADGES_DIR, `${id}.json`);
    if (!opts.dryRun) fs.writeFileSync(dest, content, 'utf-8');
    restoredBadges += 1;
  }

  // 2. Assertions
  const remoteAssertions = await client.listCollection('assertions');
  let restoredAssertions = 0;
  for (const { id, data } of remoteAssertions) {
    if (!shouldRestore(data)) continue;
    const content =
      typeof data.rawJson === 'string' && data.rawJson.trim()
        ? data.rawJson
        : JSON.stringify(sanitizeAssertion(data), null, 2) + '\n';
    const dest = path.join(ASSERTIONS_DIR, `${id}.json`);
    if (!opts.dryRun) fs.writeFileSync(dest, content, 'utf-8');
    restoredAssertions += 1;
  }

  // 3. Imágenes
  const remoteAssets = await client.listCollection('badge_assets');
  let restoredAssets = 0;
  for (const { id, data } of remoteAssets) {
    if (!shouldRestore(data)) continue;
    const filename = data.filename || `${id}.png`;
    let buf;
    if (data.chunked) {
      const chunks = await client.listCollection(`badge_assets/${id}/chunks`);
      chunks.sort((a, b) => Number(a.data.index) - Number(b.data.index));
      buf = Buffer.concat(chunks.map((c) => Buffer.from(c.data.data)));
    } else if (Buffer.isBuffer(data.data)) {
      buf = data.data;
    } else {
      console.warn(`⚠️ Imagen ${id} sin datos binarios en Firestore; omitida.`);
      continue;
    }
    const dest = path.join(BADGE_IMAGES_DIR, filename);
    if (!opts.dryRun) fs.writeFileSync(dest, buf);
    restoredAssets += 1;
  }

  console.log(
    `✅ Restauración finalizada${opts.dryRun ? ' (dry-run)' : ''}: ${restoredBadges} badges, ${restoredAssertions} assertions, ${restoredAssets} imágenes.`
  );
}

async function main() {
  const opts = parseCliArgs(process.argv.slice(2));
  const sa = loadServiceAccount(opts.keyPath);
  const token = await getAccessToken(sa);
  const client = new FirestoreClient(sa.project_id, opts.databaseId, token);

  if (opts.restore) {
    await runRestore(client, opts);
  } else {
    await runBackup(client, opts);
  }
}

main().catch((err) => {
  console.error(`❌ Error en sync-firebase-backup: ${err.message}`);
  process.exit(1);
});
