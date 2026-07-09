import type { ToolManifest } from '@toolbox/shared/types';
export const baseConverterManifest: ToolManifest = {
  id:'base-converter', slug:'/tools/utility/base-converter', category:'utility',
  name:'Number Base Converter', description:'Convert numbers between binary, octal, decimal and hexadecimal.',
  icon:'hash', keywords:['base','binary','octal','decimal','hex','convert'],
  accepts:[], maxFileSizeMB:0, maxFiles:0, requiresServer:false,
  engine:()=>import('./engine'),
  meta:{ title:'Free Number Base Converter Online', description:'Convert between binary, octal, decimal and hex.' },
};
