import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { getFullUrl } from '@/config/site';

export async function getStaticPaths() {
  const assertions = await getCollection('assertions');
  return assertions.map((assertion) => ({
    params: { id: assertion.id.replace(/\.json$/, '') },
    props: { assertion },
  }));
}

export const GET: APIRoute = async ({ props }) => {
  const { assertion } = props;
  const assertionId = assertion.id.replace(/\.json$/, '');

  const assertionPayload: Record<string, any> = {
    '@context': 'https://w3id.org/openbadges/v2',
    id: getFullUrl(`/api/badges/assertion/${assertionId}.json`),
    type: 'Assertion',
    recipient: {
      type: assertion.data.recipient.type,
      hashed: assertion.data.recipient.hashed,
      identity: assertion.data.recipient.identity,
      salt: assertion.data.recipient.salt,
    },
    badge: getFullUrl(`/api/badges/class/${assertion.data.badgeId}.json`),
    issuedOn: assertion.data.issuedOn,
    verification: {
      type: 'hosted',
    },
  };

  if (assertion.data.expires) {
    assertionPayload.expires = assertion.data.expires;
  }

  if (assertion.data.evidence) {
    assertionPayload.evidence = assertion.data.evidence.startsWith('http')
      ? assertion.data.evidence
      : getFullUrl(assertion.data.evidence);
  }

  return new Response(JSON.stringify(assertionPayload, null, 2), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};

