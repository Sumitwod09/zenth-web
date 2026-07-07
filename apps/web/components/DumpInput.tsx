"use client";

import { useState, useRef, useEffect, KeyboardEvent } from "react";
import { Send } from "lucide-react";

interface DumpInputProps {
  onSubmit: (text: string) => void;
  isLoading?: boolean;
}

export function DumpInput({ onSubmit, isLoading }: DumpInputProps) {
  const [text, setText] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = "auto";
      el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
    }
  }, [text]);

  function handleSubmit() {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;
    onSubmit(trimmed);
    setText("");
    textareaRef.current?.focus();
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  }

  return (
    <div className="dump-input-wrapper" id="dump-input">
      <textarea
        ref={textareaRef}
        className="dump-textarea"
        placeholder="What's on your mind? Just dump it here..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        rows={1}
        disabled={isLoading}
      />
      <button
        className="dump-send-btn"
        onClick={handleSubmit}
        disabled={!text.trim() || isLoading}
        aria-label="Send"
      >
        <Send size={18} strokeWidth={2} />
      </button>
    </div>
  );
}
