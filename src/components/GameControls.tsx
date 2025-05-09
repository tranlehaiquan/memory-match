interface GameControlsProps {
  status: 'idle' | 'playing' | 'paused' | 'ended';
  onPlay: () => void;
  onPause: () => void;
  onEnd: () => void;
  onReset: () => void;
}

export const GameControls = ({ status, onPlay, onPause, onEnd, onReset }: GameControlsProps) => {
  return (
    <div className="flex gap-3">
      {status === 'playing' && (
        <>
          <button
            onClick={onPause}
            className="bg-yellow-500 text-white px-6 py-2 rounded-md hover:bg-yellow-600 transition-colors"
          >
            Pause
          </button>
          <button
            onClick={onEnd}
            className="bg-red-500 text-white px-6 py-2 rounded-md hover:bg-red-600 transition-colors"
          >
            End
          </button>
        </>
      )}
      
      {status === 'paused' && (
        <>
          <button
            onClick={onPlay}
            className="bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600 transition-colors"
          >
            Resume
          </button>
          <button
            onClick={onEnd}
            className="bg-red-500 text-white px-6 py-2 rounded-md hover:bg-red-600 transition-colors"
          >
            End
          </button>
        </>
      )}
      
      {status === 'ended' && (
        <button
          onClick={onReset}
          className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition-colors"
        >
          Play Again
        </button>
      )}
    </div>
  );
}; 