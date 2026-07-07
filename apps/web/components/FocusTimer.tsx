"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Play, Pause, RotateCcw } from "lucide-react";
import { formatTimerDisplay } from "@zenth/utils";

interface FocusTimerProps {
  durationMinutes: number;
  onComplete: () => void;
  size?: number;
}

export function FocusTimer({ durationMinutes, onComplete, size = 220 }: FocusTimerProps) {
  const totalSeconds = durationMinutes * 60;
  const [secondsLeft, setSecondsLeft] = useState(totalSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const hasCompletedRef = useRef(false);

  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = secondsLeft / totalSeconds;
  const offset = circumference - progress * circumference;

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            clearTimer();
            setIsRunning(false);
            if (!hasCompletedRef.current) {
              hasCompletedRef.current = true;
              setTimeout(() => onComplete(), 0);
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearTimer();
    }
    return clearTimer;
  }, [isRunning, clearTimer, onComplete]);

  // Reset when duration changes
  useEffect(() => {
    setSecondsLeft(durationMinutes * 60);
    setIsRunning(false);
    hasCompletedRef.current = false;
    clearTimer();
  }, [durationMinutes, clearTimer]);

  function handleReset() {
    setSecondsLeft(totalSeconds);
    setIsRunning(false);
    hasCompletedRef.current = false;
    clearTimer();
  }

  function toggleRunning() {
    if (secondsLeft === 0) {
      handleReset();
      return;
    }
    setIsRunning((prev) => !prev);
  }

  return (
    <div className="focus-timer" id="focus-timer">
      <div className="focus-timer-ring">
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <circle
            className="timer-ring-track"
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={strokeWidth}
            fill="none"
          />
          <circle
            className={`timer-ring-fill ${secondsLeft === 0 ? "complete" : ""}`}
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
            style={{ transition: isRunning ? "stroke-dashoffset 1s linear" : "stroke-dashoffset 0.3s ease" }}
          />
        </svg>
        <div className="focus-timer-display">
          <span className="focus-timer-time">{formatTimerDisplay(secondsLeft)}</span>
          <span className="focus-timer-label">
            {secondsLeft === 0 ? "Time's up!" : isRunning ? "Focusing..." : "Ready"}
          </span>
        </div>
      </div>

      <div className="focus-timer-controls">
        <button
          className="timer-btn secondary"
          onClick={handleReset}
          aria-label="Reset timer"
          disabled={secondsLeft === totalSeconds && !isRunning}
        >
          <RotateCcw size={18} strokeWidth={2} />
        </button>
        <button
          className={`timer-btn primary ${isRunning ? "running" : ""}`}
          onClick={toggleRunning}
          aria-label={isRunning ? "Pause" : "Start"}
        >
          {isRunning ? (
            <Pause size={22} strokeWidth={2} />
          ) : (
            <Play size={22} strokeWidth={2} />
          )}
        </button>
      </div>
    </div>
  );
}
