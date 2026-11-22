import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

export const GET: APIRoute = async () => {
  const badges = await getCollection('badges');
  const assertions = await getCollection('assertions');

  const badgeStyleById = new Map<string, string>();
  for (const b of badges) {
    const id = b.id.replace(/^.*\/|\.json$/g, '');
    badgeStyleById.set(id, b.data.style || 'google');
  }

  const map: Record<string, string> = {};
  for (const a of assertions) {
    const id = a.id.replace(/^.*\/|\.json$/g, '');
    map[id] = a.data.styleOverride || badgeStyleById.get(a.data.badgeId) || 'google';
  }

  return new Response(JSON.stringify(map), {
    status: 200,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'public, max-age=300',
    },
  });
};
