import type { ToolManifest } from '@toolbox/shared/types';
export const jwtDecoderManifest: ToolManifest = {
  id:'jwt-decoder', slug:'/tools/developer/jwt-decoder', category:'developer',
  name:'JWT Decoder', description:'Decode and inspect JSON Web Tokens without verification.',
  icon:'key', keywords:['jwt','token','decode','auth','header','payload'],
  accepts:[], maxFileSizeMB:0, maxFiles:0, requiresServer:false,
  engine:()=>import('./engine'),
  meta:{ title:'Free JWT Decoder Online', description:'Decode and inspect JWT tokens instantly.' },
};
