// ─── Data Models (MVP) ───────────────────────────────────────────────

export interface Dump {
  id: string;
  text: string;
  createdAt: number; // Unix timestamp ms
  convertedToTaskIds: string[];
}

export interface Task {
  id: string;
  title: string;
  sourceDumpId: string | null;
  status: 'active' | 'done';
  dueAt: number | null; // Unix timestamp ms
  reminderRepeat: 'none' | 'daily' | 'weekly';
  createdAt: number; // Unix timestamp ms
  completedAt: number | null; // Unix timestamp ms
}

// ─── Settings ────────────────────────────────────────────────────────

export interface AppSettings {
  focusDuration: number; // minutes (10–25)
  onboardingComplete: boolean;
  notificationPermissionAsked: boolean;
}

export const DEFAULT_SETTINGS: AppSettings = {
  focusDuration: 25,
  onboardingComplete: false,
  notificationPermissionAsked: false,
};

// ─── Filter Types ────────────────────────────────────────────────────

export type TrackerFilter = 'today' | 'upcoming' | 'completed';

// ─── Notification Payload ────────────────────────────────────────────

export interface NotificationPayload {
  taskId: string;
  action: 'open_do_now';
}
