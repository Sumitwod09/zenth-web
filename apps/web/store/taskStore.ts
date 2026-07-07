import { create } from "zustand";
import { SupabaseClient } from "@supabase/supabase-js";
import { generateId, isToday, isUpcoming } from "@zenth/utils";

export type TaskStatus = "pending" | "completed";
export type TrackerFilter = "today" | "upcoming" | "completed";

interface TaskEntry {
  id: string;
  title: string;
  status: TaskStatus;
  dumpId: string | null;
  createdAt: number;
  completedAt: number | null;
}

interface TaskState {
  tasks: TaskEntry[];
  isLoading: boolean;
  loadTasks: (supabase: SupabaseClient) => Promise<void>;
  addTask: (supabase: SupabaseClient, title: string, userId: string, dumpId?: string) => Promise<string>;
  toggleTask: (supabase: SupabaseClient, id: string) => Promise<void>;
  deleteTask: (supabase: SupabaseClient, id: string) => Promise<void>;
  getFilteredTasks: (filter: TrackerFilter) => TaskEntry[];
  getActiveTasks: () => TaskEntry[];
  getCurrentDoNowTask: () => TaskEntry | null;
  getTodayProgress: () => { done: number; total: number; percentage: number };
}

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  isLoading: false,

  loadTasks: async (supabase) => {
    set({ isLoading: true });
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Failed to load tasks:", error);
      set({ isLoading: false });
      return;
    }

    const tasks: TaskEntry[] = (data || []).map((row) => ({
      id: row.id,
      title: row.content,
      status: row.status as TaskStatus,
      dumpId: row.dump_id,
      createdAt: new Date(row.created_at).getTime(),
      completedAt: row.completed_at ? new Date(row.completed_at).getTime() : null,
    }));

    set({ tasks, isLoading: false });
  },

  addTask: async (supabase, title, userId, dumpId) => {
    const id = generateId();
    const now = Date.now();

    const newTask: TaskEntry = {
      id,
      title,
      status: "pending",
      dumpId: dumpId || null,
      createdAt: now,
      completedAt: null,
    };

    // Optimistic
    set((state) => ({ tasks: [...state.tasks, newTask] }));

    const { error } = await supabase.from("tasks").insert({
      id,
      user_id: userId,
      content: title,
      status: "pending",
      dump_id: dumpId || null,
    });

    if (error) {
      console.error("Failed to save task:", error);
    }

    return id;
  },

  toggleTask: async (supabase, id) => {
    const task = get().tasks.find((t) => t.id === id);
    if (!task) return;

    const newStatus: TaskStatus = task.status === "pending" ? "completed" : "pending";
    const completedAt = newStatus === "completed" ? Date.now() : null;

    // Optimistic
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === id ? { ...t, status: newStatus, completedAt } : t
      ),
    }));

    const updateData: Record<string, unknown> = { status: newStatus };
    if (newStatus === "completed") {
      updateData.completed_at = new Date(completedAt!).toISOString();
    } else {
      updateData.completed_at = null;
    }

    const { error } = await supabase
      .from("tasks")
      .update(updateData)
      .eq("id", id);

    if (error) {
      console.error("Failed to toggle task:", error);
    }
  },

  deleteTask: async (supabase, id) => {
    set((state) => ({ tasks: state.tasks.filter((t) => t.id !== id) }));

    const { error } = await supabase.from("tasks").delete().eq("id", id);
    if (error) {
      console.error("Failed to delete task:", error);
    }
  },

  getFilteredTasks: (filter) => {
    const tasks = get().tasks;
    switch (filter) {
      case "today":
        return tasks.filter(
          (t) => t.status === "pending" && isToday(t.createdAt)
        );
      case "upcoming":
        return tasks.filter(
          (t) => t.status === "pending" && !isToday(t.createdAt)
        );
      case "completed":
        return tasks.filter((t) => t.status === "completed");
      default:
        return tasks;
    }
  },

  getActiveTasks: () => {
    return get().tasks.filter((t) => t.status === "pending");
  },

  getCurrentDoNowTask: () => {
    const active = get().tasks.filter((t) => t.status === "pending");
    return active.length > 0 ? active[0] : null;
  },

  getTodayProgress: () => {
    const tasks = get().tasks;
    const todayTasks = tasks.filter(
      (t) => isToday(t.createdAt) || (t.completedAt && isToday(t.completedAt))
    );
    const done = todayTasks.filter((t) => t.status === "completed").length;
    const total = todayTasks.length;
    return {
      done,
      total,
      percentage: total > 0 ? done / total : 0,
    };
  },
}));
