export interface SERPData {
  title:       string;
  url:         string;
  description: string;
}

export const DEFAULT_SERP: SERPData = {
  title:       'My Page Title | Brand Name',
  url:         'https://www.example.com/my-page',
  description: 'This is the meta description that appears in Google search results. Keep it under 160 characters for best results.',
};

export function truncate(str: string, maxPx: number, charsPerPx = 0.14): string {
  const maxChars = Math.floor(maxPx * charsPerPx);
  return str.length > maxChars ? str.slice(0, maxChars - 1) + '…' : str;
}

export function getTitleStatus(title: string): { ok: boolean; msg: string } {
  const l = title.length;
  if (l < 30)  return { ok: false, msg: `Too short (${l}/30–60 chars)` };
  if (l > 60)  return { ok: false, msg: `Too long (${l}/60 chars)` };
  return { ok: true, msg: `Good length (${l} chars)` };
}

export function getDescStatus(desc: string): { ok: boolean; msg: string } {
  const l = desc.length;
  if (l < 70)  return { ok: false, msg: `Too short (${l}/70–160 chars)` };
  if (l > 160) return { ok: false, msg: `Too long (${l}/160 chars)` };
  return { ok: true, msg: `Good length (${l} chars)` };
}

export const meta = { ready: true };
