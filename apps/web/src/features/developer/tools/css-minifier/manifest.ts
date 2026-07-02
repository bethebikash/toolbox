import type { ToolManifest } from '@toolbox/shared/types';
export const cssMinifierManifest: ToolManifest = {
  id:'css-minifier', slug:'/tools/developer/css-minifier', category:'developer',
  name:'CSS Minifier', description:'Minify or beautify CSS. Removes comments and collapses whitespace.',
  icon:'braces', keywords:['css','minify','compress','beautify','optimize'],
  accepts:[], maxFileSizeMB:0, maxFiles:0, requiresServer:false,
  engine:()=>import('./engine'),
  meta:{ title:'Free CSS Minifier Online', description:'Minify CSS instantly — removes comments and whitespace.' },
};
