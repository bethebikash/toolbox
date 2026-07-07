export interface EXIFTag {
  tag:   string;
  label: string;
  value: string;
}

export interface EXIFResult {
  tags:      EXIFTag[];
  hasGPS:    boolean;
  latitude?:  number;
  longitude?: number;
}

// Simple JPEG EXIF reader — reads basic tags without a full library
export async function readEXIF(file: File): Promise<EXIFResult> {
  if (!file.type.includes('jpeg') && !file.type.includes('jpg')) {
    return { tags: [{ tag: 'note', label: 'Note', value: 'EXIF data is only available in JPEG files.' }], hasGPS: false };
  }

  const buffer = await file.arrayBuffer();
  const view   = new DataView(buffer);

  // Check JPEG SOI marker
  if (view.getUint16(0) !== 0xFFD8) {
    return { tags: [{ tag: 'error', label: 'Error', value: 'Not a valid JPEG file.' }], hasGPS: false };
  }

  const tags: EXIFTag[] = [
    { tag: 'filename', label: 'File name',  value: file.name },
    { tag: 'filesize', label: 'File size',  value: formatBytes(file.size) },
    { tag: 'mimetype', label: 'MIME type',  value: file.type },
    { tag: 'modified', label: 'Modified',   value: new Date(file.lastModified).toISOString() },
  ];

  // Read basic image dimensions using ImageBitmap
  try {
    const bitmap = await createImageBitmap(file);
    tags.push({ tag: 'width',  label: 'Width',  value: bitmap.width  + ' px' });
    tags.push({ tag: 'height', label: 'Height', value: bitmap.height + ' px' });
    bitmap.close();
  } catch {}

  // Try to parse EXIF APP1 segment
  try {
    let offset = 2;
    while (offset < buffer.byteLength - 4) {
      const marker = view.getUint16(offset);
      const length = view.getUint16(offset + 2);

      if (marker === 0xFFE1) {
        // APP1 — check for Exif header
        const exifHeader = String.fromCharCode(...new Uint8Array(buffer, offset + 4, 4));
        if (exifHeader === 'Exif') {
          tags.push({ tag: 'exif', label: 'EXIF', value: 'EXIF data present' });
          // Basic: just note it's there
          break;
        }
      }
      offset += 2 + length;
      if (length < 2) break;
    }
  } catch {}

  return { tags, hasGPS: false };
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024)        return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
}

export const meta = { ready: true };
