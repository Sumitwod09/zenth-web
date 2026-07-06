// ─── Date & Time Utilities ───────────────────────────────────────────

const MS_PER_DAY = 86_400_000;

/**
 * Check if a timestamp falls on today's date.
 */
export function isToday(timestamp: number): boolean {
  const now = new Date();
  const date = new Date(timestamp);
  return (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()
  );
}

/**
 * Check if a timestamp is in the future (not today).
 */
export function isUpcoming(timestamp: number): boolean {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  return timestamp >= todayStart + MS_PER_DAY;
}

/**
 * Format a timestamp into a human-friendly relative string.
 * Examples: "Just now", "5m ago", "2h ago", "Yesterday", "Mon", "Jun 15"
 */
export function formatRelative(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;

  if (diff < 60_000) return 'Just now';
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`;
  if (diff < MS_PER_DAY) return `${Math.floor(diff / 3_600_000)}h ago`;

  const date = new Date(timestamp);
  const yesterday = new Date(now - MS_PER_DAY);

  if (
    date.getFullYear() === yesterday.getFullYear() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getDate() === yesterday.getDate()
  ) {
    return 'Yesterday';
  }

  // Within this week — show day name
  if (diff < MS_PER_DAY * 7) {
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  }

  // Older — show month and day
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

/**
 * Format a timestamp into a time string like "3:45 PM".
 */
export function formatTime(timestamp: number): string {
  return new Date(timestamp).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

/**
 * Format a timestamp into a date string like "Jul 6, 2026".
 */
export function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/**
 * Format seconds into MM:SS for timer display.
 */
export function formatTimerDisplay(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

/**
 * Generate a unique ID using timestamp + random suffix.
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}
