import type { ToolManifest } from '@toolbox/shared/types';
export const loanCalculatorManifest: ToolManifest = {
  id:'loan-calculator', slug:'/tools/utility/loan-calculator', category:'utility',
  name:'Loan Calculator', description:'Calculate monthly payments, total interest and amortization schedule.',
  icon:'calculator', keywords:['loan','mortgage','payment','interest','amortization'],
  accepts:[], maxFileSizeMB:0, maxFiles:0, requiresServer:false,
  engine:()=>import('./engine'),
  meta:{ title:'Free Loan Calculator Online', description:'Calculate loan payments and view full amortization schedule.' },
};
