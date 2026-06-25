export * from './color';
export * from './typography';
export * from './space';
export * from './radius';
export * from './shadow';
export * from './motion';
export * from './breakpoint';

export function generateCSSVariables(): string {
  return `
    :root {
      --color-brand-50:  #EFF6FF;
      --color-brand-100: #DBEAFE;
      --color-brand-500: #2E7CF6;
      --color-brand-600: #1D6AE5;
      --color-brand-900: #1E3A5F;

      --color-success:     #10B981;
      --color-success-bg:  #F0FDF4;
      --color-warning:     #D97706;
      --color-warning-bg:  #FFFBEB;
      --color-danger:      #EF4444;
      --color-danger-bg:   #FFF1F2;

      --color-bg:          #F8FAFC;
      --color-surface:     #FFFFFF;
      --color-surface-2:   #F1F5F9;
      --color-border:      #E2E8F0;
      --color-border-2:    #CBD5E1;

      --color-text-primary:   #0F172A;
      --color-text-secondary: #475569;
      --color-text-tertiary:  #94A3B8;
      --color-text-inverse:   #FFFFFF;

      --font-sans: Inter, system-ui, sans-serif;
      --font-mono: 'JetBrains Mono', 'Fira Code', monospace;

      --space-1:  4px;
      --space-2:  8px;
      --space-3:  12px;
      --space-4:  16px;
      --space-5:  20px;
      --space-6:  24px;
      --space-8:  32px;
      --space-10: 40px;
      --space-12: 48px;
      --space-16: 64px;
      --space-20: 80px;

      --radius-sm:   4px;
      --radius-md:   8px;
      --radius-lg:   12px;
      --radius-xl:   16px;
      --radius-2xl:  24px;
      --radius-full: 9999px;

      --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
      --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.07), 0 2px 4px -2px rgb(0 0 0 / 0.05);
      --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.08), 0 4px 6px -4px rgb(0 0 0 / 0.05);
      --shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.08), 0 8px 10px -6px rgb(0 0 0 / 0.05);

      --duration-fast:   120ms;
      --duration-normal: 200ms;
      --duration-slow:   300ms;
      --easing-out:    cubic-bezier(0, 0, 0.2, 1);
      --easing-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
    }

    @media (prefers-color-scheme: dark) {
      :root {
        --color-brand-50:  #1e2d45;
        --color-brand-100: #1e3a5f;
        --color-brand-500: #4E9BF8;
        --color-brand-600: #2E7CF6;
        --color-brand-900: #93C5FD;

        --color-success:     #34D399;
        --color-success-bg:  #022c22;
        --color-warning:     #FBBF24;
        --color-warning-bg:  #1c1400;
        --color-danger:      #F87171;
        --color-danger-bg:   #2d0a0a;

        --color-bg:          #0F172A;
        --color-surface:     #1E293B;
        --color-surface-2:   #263244;
        --color-border:      #2D3F55;
        --color-border-2:    #374d65;

        --color-text-primary:   #F1F5F9;
        --color-text-secondary: #94A3B8;
        --color-text-tertiary:  #64748B;
        --color-text-inverse:   #0F172A;

        --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.3);
        --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.4), 0 2px 4px -2px rgb(0 0 0 / 0.3);
        --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.4), 0 4px 6px -4px rgb(0 0 0 / 0.3);
      }
    }

    @media (prefers-reduced-motion: reduce) {
      :root {
        --duration-fast:   0ms;
        --duration-normal: 0ms;
        --duration-slow:   0ms;
      }
    }

    *, *::before, *::after { box-sizing: border-box; }
    body {
      margin: 0;
      font-family: var(--font-sans);
      background: var(--color-bg);
      color: var(--color-text-primary);
      -webkit-font-smoothing: antialiased;
    }
  `;
}
