import { useState } from 'react';
import { convert, formatAmount, CURRENCIES, CURRENCY_NAMES } from './engine';

export default function CurrencyConverterPage() {
  const [amount, setAmount]   = useState('100');
  const [from,   setFrom]     = useState('USD');
  const [to,     setTo]       = useState('EUR');
  const [copied, setCopied]   = useState(false);

  const num    = parseFloat(amount) || 0;
  const result = convert(num, from, to);

  function swap() { setFrom(to); setTo(from); }

  function copy() {
    navigator.clipboard.writeText(formatAmount(result, to));
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  const selectStyle = { padding: 'var(--space-3)', border: '1px solid var(--color-border-2)', borderRadius: 'var(--radius-md)', fontSize: '15px', fontFamily: 'var(--font-sans)', color: 'var(--color-text-primary)', background: 'var(--color-surface)', outline: 'none', width: '100%', cursor: 'pointer' };

  return (
    <div style={{ maxWidth: '680px', margin: '0 auto' }}>
      <div style={{ fontSize: '13px', color: 'var(--color-text-tertiary)', marginBottom: 'var(--space-5)', display: 'flex', alignItems: 'center', gap: '6px' }}>
        <a href="/" style={{ color: 'var(--color-text-tertiary)', textDecoration: 'none' }}>Home</a><span>/</span>
        <a href="/tools/utility" style={{ color: 'var(--color-text-tertiary)', textDecoration: 'none' }}>Utility Tools</a><span>/</span>
        <span style={{ color: 'var(--color-text-secondary)' }}>Currency Converter</span>
      </div>
      <div style={{ marginBottom: 'var(--space-8)' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--color-text-primary)', margin: '0 0 var(--space-2)', letterSpacing: '-0.02em' }}>Currency Converter</h1>
        <p style={{ color: 'var(--color-text-secondary)', margin: 0, fontSize: '15px', lineHeight: 1.6 }}>Convert between 30+ currencies using static exchange rates.</p>
      </div>

      <div style={{ padding: 'var(--space-3) var(--space-5)', background: 'var(--color-warning-bg)', border: '1px solid var(--color-warning)', borderRadius: 'var(--radius-lg)', fontSize: '13px', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-6)', display: 'flex', gap: 'var(--space-2)' }}>
        <span>ℹ</span><span>Uses static rates for offline operation. For live rates, check a financial service.</span>
      </div>

      <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)', padding: 'var(--space-6)', marginBottom: 'var(--space-4)' }}>
        {/* Amount */}
        <div style={{ marginBottom: 'var(--space-5)' }}>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: 'var(--color-text-primary)', marginBottom: 'var(--space-2)' }}>Amount</label>
          <input type="number" value={amount} onChange={e => setAmount(e.target.value)}
            style={{ width: '100%', padding: 'var(--space-4)', border: '1px solid var(--color-border-2)', borderRadius: 'var(--radius-md)', fontSize: '24px', fontFamily: 'var(--font-mono)', color: 'var(--color-text-primary)', background: 'var(--color-surface)', outline: 'none', boxSizing: 'border-box', textAlign: 'center', fontWeight: '700' }}
          />
        </div>

        {/* From / Swap / To */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: 'var(--space-3)', alignItems: 'end' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-2)' }}>From</label>
            <select value={from} onChange={e => setFrom(e.target.value)} style={selectStyle}>
              {CURRENCIES.map(c => <option key={c} value={c}>{c} — {CURRENCY_NAMES[c]}</option>)}
            </select>
          </div>
          <button onClick={swap} style={{ padding: 'var(--space-3)', background: 'var(--color-surface-2)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-full)', cursor: 'pointer', fontSize: '20px', lineHeight: 1, marginBottom: '2px' }}>⇄</button>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-2)' }}>To</label>
            <select value={to} onChange={e => setTo(e.target.value)} style={selectStyle}>
              {CURRENCIES.map(c => <option key={c} value={c}>{c} — {CURRENCY_NAMES[c]}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Result */}
      <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-brand-500)', padding: 'var(--space-6)', textAlign: 'center' }}>
        <div style={{ fontSize: '14px', color: 'var(--color-text-tertiary)', marginBottom: 'var(--space-3)' }}>
          {amount} {CURRENCY_NAMES[from]} =
        </div>
        <div style={{ fontSize: '40px', fontWeight: '800', color: 'var(--color-brand-500)', fontVariantNumeric: 'tabular-nums', marginBottom: 'var(--space-4)' }}>
          {formatAmount(result, to)}
        </div>
        <div style={{ fontSize: '13px', color: 'var(--color-text-tertiary)', marginBottom: 'var(--space-4)' }}>
          1 {from} = {formatAmount(convert(1, from, to), to)}
        </div>
        <button onClick={copy} style={{ padding: 'var(--space-2) var(--space-6)', background: copied ? 'var(--color-success)' : 'var(--color-surface-2)', color: copied ? '#fff' : 'var(--color-text-secondary)', border: '1px solid ' + (copied ? 'var(--color-success)' : 'var(--color-border)'), borderRadius: 'var(--radius-full)', fontSize: '14px', cursor: 'pointer', fontFamily: 'var(--font-sans)', fontWeight: '500', transition: 'all var(--duration-fast)' }}>
          {copied ? '✓ Copied' : 'Copy result'}
        </button>
      </div>

      {/* All conversions */}
      <div style={{ marginTop: 'var(--space-4)', background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)', overflow: 'hidden' }}>
        <div style={{ padding: 'var(--space-3) var(--space-5)', borderBottom: '1px solid var(--color-border)', background: 'var(--color-surface-2)', fontSize: '12px', fontWeight: '700', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--color-text-tertiary)' }}>
          {amount} {from} in other currencies
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 0 }}>
          {CURRENCIES.filter(c => c !== from).slice(0, 18).map((c, i) => (
            <div key={c} onClick={() => setTo(c)} style={{ padding: 'var(--space-3) var(--space-4)', borderBottom: '1px solid var(--color-border)', borderRight: '1px solid var(--color-border)', cursor: 'pointer', background: c === to ? 'var(--color-brand-50)' : 'transparent', transition: 'background var(--duration-fast)' }}>
              <div style={{ fontSize: '12px', color: 'var(--color-text-tertiary)', marginBottom: '2px' }}>{c}</div>
              <div style={{ fontSize: '14px', fontWeight: '700', color: c === to ? 'var(--color-brand-500)' : 'var(--color-text-primary)', fontVariantNumeric: 'tabular-nums' }}>
                {formatAmount(convert(num, from, c), c)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
