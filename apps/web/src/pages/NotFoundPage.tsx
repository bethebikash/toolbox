export default function NotFoundPage() {
  return (
    <div style={{
      textAlign: 'center',
      padding: 'var(--space-16) 0',
      fontFamily: 'var(--font-sans)',
    }}>
      <div style={{ fontSize: '4rem', marginBottom: 'var(--space-4)' }}>404</div>
      <h1 style={{ color: 'var(--color-brand-900)', marginBottom: 'var(--space-4)' }}>
        Page not found
      </h1>
      <a href="/" style={{ color: 'var(--color-brand-500)', fontWeight: '500' }}>
        ← Back to home
      </a>
    </div>
  );
}
