import type { ToolManifest } from '@toolbox/shared/types';
export const escapeUnescapeManifest: ToolManifest = {
  id:'escape-unescape', slug:'/tools/developer/escape-unescape', category:'developer',
  name:'Escape / Unescape', description:'Escape and unescape HTML, URL, JavaScript strings, Base64 and JSON.',
  icon:'shield', keywords:['escape','unescape','html','url','base64','json','encode'],
  accepts:[], maxFileSizeMB:0, maxFiles:0, requiresServer:false,
  engine:()=>import('./engine'),
  meta:{ title:'Free Escape / Unescape Tool Online', description:'Escape and unescape HTML, URL, JS, Base64 and JSON.' },
};
