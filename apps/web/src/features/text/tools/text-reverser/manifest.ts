import type { ToolManifest } from '@toolbox/shared/types';
export const textReverserManifest: ToolManifest = {
  id:'text-reverser', slug:'/tools/text/text-reverser', category:'text',
  name:'Text Reverser', description:'Reverse characters, words, or lines of text.',
  icon:'arrow-left-right', keywords:['reverse','flip','mirror','text'],
  accepts:[], maxFileSizeMB:0, maxFiles:0, requiresServer:false,
  engine:()=>import('./engine'),
  meta:{ title:'Free Text Reverser Online', description:'Reverse characters, words or lines instantly.' },
};
