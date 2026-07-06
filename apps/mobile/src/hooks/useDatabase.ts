// ─── Database Initialization Hook ────────────────────────────────────
// Initializes SQLite, runs migrations, and hydrates Zustand stores on app mount.

import { useEffect, useState } from 'react';
import { initDatabase } from '@/lib/db';
import { setupNotificationChannel } from '@/lib/notifications';
import { useDumpStore } from '@/store/dumpStore';
import { useTaskStore } from '@/store/taskStore';

export function useDatabase() {
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const loadDumps = useDumpStore((s) => s.loadDumps);
  const loadTasks = useTaskStore((s) => s.loadTasks);

  useEffect(() => {
    async function init() {
      try {
        await initDatabase();
        await Promise.all([loadDumps(), loadTasks()]);
        await setupNotificationChannel();
        setIsReady(true);
      } catch (err) {
        console.error('Database initialization failed:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      }
    }
    init();
  }, []);

  return { isReady, error };
}
