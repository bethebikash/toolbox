import type { ToolManifest } from '@toolbox/shared/types';
export const gradientGeneratorManifest: ToolManifest = {
  id:'gradient-generator', slug:'/tools/color/gradient-generator', category:'color',
  name:'Gradient Generator', description:'Create CSS gradients visually and copy as CSS, Tailwind or SCSS.',
  icon:'blend', keywords:['gradient','css','linear','radial','color','tailwind'],
  accepts:[], maxFileSizeMB:0, maxFiles:0, requiresServer:false,
  engine:()=>import('./engine'),
  meta:{ title:'Free CSS Gradient Generator Online', description:'Create beautiful CSS gradients visually.' },
};
