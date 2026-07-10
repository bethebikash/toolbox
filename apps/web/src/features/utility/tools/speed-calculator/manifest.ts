import type { ToolManifest } from '@toolbox/shared/types';
export const speedCalculatorManifest: ToolManifest = {
  id:'speed-calculator', slug:'/tools/utility/speed-calculator', category:'utility',
  name:'Speed Calculator', description:'Calculate speed from distance and time with unit conversion.',
  icon:'gauge', keywords:['speed','distance','time','mph','kph','calculator'],
  accepts:[], maxFileSizeMB:0, maxFiles:0, requiresServer:false,
  engine:()=>import('./engine'),
  meta:{ title:'Free Speed Calculator Online', description:'Calculate speed from distance and time.' },
};
