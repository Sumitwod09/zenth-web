"use client";

import { ArrowRight, Trash2 } from "lucide-react";
import { formatRelative } from "@zenth/utils";

interface DumpCardProps {
  id: string;
  text: string;
  createdAt: number;
  isConverted: boolean;
  onConvert: (id: string, text: string) => void;
  onDelete: (id: string) => void;
}

export function DumpCard({
  id,
  text,
  createdAt,
  isConverted,
  onConvert,
  onDelete,
}: DumpCardProps) {
  return (
    <div className={`dump-card ${isConverted ? "converted" : ""}`} id={`dump-${id}`}>
      <div className="dump-card-content">
        <p className="dump-card-text">{text}</p>
        <span className="dump-card-time">{formatRelative(createdAt)}</span>
      </div>
      <div className="dump-card-actions">
        {isConverted ? (
          <span className="dump-converted-badge">✓ Task created</span>
        ) : (
          <button
            className="dump-convert-btn"
            onClick={() => onConvert(id, text)}
            aria-label="Convert to task"
          >
            <span>Make it a task</span>
            <ArrowRight size={14} strokeWidth={2} />
          </button>
        )}
        <button
          className="dump-delete-btn"
          onClick={() => onDelete(id)}
          aria-label="Delete dump"
        >
          <Trash2 size={14} strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}
