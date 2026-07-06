// ─── Dump Store ──────────────────────────────────────────────────────
// Zustand store for brain dump entries, persisted to SQLite.

import { create } from 'zustand';
import type { Dump } from '@zenth/utils';
import { generateId } from '@zenth/utils';
import * as db from '@/lib/db';

interface DumpState {
  dumps: Dump[];
  isLoaded: boolean;

  // Actions
  loadDumps: () => Promise<void>;
  addDump: (text: string) => Promise<Dump>;
  removeDump: (id: string) => Promise<void>;
  markConverted: (dumpId: string, taskIds: string[]) => Promise<void>;
}

export const useDumpStore = create<DumpState>((set, get) => ({
  dumps: [],
  isLoaded: false,

  loadDumps: async () => {
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

    await db.insertDump(dump);
    set((state) => ({ dumps: [dump, ...state.dumps] }));
    return dump;
  },

  removeDump: async (id: string) => {
    await db.deleteDump(id);
    set((state) => ({
      dumps: state.dumps.filter((d) => d.id !== id),
    }));
  },

  markConverted: async (dumpId: string, taskIds: string[]) => {
    const dump = get().dumps.find((d) => d.id === dumpId);
    if (!dump) return;

    const updatedIds = [...dump.convertedToTaskIds, ...taskIds];
    await db.updateDumpTaskIds(dumpId, updatedIds);

    set((state) => ({
      dumps: state.dumps.map((d) =>
        d.id === dumpId ? { ...d, convertedToTaskIds: updatedIds } : d
      ),
    }));
  },
}));
