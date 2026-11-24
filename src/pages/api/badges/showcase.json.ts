import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { getOpenBadgesUrl, isShowcaseAssertion } from '@/config/site';
import { isAssertionRevoked } from '@/utils/revocations';

export const GET: APIRoute = async () => {
  const assertions = (await getCollection('assertions')).filter((a) => {
    const id = a.id.replace(/^.*\/|\.json$/g, '');
    return isShowcaseAssertion(a) && !isAssertionRevoked(id, a.data);
  });
  const today = new Date().toISOString().split('T')[0];

  const items = assertions.map((a) => {
    const id = a.id.replace(/^.*\/|\.json$/g, '');
    const lastmod = a.data.issuedOn
      ? new Date(a.data.issuedOn).toISOString().split('T')[0]
      : today;
    return {
      id,
      loc: getOpenBadgesUrl(`/cert/${id}/`),
      lastmod,
    };
  });

  return new Response(JSON.stringify(items), {
    status: 200,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'public, max-age=300',
    },
  });
};
