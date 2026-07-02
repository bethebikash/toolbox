import type { ToolManifest } from '@toolbox/shared/types';
export const ageCalculatorManifest: ToolManifest = {
  id:'age-calculator', slug:'/tools/utility/age-calculator', category:'utility',
  name:'Age Calculator', description:'Calculate exact age in years, months, days and more.',
  icon:'calendar-days', keywords:['age','calculator','birthday','date','years'],
  accepts:[], maxFileSizeMB:0, maxFiles:0, requiresServer:false,
  engine:()=>import('./engine'),
  meta:{ title:'Free Age Calculator Online', description:'Calculate your exact age in years, months, days, hours and minutes.' },
};
