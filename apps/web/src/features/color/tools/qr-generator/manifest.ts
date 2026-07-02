import type { ToolManifest } from '@toolbox/shared/types';
export const qrGeneratorManifest: ToolManifest = {
  id:'qr-generator', slug:'/tools/color/qr-generator', category:'color',
  name:'QR Code Generator', description:'Generate QR codes for URLs, text, emails or phone numbers.',
  icon:'qr-code', keywords:['qr','qrcode','barcode','generate','url'],
  accepts:[], maxFileSizeMB:0, maxFiles:0, requiresServer:false,
  engine:()=>import('./engine'),
  meta:{ title:'Free QR Code Generator Online', description:'Generate QR codes for any text or URL. Download as PNG or SVG.' },
};
