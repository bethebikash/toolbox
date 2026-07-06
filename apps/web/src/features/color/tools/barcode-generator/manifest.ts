import type { ToolManifest } from '@toolbox/shared/types';
export const barcodeGeneratorManifest: ToolManifest = {
  id:'barcode-generator', slug:'/tools/color/barcode-generator', category:'color',
  name:'Barcode Generator', description:'Generate Code 128, EAN, UPC and more barcodes.',
  icon:'bar-chart-2', keywords:['barcode','ean','upc','code128','generate'],
  accepts:[], maxFileSizeMB:0, maxFiles:0, requiresServer:false,
  engine:()=>import('./engine'),
  meta:{ title:'Free Barcode Generator Online', description:'Generate barcodes in multiple formats.' },
};
