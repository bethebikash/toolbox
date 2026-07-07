export interface RobotsRule {
  id:         string;
  userAgent:  string;
  allow:      string[];
  disallow:   string[];
  crawlDelay: number | null;
}

export interface RobotsOptions {
  rules:   RobotsRule[];
  sitemap: string;
}

export function generateRobotsTxt(opts: RobotsOptions): string {
  const lines: string[] = [];

  for (const rule of opts.rules) {
    lines.push(`User-agent: ${rule.userAgent}`);
    for (const path of rule.disallow) {
      if (path) lines.push(`Disallow: ${path}`);
    }
    for (const path of rule.allow) {
      if (path) lines.push(`Allow: ${path}`);
    }
    if (rule.crawlDelay !== null) {
      lines.push(`Crawl-delay: ${rule.crawlDelay}`);
    }
    lines.push('');
  }

  if (opts.sitemap) {
    lines.push(`Sitemap: ${opts.sitemap}`);
  }

  return lines.join('\n').trim();
}

export const DEFAULT_OPTS: RobotsOptions = {
  rules: [
    {
      id:         '1',
      userAgent:  '*',
      allow:      ['/'],
      disallow:   ['/admin/', '/private/'],
      crawlDelay: null,
    },
  ],
  sitemap: 'https://example.com/sitemap.xml',
};

export const meta = { ready: true };
