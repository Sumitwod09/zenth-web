"use client";

import { useEffect, useCallback } from "react";
import { useAuth } from "@clerk/nextjs";
import { useSupabase } from "@/components/SupabaseProvider";
import { useTaskStore } from "@/store/taskStore";
import { useSettingsStore } from "@/store/settingsStore";
import { FocusTimer } from "@/components/FocusTimer";
import { EmptyState } from "@/components/EmptyState";
import { Check, SkipForward, PartyPopper, Zap } from "lucide-react";

export default function DoNowPage() {
  const { userId } = useAuth();
  const supabase = useSupabase();
  const { tasks, isLoading, loadTasks, toggleTask } = useTaskStore();
  const { focusDuration, loadSettings } = useSettingsStore();

  const currentTask = useTaskStore((s) => s.getCurrentDoNowTask());

  useEffect(() => {
    loadTasks(supabase);
    if (userId) {
      loadSettings(supabase, userId);
    }
  }, [supabase, userId, loadTasks, loadSettings]);

  const handleTimerComplete = useCallback(() => {
    // Timer completed — could add notification sound here
  }, []);

  async function handleDone() {
    if (!currentTask) return;
    await toggleTask(supabase, currentTask.id);
  }

  function handleSkip() {
    // Move current task to end of list by toggling active tasks order
    // For MVP, we just show the next task (tasks are ordered by created_at ASC)
    // The current task stays pending but we can shift the view
    if (!currentTask) return;
    // Re-load to get the natural next task
    loadTasks(supabase);
  }

  if (isLoading) {
    return (
      <div className="dashboard-loading" style={{ minHeight: "400px" }}>
        <div className="loading-spinner" />
      </div>
    );
  }

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">Do Now</h1>
        <p className="page-subtitle">One task. Full focus. No distractions.</p>
      </div>

      {!currentTask ? (
        <EmptyState
          icon={PartyPopper}
          title="All caught up! 🎉"
          description="No pending tasks. Go to Brain Dump to capture new thoughts, or enjoy the moment."
        />
      ) : (
        <div className="do-now-container">
          <div className="focus-task-card">
            <p className="focus-task-label">Currently Focusing On</p>
            <h2 className="focus-task-title">{currentTask.title}</h2>
          </div>

          <FocusTimer
            durationMinutes={focusDuration}
            onComplete={handleTimerComplete}
          />

          <div className="focus-actions">
            <button className="focus-btn done" onClick={handleDone} id="btn-mark-done">
              <Check size={18} strokeWidth={2.5} />
              Done
            </button>
            <button className="focus-btn skip" onClick={handleSkip} id="btn-skip-task">
              <SkipForward size={18} strokeWidth={2} />
              Skip
            </button>
          </div>
        </div>
      )}
    </>
  );
}
