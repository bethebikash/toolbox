import type { ToolManifest } from '@toolbox/shared/types';
export const findReplaceManifest: ToolManifest = {
  id:'find-replace', slug:'/tools/text/find-replace', category:'text',
  name:'Find & Replace', description:'Find and replace text with regex support and case sensitivity.',
  icon:'search-check', keywords:['find','replace','regex','text','search'],
  accepts:[], maxFileSizeMB:0, maxFiles:0, requiresServer:false,
  engine:()=>import('./engine'),
  meta:{ title:'Free Find & Replace Text Tool Online', description:'Find and replace text with regex support.' },
};
