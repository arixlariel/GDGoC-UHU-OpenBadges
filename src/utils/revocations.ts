import revokedConfig from '@/config/revoked.json';

export interface RevocationEntry {
  id: string;
  revokedAt?: string;
  reason?: string;
}

type RawRevokedItem =
  | string
  | {
      id?: string;
      revokedAt?: string;
      reason?: string;
    };

function normalizeId(raw: string): string {
  return raw.replace(/^.*\/|\.json$/g, '').trim().toLowerCase();
}

export function getRevocationMap(): Map<string, RevocationEntry> {
  const map = new Map<string, RevocationEntry>();
  const rawList: RawRevokedItem[] = Array.isArray((revokedConfig as any)?.revoked)
    ? (revokedConfig as any).revoked
    : [];

  for (const item of rawList) {
    if (typeof item === 'string') {
      const id = normalizeId(item);
      if (id) map.set(id, { id });
    } else if (item && typeof item === 'object' && typeof item.id === 'string') {
      const id = normalizeId(item.id);
      if (id) {
        map.set(id, {
          id,
          revokedAt: typeof item.revokedAt === 'string' && item.revokedAt.trim() ? item.revokedAt.trim() : undefined,
          reason: typeof item.reason === 'string' && item.reason.trim() ? item.reason.trim() : undefined,
        });
      }
    }
  }

  return map;
}

export function getAssertionRevocation(
  assertionId: string,
  assertionData?: { revoked?: boolean; revokedAt?: string; revocationReason?: string },
): RevocationEntry | null {
  const cleanId = normalizeId(assertionId);
  const fromConfig = getRevocationMap().get(cleanId);
  if (fromConfig) return fromConfig;

  if (assertionData?.revoked === true) {
    return {
      id: cleanId,
      revokedAt: assertionData.revokedAt,
      reason: assertionData.revocationReason,
    };
  }

  return null;
}

export function isAssertionRevoked(
  assertionId: string,
  assertionData?: { revoked?: boolean; revokedAt?: string; revocationReason?: string },
): boolean {
  return getAssertionRevocation(assertionId, assertionData) !== null;
}

export function collectAllRevokedEntries(
  assertions: Array<{ id: string; data?: { revoked?: boolean; revokedAt?: string; revocationReason?: string } }> = [],
): RevocationEntry[] {
  const map = getRevocationMap();

  for (const a of assertions) {
    const cleanId = normalizeId(a.id);
    if (a.data?.revoked === true && !map.has(cleanId)) {
      map.set(cleanId, {
        id: cleanId,
        revokedAt: a.data.revokedAt,
        reason: a.data.revocationReason,
      });
    }
  }

  return Array.from(map.values()).sort((a, b) => a.id.localeCompare(b.id));
}
