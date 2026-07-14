import type { ToolManifest } from '@toolbox/shared/types';
export const urlParserManifest: ToolManifest = {
  id:'url-parser', slug:'/tools/developer/url-parser', category:'developer',
  name:'URL Parser & Inspector', description:'Break down any URL into protocol, host, path, query params and more.',
  icon:'link-2', keywords:['url','parse','inspect','query','params','hostname'],
  accepts:[], maxFileSizeMB:0, maxFiles:0, requiresServer:false,
  engine:()=>import('./engine'),
  meta:{ title:'Free URL Parser & Inspector Online', description:'Parse and inspect any URL into its components.' },
};
