import type { ToolManifest } from '@toolbox/shared/types';
export const faviconGeneratorManifest: ToolManifest = {
  id:'favicon-generator', slug:'/tools/color/favicon-generator', category:'color',
  name:'Favicon Generator', description:'Create favicons in all standard sizes from text or emoji.',
  icon:'image', keywords:['favicon','icon','png','16','32','256'],
  accepts:[], maxFileSizeMB:0, maxFiles:0, requiresServer:false,
  engine:()=>import('./engine'),
  meta:{ title:'Free Favicon Generator Online', description:'Create favicons in all sizes (16–256px) instantly.' },
};
