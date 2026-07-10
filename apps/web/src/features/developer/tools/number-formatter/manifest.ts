import type { ToolManifest } from '@toolbox/shared/types';
export const numberFormatterManifest: ToolManifest = {
  id:'number-formatter', slug:'/tools/developer/number-formatter', category:'developer',
  name:'Number Formatter', description:'Format numbers for different locales, currencies using the Intl API.',
  icon:'hash', keywords:['number','format','locale','currency','intl','decimal'],
  accepts:[], maxFileSizeMB:0, maxFiles:0, requiresServer:false,
  engine:()=>import('./engine'),
  meta:{ title:'Free Number Formatter Online', description:'Format numbers for any locale or currency.' },
};
