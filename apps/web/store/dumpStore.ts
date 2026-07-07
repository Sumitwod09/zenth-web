import { create } from "zustand";
import { SupabaseClient } from "@supabase/supabase-js";
import { generateId } from "@zenth/utils";

interface DumpEntry {
  id: string;
  text: string;
  createdAt: number;
  convertedToTaskIds: string[];
}

interface DumpState {
  dumps: DumpEntry[];
  isLoading: boolean;
  loadDumps: (supabase: SupabaseClient) => Promise<void>;
  addDump: (supabase: SupabaseClient, text: string, userId: string) => Promise<void>;
  deleteDump: (supabase: SupabaseClient, id: string) => Promise<void>;
  markConverted: (dumpId: string, taskId: string) => void;
}

export const useDumpStore = create<DumpState>((set, get) => ({
  dumps: [],
  isLoading: false,

  loadDumps: async (supabase) => {
    set({ isLoading: true });
    const { data, error } = await supabase
      .from("dumps")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Failed to load dumps:", error);
      set({ isLoading: false });
      return;
    }

    const dumps: DumpEntry[] = (data || []).map((row) => ({
      id: row.id,
      text: row.content,
      createdAt: new Date(row.created_at).getTime(),
      convertedToTaskIds: [],
    }));

    // Check which dumps have associated tasks
    const { data: tasks } = await supabase
      .from("tasks")
      .select("id, dump_id")
      .not("dump_id", "is", null);

    if (tasks) {
      const tasksByDump = new Map<string, string[]>();
      for (const t of tasks) {
        const list = tasksByDump.get(t.dump_id) || [];
        list.push(t.id);
        tasksByDump.set(t.dump_id, list);
      }
      for (const dump of dumps) {
        dump.convertedToTaskIds = tasksByDump.get(dump.id) || [];
      }
    }

    set({ dumps, isLoading: false });
  },

  addDump: async (supabase, text, userId) => {
    const id = generateId();
    const now = Date.now();

    // Optimistic update
    const newDump: DumpEntry = {
      id,
      text,
      createdAt: now,
      convertedToTaskIds: [],
    };
    set((state) => ({ dumps: [newDump, ...state.dumps] }));

    // Background sync
    const { error } = await supabase.from("dumps").insert({
      id,
      user_id: userId,
      content: text,
    });

    if (error) {
      console.error("Failed to save dump:", error);
      // Don't rollback — optimistic local state is still valid
    }
  },

  deleteDump: async (supabase, id) => {
    // Optimistic remove
    set((state) => ({ dumps: state.dumps.filter((d) => d.id !== id) }));

    const { error } = await supabase.from("dumps").delete().eq("id", id);
    if (error) {
      console.error("Failed to delete dump:", error);
    }
  },

  markConverted: (dumpId, taskId) => {
    set((state) => ({
      dumps: state.dumps.map((d) =>
        d.id === dumpId
          ? { ...d, convertedToTaskIds: [...d.convertedToTaskIds, taskId] }
          : d
      ),
    }));
  },
}));
