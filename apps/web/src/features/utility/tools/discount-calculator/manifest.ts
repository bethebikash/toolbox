import type { ToolManifest } from '@toolbox/shared/types';
export const discountCalculatorManifest: ToolManifest = {
  id:'discount-calculator', slug:'/tools/utility/discount-calculator', category:'utility',
  name:'Discount Calculator', description:'Calculate discounted prices, savings and reverse-find original prices.',
  icon:'tag', keywords:['discount','sale','price','savings','percentage','off'],
  accepts:[], maxFileSizeMB:0, maxFiles:0, requiresServer:false,
  engine:()=>import('./engine'),
  meta:{ title:'Free Discount Calculator Online', description:'Calculate sale prices and find original prices from discounts.' },
};
