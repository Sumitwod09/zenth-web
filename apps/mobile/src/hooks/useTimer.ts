// ─── Focus Timer Hook ────────────────────────────────────────────────
// Countdown timer for Focus Mode with start, pause, resume, and reset.

import { useRef, useState, useCallback, useEffect } from 'react';

type TimerStatus = 'idle' | 'running' | 'paused' | 'completed';

interface UseTimerReturn {
  secondsRemaining: number;
  totalSeconds: number;
  status: TimerStatus;
  progress: number; // 0 to 1
  start: () => void;
  pause: () => void;
  resume: () => void;
  reset: () => void;
  stop: () => void;
}

export function useTimer(durationMinutes: number): UseTimerReturn {
  const totalSeconds = durationMinutes * 60;
  const [secondsRemaining, setSecondsRemaining] = useState(totalSeconds);
  const [status, setStatus] = useState<TimerStatus>('idle');
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const start = useCallback(() => {
    setSecondsRemaining(totalSeconds);
    setStatus('running');
    clearTimer();
    intervalRef.current = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearTimer();
          setStatus('completed');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [totalSeconds, clearTimer]);

  const pause = useCallback(() => {
    if (status !== 'running') return;
    clearTimer();
    setStatus('paused');
  }, [status, clearTimer]);

  const resume = useCallback(() => {
    if (status !== 'paused') return;
    setStatus('running');
    intervalRef.current = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearTimer();
          setStatus('completed');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [status, clearTimer]);

  const reset = useCallback(() => {
    clearTimer();
    setSecondsRemaining(totalSeconds);
    setStatus('idle');
  }, [totalSeconds, clearTimer]);

  const stop = useCallback(() => {
    clearTimer();
    setStatus('idle');
    setSecondsRemaining(totalSeconds);
  }, [totalSeconds, clearTimer]);

  // Cleanup on unmount
  useEffect(() => {
    return () => clearTimer();
  }, [clearTimer]);

  // Reset when duration changes
  useEffect(() => {
    if (status === 'idle') {
      setSecondsRemaining(totalSeconds);
    }
  }, [totalSeconds, status]);

  const progress =
    totalSeconds > 0 ? (totalSeconds - secondsRemaining) / totalSeconds : 0;

  return {
    secondsRemaining,
    totalSeconds,
    status,
    progress,
    start,
    pause,
    resume,
    reset,
    stop,
  };
}
