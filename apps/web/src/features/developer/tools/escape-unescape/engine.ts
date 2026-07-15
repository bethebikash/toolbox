export type EscapeType = 'html' | 'url' | 'js' | 'base64' | 'json';

export const TYPE_LABELS: Record<EscapeType, string> = {
  html:   'HTML entities',
  url:    'URL encoding',
  js:     'JavaScript string',
  base64: 'Base64',
  json:   'JSON string',
};

export function encodeText(input: string, type: EscapeType): string {
  switch (type) {
    case 'html':
      return input.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
    case 'url':
      return encodeURIComponent(input);
    case 'js':
      return input.replace(/\\/g,'\\\\').replace(/"/g,'\\"').replace(/'/g,"\\'").replace(/\n/g,'\\n').replace(/\r/g,'\\r').replace(/\t/g,'\\t');
    case 'base64':
      return btoa(new TextEncoder().encode(input).reduce((s, b) => s + String.fromCharCode(b), ''));
    case 'json':
      return JSON.stringify(input).slice(1, -1);
  }
}

export function decodeText(input: string, type: EscapeType): string {
  try {
    switch (type) {
      case 'html':
        return input.replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"').replace(/&#39;/g,"'");
      case 'url':
        return decodeURIComponent(input);
      case 'js':
        return input.replace(/\\n/g,'\n').replace(/\\r/g,'\r').replace(/\\t/g,'\t').replace(/\\"/g,'"').replace(/\\'/g,"'").replace(/\\\\/g,'\\');
      case 'base64': {
        const binary = atob(input);
        const bytes  = Uint8Array.from(binary, c => c.charCodeAt(0));
        return new TextDecoder().decode(bytes);
      }
      case 'json':
        return JSON.parse('"' + input + '"');
    }
  } catch {
    return input;
  }
}

export const meta = { ready: true };
