import { useState } from 'react';
import { fromTimestamp, fromDatetime } from './engine';
import type { TimestampResult } from './engine';

export default function TimestampConverterPage() {
  const now    = Math.floor(Date.now() / 1000);
  const today  = new Date().toISOString().split('T')[0]!;
  const nowTime= new Date().toTimeString().slice(0, 5);

  const [tsInput,   setTsInput]   = useState(String(now));
  const [dateInput, setDateInput] = useState(today);
  const [timeInput, setTimeInput] = useState(nowTime);
  const [result,    setResult]    = useState<TimestampResult | null>(null);
  const [copied,    setCopied]    = useState<string | null>(null);

  function convertTs() {
    const n = parseInt(tsInput);
    if (!isNaN(n)) setResult(fromTimestamp(n));
  }

  function convertDate() {
    setResult(fromDatetime(dateInput, timeInput + ':00'));
  }

  function useNow() {
    const n = Math.floor(Date.now() / 1000);
    setTsInput(String(n));
    setResult(fromTimestamp(n));
  }

  function copy(text: string, key: string) {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 1500);
  }

  const rows = result ? [
    { label: 'Unix timestamp', value: String(result.unix), key: 'unix' },
    { label: 'ISO 8601',       value: result.iso,           key: 'iso'  },
    { label: 'UTC',            value: result.utc,           key: 'utc'  },
    { label: 'Local',          value: result.local,         key: 'local'},
    { label: 'Relative',       value: result.relative,      key: 'rel'  },
    { label: 'Date',           value: result.date,          key: 'date' },
    { label: 'Time (UTC)',     value: result.time,          key: 'time' },
  ] : [];

  const inputStyle = { width: '100%', padding: 'var(--space-3)', border: '1px solid var(--color-border-2)', borderRadius: 'var(--radius-md)', fontSize: '15px', fontFamily: 'var(--font-mono)', color: 'var(--color-text-primary)', background: 'var(--color-surface)', outline: 'none', boxSizing: 'border-box' as const };

  return (
    <div style={{ maxWidth: '680px', margin: '0 auto' }}>
      <div style={{ fontSize: '13px', color: 'var(--color-text-tertiary)', marginBottom: 'var(--space-5)', display: 'flex', alignItems: 'center', gap: '6px' }}>
        <a href="/" style={{ color: 'var(--color-text-tertiary)', textDecoration: 'none' }}>Home</a><span>/</span>
        <a href="/tools/utility" style={{ color: 'var(--color-text-tertiary)', textDecoration: 'none' }}>Utility</a><span>/</span>
        <span style={{ color: 'var(--color-text-secondary)' }}>Timestamp Converter</span>
      </div>
      <div style={{ marginBottom: 'var(--space-8)' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--color-text-primary)', margin: '0 0 var(--space-2)', letterSpacing: '-0.02em' }}>Timestamp Converter</h1>
        <p style={{ color: 'var(--color-text-secondary)', margin: 0, fontSize: '15px', lineHeight: 1.6 }}>Convert Unix timestamps to human-readable dates and vice versa.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)', marginBottom: 'var(--space-4)' }}>
        <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)', padding: 'var(--space-5)' }}>
          <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-3)' }}>Unix timestamp → date</div>
          <input type="number" value={tsInput} onChange={e => setTsInput(e.target.value)} style={inputStyle} placeholder="e.g. 1700000000" />
          <div style={{ display: 'flex', gap: 'var(--space-2)', marginTop: 'var(--space-3)' }}>
            <button onClick={convertTs} style={{ flex: 1, padding: 'var(--space-2)', background: 'var(--color-brand-500)', color: '#fff', border: 'none', borderRadius: 'var(--radius-md)', fontSize: '13px', fontWeight: '600', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>Convert →</button>
            <button onClick={useNow} style={{ padding: 'var(--space-2) var(--space-3)', background: 'var(--color-surface-2)', color: 'var(--color-text-secondary)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', fontSize: '13px', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>Now</button>
          </div>
        </div>
        <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)', padding: 'var(--space-5)' }}>
          <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-3)' }}>Date + time → timestamp</div>
          <input type="date" value={dateInput} onChange={e => setDateInput(e.target.value)} style={{ ...inputStyle, marginBottom: 'var(--space-2)' }} />
          <input type="time" value={timeInput} onChange={e => setTimeInput(e.target.value)} style={inputStyle} />
          <button onClick={convertDate} style={{ width: '100%', marginTop: 'var(--space-3)', padding: 'var(--space-2)', background: 'var(--color-brand-500)', color: '#fff', border: 'none', borderRadius: 'var(--radius-md)', fontSize: '13px', fontWeight: '600', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>Convert →</button>
        </div>
      </div>

      {result && (
        <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)', overflow: 'hidden' }}>
          {rows.map((row, i) => (
            <div key={row.key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--space-4) var(--space-5)', borderBottom: i < rows.length - 1 ? '1px solid var(--color-border)' : 'none', gap: 'var(--space-4)' }}>
              <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--color-text-secondary)', minWidth: '130px', flexShrink: 0 }}>{row.label}</span>
              <span style={{ fontSize: '13px', fontFamily: 'var(--font-mono)', color: 'var(--color-text-primary)', flex: 1, wordBreak: 'break-all' }}>{row.value}</span>
              <button onClick={() => copy(row.value, row.key)} style={{ background: copied === row.key ? 'var(--color-success)' : 'none', color: copied === row.key ? '#fff' : 'var(--color-text-tertiary)', border: 'none', borderRadius: 'var(--radius-sm)', padding: copied === row.key ? '2px 8px' : '0', fontSize: '12px', cursor: 'pointer', fontFamily: 'var(--font-sans)', fontWeight: '500', flexShrink: 0 }}>
                {copied === row.key ? '✓' : 'Copy'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
