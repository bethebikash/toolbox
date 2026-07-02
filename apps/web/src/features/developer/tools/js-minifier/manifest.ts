import type { ToolManifest } from '@toolbox/shared/types';
export const jsMinifierManifest: ToolManifest = {
  id:'js-minifier', slug:'/tools/developer/js-minifier', category:'developer',
  name:'JavaScript Minifier', description:'Minify JavaScript by removing comments and whitespace.',
  icon:'code', keywords:['javascript','js','minify','compress','optimize'],
  accepts:[], maxFileSizeMB:0, maxFiles:0, requiresServer:false,
  engine:()=>import('./engine'),
  meta:{ title:'Free JavaScript Minifier Online', description:'Minify JS instantly — removes comments and whitespace.' },
};
