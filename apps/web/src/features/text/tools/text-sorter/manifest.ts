import type { ToolManifest } from '@toolbox/shared/types';
export const textSorterManifest: ToolManifest = {
  id:'text-sorter', slug:'/tools/text/text-sorter', category:'text',
  name:'Text Sorter', description:'Sort lines alphabetically, by length, or shuffle randomly.',
  icon:'arrow-up-down', keywords:['sort','alphabetical','lines','shuffle','order'],
  accepts:[], maxFileSizeMB:0, maxFiles:0, requiresServer:false,
  engine:()=>import('./engine'),
  meta:{ title:'Free Text Sorter Online', description:'Sort lines of text alphabetically or by length.' },
};
