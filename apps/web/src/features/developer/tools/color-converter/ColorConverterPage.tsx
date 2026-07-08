import { useState } from 'react';
import { parseColor } from './engine';
import type { ColorFormats } from './engine';

const EXAMPLES = ['#2E7CF6', 'rgb(255, 128, 0)', 'hsl(120, 100%, 50%)', '#ff0', '#abc'];

export default function ColorConverterPage() {
  const [input,  setInput]  = useState('#2E7CF6');
  const [copied, setCopied] = useState<string | null>(null);

  const result: ColorFormats | null = parseColor(input);

  function copy(text: string, key: string) {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 1500);
  }

  const formats = result ? [
    { label: 'HEX',  value: result.hex,  key: 'hex'  },
    { label: 'RGB',  value: result.rgb,  key: 'rgb'  },
    { label: 'HSL',  value: result.hsl,  key: 'hsl'  },
    { label: 'HSV',  value: result.hsv,  key: 'hsv'  },
    { label: 'CMYK', value: result.cmyk, key: 'cmyk' },
    { label: 'CSS',  value: result.css,  key: 'css'  },
  ] : [];

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ fontSize: '13px', color: 'var(--color-text-tertiary)', marginBottom: 'var(--space-5)', display: 'flex', alignItems: 'center', gap: '6px' }}>
        <a href="/" style={{ color: 'var(--color-text-tertiary)', textDecoration: 'none' }}>Home</a><span>/</span>
        <a href="/tools/developer" style={{ color: 'var(--color-text-tertiary)', textDecoration: 'none' }}>Developer</a><span>/</span>
        <span style={{ color: 'var(--color-text-secondary)' }}>Color Converter</span>
      </div>
      <div style={{ marginBottom: 'var(--space-8)' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--color-text-primary)', margin: '0 0 var(--space-2)', letterSpacing: '-0.02em' }}>Color Code Converter</h1>
        <p style={{ color: 'var(--color-text-secondary)', margin: 0, fontSize: '15px', lineHeight: 1.6 }}>Convert colors between HEX, RGB, HSL, HSV and CMYK formats.</p>
      </div>

      {/* Color input */}
      <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)', padding: 'var(--space-5)', marginBottom: 'var(--space-4)' }}>
        {result && (
          <div style={{ height: '80px', borderRadius: 'var(--radius-lg)', background: result.hex, marginBottom: 'var(--space-4)', boxShadow: 'var(--shadow-md)' }} />
        )}
        <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: 'var(--color-text-primary)', marginBottom: 'var(--space-2)' }}>Enter a color</label>
        <input type="text" value={input} onChange={e => setInput(e.target.value)}
          placeholder="#hex, rgb(), or hsl()"
          style={{ width: '100%', padding: 'var(--space-3)', border: '1px solid ' + (result ? 'var(--color-border-2)' : 'var(--color-danger)'), borderRadius: 'var(--radius-md)', fontSize: '16px', fontFamily: 'var(--font-mono)', color: 'var(--color-text-primary)', background: 'var(--color-surface)', outline: 'none', boxSizing: 'border-box', fontWeight: '600' }}
        />
        <div style={{ display: 'flex', gap: 'var(--space-2)', marginTop: 'var(--space-3)', flexWrap: 'wrap' }}>
          {EXAMPLES.map(ex => (
            <button key={ex} onClick={() => setInput(ex)} style={{ padding: 'var(--space-1) var(--space-3)', background: 'var(--color-surface-2)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-full)', fontSize: '12px', fontFamily: 'var(--font-mono)', color: 'var(--color-text-secondary)', cursor: 'pointer' }}>{ex}</button>
          ))}
        </div>
      </div>

      {result && (
        <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)', overflow: 'hidden' }}>
          {formats.map((f, i) => (
            <div key={f.key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'var(--space-4) var(--space-5)', borderBottom: i < formats.length - 1 ? '1px solid var(--color-border)' : 'none', gap: 'var(--space-4)' }}>
              <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--color-text-tertiary)', width: '40px', letterSpacing: '0.05em' }}>{f.label}</span>
              <code style={{ fontFamily: 'var(--font-mono)', fontSize: '14px', color: 'var(--color-text-primary)', flex: 1 }}>{f.value}</code>
              <button onClick={() => copy(f.value, f.key)} style={{ background: copied === f.key ? 'var(--color-success)' : 'none', color: copied === f.key ? '#fff' : 'var(--color-text-tertiary)', border: 'none', borderRadius: 'var(--radius-sm)', padding: copied === f.key ? '2px 8px' : '0', fontSize: '12px', cursor: 'pointer', fontFamily: 'var(--font-sans)', fontWeight: '500' }}>
                {copied === f.key ? '✓' : 'Copy'}
              </button>
            </div>
          ))}
        </div>
      )}

      {!result && input.trim() && (
        <div style={{ background: 'var(--color-danger-bg)', border: '1px solid var(--color-danger)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-4) var(--space-5)', fontSize: '14px', color: 'var(--color-danger)' }}>
          ⚠ Could not parse color. Try #hex, rgb(r,g,b) or hsl(h,s%,l%).
        </div>
      )}
    </div>
  );
}
