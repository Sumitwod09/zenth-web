// ─── Settings Store ──────────────────────────────────────────────────
// Zustand store for app settings, persisted to AsyncStorage.

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { AppSettings } from '@zenth/utils';
import { DEFAULT_SETTINGS, STORAGE_KEYS } from '@zenth/utils';

interface SettingsState extends AppSettings {
  setFocusDuration: (minutes: number) => void;
  completeOnboarding: () => void;
  markNotificationPermissionAsked: () => void;
  resetSettings: () => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      ...DEFAULT_SETTINGS,

      setFocusDuration: (minutes: number) => {
        const clamped = Math.min(25, Math.max(10, minutes));
        set({ focusDuration: clamped });
      },

      completeOnboarding: () => set({ onboardingComplete: true }),

      markNotificationPermissionAsked: () =>
        set({ notificationPermissionAsked: true }),

      resetSettings: () => set(DEFAULT_SETTINGS),
    }),
    {
      name: STORAGE_KEYS.SETTINGS,
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
