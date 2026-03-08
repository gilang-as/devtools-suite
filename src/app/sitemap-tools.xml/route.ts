import { TOOLS } from '@/tools/config';
import { SITE_CONFIG } from '@/lib/seo';

export async function GET() {
  const baseUrl = SITE_CONFIG.url;

  const toolsXml = TOOLS.map((tool) => {
    return `  <url>
    <loc>${baseUrl}${tool.href}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`;
  }).join('\n');

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${toolsXml}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, s-maxage=604800',
    },
  });
}
