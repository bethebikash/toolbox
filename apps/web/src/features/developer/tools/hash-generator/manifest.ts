import type { ToolManifest } from '@toolbox/shared/types';
export const hashGeneratorManifest: ToolManifest = {
  id: 'hash-generator', slug: '/tools/developer/hash-generator', category: 'developer',
  name: 'Hash Generator', description: 'Generate MD5, SHA-1, SHA-256, SHA-384 and SHA-512 hashes.',
  icon: 'hash', keywords: ['hash', 'md5', 'sha', 'sha256', 'sha512', 'checksum', 'crypto'],
  accepts: [], maxFileSizeMB: 0, maxFiles: 0, requiresServer: false,
  engine: () => import('./engine'),
  meta: { title: 'Free Hash Generator — MD5, SHA-256, SHA-512 Online', description: 'Generate MD5, SHA-1, SHA-256, SHA-384 and SHA-512 hashes instantly in your browser.' },
};
