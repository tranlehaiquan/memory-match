import { motion, AnimatePresence } from 'framer-motion';
import { Confetti } from './Confetti';

interface GameOverlayProps {
  status: 'idle' | 'playing' | 'paused' | 'ended';
  score: number;
  isWinner: boolean;
  onPlayAgain: () => void;
}

export const GameOverlay = ({ status, score, isWinner, onPlayAgain }: GameOverlayProps) => {
  return (
    <>
      <Confetti isActive={status === 'ended' && isWinner} />
      
      <AnimatePresence mode="wait">
        {status === 'ended' && (
          <motion.div
            key="end"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center bg-black/50 z-40"
          >
            <motion.div
              className="bg-white p-8 rounded-xl shadow-xl text-center"
              initial={{ y: 50, scale: 0.8 }}
              animate={{ y: 0, scale: 1 }}
              transition={{ type: "spring", duration: 0.5 }}
            >
              <motion.h2
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className={`text-4xl font-bold mb-4 ${isWinner ? 'text-green-600' : 'text-blue-600'}`}
              >
                {isWinner ? '🎉 Congratulations!' : 'Game Over!'}
              </motion.h2>
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-xl text-gray-600 mb-4"
              >
                Final Score: {score}
              </motion.p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-blue-500 text-white px-8 py-3 rounded-lg text-lg font-semibold"
                onClick={onPlayAgain}
              >
                Play Again
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}; 