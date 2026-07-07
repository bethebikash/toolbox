import type { ToolManifest } from '@toolbox/shared/types';
export const currencyConverterManifest: ToolManifest = {
  id:'currency-converter', slug:'/tools/utility/currency-converter', category:'utility',
  name:'Currency Converter', description:'Convert between 30+ currencies using static exchange rates.',
  icon:'coins', keywords:['currency','convert','exchange','rate','money','usd','eur'],
  accepts:[], maxFileSizeMB:0, maxFiles:0, requiresServer:false,
  engine:()=>import('./engine'),
  meta:{ title:'Free Currency Converter Online', description:'Convert between 30+ currencies instantly.' },
};
