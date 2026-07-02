import { useState, useEffect } from 'react';
import { getCountdown } from './engine';
import type { TimerTarget, Countdown } from './engine';

const tomorrow = new Date(Date.now() + 86400000);
const DEFAULT: TimerTarget = {
  date:  tomorrow.toISOString().split('T')[0]!,
  time:  '12:00',
  label: 'My Countdown',
};

export default function CountdownTimerPage() {
  const [target,    setTarget]    = useState<TimerTarget>(DEFAULT);
  const [countdown, setCountdown] = useState<Countdown | null>(null);
  const [running,   setRunning]   = useState(false);

  useEffect(() => {
    if (!running) return;
    const tick = () => setCountdown(getCountdown(target));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [running, target]);

  function start() { setRunning(true); }
  function stop()  { setRunning(false); setCountdown(null); }

  const pad = (n: number) => String(n).padStart(2, '0');

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ fontSize: '13px', color: 'var(--color-text-tertiary)', marginBottom: 'var(--space-5)', display: 'flex', alignItems: 'center', gap: '6px' }}>
        <a href="/" style={{ color: 'var(--color-text-tertiary)', textDecoration: 'none' }}>Home</a>
        <span>/</span>
        <a href="/tools/utility" style={{ color: 'var(--color-text-tertiary)', textDecoration: 'none' }}>Utility Tools</a>
        <span>/</span>
        <span style={{ color: 'var(--color-text-secondary)' }}>Countdown Timer</span>
      </div>
      <div style={{ marginBottom: 'var(--space-8)' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--color-text-primary)', margin: '0 0 var(--space-2)', letterSpacing: '-0.02em' }}>Countdown Timer</h1>
        <p style={{ color: 'var(--color-text-secondary)', margin: 0, fontSize: '15px', lineHeight: 1.6 }}>Count down to any date and time. Live updating.</p>
      </div>

      <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)', padding: 'var(--space-6)', marginBottom: 'var(--space-4)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: 'var(--color-text-primary)', marginBottom: 'var(--space-2)' }}>Label</label>
            <input type="text" value={target.label} onChange={e => setTarget(t => ({ ...t, label: e.target.value }))}
              style={{ width: '100%', padding: 'var(--space-3)', border: '1px solid var(--color-border-2)', borderRadius: 'var(--radius-md)', fontSize: '15px', fontFamily: 'var(--font-sans)', color: 'var(--color-text-primary)', background: 'var(--color-surface)', outline: 'none', boxSizing: 'border-box' }}
            />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: 'var(--color-text-primary)', marginBottom: 'var(--space-2)' }}>Target date</label>
              <input type="date" value={target.date} onChange={e => setTarget(t => ({ ...t, date: e.target.value }))}
                style={{ width: '100%', padding: 'var(--space-3)', border: '1px solid var(--color-border-2)', borderRadius: 'var(--radius-md)', fontSize: '15px', fontFamily: 'var(--font-sans)', color: 'var(--color-text-primary)', background: 'var(--color-surface)', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: 'var(--color-text-primary)', marginBottom: 'var(--space-2)' }}>Target time</label>
              <input type="time" value={target.time} onChange={e => setTarget(t => ({ ...t, time: e.target.value }))}
                style={{ width: '100%', padding: 'var(--space-3)', border: '1px solid var(--color-border-2)', borderRadius: 'var(--radius-md)', fontSize: '15px', fontFamily: 'var(--font-sans)', color: 'var(--color-text-primary)', background: 'var(--color-surface)', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>
          </div>
          <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
            {!running
              ? <button onClick={start} style={{ flex: 1, padding: 'var(--space-3)', background: 'var(--color-brand-500)', color: '#fff', border: 'none', borderRadius: 'var(--radius-lg)', fontSize: '15px', fontWeight: '600', cursor: 'pointer', fontFamily: 'var(--font-sans)', boxShadow: '0 4px 12px rgb(46 124 246 / 0.35)' }}>Start countdown</button>
              : <button onClick={stop} style={{ flex: 1, padding: 'var(--space-3)', background: 'var(--color-danger)', color: '#fff', border: 'none', borderRadius: 'var(--radius-lg)', fontSize: '15px', fontWeight: '600', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>Stop</button>
            }
          </div>
        </div>
      </div>

      {countdown && (
        <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)', padding: 'var(--space-8)', textAlign: 'center' }}>
          {target.label && <div style={{ fontSize: '16px', fontWeight: '600', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-4)' }}>{target.label}</div>}
          {countdown.past && <div style={{ fontSize: '14px', color: 'var(--color-warning)', marginBottom: 'var(--space-4)' }}>⏱ This date has passed — showing time since</div>}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
            {[
              { label: 'Days',    value: countdown.days },
              { label: 'Hours',   value: countdown.hours },
              { label: 'Minutes', value: countdown.minutes },
              { label: 'Seconds', value: countdown.seconds },
            ].map(unit => (
              <div key={unit.label} style={{ textAlign: 'center', minWidth: '80px' }}>
                <div style={{ fontSize: '56px', fontWeight: '800', color: 'var(--color-brand-500)', lineHeight: 1, fontVariantNumeric: 'tabular-nums', fontFamily: 'var(--font-mono)' }}>
                  {pad(unit.value)}
                </div>
                <div style={{ fontSize: '13px', color: 'var(--color-text-tertiary)', marginTop: 'var(--space-2)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: '600' }}>
                  {unit.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
