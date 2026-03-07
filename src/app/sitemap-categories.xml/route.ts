import { TOOLS } from '@/tools/config';

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://devtools-suite.app';

  // Extract unique categories
  const categories = Array.from(new Set(TOOLS.map((tool) => tool.category)));

  // Build category URLs
  const categoryUrls = categories.map((category) => {
    const categoryPath = `/${category.toLowerCase().replace(/\s+/g, '-')}`;
    return `  <url>
    <loc>${baseUrl}${categoryPath}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`;
  }).join('\n');

  // Add special pages
  const specialPages = [
    { path: '/tools', changefreq: 'weekly', priority: 0.9 },
    { path: '/privacy', changefreq: 'monthly', priority: 0.5 },
    { path: '/terms', changefreq: 'monthly', priority: 0.5 },
  ];

  const specialUrls = specialPages.map((page) => {
    return `  <url>
    <loc>${baseUrl}${page.path}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`;
  }).join('\n');

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${categoryUrls}
${specialUrls}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, s-maxage=604800',
    },
  });
}
