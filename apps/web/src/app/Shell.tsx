import { Outlet } from 'react-router';

const NAV_ITEMS = [
  { label: 'Image',     path: '/tools/image' },
  { label: 'PDF',       path: '/tools/pdf' },
  { label: 'Video',     path: '/tools/video' },
  { label: 'Developer', path: '/tools/developer' },
];

export function Shell() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: 'var(--font-sans)',
      background: 'var(--color-bg)',
      color: 'var(--color-text-primary)',
    }}>
      <Header />
      <main style={{
        flex: 1,
        width: '100%',
        maxWidth: '1200px',
        margin: '0 auto',
        padding: 'var(--space-10) var(--space-6)',
      }}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

function Header() {
  return (
    <header style={{
      borderBottom: '1px solid var(--color-border)',
      background: 'var(--color-surface)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxShadow: 'var(--shadow-sm)',
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 var(--space-6)',
        height: '60px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <a href="/" style={{
          fontWeight: '800',
          fontSize: '18px',
          color: 'var(--color-brand-500)',
          textDecoration: 'none',
          letterSpacing: '-0.03em',
        }}>
          Toolbox
        </a>
        <nav style={{ display: 'flex', gap: 'var(--space-1)', alignItems: 'center' }}>
          {NAV_ITEMS.map(item => (
            <a
              key={item.path}
              href={item.path}
              style={{
                fontSize: '14px',
                fontWeight: '500',
                color: 'var(--color-text-secondary)',
                textDecoration: 'none',
                padding: 'var(--space-2) var(--space-3)',
                borderRadius: 'var(--radius-md)',
                transition: 'background var(--duration-fast), color var(--duration-fast)',
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLAnchorElement;
                el.style.background = 'var(--color-surface-2)';
                el.style.color = 'var(--color-text-primary)';
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLAnchorElement;
                el.style.background = 'transparent';
                el.style.color = 'var(--color-text-secondary)';
              }}
            >
              {item.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer style={{
      borderTop: '1px solid var(--color-border)',
      background: 'var(--color-surface)',
      padding: 'var(--space-8) var(--space-6)',
      textAlign: 'center',
      fontSize: '13px',
      color: 'var(--color-text-tertiary)',
    }}>
      Toolbox — all processing runs in your browser. Your files never leave your device.
    </footer>
  );
}
