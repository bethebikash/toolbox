import type { ToolManifest } from '@toolbox/shared/types';
export const caseConverterManifest: ToolManifest = {
  id:'case-converter', slug:'/tools/text/case-converter', category:'text',
  name:'Case Converter', description:'Convert text between UPPER, lower, Title, camelCase, snake_case and more.',
  icon:'type', keywords:['case','upper','lower','camel','snake','kebab','pascal','title'],
  accepts:[], maxFileSizeMB:0, maxFiles:0, requiresServer:false,
  engine:()=>import('./engine'),
  meta:{ title:'Free Case Converter Online', description:'Convert text case instantly — upper, lower, camel, snake and more.' },
};
