import type { ToolManifest } from '@toolbox/shared/types';
export const removeDuplicatesManifest: ToolManifest = {
  id:'remove-duplicates', slug:'/tools/text/remove-duplicates', category:'text',
  name:'Remove Duplicate Lines', description:'Remove duplicate lines from text, keeping only the first occurrence.',
  icon:'list-x', keywords:['duplicate','remove','lines','unique','clean'],
  accepts:[], maxFileSizeMB:0, maxFiles:0, requiresServer:false,
  engine:()=>import('./engine'),
  meta:{ title:'Remove Duplicate Lines Online', description:'Remove duplicate lines from text instantly.' },
};
