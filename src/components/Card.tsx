import { motion } from 'framer-motion';
import { Card as CardType } from '../types/game';

interface CardProps {
  card: CardType;
  onClick: () => void;
}

export const Card = ({ card, onClick }: CardProps) => {
  return (
    <motion.div
      className="aspect-square relative cursor-pointer perspective-1000"
      onClick={onClick}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      layout
    >
      <motion.div
        className="w-full h-full relative transform-style-3d"
        initial={false}
        animate={{ rotateY: card.isFlipped ? 180 : 0 }}
        transition={{ duration: 0.5, type: "spring", stiffness: 300, damping: 30 }}
      >
        {/* Front of card (question mark side) */}
        <motion.div
          className="absolute w-full h-full backface-hidden flex items-center justify-center
            rounded-lg text-2xl font-bold bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-md"
        >
          ?
        </motion.div>

        {/* Back of card (number side) */}
        <motion.div
          className={`absolute w-full h-full backface-hidden flex items-center justify-center
            rounded-lg text-2xl font-bold text-white rotate-y-180 shadow-md
            ${card.isMatched 
              ? 'bg-gradient-to-br from-green-500 to-green-600' 
              : 'bg-gradient-to-br from-purple-500 to-purple-600'
            }`}
        >
          {card.value}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}; 