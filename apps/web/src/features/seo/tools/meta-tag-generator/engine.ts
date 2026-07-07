export interface MetaTagOptions {
  title:       string;
  description: string;
  keywords:    string;
  author:      string;
  canonical:   string;
  robots:      string;
  ogTitle:     string;
  ogDescription: string;
  ogImage:     string;
  ogUrl:       string;
  ogType:      string;
  twitterCard: 'summary' | 'summary_large_image' | 'app' | 'player';
  twitterSite: string;
  twitterCreator: string;
}

export const DEFAULT_OPTS: MetaTagOptions = {
  title:          'My Page Title',
  description:    'A brief description of my page for search engines.',
  keywords:       'keyword1, keyword2, keyword3',
  author:         '',
  canonical:      'https://example.com/page',
  robots:         'index, follow',
  ogTitle:        'My Page Title',
  ogDescription:  'A brief description for social sharing.',
  ogImage:        'https://example.com/og-image.jpg',
  ogUrl:          'https://example.com/page',
  ogType:         'website',
  twitterCard:    'summary_large_image',
  twitterSite:    '@mysite',
  twitterCreator: '@author',
};

export function generateMetaTags(opts: MetaTagOptions): string {
  const tags: string[] = [];

  const add = (name: string, content: string, prop = false) => {
    if (!content.trim()) return;
    const attr = prop ? 'property' : 'name';
    tags.push(`<meta ${attr}="${name}" content="${content}">`);
  };

  // Basic
  if (opts.title)       tags.push(`<title>${opts.title}</title>`);
  if (opts.description) add('description', opts.description);
  if (opts.keywords)    add('keywords',    opts.keywords);
  if (opts.author)      add('author',      opts.author);
  if (opts.robots)      add('robots',      opts.robots);
  if (opts.canonical)   tags.push(`<link rel="canonical" href="${opts.canonical}">`);

  tags.push('');

  // Open Graph
  if (opts.ogTitle)       add('og:title',       opts.ogTitle,       true);
  if (opts.ogDescription) add('og:description', opts.ogDescription, true);
  if (opts.ogImage)       add('og:image',       opts.ogImage,       true);
  if (opts.ogUrl)         add('og:url',         opts.ogUrl,         true);
  if (opts.ogType)        add('og:type',        opts.ogType,        true);

  tags.push('');

  // Twitter
  add('twitter:card',    opts.twitterCard);
  if (opts.twitterSite)    add('twitter:site',    opts.twitterSite);
  if (opts.twitterCreator) add('twitter:creator', opts.twitterCreator);
  if (opts.ogTitle)        add('twitter:title',   opts.ogTitle);
  if (opts.ogDescription)  add('twitter:description', opts.ogDescription);
  if (opts.ogImage)        add('twitter:image',   opts.ogImage);

  return tags.join('\n');
}

export function countChars(str: string) {
  return { length: str.length, ok: str.length <= 160 };
}

export const meta = { ready: true };
