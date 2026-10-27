import type { APIRoute } from 'astro';
import { issuerConfig } from '@/config/site';

export const GET: APIRoute = async () => {
  const issuerPayload = {
    '@context': 'https://w3id.org/openbadges/v2',
    id: issuerConfig.id,
    type: 'Profile',
    name: issuerConfig.name,
    url: issuerConfig.url,
    email: issuerConfig.email,
    description: issuerConfig.description,
    image: issuerConfig.image,
  };

  return new Response(JSON.stringify(issuerPayload, null, 2), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};

