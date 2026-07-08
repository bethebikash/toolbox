import type { ToolManifest } from '@toolbox/shared/types';
export const tipCalculatorManifest: ToolManifest = {
  id:'tip-calculator', slug:'/tools/utility/tip-calculator', category:'utility',
  name:'Tip Calculator', description:'Calculate tip amount and split the bill between multiple people.',
  icon:'receipt', keywords:['tip','bill','split','restaurant','calculator'],
  accepts:[], maxFileSizeMB:0, maxFiles:0, requiresServer:false,
  engine:()=>import('./engine'),
  meta:{ title:'Free Tip Calculator Online', description:'Calculate tip and split bills easily.' },
};
