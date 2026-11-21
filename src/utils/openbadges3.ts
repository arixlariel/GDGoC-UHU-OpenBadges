import crypto from 'node:crypto';
import jsonldModule from 'jsonld';
import { issuerConfig, siteConfig, getFullUrl } from '@/config/site';
import credentialsV2Context from './ob3-contexts/credentials-v2.json';
import ob3Context from './ob3-contexts/ob-v3p0-3.0.3.json';

const jsonld = (jsonldModule as any)?.default ?? jsonldModule;

export const OB3_ISSUER_DID = 'did:web:gdguhu.com';
export const OB3_VERIFICATION_METHOD = `${OB3_ISSUER_DID}#key-1`;
export const OB3_CONTEXTS = [
  'https://www.w3.org/ns/credentials/v2',
  'https://purl.imsglobal.org/spec/ob/v3p0/context-3.0.3.json',
] as const;

const LOCAL_CONTEXTS: Record<string, Record<string, unknown>> = {
  'https://www.w3.org/ns/credentials/v2': credentialsV2Context as unknown as Record<string, unknown>,
  'https://purl.imsglobal.org/spec/ob/v3p0/context-3.0.3.json': ob3Context as unknown as Record<string, unknown>,
};

const BASE58_ALPHABET = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';

let missingKeyWarned = false;

export function base58btcEncode(bytes: Uint8Array): string {
  if (bytes.length === 0) return '';

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

function normalizeIsoUtc(dateInput: string): string {
  const parsed = new Date(dateInput);
  if (Number.isNaN(parsed.getTime())) {
    return dateInput;
  }
  return parsed.toISOString().replace(/\.\d{3}Z$/, 'Z');
}

async function localDocumentLoader(url: string) {
  const ctx = LOCAL_CONTEXTS[url];
  if (!ctx) {
    throw new Error(`[OB3] Contexto JSON-LD no cacheado localmente: ${url}`);
  }
  return {
    contextUrl: null,
    documentUrl: url,
    document: JSON.parse(JSON.stringify(ctx)),
  };
}

export interface OpenBadge3Input {
  assertionId: string;
  assertion: {
    id: string;
    data: {
      recipient: {
        name: string;
        identity: string;
        hashed: boolean;
        type: string;
        salt?: string;
      };
      badgeId: string;
      role: string;
      issuedOn: string;
      expires?: string;
      evidence?: string;
    };
  };
  badge: {
    id: string;
    data: {
      name: string;
      description: string;
      image: string;
      criteria: {
        narrative: string;
      };
      tags?: string[];
    };
  };
}

export function buildOpenBadge3Credential({
  assertionId,
  assertion,
  badge,
}: OpenBadge3Input): Record<string, unknown> {
  const badgeId = badge.id.replace(/^.*\/|\.json$/g, '');
  const credentialId = getFullUrl(`/api/badges/v3/${assertionId}.json`);
  const badgeClassUrl = getFullUrl(`/api/badges/class/${badgeId}.json`);
  const badgeImageUrl = getFullUrl(badge.data.image);
  const validFrom = normalizeIsoUtc(assertion.data.issuedOn);

  const identityObj: Record<string, unknown> = {
    type: 'IdentityObject',
    hashed: Boolean(assertion.data.recipient.hashed),
    identityHash: assertion.data.recipient.identity,
    identityType: 'emailAddress',
  };

  if (assertion.data.recipient.salt) {
    identityObj.salt = assertion.data.recipient.salt;
  }

  const achievement: Record<string, unknown> = {
    id: badgeClassUrl,
    type: ['Achievement'],
    name: badge.data.name,
    description: badge.data.description,
    criteria: {
      narrative: badge.data.criteria.narrative,
    },
    image: {
      id: badgeImageUrl,
      type: 'Image',
    },
  };

  if (Array.isArray(badge.data.tags) && badge.data.tags.length > 0) {
    const cleanTags = badge.data.tags.map((t) => t.trim()).filter(Boolean);
    if (cleanTags.length > 0) {
      achievement.tag = cleanTags;
    }
  }

  const credentialSubject: Record<string, unknown> = {
    type: ['AchievementSubject'],
    identifier: [identityObj],
    achievement,
  };

  if (assertion.data.role && assertion.data.role.trim().length > 0) {
    credentialSubject.role = assertion.data.role.trim();
  }

  const credential: Record<string, unknown> = {
    '@context': [...OB3_CONTEXTS],
    id: credentialId,
    type: ['VerifiableCredential', 'OpenBadgeCredential'],
    name: badge.data.name,
    description: badge.data.description,
    image: {
      id: badgeImageUrl,
      type: 'Image',
    },
    issuer: {
      id: OB3_ISSUER_DID,
      type: ['Profile'],
      name: issuerConfig.name,
      url: siteConfig.url,
      email: issuerConfig.email,
      description: issuerConfig.description,
      image: {
        id: issuerConfig.image,
        type: 'Image',
      },
    },
    validFrom,
    credentialSubject,
  };

  if (assertion.data.expires && assertion.data.expires.trim().length > 0) {
    credential.validUntil = normalizeIsoUtc(assertion.data.expires);
  }

  if (assertion.data.evidence && assertion.data.evidence.trim().length > 0) {
    const rawEvidence = assertion.data.evidence.trim();
    const evidenceUrl = rawEvidence.startsWith('http') ? rawEvidence : getFullUrl(rawEvidence);
    credential.evidence = [
      {
        id: evidenceUrl,
        type: ['Evidence'],
        name: 'Evidencia / Proyecto',
      },
    ];
  }

  return credential;
}

export async function signOpenBadge3Credential(
  unsignedCredential: Record<string, unknown>,
): Promise<Record<string, unknown>> {
  const rawPem = process.env.OB3_PRIVATE_KEY;

  if (!rawPem || !rawPem.trim()) {
    if (!missingKeyWarned) {
      console.warn(
        '[OB3] OB3_PRIVATE_KEY no está definida. Se emitirán credenciales Open Badges 3.0 sin firma criptográfica (solo recomendado para desarrollo local).',
      );
      missingKeyWarned = true;
    }
    return unsignedCredential;
  }

  const pem = rawPem.replace(/\\n/g, '\n').trim();
  const created =
    typeof unsignedCredential.validFrom === 'string'
      ? unsignedCredential.validFrom
      : new Date().toISOString().replace(/\.\d{3}Z$/, 'Z');

  const proofConfig: Record<string, unknown> = {
    '@context': unsignedCredential['@context'],
    type: 'DataIntegrityProof',
    cryptosuite: 'eddsa-rdfc-2022',
    created,
    verificationMethod: OB3_VERIFICATION_METHOD,
    proofPurpose: 'assertionMethod',
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

  const proofHash = crypto.createHash('sha256').update(canonProof, 'utf8').digest();
  const docHash = crypto.createHash('sha256').update(canonDoc, 'utf8').digest();
  const hashData = Buffer.concat([proofHash, docHash]);

  const privateKey = crypto.createPrivateKey(pem);
  const signature = crypto.sign(null, hashData, privateKey);
  const proofValue = `z${base58btcEncode(signature)}`;

  return {
    ...unsignedCredential,
    proof: {
      type: 'DataIntegrityProof',
      cryptosuite: 'eddsa-rdfc-2022',
      created,
      verificationMethod: OB3_VERIFICATION_METHOD,
      proofPurpose: 'assertionMethod',
      proofValue,
    },
  };
}
