import { describe, it, expect } from 'vitest';
import { formatXML, minifyXML } from './engine';

const SAMPLE_XML = '<root><item>hello</item><item>world</item></root>';

describe('formatXML', () => {
  it('formats valid XML', () => {
    const r = formatXML(SAMPLE_XML);
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.output).toContain('\n');
    expect(r.output).toContain('<?xml');
  });

  it('returns error for invalid XML', () => {
    const r = formatXML('<unclosed>');
    expect(r.ok).toBe(false);
  });
});

describe('minifyXML', () => {
  it('minifies XML', () => {
    const formatted = formatXML(SAMPLE_XML);
    if (!formatted.ok) return;
    const minified = minifyXML(formatted.output);
    expect(minified.ok).toBe(true);
  });
});
