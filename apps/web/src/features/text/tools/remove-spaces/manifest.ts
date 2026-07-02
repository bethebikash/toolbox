import type { ToolManifest } from '@toolbox/shared/types';
export const removeSpacesManifest: ToolManifest = {
  id:'remove-spaces', slug:'/tools/text/remove-spaces', category:'text',
  name:'Remove Extra Spaces', description:'Remove extra spaces, trim lines, or strip blank lines from text.',
  icon:'space', keywords:['space','whitespace','trim','clean','blank'],
  accepts:[], maxFileSizeMB:0, maxFiles:0, requiresServer:false,
  engine:()=>import('./engine'),
  meta:{ title:'Remove Extra Spaces Online', description:'Clean up whitespace from text instantly.' },
};
