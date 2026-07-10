import type { ToolManifest } from '@toolbox/shared/types';
export const cronParserManifest: ToolManifest = {
  id:'cron-parser', slug:'/tools/developer/cron-parser', category:'developer',
  name:'Cron Expression Parser', description:'Parse and explain cron expressions with next run times.',
  icon:'clock', keywords:['cron','schedule','parser','expression','job'],
  accepts:[], maxFileSizeMB:0, maxFiles:0, requiresServer:false,
  engine:()=>import('./engine'),
  meta:{ title:'Free Cron Expression Parser Online', description:'Parse cron expressions and see next run times.' },
};
