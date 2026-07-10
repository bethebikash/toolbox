import type { ToolManifest } from '@toolbox/shared/types';
export const textStatisticsManifest: ToolManifest = {
  id:'text-statistics', slug:'/tools/text/text-statistics', category:'text',
  name:'Text Statistics', description:'Deep text analysis with word count, frequency, readability and more.',
  icon:'bar-chart-2', keywords:['text','statistics','analysis','words','frequency','readability'],
  accepts:[], maxFileSizeMB:0, maxFiles:0, requiresServer:false,
  engine:()=>import('./engine'),
  meta:{ title:'Free Text Statistics Analyzer Online', description:'Analyze text for word count, frequency and readability.' },
};
