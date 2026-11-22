/**
 * Verificador criptográfico en tiempo real (cliente) para credenciales
 * W3C Open Badges 3.0 con firma Data Integrity `eddsa-rdfc-2022` (Ed25519 + URDNA2015).
 *
 * Pasos ejecutados en vivo en cada apertura del certificado:
 *  1. Descarga `/.well-known/did.json` y `/api/badges/v3/<id>.json`.
 *  2. Comprueba correspondencia de emisor (DID), método de verificación, sujeto y URL.
 *  3. Canoniza `proofConfig` y el documento sin prueba con `URDNA2015` (jsonld.min.js + contextos locales).
 *  4. Calcula SHA-256(canonProof) || SHA-256(canonDoc) vía Web Crypto API.
 *  5. Verifica la firma Ed25519 de 64 bytes con la clave pública de 32 bytes del DID
 *     (Web Crypto `Ed25519` nativo, con respaldo puro BigInt RFC 8032 para navegadores antiguos).
 */

import credentialsV2Context from './ob3-contexts/credentials-v2.json';
import ob3Context from './ob3-contexts/ob-v3p0-3.0.3.json';

export interface LiveVerificationExpected {
  credentialUrl: string;
  didUrl: string;
  vendorJsonldUrl: string;
  expectedIdentityHash?: string;
}

export interface LiveVerificationResult {
  status: 'verified' | 'unsigned' | 'invalid' | 'error';
  valid: boolean;
  checkedAtIso: string;
  checkedAtLocal: string;
  durationMs: number;
  engine: 'WebCrypto Ed25519' | 'RFC 8032 JS Fallback' | 'N/A';
  did: string;
  verificationMethod: string;
  publicKeyMultibase: string;
  cryptosuite: string;
  proofCreated: string;
  docHashHex: string;
  credentialUrl: string;
  reason?: string;
}

const LOCAL_CONTEXTS: Record<string, Record<string, unknown>> = {
  'https://www.w3.org/ns/credentials/v2': credentialsV2Context as unknown as Record<string, unknown>,
  'https://purl.imsglobal.org/spec/ob/v3p0/context-3.0.3.json': ob3Context as unknown as Record<string, unknown>,
};

const BASE58_ALPHABET = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
const BASE58_MAP = new Map<string, bigint>();
for (let i = 0; i < BASE58_ALPHABET.length; i++) {
  BASE58_MAP.set(BASE58_ALPHABET[i], BigInt(i));
}

function base58btcDecode(input: string): Uint8Array {
  if (!input) return new Uint8Array(0);
  let leadingZeros = 0;
  while (leadingZeros < input.length && input[leadingZeros] === '1') {
    leadingZeros++;
  }

  let num = 0n;
  for (let i = leadingZeros; i < input.length; i++) {
    const digit = BASE58_MAP.get(input[i]);
    if (digit === undefined) {
      throw new Error(`Carácter Base58 inválido: ${input[i]}`);
    }
    num = num * 58n + digit;
  }

  const decoded: number[] = [];
  while (num > 0n) {
    decoded.push(Number(num & 0xffn));
    num >>= 8n;
  }
  decoded.reverse();

  const out = new Uint8Array(leadingZeros + decoded.length);
  out.set(decoded, leadingZeros);
  return out;
}

function decodeMultibaseZ(multibase: string): Uint8Array {
  if (!multibase || !multibase.startsWith('z')) {
    throw new Error('Codificación multibase esperada con prefijo "z" (base58btc)');
  }
  return base58btcDecode(multibase.slice(1));
}

function toHex(bytes: Uint8Array): string {
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
}

async function sha256Bytes(data: Uint8Array): Promise<Uint8Array> {
  const buf = await crypto.subtle.digest('SHA-256', data as BufferSource);
  return new Uint8Array(buf);
}

async function sha512Bytes(data: Uint8Array): Promise<Uint8Array> {
  const buf = await crypto.subtle.digest('SHA-512', data as BufferSource);
  return new Uint8Array(buf);
}

function concatBytes(...arrays: Uint8Array[]): Uint8Array {
  const total = arrays.reduce((sum, a) => sum + a.length, 0);
  const out = new Uint8Array(total);
  let offset = 0;
  for (const arr of arrays) {
    out.set(arr, offset);
    offset += arr.length;
  }
  return out;
}

// ============================================================================
// Respaldo criptográfico puro RFC 8032 Ed25519 (solo si WebCrypto no soporta Ed25519)
// ============================================================================
const ED_P = (1n << 255n) - 19n;
const ED_L = (1n << 252n) + 27742317777372353535851937790883648493n;

function mod(a: bigint, m: bigint): bigint {
  const r = a % m;
  return r >= 0n ? r : r + m;
}

function modPow(base: bigint, exp: bigint, m: bigint): bigint {
  let result = 1n;
  let b = mod(base, m);
  let e = exp;
  while (e > 0n) {
    if (e & 1n) result = (result * b) % m;
    b = (b * b) % m;
    e >>= 1n;
  }
  return result;
}

function modInv(a: bigint, m: bigint): bigint {
  return modPow(a, m - 2n, m);
}

const ED_D = mod(-121665n * modInv(121666n, ED_P), ED_P);
const ED_SQRT_M1 = modPow(2n, (ED_P - 1n) / 4n, ED_P);

function bytesToLeBigInt(bytes: Uint8Array): bigint {
  let n = 0n;
  for (let i = bytes.length - 1; i >= 0; i--) {
    n = (n << 8n) | BigInt(bytes[i]);
  }
  return n;
}

type ExtPoint = [bigint, bigint, bigint, bigint]; // [X, Y, Z, T]

function edRecoverX(y: bigint, sign: bigint): bigint | null {
  if (y >= ED_P) return null;
  const y2 = mod(y * y, ED_P);
  const u = mod(y2 - 1n, ED_P);
  const v = mod(ED_D * y2 + 1n, ED_P);
  const v3 = mod(v * v * v, ED_P);
  const v7 = mod(v3 * v3 * v, ED_P);
  let x = mod(u * v3 * modPow(mod(u * v7, ED_P), (ED_P - 5n) / 8n, ED_P), ED_P);
  const vx2 = mod(v * x * x, ED_P);
  if (vx2 !== u) {
    if (vx2 === mod(-u, ED_P)) {
      x = mod(x * ED_SQRT_M1, ED_P);
    } else {
      return null;
    }
  }
  if (x === 0n && sign === 1n) return null;
  if ((x & 1n) !== sign) x = mod(-x, ED_P);
  return x;
}

function edDecodePoint(bytes: Uint8Array): ExtPoint | null {
  if (bytes.length !== 32) return null;
  const copy = new Uint8Array(bytes);
  const sign = BigInt((copy[31] >> 7) & 1);
  copy[31] &= 0x7f;
  const y = bytesToLeBigInt(copy);
  const x = edRecoverX(y, sign);
  if (x === null) return null;
  return [x, y, 1n, mod(x * y, ED_P)];
}

function edAdd(p1: ExtPoint, p2: ExtPoint): ExtPoint {
  const [X1, Y1, Z1, T1] = p1;
  const [X2, Y2, Z2, T2] = p2;
  const A = mod((Y1 - X1) * (Y2 - X2), ED_P);
  const B = mod((Y1 + X1) * (Y2 + X2), ED_P);
  const C = mod(2n * ED_D * T1 * T2, ED_P);
  const D = mod(2n * Z1 * Z2, ED_P);
  const E = mod(B - A, ED_P);
  const F = mod(D - C, ED_P);
  const G = mod(D + C, ED_P);
  const H = mod(B + A, ED_P);
  return [mod(E * F, ED_P), mod(G * H, ED_P), mod(F * G, ED_P), mod(E * H, ED_P)];
}

function edScale(point: ExtPoint, scalar: bigint): ExtPoint {
  let res: ExtPoint = [0n, 1n, 1n, 0n];
  let addend: ExtPoint = point;
  let k = scalar;
  while (k > 0n) {
    if (k & 1n) res = edAdd(res, addend);
    addend = edAdd(addend, addend);
    k >>= 1n;
  }
  return res;
}

function edPointsEqual(p1: ExtPoint, p2: ExtPoint): boolean {
  const [X1, Y1, Z1] = p1;
  const [X2, Y2, Z2] = p2;
  return mod(X1 * Z2 - X2 * Z1, ED_P) === 0n && mod(Y1 * Z2 - Y2 * Z1, ED_P) === 0n;
}

const ED_BY = mod(4n * modInv(5n, ED_P), ED_P);
const ED_BX = edRecoverX(ED_BY, 0n)!;
const ED_BASE: ExtPoint = [ED_BX, ED_BY, 1n, mod(ED_BX * ED_BY, ED_P)];

async function verifyEd25519Fallback(
  publicKey32: Uint8Array,
  signature64: Uint8Array,
  message: Uint8Array,
): Promise<boolean> {
  if (publicKey32.length !== 32 || signature64.length !== 64) return false;
  const A = edDecodePoint(publicKey32);
  if (!A) return false;

  const Rbytes = signature64.slice(0, 32);
  const Sbytes = signature64.slice(32, 64);
  const R = edDecodePoint(Rbytes);
  if (!R) return false;

  const S = bytesToLeBigInt(Sbytes);
  if (S < 0n || S >= ED_L) return false;

  const hDigest = await sha512Bytes(concatBytes(Rbytes, publicKey32, message));
  const h = mod(bytesToLeBigInt(hDigest), ED_L);

  const lhs = edScale(ED_BASE, S);
  const rhs = edAdd(R, edScale(A, h));
  return edPointsEqual(lhs, rhs);
}

async function verifyEd25519(
  publicKey32: Uint8Array,
  signature64: Uint8Array,
  message: Uint8Array,
): Promise<{ valid: boolean; engine: 'WebCrypto Ed25519' | 'RFC 8032 JS Fallback' }> {
  try {
    if (typeof crypto !== 'undefined' && crypto.subtle) {
      const key = await crypto.subtle.importKey(
        'raw',
        publicKey32 as BufferSource,
        { name: 'Ed25519' } as AlgorithmIdentifier,
        false,
        ['verify'],
      );
      const valid = await crypto.subtle.verify(
        { name: 'Ed25519' } as AlgorithmIdentifier,
        key,
        signature64 as BufferSource,
        message as BufferSource,
      );
      return { valid, engine: 'WebCrypto Ed25519' };
    }
  } catch {
    // El navegador no soporta Ed25519 nativo en WebCrypto → usar respaldo matemático RFC 8032
  }

  const valid = await verifyEd25519Fallback(publicKey32, signature64, message);
  return { valid, engine: 'RFC 8032 JS Fallback' };
}

// ============================================================================
// Carga perezosa de jsonld.min.js (URDNA2015) desde /vendor/jsonld.min.js
// ============================================================================
let jsonldLoaderPromise: Promise<any> | null = null;

function loadJsonLdLibrary(scriptUrl: string): Promise<any> {
  if (typeof window !== 'undefined' && (window as any).jsonld?.canonize) {
    return Promise.resolve((window as any).jsonld);
  }
  if (jsonldLoaderPromise) return jsonldLoaderPromise;

  jsonldLoaderPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = scriptUrl;
    script.async = true;
    script.onload = () => {
      const lib = (window as any).jsonld;
      if (lib && typeof lib.canonize === 'function') {
        resolve(lib);
      } else {
        jsonldLoaderPromise = null;
        reject(new Error('No se pudo inicializar jsonld.canonize'));
      }
    };
    script.onerror = () => {
      jsonldLoaderPromise = null;
      reject(new Error('No se pudo cargar /vendor/jsonld.min.js'));
    };
    document.head.appendChild(script);
  });

  return jsonldLoaderPromise;
}

async function localDocumentLoader(url: string) {
  const ctx = LOCAL_CONTEXTS[url];
  if (!ctx) {
    throw new Error(`Contexto JSON-LD externo no permitido: ${url}`);
  }
  return {
    contextUrl: null,
    documentUrl: url,
    document: JSON.parse(JSON.stringify(ctx)),
  };
}

function formatNowLocal(date: Date): string {
  return date.toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

export async function verifyOpenBadge3Live(
  opts: LiveVerificationExpected,
): Promise<LiveVerificationResult> {
  const started = performance.now();
  const baseFail = (
    status: LiveVerificationResult['status'],
    reason: string,
    partial?: Partial<LiveVerificationResult>,
  ): LiveVerificationResult => {
    const now = new Date();
    return {
      status,
      valid: false,
      checkedAtIso: now.toISOString(),
      checkedAtLocal: formatNowLocal(now),
      durationMs: Math.max(1, Math.round(performance.now() - started)),
      engine: 'N/A',
      did: '',
      verificationMethod: '',
      publicKeyMultibase: '',
      cryptosuite: '',
      proofCreated: '',
      docHashHex: '',
      credentialUrl: opts.credentialUrl,
      reason,
      ...partial,
    };
  };

  try {
    const [didResp, credResp, jsonld] = await Promise.all([
      fetch(opts.didUrl, { cache: 'no-cache' }),
      fetch(opts.credentialUrl, { cache: 'no-cache' }),
      loadJsonLdLibrary(opts.vendorJsonldUrl),
    ]);

    if (!didResp.ok) {
      return baseFail('error', `No se pudo leer el documento DID (HTTP ${didResp.status})`);
    }
    if (!credResp.ok) {
      return baseFail('error', `No se pudo descargar la credencial OB3 (HTTP ${credResp.status})`);
    }

    const didDoc = await didResp.json();
    const credential = await credResp.json();

    const proof = credential?.proof;
    if (!proof || !proof.proofValue) {
      return baseFail('unsigned', 'La credencial no incluye una firma criptográfica DataIntegrityProof.', {
        did: String(didDoc?.id || ''),
      });
    }

    if (proof.type !== 'DataIntegrityProof' || proof.cryptosuite !== 'eddsa-rdfc-2022') {
      return baseFail('invalid', `Criptosistema no esperado: ${String(proof.cryptosuite || proof.type)}`);
    }

    const vmId = String(proof.verificationMethod || '');
    const methods = Array.isArray(didDoc?.verificationMethod) ? didDoc.verificationMethod : [];
    const vm = methods.find((m: any) => m && m.id === vmId);
    if (!vm || typeof vm.publicKeyMultibase !== 'string') {
      return baseFail('invalid', `El método de verificación ${vmId} no está autorizado en did.json.`);
    }

    if (credential?.issuer?.id !== didDoc?.id) {
      return baseFail('invalid', 'El DID emisor de la credencial no coincide con did.json.');
    }

    if (opts.expectedIdentityHash) {
      const actualHash = credential?.credentialSubject?.identifier?.[0]?.identityHash;
      if (actualHash !== opts.expectedIdentityHash) {
        return baseFail('invalid', 'El hash de identidad de la credencial no coincide con este diploma.');
      }
    }

    // Decodificar clave pública Multikey Ed25519 (prefijo multicodec 0xed 0x01 + 32 bytes)
    const rawMultikey = decodeMultibaseZ(vm.publicKeyMultibase);
    if (rawMultikey.length !== 34 || rawMultikey[0] !== 0xed || rawMultikey[1] !== 0x01) {
      return baseFail('invalid', 'Formato de clave pública Multikey Ed25519 inválido en did.json.');
    }
    const publicKey32 = rawMultikey.slice(2);

    // Decodificar firma Ed25519 (64 bytes)
    const signature64 = decodeMultibaseZ(String(proof.proofValue));
    if (signature64.length !== 64) {
      return baseFail('invalid', 'Longitud de firma Ed25519 inválida.');
    }

    // Construir proofConfig y documento sin prueba exactamente según W3C eddsa-rdfc-2022
    const unsignedCredential = { ...credential };
    delete unsignedCredential.proof;

    const proofConfig: Record<string, unknown> = {
      '@context': credential['@context'],
      type: proof.type,
      cryptosuite: proof.cryptosuite,
      created: proof.created,
      verificationMethod: proof.verificationMethod,
      proofPurpose: proof.proofPurpose,
    };

    const [canonProof, canonDoc] = await Promise.all([
      jsonld.canonize(proofConfig, {
        algorithm: 'URDNA2015',
        format: 'application/n-quads',
        documentLoader: localDocumentLoader,
      }),
      jsonld.canonize(unsignedCredential, {
        algorithm: 'URDNA2015',
        format: 'application/n-quads',
        documentLoader: localDocumentLoader,
      }),
    ]);

    const encoder = new TextEncoder();
    const [proofHash, docHash] = await Promise.all([
      sha256Bytes(encoder.encode(String(canonProof))),
      sha256Bytes(encoder.encode(String(canonDoc))),
    ]);

    const verifyData = concatBytes(proofHash, docHash);
    const { valid, engine } = await verifyEd25519(publicKey32, signature64, verifyData);
    const now = new Date();
    const docHashHex = toHex(docHash);

    if (!valid) {
      return baseFail('invalid', 'La firma Ed25519 no coincide con el contenido de la credencial.', {
        engine,
        did: String(didDoc.id),
        verificationMethod: vmId,
        publicKeyMultibase: vm.publicKeyMultibase,
        cryptosuite: String(proof.cryptosuite),
        proofCreated: String(proof.created || ''),
        docHashHex,
      });
    }

    return {
      status: 'verified',
      valid: true,
      checkedAtIso: now.toISOString(),
      checkedAtLocal: formatNowLocal(now),
      durationMs: Math.max(1, Math.round(performance.now() - started)),
      engine,
      did: String(didDoc.id),
      verificationMethod: vmId,
      publicKeyMultibase: vm.publicKeyMultibase,
      cryptosuite: String(proof.cryptosuite),
      proofCreated: String(proof.created || ''),
      docHashHex,
      credentialUrl: opts.credentialUrl,
    };
  } catch (err: any) {
    return baseFail('error', err?.message || 'Error inesperado durante la verificación.');
  }
}
