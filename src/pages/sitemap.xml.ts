import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { getFullUrl } from '@/config/site';

export const GET: APIRoute = async () => {
  const assertions = await getCollection('assertions');
  const today = new Date().toISOString().split('T')[0];

  const urls = [
    {
      loc: getFullUrl('/'),
      lastmod: today,
      changefreq: 'weekly',
      priority: '1.0',
    },
    ...assertions.map((assertion) => {
      const id = assertion.id.replace(/^.*\/|\.json$/g, '');
      const issuedDate = assertion.data.issuedOn
        ? new Date(assertion.data.issuedOn).toISOString().split('T')[0]
        : today;
      return {
        loc: getFullUrl(`/cert/${id}`),
        lastmod: issuedDate,
        changefreq: 'monthly',
        priority: '0.8',
      };
    }),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

  return new Response(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
};
