export const color = {
  brand: {
    50:  '#EFF6FF',
    100: '#DBEAFE',
    200: '#BFDBFE',
    300: '#93C5FD',
    400: '#60A5FA',
    500: '#2E7CF6',
    600: '#1D6AE5',
    700: '#1D4ED8',
    800: '#1E40AF',
    900: '#1E3A5F',
  },
  success: {
    50:  '#F0FDF4',
    500: '#10B981',
    700: '#047857',
    900: '#064E3B',
  },
  warning: {
    50:  '#FFFBEB',
    500: '#D97706',
    700: '#B45309',
    900: '#451A03',
  },
  danger: {
    50:  '#FFF1F2',
    500: '#EF4444',
    700: '#B91C1C',
    900: '#7F1D1D',
  },
  neutral: {
    0:   '#FFFFFF',
    50:  '#F8FAFC',
    100: '#F1F5F9',
    200: '#E2E8F0',
    300: '#CBD5E1',
    400: '#94A3B8',
    500: '#64748B',
    600: '#475569',
    700: '#334155',
    800: '#1E293B',
    900: '#0F172A',
    950: '#020617',
  },
} as const;

export type ColorToken = typeof color;
