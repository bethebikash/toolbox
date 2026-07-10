import type { ToolManifest } from '@toolbox/shared/types';
export const mortgageCalculatorManifest: ToolManifest = {
  id:'mortgage-calculator', slug:'/tools/utility/mortgage-calculator', category:'utility',
  name:'Mortgage Calculator', description:'Calculate monthly payments including principal, tax and insurance.',
  icon:'home', keywords:['mortgage','home','loan','payment','interest','real-estate'],
  accepts:[], maxFileSizeMB:0, maxFiles:0, requiresServer:false,
  engine:()=>import('./engine'),
  meta:{ title:'Free Mortgage Calculator Online', description:'Calculate monthly mortgage payments with taxes and insurance.' },
};
