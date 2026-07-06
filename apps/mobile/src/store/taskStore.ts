// ─── Task Store ──────────────────────────────────────────────────────
// Zustand store for tasks, persisted to SQLite.
// Handles CRUD, status toggling, and filtering.

import { create } from 'zustand';
import type { Task, TrackerFilter } from '@zenth/utils';
import { generateId, isToday, isUpcoming } from '@zenth/utils';
import * as db from '@/lib/db';
import { scheduleTaskReminder, cancelTaskReminder } from '@/lib/notifications';

interface TaskState {
  tasks: Task[];
  isLoaded: boolean;
  activeFilter: TrackerFilter;
  doNowIndex: number;

  // Actions
  loadTasks: () => Promise<void>;
  addTask: (title: string, sourceDumpId?: string | null) => Promise<Task>;
  toggleTask: (id: string) => Promise<void>;
  updateTaskReminder: (
    id: string,
    dueAt: number | null,
    reminderRepeat: 'none' | 'daily' | 'weekly'
  ) => Promise<void>;
  removeTask: (id: string) => Promise<void>;
  setFilter: (filter: TrackerFilter) => void;
  skipDoNow: () => void;
  setDoNowTask: (taskId: string) => void;

  // Computed
  getFilteredTasks: () => Task[];
  getActiveTasks: () => Task[];
  getCurrentDoNowTask: () => Task | null;
  getTodayProgress: () => { done: number; total: number };
}

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  isLoaded: false,
  activeFilter: 'today',
  doNowIndex: 0,

  loadTasks: async () => {
    const tasks = await db.getAllTasks();
    set({ tasks, isLoaded: true });
  },

  addTask: async (title: string, sourceDumpId: string | null = null) => {
    const task: Task = {
      id: generateId(),
      title: title.trim(),
      sourceDumpId,
      status: 'active',
      dueAt: null,
      reminderRepeat: 'none',
      createdAt: Date.now(),
      completedAt: null,
    };

    await db.insertTask(task);
    set((state) => ({ tasks: [task, ...state.tasks] }));
    return task;
  },

  toggleTask: async (id: string) => {
    const task = get().tasks.find((t) => t.id === id);
    if (!task) return;

    const newStatus = task.status === 'active' ? 'done' : 'active';
    const completedAt = newStatus === 'done' ? Date.now() : null;

    await db.updateTaskStatus(id, newStatus, completedAt);

    // Cancel reminder if marking done
    if (newStatus === 'done') {
      await cancelTaskReminder(id);
    }

    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === id ? { ...t, status: newStatus, completedAt } : t
      ),
    }));
  },

  updateTaskReminder: async (
    id: string,
    dueAt: number | null,
    reminderRepeat: 'none' | 'daily' | 'weekly'
  ) => {
    await db.updateTaskDue(id, dueAt, reminderRepeat);

    // Cancel existing reminder
    await cancelTaskReminder(id);

    // Schedule new one if dueAt is set
    const task = get().tasks.find((t) => t.id === id);
    if (task && dueAt) {
      await scheduleTaskReminder({ ...task, dueAt, reminderRepeat });
    }

    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === id ? { ...t, dueAt, reminderRepeat } : t
      ),
    }));
  },

  removeTask: async (id: string) => {
    await cancelTaskReminder(id);
    await db.deleteTask(id);
    set((state) => ({
      tasks: state.tasks.filter((t) => t.id !== id),
    }));
  },

  setFilter: (filter: TrackerFilter) => set({ activeFilter: filter }),

  skipDoNow: () => {
    const activeTasks = get().getActiveTasks();
    if (activeTasks.length === 0) return;
    set((state) => ({
      doNowIndex: (state.doNowIndex + 1) % activeTasks.length,
    }));
  },

  setDoNowTask: (taskId: string) => {
    const activeTasks = get().getActiveTasks();
    const index = activeTasks.findIndex((t) => t.id === taskId);
    if (index >= 0) {
      set({ doNowIndex: index });
    }
  },

  getFilteredTasks: () => {
    const { tasks, activeFilter } = get();
    switch (activeFilter) {
      case 'today':
        return tasks.filter(
          (t) =>
            t.status === 'active' &&
            (t.dueAt === null || isToday(t.dueAt) || t.dueAt <= Date.now())
        );
      case 'upcoming':
        return tasks.filter(
          (t) => t.status === 'active' && t.dueAt !== null && isUpcoming(t.dueAt)
        );
      case 'completed':
        return tasks.filter((t) => t.status === 'done');
      default:
        return tasks;
    }
  },

  getActiveTasks: () => {
    return get().tasks.filter((t) => t.status === 'active');
  },

  getCurrentDoNowTask: () => {
    const activeTasks = get().getActiveTasks();
    if (activeTasks.length === 0) return null;

    // Sort by dueAt (soonest first), then by createdAt
    const sorted = [...activeTasks].sort((a, b) => {
      if (a.dueAt && b.dueAt) return a.dueAt - b.dueAt;
      if (a.dueAt) return -1;
      if (b.dueAt) return 1;
      return a.createdAt - b.createdAt;
    });

    const index = get().doNowIndex % sorted.length;
    return sorted[index] ?? null;
  },

  getTodayProgress: () => {
    const { tasks } = get();
    const todayTasks = tasks.filter(
      (t) =>
        isToday(t.createdAt) ||
        (t.dueAt !== null && isToday(t.dueAt)) ||
        (t.completedAt !== null && isToday(t.completedAt))
    );
    const done = todayTasks.filter((t) => t.status === 'done').length;
    return { done, total: todayTasks.length };
  },
}));
