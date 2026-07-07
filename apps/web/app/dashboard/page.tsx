"use client";

import { useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { useSupabase } from "@/components/SupabaseProvider";
import { useDumpStore } from "@/store/dumpStore";
import { useTaskStore } from "@/store/taskStore";
import { DumpInput } from "@/components/DumpInput";
import { DumpCard } from "@/components/DumpCard";
import { EmptyState } from "@/components/EmptyState";
import { Brain } from "lucide-react";

export default function BrainDumpPage() {
  const { userId } = useAuth();
  const supabase = useSupabase();
  const { dumps, isLoading, loadDumps, addDump, deleteDump, markConverted } = useDumpStore();
  const { addTask } = useTaskStore();

  useEffect(() => {
    loadDumps(supabase);
  }, [supabase, loadDumps]);

  async function handleAddDump(text: string) {
    if (!userId) return;
    await addDump(supabase, text, userId);
  }

  async function handleConvert(dumpId: string, text: string) {
    if (!userId) return;
    const taskId = await addTask(supabase, text, userId, dumpId);
    markConverted(dumpId, taskId);
  }

  async function handleDelete(id: string) {
    await deleteDump(supabase, id);
  }

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">Brain Dump</h1>
        <p className="page-subtitle">Get it out of your head. Zero friction, zero judgment.</p>
      </div>

      <DumpInput onSubmit={handleAddDump} />

      {isLoading ? (
        <div className="dashboard-loading" style={{ minHeight: "200px" }}>
          <div className="loading-spinner" />
        </div>
      ) : dumps.length === 0 ? (
        <EmptyState
          icon={Brain}
          title="Your mind is clear"
          description="Type a thought above and hit Enter. That's it. No categories, no labels."
        />
      ) : (
        <div className="dumps-list">
          {dumps.map((dump) => (
            <DumpCard
              key={dump.id}
              id={dump.id}
              text={dump.text}
              createdAt={dump.createdAt}
              isConverted={dump.convertedToTaskIds.length > 0}
              onConvert={handleConvert}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </>
  );
}
