// ─── Key-Value Storage Interface ─────────────────────────────────────
// Abstraction over AsyncStorage for settings and simple flags.
// The actual AsyncStorage import happens in the mobile app;
// this file provides the key constants and type-safe helpers.

export const STORAGE_KEYS = {
  SETTINGS: 'zenth_settings',
  ONBOARDING: 'zenth_onboarding',
  LAST_FOCUS_TASK: 'zenth_last_focus_task',
} as const;

export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];
