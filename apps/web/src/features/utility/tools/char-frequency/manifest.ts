import type { ToolManifest } from '@toolbox/shared/types';
export const charFrequencyManifest: ToolManifest = {
  id:'char-frequency', slug:'/tools/utility/char-frequency', category:'utility',
  name:'Character Frequency Counter', description:'Analyze how often each character appears in your text.',
  icon:'bar-chart', keywords:['character','frequency','count','analyze','text'],
  accepts:[], maxFileSizeMB:0, maxFiles:0, requiresServer:false,
  engine:()=>import('./engine'),
  meta:{ title:'Character Frequency Counter Online', description:'Analyze character frequency in any text.' },
};
