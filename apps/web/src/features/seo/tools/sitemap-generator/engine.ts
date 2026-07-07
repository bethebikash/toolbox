export type ChangeFreq = 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
export type Priority   = '1.0' | '0.9' | '0.8' | '0.7' | '0.6' | '0.5' | '0.4' | '0.3' | '0.2' | '0.1';

export interface SitemapURL {
  id:        string;
  loc:       string;
  lastmod:   string;
  changefreq:ChangeFreq;
  priority:  Priority;
}

export interface SitemapOptions {
  urls: SitemapURL[];
}

export function generateSitemap(opts: SitemapOptions): string {
  const urls = opts.urls
    .filter(u => u.loc.trim())
    .map(u => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`)
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
}

export function parseBulkURLs(text: string, defaults: Omit<SitemapURL, 'id' | 'loc'>): SitemapURL[] {
  return text
    .split('\n')
    .map(l => l.trim())
    .filter(Boolean)
    .map(loc => ({ id: crypto.randomUUID(), loc, ...defaults }));
}

const today = new Date().toISOString().split('T')[0]!;

export const DEFAULT_OPTS: SitemapOptions = {
  urls: [
    { id: '1', loc: 'https://example.com/',        lastmod: today, changefreq: 'weekly',  priority: '1.0' },
    { id: '2', loc: 'https://example.com/about',   lastmod: today, changefreq: 'monthly', priority: '0.8' },
    { id: '3', loc: 'https://example.com/contact', lastmod: today, changefreq: 'monthly', priority: '0.7' },
  ],
};

export const meta = { ready: true };
