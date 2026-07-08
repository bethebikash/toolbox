import { Outlet, NavLink, useNavigate } from 'react-router';
import { useState, useEffect, useRef } from 'react';
import { useSettingsStore } from '../store/settings';
import { searchTools } from '../registry/registry';
import type { ToolManifest } from '@toolbox/shared/types';

const NAV_ITEMS = [
  { path: '/tools/image',     label: 'Image',     emoji: '🖼️' },
  { path: '/tools/pdf',       label: 'PDF',        emoji: '📄' },
  { path: '/tools/developer', label: 'Developer',  emoji: '🛠️' },
  { path: '/tools/text',      label: 'Text',       emoji: '✏️' },
  { path: '/tools/color',     label: 'Design',     emoji: '🎨' },
  { path: '/tools/utility',   label: 'Utility',    emoji: '🔧' },
  { path: '/tools/video',     label: 'Video',      emoji: '🎬' },
  { path: '/tools/audio',     label: 'Audio',      emoji: '🎵' },
  { path: '/tools/seo',       label: 'SEO',        emoji: '🔍' },
];

export function Shell() {
  const theme       = useSettingsStore(s => s.theme);
  const setTheme    = useSettingsStore(s => s.setTheme);
  const navigate    = useNavigate();

  const [query,       setQuery]       = useState('');
  const [results,     setResults]     = useState<ToolManifest[]>([]);
  const [searchOpen,  setSearchOpen]  = useState(false);
  const [activeIdx,   setActiveIdx]   = useState(0);
  const [mobileMenu,  setMobileMenu]  = useState(false);
  const searchRef  = useRef<HTMLInputElement>(null);
  const dropRef    = useRef<HTMLDivElement>(null);

  // Sync theme to <html>
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Global keyboard shortcut: Cmd+K / Ctrl+K
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
        setTimeout(() => searchRef.current?.focus(), 50);
      }
      if (e.key === 'Escape') { setSearchOpen(false); setQuery(''); }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Close on outside click
  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
        setQuery('');
      }
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  function handleSearch(q: string) {
    setQuery(q);
    setActiveIdx(0);
    if (q.trim()) {
      setResults(searchTools(q).slice(0, 8));
      setSearchOpen(true);
    } else {
      setResults([]);
    }
  }

  function goTo(slug: string) {
    navigate(slug);
    setSearchOpen(false);
    setQuery('');
    setResults([]);
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'ArrowDown') { e.preventDefault(); setActiveIdx(i => Math.min(i + 1, results.length - 1)); }
    if (e.key === 'ArrowUp')   { e.preventDefault(); setActiveIdx(i => Math.max(i - 1, 0)); }
    if (e.key === 'Enter' && results[activeIdx]) goTo(results[activeIdx]!.slug);
  }

  const isDark = theme === 'dark';

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)', display: 'flex', flexDirection: 'column' }}>

      {/* Header */}
      <header style={{ position: 'sticky', top: 0, zIndex: 100, background: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)', backdropFilter: 'blur(12px)' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 var(--space-6)', height: '60px', display: 'flex', alignItems: 'center', gap: 'var(--space-6)' }}>

          {/* Logo */}
          <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', textDecoration: 'none', flexShrink: 0 }}>
            <div style={{ width: '32px', height: '32px', borderRadius: 'var(--radius-lg)', background: 'var(--color-brand-500)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>🧰</div>
            <span style={{ fontSize: '18px', fontWeight: '800', color: 'var(--color-text-primary)', letterSpacing: '-0.03em' }}>Toolbox</span>
          </a>

          {/* Desktop nav */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: '2px', flex: 1, overflowX: 'auto' }} className="hide-scrollbar">
            {NAV_ITEMS.map(item => (
              <NavLink key={item.path} to={item.path}
                style={({ isActive }) => ({
                  display: 'flex', alignItems: 'center', gap: '5px',
                  padding: 'var(--space-2) var(--space-3)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '13px', fontWeight: isActive ? '600' : '500',
                  color: isActive ? 'var(--color-brand-500)' : 'var(--color-text-secondary)',
                  background: isActive ? 'var(--color-brand-50)' : 'transparent',
                  textDecoration: 'none', whiteSpace: 'nowrap',
                  transition: 'all var(--duration-fast)',
                })}>
                <span>{item.emoji}</span>
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>

          {/* Search */}
          <div ref={dropRef} style={{ position: 'relative', flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', padding: 'var(--space-2) var(--space-3)', background: 'var(--color-surface-2)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', cursor: 'text', width: '200px' }}
              onClick={() => { setSearchOpen(true); searchRef.current?.focus(); }}>
              <span style={{ fontSize: '14px', color: 'var(--color-text-tertiary)' }}>🔎</span>
              <input ref={searchRef} type="text" value={query} onChange={e => handleSearch(e.target.value)} onKeyDown={onKeyDown} onFocus={() => query && setSearchOpen(true)}
                placeholder="Search tools..." style={{ border: 'none', outline: 'none', background: 'transparent', fontSize: '13px', color: 'var(--color-text-primary)', width: '100%', fontFamily: 'var(--font-sans)' }}
              />
              <kbd style={{ fontSize: '10px', color: 'var(--color-text-tertiary)', background: 'var(--color-border)', borderRadius: '4px', padding: '1px 5px', flexShrink: 0 }}>⌘K</kbd>
            </div>

            {/* Search dropdown */}
            {searchOpen && results.length > 0 && (
              <div style={{ position: 'absolute', top: 'calc(100% + 8px)', right: 0, width: '320px', background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-xl)', overflow: 'hidden', zIndex: 200 }}>
                {results.map((tool, i) => (
                  <div key={tool.id} onClick={() => goTo(tool.slug)}
                    style={{ padding: 'var(--space-3) var(--space-4)', cursor: 'pointer', background: i === activeIdx ? 'var(--color-brand-50)' : 'transparent', borderBottom: i < results.length - 1 ? '1px solid var(--color-border)' : 'none', display: 'flex', flexDirection: 'column', gap: '2px', transition: 'background var(--duration-fast)' }}
                    onMouseEnter={() => setActiveIdx(i)}>
                    <div style={{ fontSize: '14px', fontWeight: '600', color: i === activeIdx ? 'var(--color-brand-500)' : 'var(--color-text-primary)' }}>{tool.name}</div>
                    <div style={{ fontSize: '12px', color: 'var(--color-text-tertiary)' }}>{tool.category} · {tool.description.slice(0, 60)}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Dark mode toggle */}
          <button onClick={() => setTheme(isDark ? 'light' : 'dark')} title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            style={{ width: '36px', height: '36px', borderRadius: 'var(--radius-lg)', background: 'var(--color-surface-2)', border: '1px solid var(--color-border)', cursor: 'pointer', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all var(--duration-fast)' }}>
            {isDark ? '☀️' : '🌙'}
          </button>

          {/* Mobile menu button */}
          <button onClick={() => setMobileMenu(m => !m)}
            style={{ display: 'none', width: '36px', height: '36px', borderRadius: 'var(--radius-md)', background: 'var(--color-surface-2)', border: '1px solid var(--color-border)', cursor: 'pointer', fontSize: '18px', alignItems: 'center', justifyContent: 'center' }}
            className="mobile-menu-btn">
            {mobileMenu ? '✕' : '☰'}
          </button>
        </div>

        {/* Mobile nav */}
        {mobileMenu && (
          <div style={{ borderTop: '1px solid var(--color-border)', padding: 'var(--space-4) var(--space-6)', display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
            {NAV_ITEMS.map(item => (
              <NavLink key={item.path} to={item.path} onClick={() => setMobileMenu(false)}
                style={({ isActive }) => ({
                  display: 'flex', alignItems: 'center', gap: '6px',
                  padding: 'var(--space-2) var(--space-3)', borderRadius: 'var(--radius-md)',
                  fontSize: '14px', fontWeight: isActive ? '600' : '500',
                  color: isActive ? 'var(--color-brand-500)' : 'var(--color-text-secondary)',
                  background: isActive ? 'var(--color-brand-50)' : 'var(--color-surface-2)',
                  textDecoration: 'none',
                })}>
                {item.emoji} {item.label}
              </NavLink>
            ))}
          </div>
        )}
      </header>

      {/* Main */}
      <main style={{ flex: 1, maxWidth: '1400px', width: '100%', margin: '0 auto', padding: 'var(--space-8) var(--space-6)' }}>
        <Outlet />
      </main>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid var(--color-border)', background: 'var(--color-surface)', padding: 'var(--space-6)', textAlign: 'center' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
          <div style={{ fontSize: '13px', color: 'var(--color-text-tertiary)' }}>
            <strong style={{ color: 'var(--color-text-secondary)' }}>🧰 Toolbox</strong> — 70 free browser tools. No uploads, no accounts.
          </div>
          <div style={{ display: 'flex', gap: 'var(--space-4)', fontSize: '13px', color: 'var(--color-text-tertiary)', flexWrap: 'wrap' }}>
            {NAV_ITEMS.map(item => (
              <a key={item.path} href={item.path} style={{ color: 'var(--color-text-tertiary)', textDecoration: 'none' }}>{item.label}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
