import type { ToolManifest } from '@toolbox/shared/types';
export const htmlMinifierManifest: ToolManifest = {
  id:'html-minifier', slug:'/tools/developer/html-minifier', category:'developer',
  name:'HTML Minifier', description:'Minify or beautify HTML. Removes comments and collapses whitespace.',
  icon:'code', keywords:['html','minify','compress','beautify','web'],
  accepts:[], maxFileSizeMB:0, maxFiles:0, requiresServer:false,
  engine:()=>import('./engine'),
  meta:{ title:'Free HTML Minifier Online', description:'Minify HTML instantly.' },
};
