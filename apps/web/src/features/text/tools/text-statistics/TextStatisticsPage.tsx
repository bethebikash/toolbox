import { useState, useMemo } from 'react';
import { analyzeText } from './engine';

const SAMPLE = `The quick brown fox jumps over the lazy dog. Pack my box with five dozen liquor jugs. How valiantly I quaffed extraordinary liquor.

This is the second paragraph with more text to analyze. Statistics are interesting and useful for writers and researchers alike.`;

export default function TextStatisticsPage() {
  const [text, setText] = useState(SAMPLE);
  const stats = useMemo(() => analyzeText(text), [text]);

  const STATS = [
    { label: 'Characters',       value: stats.chars.toLocaleString() },
    { label: 'Chars (no spaces)',value: stats.charsNoSpaces.toLocaleString() },
    { label: 'Words',            value: stats.words.toLocaleString() },
    { label: 'Unique words',     value: stats.uniqueWords.toLocaleString() },
    { label: 'Sentences',        value: stats.sentences.toLocaleString() },
    { label: 'Paragraphs',       value: stats.paragraphs.toLocaleString() },
    { label: 'Lines',            value: stats.lines.toLocaleString() },
    { label: 'Avg word length',  value: stats.avgWordLength + ' chars' },
    { label: 'Avg sentence',     value: stats.avgSentenceLen + ' words' },
    { label: 'Lexical density',  value: stats.lexicalDensity + '%' },
    { label: 'Reading time',     value: stats.readingTime },
    { label: 'Speaking time',    value: stats.speakingTime },
    { label: 'Longest word',     value: stats.longestWord || '—' },
    { label: 'Most frequent',    value: stats.mostFreqWord || '—' },
  ];

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ fontSize: '13px', color: 'var(--color-text-tertiary)', marginBottom: 'var(--space-5)', display: 'flex', alignItems: 'center', gap: '6px' }}>
        <a href="/" style={{ color: 'var(--color-text-tertiary)', textDecoration: 'none' }}>Home</a><span>/</span>
        <a href="/tools/text" style={{ color: 'var(--color-text-tertiary)', textDecoration: 'none' }}>Text</a><span>/</span>
        <span style={{ color: 'var(--color-text-secondary)' }}>Text Statistics</span>
      </div>
      <div style={{ marginBottom: 'var(--space-6)' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--color-text-primary)', margin: '0 0 var(--space-2)', letterSpacing: '-0.02em' }}>Text Statistics</h1>
        <p style={{ color: 'var(--color-text-secondary)', margin: 0, fontSize: '15px', lineHeight: 1.6 }}>Deep text analysis: character count, word frequency, readability metrics and more.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-6)' }}>
        {/* Input */}
        <div style={{ display: 'flex', flexDirection: 'column', background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)', overflow: 'hidden' }}>
          <div style={{ padding: 'var(--space-3) var(--space-4)', borderBottom: '1px solid var(--color-border)', background: 'var(--color-surface-2)', display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: '700', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--color-text-tertiary)' }}>
            Text input
            <button onClick={() => setText('')} style={{ background: 'none', border: 'none', fontSize: '12px', color: 'var(--color-text-tertiary)', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>Clear</button>
          </div>
          <textarea value={text} onChange={e => setText(e.target.value)}
            style={{ flex: 1, minHeight: '420px', padding: 'var(--space-4)', border: 'none', outline: 'none', resize: 'none', fontFamily: 'var(--font-sans)', fontSize: '14px', lineHeight: 1.7, color: 'var(--color-text-primary)', background: 'transparent' }} />
        </div>

        {/* Stats grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)', alignContent: 'start' }}>
          {STATS.map(s => (
            <div key={s.label} style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-3) var(--space-4)' }}>
              <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--color-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 'var(--space-1)' }}>{s.label}</div>
              <div style={{ fontSize: '18px', fontWeight: '800', color: 'var(--color-brand-500)', fontVariantNumeric: 'tabular-nums', wordBreak: 'break-word' }}>{s.value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
