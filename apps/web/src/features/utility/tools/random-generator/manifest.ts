import type { ToolManifest } from '@toolbox/shared/types';
export const randomGeneratorManifest: ToolManifest = {
  id:'random-generator', slug:'/tools/utility/random-generator', category:'utility',
  name:'Random Number Generator', description:'Generate random numbers within a custom range.',
  icon:'dice-5', keywords:['random','number','generate','range','unique'],
  accepts:[], maxFileSizeMB:0, maxFiles:0, requiresServer:false,
  engine:()=>import('./engine'),
  meta:{ title:'Free Random Number Generator Online', description:'Generate random numbers with custom range and options.' },
};
