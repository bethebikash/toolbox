import type { ToolManifest } from '@toolbox/shared/types';
export const ogPreviewManifest: ToolManifest = {
  id:'og-preview', slug:'/tools/seo/og-preview', category:'seo',
  name:'Open Graph Preview', description:'Preview how your page looks when shared on social networks.',
  icon:'share-2', keywords:['og','opengraph','facebook','linkedin','preview','social'],
  accepts:[], maxFileSizeMB:0, maxFiles:0, requiresServer:false,
  engine:()=>import('./engine'),
  meta:{ title:'Open Graph Preview Tool Online', description:'Preview Open Graph tags for social media sharing.' },
};
