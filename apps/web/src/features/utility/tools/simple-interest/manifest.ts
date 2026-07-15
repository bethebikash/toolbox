import type { ToolManifest } from '@toolbox/shared/types';
export const simpleInterestManifest: ToolManifest = {
  id:'simple-interest', slug:'/tools/utility/simple-interest', category:'utility',
  name:'Interest Calculator', description:'Calculate simple and compound interest side by side.',
  icon:'trending-up', keywords:['interest','simple','compound','rate','principal','time'],
  accepts:[], maxFileSizeMB:0, maxFiles:0, requiresServer:false,
  engine:()=>import('./engine'),
  meta:{ title:'Free Interest Calculator Online', description:'Calculate simple and compound interest instantly.' },
};
