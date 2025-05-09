import { useEffect } from 'react';
import { useTimerStore } from '../store/timerStore';

export const Timer = () => {
  const { time, isRunning, start, stop, reset } = useTimerStore();

  useEffect(() => {
    let intervalId: number;

    if (isRunning) {
      intervalId = window.setInterval(() => {
        useTimerStore.getState().tick();
      }, 1000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isRunning]);

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-white p-2 rounded-lg shadow-md">
      <div className="text-xl font-mono font-bold text-center">
        {formatTime(time)}
      </div>
    </div>
  );
}; 