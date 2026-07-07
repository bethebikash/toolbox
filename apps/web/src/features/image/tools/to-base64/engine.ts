export interface ImageBase64Result {
  dataUrl:      string;
  base64:       string;
  mimeType:     string;
  sizeBytes:    number;
  base64Length: number;
}

export async function imageToBase64(file: File): Promise<ImageBase64Result> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload  = () => {
      const dataUrl    = reader.result as string;
      const base64     = dataUrl.split(',')[1] ?? '';
      resolve({
        dataUrl,
        base64,
        mimeType:     file.type,
        sizeBytes:    file.size,
        base64Length: base64.length,
      });
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

export function generateImgTag(result: ImageBase64Result): string {
  return `<img src="${result.dataUrl}" alt="image" />`;
}

export function generateCSSBackground(result: ImageBase64Result): string {
  return `background-image: url('${result.dataUrl}');`;
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024)        return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
}

export const meta = { ready: true };
