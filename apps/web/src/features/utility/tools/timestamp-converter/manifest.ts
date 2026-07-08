import type { ToolManifest } from '@toolbox/shared/types';
export const timestampConverterManifest: ToolManifest = {
  id:'timestamp-converter', slug:'/tools/utility/timestamp-converter', category:'utility',
  name:'Timestamp Converter', description:'Convert Unix timestamps to human-readable dates and vice versa.',
  icon:'clock-4', keywords:['timestamp','unix','epoch','date','convert','time'],
  accepts:[], maxFileSizeMB:0, maxFiles:0, requiresServer:false,
  engine:()=>import('./engine'),
  meta:{ title:'Free Unix Timestamp Converter Online', description:'Convert Unix timestamps to dates and back.' },
};
