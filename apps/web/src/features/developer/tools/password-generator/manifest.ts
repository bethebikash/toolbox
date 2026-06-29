import type { ToolManifest } from '@toolbox/shared/types';
export const passwordGeneratorManifest: ToolManifest = {
  id: 'password-generator', slug: '/tools/developer/password-generator', category: 'developer',
  name: 'Password Generator', description: 'Generate cryptographically secure passwords.',
  icon: 'key-round', keywords: ['password', 'generate', 'secure', 'random', 'crypto'],
  accepts: [], maxFileSizeMB: 0, maxFiles: 0, requiresServer: false,
  engine: () => import('./engine'),
  meta: { title: 'Free Password Generator — Secure Passwords Online', description: 'Generate cryptographically secure passwords with custom length and character sets.' },
};
