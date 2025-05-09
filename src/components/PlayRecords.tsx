import { motion } from 'framer-motion';
import { useRecordsStore } from '../store/recordsStore';
import { formatTime } from '../utils/formatTime';

export const PlayRecords = () => {
  const records = useRecordsStore((state) => state.records);

  if (records.length === 0) {
    return (
      <div className="w-full h-full bg-white rounded-xl shadow-md p-4 overflow-auto">
        <h2 className="text-xl font-bold text-blue-700 mb-3">Recent Games</h2>
        <div className="w-full p-4 bg-blue-50 rounded-lg text-center text-gray-600">
          No games played yet
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-white rounded-xl shadow-md p-4 overflow-auto">
      <h2 className="text-xl font-bold text-blue-700 mb-3">Recent Games</h2>
      <ul className="space-y-2 overflow-y-auto custom-scrollbar">
        {records.map((record) => (
          <motion.li
            key={record.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`p-3 rounded-lg border ${
              record.won
                ? 'border-green-200 bg-green-50'
                : 'border-red-200 bg-red-50'
            }`}
          >
            <div className="flex justify-between items-center mb-1">
              <span className="font-semibold text-gray-800">{record.playerName}</span>
              <span className="text-xs text-gray-500">
                {new Date(record.completedAt).toLocaleDateString()}
              </span>
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
              <div>
                <span className="text-gray-600">Score:</span>{' '}
                <span className="font-medium">{record.score}</span>
              </div>
              <div>
                <span className="text-gray-600">Moves:</span>{' '}
                <span className="font-medium">{record.moves}</span>
              </div>
              <div>
                <span className="text-gray-600">Time:</span>{' '}
                <span className="font-medium">{formatTime(record.timeElapsed)}</span>
              </div>
              {record.difficulty && (
                <div>
                  <span className="text-gray-600">Difficulty:</span>{' '}
                  <span className="font-medium capitalize">{record.difficulty}</span>
                </div>
              )}
            </div>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}; 