import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { buildOpenBadge3Credential, signOpenBadge3Credential } from '@/utils/openbadges3';

export async function getStaticPaths() {
  const assertions = await getCollection('assertions');
  const badges = await getCollection('badges');

  return assertions.map((assertion) => {
    const assertionId = assertion.id.replace(/^.*\/|\.json$/g, '');
    const badge = badges.find(
      (b) => b.id.replace(/^.*\/|\.json$/g, '') === assertion.data.badgeId,
    );

    if (!badge) {
      throw new Error(
        `[OB3] Badge no encontrado (${assertion.data.badgeId}) para el certificado ${assertionId}`,
      );
    }

    return {
      params: { id: assertionId },
      props: { assertion, badge },
    };
  });
}

export const GET: APIRoute = async ({ params, props }) => {
  const assertionId = params.id as string;
  const { assertion, badge } = props as { assertion: any; badge: any };

  const unsignedCredential = buildOpenBadge3Credential({
    assertionId,
    assertion,
    badge,
  });

  const signedCredential = await signOpenBadge3Credential(unsignedCredential);

  return new Response(JSON.stringify(signedCredential, null, 2), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
