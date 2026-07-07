import type { ToolManifest } from '@toolbox/shared/types';
export const unicodeConverterManifest: ToolManifest = {
  id:'unicode-converter', slug:'/tools/text/unicode-converter', category:'text',
  name:'Unicode Converter', description:'Convert text to Unicode code points, escape sequences and HTML entities.',
  icon:'code-2', keywords:['unicode','utf','escape','html','entities','codepoint'],
  accepts:[], maxFileSizeMB:0, maxFiles:0, requiresServer:false,
  engine:()=>import('./engine'),
  meta:{ title:'Free Unicode Converter Online', description:'Convert text to Unicode code points and escape sequences.' },
};
