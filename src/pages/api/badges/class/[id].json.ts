import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { issuerConfig, getFullUrl } from '@/config/site';

export async function getStaticPaths() {
  const badges = await getCollection('badges');
  return badges.map((badge) => ({
    params: { id: badge.id.replace(/^.*\/|\.json$/g, '') },
    props: { badge },
  }));
}

export const GET: APIRoute = async ({ props }) => {
  const { badge } = props;
  const badgeId = badge.id.replace(/^.*\/|\.json$/g, '');

  const badgePayload = {
    '@context': 'https://w3id.org/openbadges/v2',
    id: getFullUrl(`/api/badges/class/${badgeId}.json`),
    type: 'BadgeClass',
    name: badge.data.name,
    description: badge.data.description,
    image: getFullUrl(badge.data.image),
    criteria: {
      narrative: badge.data.criteria.narrative,
    },
    tags: badge.data.tags,
    issuer: issuerConfig.id,
  };

  return new Response(JSON.stringify(badgePayload, null, 2), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};

