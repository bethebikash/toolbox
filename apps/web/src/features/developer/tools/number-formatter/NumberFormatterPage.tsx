import { useState } from 'react';
import { formatNumber, LOCALES } from './engine';
import type { FormatOptions } from './engine';

const DEFAULT: FormatOptions = { locale: 'en-US', style: 'decimal', currency: 'USD', decimals: 2, grouping: true };

export default function NumberFormatterPage() {
  const [input, setInput] = useState('1234567.89');
  const [opts,  setOpts]  = useState<FormatOptions>(DEFAULT);
  const [copied, setCopied] = useState(false);

  const num = parseFloat(input) || 0;
  const result = formatNumber(num, opts);

  function copy() { navigator.clipboard.writeText(result.formatted); setCopied(true); setTimeout(() => setCopied(false), 1500); }

  const selectStyle = { padding: 'var(--space-2) var(--space-3)', border: '1px solid var(--color-border-2)', borderRadius: 'var(--radius-md)', fontSize: '14px', fontFamily: 'var(--font-sans)', color: 'var(--color-text-primary)', background: 'var(--color-surface)', outline: 'none', cursor: 'pointer' };

  return (
    <div style={{ maxWidth: '680px', margin: '0 auto' }}>
      <div style={{ fontSize: '13px', color: 'var(--color-text-tertiary)', marginBottom: 'var(--space-5)', display: 'flex', alignItems: 'center', gap: '6px' }}>
        <a href="/" style={{ color: 'var(--color-text-tertiary)', textDecoration: 'none' }}>Home</a><span>/</span>
        <a href="/tools/developer" style={{ color: 'var(--color-text-tertiary)', textDecoration: 'none' }}>Developer</a><span>/</span>
        <span style={{ color: 'var(--color-text-secondary)' }}>Number Formatter</span>
      </div>
      <div style={{ marginBottom: 'var(--space-8)' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--color-text-primary)', margin: '0 0 var(--space-2)', letterSpacing: '-0.02em' }}>Number Formatter</h1>
        <p style={{ color: 'var(--color-text-secondary)', margin: 0, fontSize: '15px', lineHeight: 1.6 }}>Format numbers for different locales, currencies and styles using the Intl API.</p>
      </div>

      <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)', padding: 'var(--space-6)', marginBottom: 'var(--space-4)' }}>
        <div style={{ marginBottom: 'var(--space-5)' }}>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: 'var(--color-text-primary)', marginBottom: 'var(--space-2)' }}>Number</label>
          <input type="number" value={input} onChange={e => setInput(e.target.value)}
            style={{ width: '100%', padding: 'var(--space-4)', border: '1px solid var(--color-border-2)', borderRadius: 'var(--radius-md)', fontSize: '24px', fontFamily: 'var(--font-mono)', color: 'var(--color-text-primary)', background: 'var(--color-surface)', outline: 'none', boxSizing: 'border-box', fontWeight: '700' }}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-2)' }}>Locale</label>
            <select value={opts.locale} onChange={e => setOpts(o => ({ ...o, locale: e.target.value }))} style={{ ...selectStyle, width: '100%' }}>
              {LOCALES.map(l => <option key={l.code} value={l.code}>{l.label}</option>)}
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-2)' }}>Style</label>
            <select value={opts.style} onChange={e => setOpts(o => ({ ...o, style: e.target.value as FormatOptions['style'] }))} style={{ ...selectStyle, width: '100%' }}>
              <option value="decimal">Decimal</option>
              <option value="currency">Currency</option>
              <option value="percent">Percent</option>
              <option value="scientific">Scientific</option>
            </select>
          </div>
          {opts.style === 'currency' && (
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-2)' }}>Currency</label>
              <input type="text" value={opts.currency} onChange={e => setOpts(o => ({ ...o, currency: e.target.value.toUpperCase() }))}
                style={{ ...selectStyle, width: '100%', boxSizing: 'border-box' }} maxLength={3} placeholder="USD" />
            </div>
          )}
          {opts.style !== 'currency' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
                <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--color-text-secondary)' }}>Decimal places</label>
                <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--color-brand-500)' }}>{opts.decimals}</span>
              </div>
              <input type="range" min={0} max={10} value={opts.decimals} onChange={e => setOpts(o => ({ ...o, decimals: Number(e.target.value) }))} style={{ width: '100%', accentColor: 'var(--color-brand-500)' }} />
            </div>
          )}
        </div>

        <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: '14px', fontWeight: '500', color: 'var(--color-text-primary)', cursor: 'pointer', marginTop: 'var(--space-4)' }}>
          <input type="checkbox" checked={opts.grouping} onChange={e => setOpts(o => ({ ...o, grouping: e.target.checked }))} style={{ accentColor: 'var(--color-brand-500)', width: '16px', height: '16px' }} />
          Use thousands separator
        </label>
      </div>

      <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-brand-500)', padding: 'var(--space-6)', textAlign: 'center' }}>
        <div style={{ fontSize: '13px', color: 'var(--color-text-tertiary)', marginBottom: 'var(--space-3)' }}>Formatted result</div>
        <div style={{ fontSize: '40px', fontWeight: '900', color: 'var(--color-brand-500)', marginBottom: 'var(--space-4)', fontVariantNumeric: 'tabular-nums' }}>{result.formatted}</div>
        <button onClick={copy} style={{ padding: 'var(--space-2) var(--space-6)', background: copied ? 'var(--color-success)' : 'var(--color-surface-2)', color: copied ? '#fff' : 'var(--color-text-secondary)', border: '1px solid ' + (copied ? 'var(--color-success)' : 'var(--color-border)'), borderRadius: 'var(--radius-full)', fontSize: '14px', cursor: 'pointer', fontFamily: 'var(--font-sans)', fontWeight: '500' }}>
          {copied ? '✓ Copied' : 'Copy result'}
        </button>
      </div>

      {/* All locales comparison */}
      <div style={{ marginTop: 'var(--space-4)', background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)', overflow: 'hidden' }}>
        <div style={{ padding: 'var(--space-3) var(--space-5)', borderBottom: '1px solid var(--color-border)', background: 'var(--color-surface-2)', fontSize: '12px', fontWeight: '700', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--color-text-tertiary)' }}>All locales</div>
        {LOCALES.map((l, i) => {
          const r = formatNumber(num, { ...opts, locale: l.code });
          return (
            <div key={l.code} style={{ display: 'flex', justifyContent: 'space-between', padding: 'var(--space-3) var(--space-5)', borderBottom: i < LOCALES.length - 1 ? '1px solid var(--color-border)' : 'none', background: l.code === opts.locale ? 'var(--color-brand-50)' : 'transparent' }}>
              <span style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>{l.label}</span>
              <span style={{ fontSize: '14px', fontFamily: 'var(--font-mono)', fontWeight: '600', color: l.code === opts.locale ? 'var(--color-brand-500)' : 'var(--color-text-primary)' }}>{r.formatted}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
