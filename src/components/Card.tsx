import { motion } from 'framer-motion';
import { Card as CardType } from '../types/game';

interface CardProps {
  card: CardType;
  onClick: () => void;
}

export const Card = ({ card, onClick }: CardProps) => {
  return (
    <motion.div
      className="w-[100px] h-[100px] relative cursor-pointer perspective-1000"
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      layout
    >
      <motion.div
        className="w-full h-full relative transform-style-3d"
        initial={false}
        animate={{ rotateY: card.isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 300, damping: 30 }}
      >
        {/* Front of card (question mark side) */}
        <motion.div
          className="absolute w-full h-full backface-hidden flex items-center justify-center
            rounded-lg text-2xl font-bold bg-blue-500 text-white"
        >
          ?
        </motion.div>

        {/* Back of card (number side) */}
        <motion.div
          className={`absolute w-full h-full backface-hidden flex items-center justify-center
            rounded-lg text-2xl font-bold text-white rotate-y-180
            ${card.isMatched ? 'bg-green-500' : 'bg-purple-500'}`}
        >
          {card.value}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}; 