import { describe, it, expect } from 'vitest';
import { markdownToHTML, htmlToMarkdown } from './engine';

describe('markdownToHTML', () => {
  it('converts heading', () => {
    const r = markdownToHTML('# Hello');
    expect(r.html).toContain('<h1>Hello</h1>');
  });

  it('converts bold', () => {
    const r = markdownToHTML('**bold**');
    expect(r.html).toContain('<strong>bold</strong>');
  });

  it('converts link', () => {
    const r = markdownToHTML('[click](https://example.com)');
    expect(r.html).toContain('href="https://example.com"');
  });

  it('counts words', () => {
    const r = markdownToHTML('hello world foo');
    expect(r.wordCount).toBe(3);
  });

  it('handles empty string', () => {
    const r = markdownToHTML('');
    expect(r.wordCount).toBe(0);
    expect(r.html.trim()).toBe('');
  });
});

describe('htmlToMarkdown', () => {
  it('converts h1', () => {
    expect(htmlToMarkdown('<h1>Hello</h1>')).toBe('# Hello');
  });

  it('converts bold', () => {
    expect(htmlToMarkdown('<strong>bold</strong>')).toBe('**bold**');
  });

  it('converts links', () => {
    expect(htmlToMarkdown('<a href="https://example.com">click</a>')).toBe('[click](https://example.com)');
  });

  it('strips unknown tags', () => {
    expect(htmlToMarkdown('<div>plain text</div>')).toBe('plain text');
  });
});
