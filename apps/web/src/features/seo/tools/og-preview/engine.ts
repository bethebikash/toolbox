export interface OGData {
  title:       string;
  description: string;
  image:       string;
  url:         string;
  siteName:    string;
  type:        string;
}

export const DEFAULT_OG: OGData = {
  title:       'My Amazing Page Title',
  description: 'This is a description that will appear when my page is shared on Facebook, LinkedIn and other social networks.',
  image:       'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200&h=630&fit=crop',
  url:         'https://example.com/my-page',
  siteName:    'My Website',
  type:        'website',
};

export function generateOGTags(og: OGData): string {
  const tags = [
    `<meta property="og:title" content="${og.title}">`,
    `<meta property="og:description" content="${og.description}">`,
    `<meta property="og:image" content="${og.image}">`,
    `<meta property="og:url" content="${og.url}">`,
    `<meta property="og:site_name" content="${og.siteName}">`,
    `<meta property="og:type" content="${og.type}">`,
  ].filter(t => !t.includes('content=""'));
  return tags.join('\n');
}

export const meta = { ready: true };
