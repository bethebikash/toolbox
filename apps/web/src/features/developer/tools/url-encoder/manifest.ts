import type { ToolManifest } from '@toolbox/shared/types';
export const urlEncoderManifest: ToolManifest = {
  id: 'url-encoder', slug: '/tools/developer/url-encoder', category: 'developer',
  name: 'URL Encoder / Decoder', description: 'Encode and decode URLs and query strings.',
  icon: 'link', keywords: ['url', 'encode', 'decode', 'query', 'percent', 'uri'],
  accepts: [], maxFileSizeMB: 0, maxFiles: 0, requiresServer: false,
  engine: () => import('./engine'),
  meta: { title: 'Free URL Encoder & Decoder Online', description: 'Encode and decode URLs, query strings and parameters instantly.' },
};
