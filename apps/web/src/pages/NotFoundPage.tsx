import { useNavigate } from 'react-router';
import { allTools } from '../registry/registry';

const SUGGESTIONS = allTools.slice(0, 6);

export default function NotFoundPage() {
  const navigate = useNavigate();
  return (
    <div style={{ textAlign: 'center', padding: 'var(--space-16) var(--space-4)', maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ fontSize: '80px', marginBottom: 'var(--space-4)', lineHeight: 1 }}>🔧</div>
      <h1 style={{ fontSize: '2.5rem', fontWeight: '900', color: 'var(--color-text-primary)', margin: '0 0 var(--space-3)', letterSpacing: '-0.03em' }}>Page not found</h1>
      <p style={{ fontSize: '16px', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-8)', lineHeight: 1.6 }}>
        The page you're looking for doesn't exist. Try one of these tools:
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--space-3)', marginBottom: 'var(--space-8)', textAlign: 'left' }}>
        {SUGGESTIONS.map(tool => (
          <div key={tool.id} onClick={() => navigate(tool.slug)}
            style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-4)', cursor: 'pointer', transition: 'all var(--duration-fast)' }}
            onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--color-brand-500)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--color-border)'; }}>
            <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--color-text-primary)', marginBottom: '4px' }}>{tool.name}</div>
            <div style={{ fontSize: '12px', color: 'var(--color-text-tertiary)' }}>{tool.description.slice(0, 50)}</div>
          </div>
        ))}
      </div>
      <button onClick={() => navigate('/')}
        style={{ padding: 'var(--space-3) var(--space-8)', background: 'var(--color-brand-500)', color: '#fff', border: 'none', borderRadius: 'var(--radius-lg)', fontSize: '15px', fontWeight: '600', cursor: 'pointer', fontFamily: 'var(--font-sans)', boxShadow: '0 4px 12px rgba(46,124,246,0.35)' }}>
        ← Back to home
      </button>
    </div>
  );
}
