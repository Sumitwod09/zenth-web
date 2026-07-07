"use client";

import { Check, Trash2, RotateCcw } from "lucide-react";
import { formatRelative } from "@zenth/utils";

interface TaskCardProps {
  id: string;
  title: string;
  status: "pending" | "completed";
  createdAt: number;
  completedAt: number | null;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export function TaskCard({
  id,
  title,
  status,
  createdAt,
  completedAt,
  onToggle,
  onDelete,
}: TaskCardProps) {
  const isDone = status === "completed";

  return (
    <div className={`task-card ${isDone ? "done" : ""}`} id={`task-${id}`}>
      <button
        className={`task-checkbox ${isDone ? "checked" : ""}`}
        onClick={() => onToggle(id)}
        aria-label={isDone ? "Mark as pending" : "Mark as done"}
      >
        {isDone ? (
          <Check size={14} strokeWidth={3} />
        ) : null}
      </button>

      <div className="task-card-content">
        <p className={`task-card-title ${isDone ? "strikethrough" : ""}`}>{title}</p>
        <span className="task-card-time">
          {isDone && completedAt
            ? `Done ${formatRelative(completedAt)}`
            : formatRelative(createdAt)}
        </span>
      </div>

      <div className="task-card-actions">
        {isDone && (
          <button
            className="task-action-btn"
            onClick={() => onToggle(id)}
            aria-label="Undo completion"
            title="Undo"
          >
            <RotateCcw size={14} strokeWidth={2} />
          </button>
        )}
        <button
          className="task-action-btn danger"
          onClick={() => onDelete(id)}
          aria-label="Delete task"
          title="Delete"
        >
          <Trash2 size={14} strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}
