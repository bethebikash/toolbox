import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Theme = 'light' | 'dark' | 'system';

interface SettingsState {
  theme:             Theme;
  autoDownload:      boolean;
  defaultQuality:    number;
  analyticsConsent:  boolean;
  setTheme:          (t: Theme) => void;
  setAutoDownload:   (v: boolean) => void;
  setDefaultQuality: (v: number) => void;
  setAnalytics:      (v: boolean) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    set => ({
      theme:            'light',
      autoDownload:     false,
      defaultQuality:   0.85,
      analyticsConsent: false,
      setTheme:          theme            => set({ theme }),
      setAutoDownload:   autoDownload     => set({ autoDownload }),
      setDefaultQuality: defaultQuality   => set({ defaultQuality }),
      setAnalytics:      analyticsConsent => set({ analyticsConsent }),
    }),
    { name: 'toolbox-settings' }
  )
);
