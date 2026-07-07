export interface FormatResult {
  ok:     true;
  output: string;
}
export interface FormatError {
  ok:    false;
  error: string;
}

export function formatXML(input: string, indent = 2): FormatResult | FormatError {
  try {
    const parser = new DOMParser();
    const doc    = parser.parseFromString(input.trim(), 'application/xml');
    const err    = doc.querySelector('parsererror');
    if (err) return { ok: false, error: err.textContent?.split('\n')[0] ?? 'Invalid XML' };

    const output = serializeXML(doc.documentElement, 0, indent);
    return { ok: true, output: '<?xml version="1.0" encoding="UTF-8"?>\n' + output };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}

function serializeXML(node: Element, depth: number, indent: number): string {
  const pad = ' '.repeat(depth * indent);
  const attrs = Array.from(node.attributes).map(a => ` ${a.name}="${a.value}"`).join('');

  const children = Array.from(node.childNodes).filter(n =>
    n.nodeType === Node.ELEMENT_NODE || (n.nodeType === Node.TEXT_NODE && n.textContent?.trim())
  );

  if (children.length === 0) {
    const text = node.textContent?.trim();
    if (text) return `${pad}<${node.tagName}${attrs}>${text}</${node.tagName}>`;
    return `${pad}<${node.tagName}${attrs}/>`;
  }

  const hasOnlyText = children.length === 1 && children[0]!.nodeType === Node.TEXT_NODE;
  if (hasOnlyText) {
    return `${pad}<${node.tagName}${attrs}>${children[0]!.textContent?.trim() ?? ''}</${node.tagName}>`;
  }

  const inner = children
    .filter(n => n.nodeType === Node.ELEMENT_NODE)
    .map(n => serializeXML(n as Element, depth + 1, indent))
    .join('\n');

  return `${pad}<${node.tagName}${attrs}>\n${inner}\n${pad}</${node.tagName}>`;
}

export function minifyXML(input: string): FormatResult | FormatError {
  try {
    const parser = new DOMParser();
    const doc    = parser.parseFromString(input.trim(), 'application/xml');
    const err    = doc.querySelector('parsererror');
    if (err) return { ok: false, error: err.textContent?.split('\n')[0] ?? 'Invalid XML' };
    const s = new XMLSerializer();
    return { ok: true, output: s.serializeToString(doc).replace(/\s+/g, ' ').replace(/> </g, '><') };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}

export const meta = { ready: true };
