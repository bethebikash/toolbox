export interface TableData {
  headers: string[];
  rows:    string[][];
}

export function parseCSVToTable(csv: string): TableData {
  const lines = csv.trim().split('\n').filter(Boolean);
  if (lines.length === 0) return { headers: [], rows: [] };
  const parse = (line: string) => line.split(',').map(c => c.trim().replace(/^"|"$/g, ''));
  const headers = parse(lines[0]!);
  const rows    = lines.slice(1).map(parse);
  return { headers, rows };
}

export function tableToMarkdown(data: TableData, align: 'left' | 'center' | 'right' = 'left'): string {
  if (data.headers.length === 0) return '';
  const alignChar = align === 'center' ? ':---:' : align === 'right' ? '---:' : ':---';
  const colWidths = data.headers.map((h, i) => Math.max(h.length, ...data.rows.map(r => (r[i] ?? '').length), 3));
  const pad = (s: string, w: number) => s + ' '.repeat(Math.max(0, w - s.length));
  const row = (cells: string[]) => '| ' + cells.map((c, i) => pad(c, colWidths[i]!)).join(' | ') + ' |';
  const sep = '| ' + colWidths.map(w => alignChar.padEnd(w, '-')).join(' | ') + ' |';
  return [row(data.headers), sep, ...data.rows.map(r => row(data.headers.map((_, i) => r[i] ?? '')))].join('\n');
}

export function markdownToHTML(md: string): string {
  const lines  = md.trim().split('\n');
  const header = lines[0];
  const rows   = lines.slice(2);
  if (!header) return '';
  const cells  = (line: string) => line.split('|').slice(1, -1).map(c => c.trim());
  const th     = cells(header).map(c => `<th>${c}</th>`).join('');
  const trs    = rows.map(r => '<tr>' + cells(r).map(c => `<td>${c}</td>`).join('') + '</tr>').join('\n');
  return `<table>\n<thead><tr>${th}</tr></thead>\n<tbody>\n${trs}\n</tbody>\n</table>`;
}

export const meta = { ready: true };
