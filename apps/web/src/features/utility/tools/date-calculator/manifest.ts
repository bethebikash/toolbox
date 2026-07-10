import type { ToolManifest } from '@toolbox/shared/types';
export const dateCalculatorManifest: ToolManifest = {
  id:'date-calculator', slug:'/tools/utility/date-calculator', category:'utility',
  name:'Date Calculator', description:'Calculate the difference between two dates or add days/months.',
  icon:'calendar-days', keywords:['date','calculator','diff','days','months','workdays'],
  accepts:[], maxFileSizeMB:0, maxFiles:0, requiresServer:false,
  engine:()=>import('./engine'),
  meta:{ title:'Free Date Calculator Online', description:'Calculate date differences and add days or months.' },
};
