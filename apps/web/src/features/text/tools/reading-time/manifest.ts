import type { ToolManifest } from '@toolbox/shared/types';
export const readingTimeManifest: ToolManifest = {
  id:'reading-time', slug:'/tools/text/reading-time', category:'text',
  name:'Reading Time Calculator', description:'Estimate how long it takes to read your content.',
  icon:'clock', keywords:['reading','time','wpm','words','estimate'],
  accepts:[], maxFileSizeMB:0, maxFiles:0, requiresServer:false,
  engine:()=>import('./engine'),
  meta:{ title:'Free Reading Time Calculator Online', description:'Calculate reading time for any text.' },
};
