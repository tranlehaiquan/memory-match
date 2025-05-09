import { useTimerStore } from '../store/timerStore';

export const Timer = () => {
  const elapsedTime = useTimerStore(state => state.elapsedTime);

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-gray-600 font-medium">Time:</span>
      <span className="text-2xl font-mono font-bold text-gray-900">{formatTime(elapsedTime)}</span>
    </div>
  );
};
