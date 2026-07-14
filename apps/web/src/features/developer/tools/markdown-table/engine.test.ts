import { describe, it, expect } from 'vitest';
import { parseCSVToTable, tableToMarkdown, markdownToHTML } from './engine';

describe('parseCSVToTable', () => {
  it('parses CSV', () => {
    const r = parseCSVToTable('Name,Age\nAlice,30\nBob,25');
    expect(r.headers).toEqual(['Name', 'Age']);
    expect(r.rows.length).toBe(2);
    expect(r.rows[0]).toEqual(['Alice', '30']);
  });
});

describe('tableToMarkdown', () => {
  it('generates markdown table', () => {
    const data = { headers: ['Name', 'Age'], rows: [['Alice', '30']] };
    const md   = tableToMarkdown(data);
    expect(md).toContain('| Name');
    expect(md).toContain('| Alice');
    expect(md).toContain(':---');
  });
});

describe('markdownToHTML', () => {
  it('generates HTML table', () => {
    const md  = '| Name | Age |\n|:---|:---|\n| Alice | 30 |';
    const html = markdownToHTML(md);
    expect(html).toContain('<table>');
    expect(html).toContain('<th>Name</th>');
  });
});
