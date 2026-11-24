import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import {
  buildRevocationListCredential,
  getRevocationStatusIndex,
  signOpenBadge3Credential,
} from '@/utils/openbadges3';
import { collectAllRevokedEntries } from '@/utils/revocations';

export const GET: APIRoute = async () => {
  const assertions = await getCollection('assertions');
  const revokedEntries = collectAllRevokedEntries(assertions);

  // Comprobar en tiempo de compilación que no exista ninguna colisión de índice en la lista de bits
  const indexOwner = new Map<number, string>();
  const allIds = new Set<string>();
  for (const a of assertions) {
    allIds.add(a.id.replace(/^.*\/|\.json$/g, '').trim().toLowerCase());
  }
  for (const r of revokedEntries) {
    allIds.add(r.id);
  }
  for (const id of allIds) {
    const idx = getRevocationStatusIndex(id);
    const prev = indexOwner.get(idx);
    if (prev && prev !== id) {
      throw new Error(
        `[OB3] Colisión de índice en BitstringStatusList (${idx}) entre ${prev} y ${id}.`,
      );
    }
    indexOwner.set(idx, id);
  }

  const latestRevokedAt = revokedEntries
    .map((e) => e.revokedAt)
    .filter((d): d is string => Boolean(d))
    .sort()
    .pop();

  const unsignedStatusList = buildRevocationListCredential(
    revokedEntries.map((e) => e.id),
    latestRevokedAt || '2026-01-01T00:00:00Z',
  );
  const signedStatusList = await signOpenBadge3Credential(unsignedStatusList);

  return new Response(JSON.stringify(signedStatusList, null, 2), {
    status: 200,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'public, max-age=300, must-revalidate',
    },
  });
};
