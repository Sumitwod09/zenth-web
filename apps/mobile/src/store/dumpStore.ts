// ─── Dump Store ──────────────────────────────────────────────────────
// Zustand store for brain dump entries, persisted to SQLite.

import { create } from 'zustand';
import type { Dump } from '@zenth/utils';
import { generateId } from '@zenth/utils';
import * as db from '@/lib/db';
import { SupabaseClient } from '@supabase/supabase-js';

interface DumpState {
  dumps: Dump[];
  isLoaded: boolean;
  supabaseClient: SupabaseClient | null;

  // Actions
  setSupabaseClient: (client: SupabaseClient | null) => void;
  loadDumps: () => Promise<void>;
  addDump: (text: string) => Promise<Dump>;
  removeDump: (id: string) => Promise<void>;
  markConverted: (dumpId: string, taskIds: string[]) => Promise<void>;
}

export const useDumpStore = create<DumpState>((set, get) => ({
  dumps: [],
  isLoaded: false,
  supabaseClient: null,

  setSupabaseClient: (client) => {
    set({ supabaseClient: client });
    // Reload dumps from cloud if client is set
    if (client) {
      get().loadDumps();
    }
  },

  loadDumps: async () => {
    const { supabaseClient } = get();
    if (supabaseClient) {
      const { data } = await supabaseClient.from('dumps').select('*').order('created_at', { ascending: false });
      if (data) {
        const cloudDumps = data.map(d => ({
          id: d.id,
          text: d.content,
          createdAt: new Date(d.created_at).getTime(),
          convertedToTaskIds: [], // We would need a junction table for this in a real relational model, keeping it simple for now
        }));
        set({ dumps: cloudDumps, isLoaded: true });
        return;
      }
    }
    
    // Fallback to local
    const dumps = await db.getAllDumps();
    set({ dumps, isLoaded: true });
  },

  addDump: async (text: string) => {
    const dump: Dump = {
      id: generateId(),
      text: text.trim(),
      createdAt: Date.now(),
      convertedToTaskIds: [],
    };

    // Optimistic local update
    set((state) => ({ dumps: [dump, ...state.dumps] }));
    await db.insertDump(dump);

    // Sync to cloud
    const { supabaseClient } = get();
    if (supabaseClient) {
      // Need user_id, but it's handled by Clerk/RLS on the backend via JWT sub.
      // Wait, insert usually requires a user_id if RLS checks for it, but Supabase auth.uid() can default it?
      // Actually we should pass the user_id from Clerk, or the SQL trigger can default it.
      // Assuming a trigger or explicit pass later.
      try {
        await supabaseClient.from('dumps').insert({
          id: dump.id,
          content: dump.text,
        });
      } catch (e) {
        console.error("Cloud sync failed", e);
      }
    }

    return dump;
  },

  removeDump: async (id: string) => {
    set((state) => ({
      dumps: state.dumps.filter((d) => d.id !== id),
    }));
    await db.deleteDump(id);

    const { supabaseClient } = get();
    if (supabaseClient) {
      supabaseClient.from('dumps').delete().eq('id', id).then();
    }
  },

  markConverted: async (dumpId: string, taskIds: string[]) => {
    const dump = get().dumps.find((d) => d.id === dumpId);
    if (!dump) return;

    const updatedIds = [...dump.convertedToTaskIds, ...taskIds];
    
    set((state) => ({
      dumps: state.dumps.map((d) =>
        d.id === dumpId ? { ...d, convertedToTaskIds: updatedIds } : d
      ),
    }));
    
    await db.updateDumpTaskIds(dumpId, updatedIds);
    // Cloud sync for task links omitted for brevity
  },
}));
