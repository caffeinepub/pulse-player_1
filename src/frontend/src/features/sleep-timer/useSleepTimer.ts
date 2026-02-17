import { useState, useEffect, useRef } from 'react';
import { usePlayer } from '../player/PlayerProvider';

export type SleepDuration = 5 | 10 | 15 | 30 | 60;

export function useSleepTimer() {
  const [isActive, setIsActive] = useState(false);
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const { pause } = usePlayer();
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isActive && remainingSeconds > 0) {
      timerRef.current = setInterval(() => {
        setRemainingSeconds(prev => {
          if (prev <= 1) {
            pause();
            setIsActive(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isActive, remainingSeconds, pause]);

  function start(minutes: SleepDuration) {
    setRemainingSeconds(minutes * 60);
    setIsActive(true);
  }

  function cancel() {
    setIsActive(false);
    setRemainingSeconds(0);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  }

  return {
    isActive,
    remainingSeconds,
    start,
    cancel,
  };
}
