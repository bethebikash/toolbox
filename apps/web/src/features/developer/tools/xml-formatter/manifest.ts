import type { ToolManifest } from '@toolbox/shared/types';
export const xmlFormatterManifest: ToolManifest = {
  id:'xml-formatter', slug:'/tools/developer/xml-formatter', category:'developer',
  name:'XML Formatter', description:'Format and validate XML documents.',
  icon:'file-code-2', keywords:['xml','format','validate','beautify','minify'],
  accepts:[], maxFileSizeMB:0, maxFiles:0, requiresServer:false,
  engine:()=>import('./engine'),
  meta:{ title:'Free XML Formatter Online', description:'Format and validate XML instantly.' },
};
