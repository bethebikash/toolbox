import { create } from 'zustand';

type Theme = 'light' | 'dark' | 'system';

interface SettingsStore {
  theme:            Theme;
  autoDownload:     boolean;
  defaultQuality:   number;
  analyticsConsent: boolean;

  setTheme:            (theme: Theme)   => void;
  setAutoDownload:     (val: boolean)   => void;
  setDefaultQuality:   (val: number)    => void;
  setAnalyticsConsent: (val: boolean)   => void;
}

export const useSettingsStore = create<SettingsStore>(set => ({
  theme:            'system',
  autoDownload:     false,
  defaultQuality:   0.8,
  analyticsConsent: false,

  setTheme:            theme   => set({ theme }),
  setAutoDownload:     val     => set({ autoDownload: val }),
  setDefaultQuality:   val     => set({ defaultQuality: val }),
  setAnalyticsConsent: val     => set({ analyticsConsent: val }),
}));
