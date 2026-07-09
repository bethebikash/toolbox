import type { ToolManifest } from '@toolbox/shared/types';
export const aspectRatioManifest: ToolManifest = {
  id:'aspect-ratio', slug:'/tools/utility/aspect-ratio', category:'utility',
  name:'Aspect Ratio Calculator', description:'Calculate and scale aspect ratios for images, videos and screens.',
  icon:'crop', keywords:['aspect','ratio','scale','resolution','image','video'],
  accepts:[], maxFileSizeMB:0, maxFiles:0, requiresServer:false,
  engine:()=>import('./engine'),
  meta:{ title:'Free Aspect Ratio Calculator Online', description:'Calculate and scale aspect ratios instantly.' },
};
