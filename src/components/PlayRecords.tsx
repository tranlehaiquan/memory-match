import { motion } from 'framer-motion';
import { useRecordsStore } from '../store/recordsStore';

export const PlayRecords = () => {
  const records = useRecordsStore((state) => state.records);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md bg-white rounded-lg shadow-lg p-6"
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Recent Games</h2>
      <div className="space-y-3">
        {records.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No games played yet!</p>
        ) : (
          records.map((record) => (
            <motion.div
              key={record.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className={`p-4 rounded-lg ${
                record.won ? 'bg-green-50' : 'bg-red-50'
              }`}
            >
              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-800">
                  {record.playerName}
                </span>
                <span className="text-sm text-gray-500">
                  {formatDate(record.completedAt)}
                </span>
              </div>
              <div className="mt-2 grid grid-cols-3 gap-2 text-sm">
                <div>
                  <span className="text-gray-500">Score:</span>
                  <span className="ml-1 font-medium text-gray-800">
                    {record.score}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">Moves:</span>
                  <span className="ml-1 font-medium text-gray-800">
                    {record.moves}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">Time:</span>
                  <span className="ml-1 font-medium text-gray-800">
                    {formatTime(record.timeElapsed)}
                  </span>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );
}; 