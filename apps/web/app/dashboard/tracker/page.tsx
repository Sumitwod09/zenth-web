"use client";

import { useEffect, useState } from "react";
import { useSupabase } from "@/components/SupabaseProvider";
import { useTaskStore, TrackerFilter } from "@/store/taskStore";
import { TaskCard } from "@/components/TaskCard";
import { ProgressRing } from "@/components/ProgressRing";
import { EmptyState } from "@/components/EmptyState";
import { CheckCircle2, ListTodo, Calendar } from "lucide-react";

const filterConfig: { key: TrackerFilter; label: string }[] = [
  { key: "today", label: "Today" },
  { key: "upcoming", label: "Upcoming" },
  { key: "completed", label: "Completed" },
];

const emptyMessages: Record<TrackerFilter, { title: string; desc: string; icon: typeof ListTodo }> = {
  today: {
    title: "No tasks for today",
    desc: "Convert some brain dumps into tasks to get started.",
    icon: ListTodo,
  },
  upcoming: {
    title: "Nothing upcoming",
    desc: "Your future is wide open. Add tasks from your brain dump.",
    icon: Calendar,
  },
  completed: {
    title: "No completed tasks yet",
    desc: "Head to Do Now and knock out your first task!",
    icon: CheckCircle2,
  },
};

export default function TrackerPage() {
  const supabase = useSupabase();
  const { tasks, isLoading, loadTasks, toggleTask, deleteTask, getFilteredTasks, getTodayProgress } =
    useTaskStore();
  const [activeFilter, setActiveFilter] = useState<TrackerFilter>("today");

  useEffect(() => {
    loadTasks(supabase);
  }, [supabase, loadTasks]);

  const filteredTasks = getFilteredTasks(activeFilter);
  const todayProgress = getTodayProgress();

  async function handleToggle(id: string) {
    await toggleTask(supabase, id);
  }

  async function handleDelete(id: string) {
    await deleteTask(supabase, id);
  }

  const emptyInfo = emptyMessages[activeFilter];

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">Tracker</h1>
        <p className="page-subtitle">See your progress. Today, upcoming, and completed.</p>
      </div>

      <div className="tracker-stats">
        <ProgressRing
          progress={todayProgress.percentage}
          size={90}
          strokeWidth={7}
          label="today"
        />
        <div className="tracker-stats-text">
          <h3>
            {todayProgress.done} of {todayProgress.total} tasks done
          </h3>
          <p>
            {todayProgress.total === 0
              ? "Add tasks to start tracking your day"
              : todayProgress.done === todayProgress.total
              ? "Amazing work! You've crushed it today 🔥"
              : "Keep going, you're making progress!"}
          </p>
        </div>
      </div>

      <div className="filter-tabs" id="tracker-filter-tabs">
        {filterConfig.map((f) => (
          <button
            key={f.key}
            className={`filter-tab ${activeFilter === f.key ? "active" : ""}`}
            onClick={() => setActiveFilter(f.key)}
            id={`filter-${f.key}`}
          >
            {f.label}
            {f.key !== "completed" && activeFilter === f.key && (
              <span> ({filteredTasks.length})</span>
            )}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="dashboard-loading" style={{ minHeight: "200px" }}>
          <div className="loading-spinner" />
        </div>
      ) : filteredTasks.length === 0 ? (
        <EmptyState
          icon={emptyInfo.icon}
          title={emptyInfo.title}
          description={emptyInfo.desc}
        />
      ) : (
        <div className="tasks-list">
          {filteredTasks.map((task) => (
            <TaskCard
              key={task.id}
              id={task.id}
              title={task.title}
              status={task.status}
              createdAt={task.createdAt}
              completedAt={task.completedAt}
              onToggle={handleToggle}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </>
  );
}
