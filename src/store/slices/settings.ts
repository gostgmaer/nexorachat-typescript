import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { SettingsStore } from '@/types';

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set, get) => ({
      isDarkMode: false,
      soundNotifications: true,

      toggleDarkMode: () => {
        const { isDarkMode } = get();
        set({ isDarkMode: !isDarkMode });
        
        // Update document class for next-themes compatibility
        if (typeof window !== 'undefined') {
          const root = window.document.documentElement;
          root.classList.toggle('dark', !isDarkMode);
        }
      },

      toggleSoundNotifications: () => {
        const { soundNotifications } = get();
        set({ soundNotifications: !soundNotifications });
      },
    }),
    {
      name: 'settings-store',
    }
  )
);