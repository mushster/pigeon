import { useCallback, useEffect, useRef, useState } from 'react';
import type { TimerConfig } from '../types';

interface UseTimerResult {
  secondsRemaining: number;
  isExpired: boolean;
  isRunning: boolean;
  start: () => void;
  pause: () => void;
  reset: () => void;
}

export function useTimer(config: TimerConfig): UseTimerResult {
  const [secondsRemaining, setSecondsRemaining] = useState(config.minutes * 60);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<number | null>(null);

  const clearTick = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const start = useCallback(() => {
    if (!config.enabled) return;
    setIsRunning(true);
  }, [config.enabled]);

  const pause = useCallback(() => {
    setIsRunning(false);
    clearTick();
  }, [clearTick]);

  const reset = useCallback(() => {
    clearTick();
    setSecondsRemaining(config.minutes * 60);
    setIsRunning(false);
  }, [config.minutes, clearTick]);

  useEffect(() => {
    if (!isRunning || secondsRemaining <= 0) {
      clearTick();
      return;
    }

    intervalRef.current = window.setInterval(() => {
      setSecondsRemaining((s) => {
        if (s <= 1) {
          clearTick();
          setIsRunning(false);
          return 0;
        }
        return s - 1;
      });
    }, 1000);

    return clearTick;
  }, [isRunning, secondsRemaining, clearTick]);

  // Reset when config changes
  useEffect(() => {
    setSecondsRemaining(config.minutes * 60);
    setIsRunning(false);
    clearTick();
  }, [config.minutes, config.enabled, clearTick]);

  return {
    secondsRemaining,
    isExpired: config.enabled && secondsRemaining <= 0,
    isRunning,
    start,
    pause,
    reset,
  };
}
