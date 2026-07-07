import type { ToolManifest } from '@toolbox/shared/types';
export const regexTesterManifest: ToolManifest = {
  id:'regex-tester', slug:'/tools/developer/regex-tester', category:'developer',
  name:'Regex Tester', description:'Test regular expressions with live match highlighting.',
  icon:'search-code', keywords:['regex','regexp','regular','expression','test','match'],
  accepts:[], maxFileSizeMB:0, maxFiles:0, requiresServer:false,
  engine:()=>import('./engine'),
  meta:{ title:'Free Regex Tester Online', description:'Test regular expressions with live highlighting.' },
};
