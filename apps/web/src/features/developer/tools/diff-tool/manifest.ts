import type { ToolManifest } from '@toolbox/shared/types';
export const diffToolManifest: ToolManifest = {
  id:'diff-tool', slug:'/tools/developer/diff-tool', category:'developer',
  name:'Text Diff Tool', description:'Compare two texts and see differences highlighted line by line.',
  icon:'git-diff', keywords:['diff','compare','text','changes','lines','code'],
  accepts:[], maxFileSizeMB:0, maxFiles:0, requiresServer:false,
  engine:()=>import('./engine'),
  meta:{ title:'Free Text Diff Tool Online', description:'Compare two texts and see the differences.' },
};
