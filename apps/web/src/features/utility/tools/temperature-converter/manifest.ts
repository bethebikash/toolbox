import type { ToolManifest } from '@toolbox/shared/types';
export const temperatureConverterManifest: ToolManifest = {
  id:'temperature-converter', slug:'/tools/utility/temperature-converter', category:'utility',
  name:'Temperature Converter', description:'Convert between Celsius, Fahrenheit, Kelvin and Rankine.',
  icon:'thermometer', keywords:['temperature','celsius','fahrenheit','kelvin','convert'],
  accepts:[], maxFileSizeMB:0, maxFiles:0, requiresServer:false,
  engine:()=>import('./engine'),
  meta:{ title:'Free Temperature Converter Online', description:'Convert between Celsius, Fahrenheit and Kelvin.' },
};
