import type { ToolManifest } from '@toolbox/shared/types';
export const numberToWordsManifest: ToolManifest = {
  id:'number-to-words', slug:'/tools/utility/number-to-words', category:'utility',
  name:'Number to Words', description:'Convert any number to its English word representation.',
  icon:'type', keywords:['number','words','convert','english','spell'],
  accepts:[], maxFileSizeMB:0, maxFiles:0, requiresServer:false,
  engine:()=>import('./engine'),
  meta:{ title:'Free Number to Words Converter Online', description:'Convert numbers to English words instantly.' },
};
