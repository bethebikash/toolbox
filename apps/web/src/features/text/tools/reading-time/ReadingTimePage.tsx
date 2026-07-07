import { useState, useMemo } from 'react';
import { calculateReadingTime, DEFAULT_OPTS } from './engine';
import type { ReadingTimeOptions } from './engine';

const SAMPLE = `Reading time calculators help writers estimate how long it takes to read their content. This is particularly useful for blog posts, articles, and documentation.

Studies show that the average adult reads about 200–250 words per minute when reading for comprehension. Technical content is often read more slowly, while light fiction can be consumed faster.

For web content, knowing your reading time helps you set appropriate expectations for your audience and can even improve SEO by reducing bounce rates on longer articles.`;

export default function ReadingTimePage() {
  const [text, setText] = useState(SAMPLE);
  const [opts, setOpts] = useState<ReadingTimeOptions>(DEFAULT_OPTS);

  const result = useMemo(() => calculateReadingTime(text, opts), [text, opts]);

  return (
    <div style={{ maxWidth: '760px', margin: '0 auto' }}>
      <div style={{ fontSize: '13px', color: 'var(--color-text-tertiary)', marginBottom: 'var(--space-5)', display: 'flex', alignItems: 'center', gap: '6px' }}>
        <a href="/" style={{ color: 'var(--color-text-tertiary)', textDecoration: 'none' }}>Home</a><span>/</span>
        <a href="/tools/text" style={{ color: 'var(--color-text-tertiary)', textDecoration: 'none' }}>Text Tools</a><span>/</span>
        <span style={{ color: 'var(--color-text-secondary)' }}>Reading Time</span>
      </div>
      <div style={{ marginBottom: 'var(--space-8)' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--color-text-primary)', margin: '0 0 var(--space-2)', letterSpacing: '-0.02em' }}>Reading Time Calculator</h1>
        <p style={{ color: 'var(--color-text-secondary)', margin: 0, fontSize: '15px', lineHeight: 1.6 }}>Estimate how long it takes to read your content. Updates as you type.</p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 'var(--space-3)', marginBottom: 'var(--space-6)' }}>
        {[
          { label: 'Reading time', value: result.formatted },
          { label: 'Words',        value: result.words.toLocaleString() },
          { label: 'Minutes',      value: String(result.minutes) },
          { label: 'Seconds',      value: String(result.totalSeconds) },
        ].map(s => (
          <div key={s.label} style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-4)' }}>
            <div style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--color-text-tertiary)', marginBottom: 'var(--space-1)' }}>{s.label}</div>
            <div style={{ fontSize: '22px', fontWeight: '800', color: 'var(--color-brand-500)' }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* WPM setting */}
      <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', padding: 'var(--space-4)', marginBottom: 'var(--space-4)', display: 'flex', gap: 'var(--space-6)', alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--color-text-primary)' }}>Reading speed</span>
          <input type="number" min={50} max={1000} value={opts.wpm} onChange={e => setOpts(o => ({ ...o, wpm: Number(e.target.value) }))}
            style={{ width: '80px', padding: 'var(--space-2) var(--space-3)', border: '1px solid var(--color-border-2)', borderRadius: 'var(--radius-md)', fontSize: '15px', fontFamily: 'var(--font-sans)', color: 'var(--color-text-primary)', background: 'var(--color-surface)', outline: 'none', textAlign: 'center', fontWeight: '600' }}
          />
          <span style={{ fontSize: '14px', color: 'var(--color-text-secondary)' }}>WPM</span>
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
          {[{ label: 'Slow (150)', wpm: 150 }, { label: 'Average (238)', wpm: 238 }, { label: 'Fast (350)', wpm: 350 }].map(p => (
            <button key={p.wpm} onClick={() => setOpts(o => ({ ...o, wpm: p.wpm }))} style={{ padding: 'var(--space-1) var(--space-3)', background: opts.wpm === p.wpm ? 'var(--color-brand-500)' : 'var(--color-surface-2)', color: opts.wpm === p.wpm ? '#fff' : 'var(--color-text-secondary)', border: '1px solid ' + (opts.wpm === p.wpm ? 'var(--color-brand-500)' : 'var(--color-border)'), borderRadius: 'var(--radius-full)', fontSize: '12px', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Textarea */}
      <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)', overflow: 'hidden' }}>
        <div style={{ padding: 'var(--space-3) var(--space-5)', borderBottom: '1px solid var(--color-border)', background: 'var(--color-surface-2)', display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: '700', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--color-text-tertiary)' }}>
          Your text
          <button onClick={() => setText('')} style={{ background: 'none', border: 'none', fontSize: '12px', color: 'var(--color-text-tertiary)', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>Clear</button>
        </div>
        <textarea value={text} onChange={e => setText(e.target.value)} placeholder="Paste or type your text here..."
          style={{ width: '100%', minHeight: '320px', padding: 'var(--space-5)', border: 'none', outline: 'none', resize: 'vertical', fontFamily: 'var(--font-sans)', fontSize: '15px', lineHeight: 1.7, color: 'var(--color-text-primary)', background: 'transparent', boxSizing: 'border-box' }}
        />
      </div>
    </div>
  );
}
