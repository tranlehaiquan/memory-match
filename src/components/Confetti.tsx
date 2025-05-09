import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface ConfettiPiece {
  id: number;
  icon: string;
  x: number;
  delay: number;
  duration: number;
  size: number;
  rotation: number;
}

interface ConfettiProps {
  isActive: boolean;
}

const ICONS = [
  '🎉',
  '🎊',
  '🏆',
  '⭐',
  '✨',
  '🌟',
  '💯',
  '🥇',
  '👑',
  '🎮',
  '🎯',
  '🎪',
  '🎨',
  '🎭',
  '🎪',
  '🎡',
  '🎠',
  '🧨',
  '🎇',
  '🎆',
];

export const Confetti = ({ isActive }: ConfettiProps) => {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);

  useEffect(() => {
    if (isActive) {
      const newPieces = Array.from({ length: 250 }).map((_, index) => ({
        id: index,
        icon: ICONS[Math.floor(Math.random() * ICONS.length)],
        x: Math.random() * 100, // random horizontal position (%)
        delay: Math.random() * 1.5, // short delay for denser appearance
        duration: 3 + Math.random() * 5, // longer duration for extended rain effect
        size: 32 + Math.random() * 40, // random size (px)
        rotation: Math.random() * 720 - 360, // rotation variation
      }));
      setPieces(newPieces);
    } else {
      setPieces([]);
    }
  }, [isActive]);

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-30">
      {pieces.map(piece => (
        <motion.div
          key={piece.id}
          initial={{
            y: Math.random() * -100 - 50, // Varied starting positions
            x: `${piece.x}vw`,
            opacity: 1,
            rotate: piece.rotation,
            scale: 0,
          }}
          animate={{
            y: '110vh',
            opacity: [1, 1, 0.9, 0.8, 0.7, 0],
            rotate: piece.rotation + (Math.random() > 0.5 ? 360 : -360),
            scale: [0, 1, 1, 0.9, 0.8],
          }}
          transition={{
            duration: piece.duration,
            delay: piece.delay,
            ease: 'easeOut', // Changed to easeOut for slower finish
          }}
          className="absolute top-0 select-none"
          style={{ fontSize: piece.size }}
        >
          {piece.icon}
        </motion.div>
      ))}
    </div>
  );
};
