import type { ToolManifest } from '@toolbox/shared/types';
export const unitConverterManifest: ToolManifest = {
  id:'unit-converter', slug:'/tools/utility/unit-converter', category:'utility',
  name:'Unit Converter', description:'Convert between length, weight, temperature, area, volume, speed and data.',
  icon:'arrow-right-left', keywords:['unit','convert','length','weight','temperature','area','volume','speed'],
  accepts:[], maxFileSizeMB:0, maxFiles:0, requiresServer:false,
  engine:()=>import('./engine'),
  meta:{ title:'Free Unit Converter Online', description:'Convert between any units of measurement instantly.' },
};
