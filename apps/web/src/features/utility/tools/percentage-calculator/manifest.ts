import type { ToolManifest } from '@toolbox/shared/types';
export const percentageCalculatorManifest: ToolManifest = {
  id:'percentage-calculator', slug:'/tools/utility/percentage-calculator', category:'utility',
  name:'Percentage Calculator', description:'Calculate percentages in multiple ways simultaneously.',
  icon:'percent', keywords:['percentage','calculate','percent','ratio'],
  accepts:[], maxFileSizeMB:0, maxFiles:0, requiresServer:false,
  engine:()=>import('./engine'),
  meta:{ title:'Free Percentage Calculator Online', description:'Calculate percentages instantly in multiple ways.' },
};
