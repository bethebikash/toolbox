import type { ToolManifest } from '@toolbox/shared/types';
export const jsonToTypeScriptManifest: ToolManifest = {
  id:'json-to-typescript', slug:'/tools/developer/json-to-typescript', category:'developer',
  name:'JSON to TypeScript', description:'Convert JSON objects to TypeScript interfaces automatically.',
  icon:'file-type-2', keywords:['json','typescript','interface','convert','types'],
  accepts:[], maxFileSizeMB:0, maxFiles:0, requiresServer:false,
  engine:()=>import('./engine'),
  meta:{ title:'Free JSON to TypeScript Converter Online', description:'Convert JSON to TypeScript interfaces.' },
};
