import { Card, GameDifficulty } from '../types/game';

// Card counts for different difficulties
const DIFFICULTY_CONFIG = {
  easy: 8, // 8 pairs (16 cards total)
  medium: 12, // 12 pairs (24 cards total)
  hard: 18, // 18 pairs (36 cards total)
};

export const generateCards = (difficulty: GameDifficulty = 'easy'): Card[] => {
  const numPairs = DIFFICULTY_CONFIG[difficulty];
  const values = Array.from({ length: numPairs }, (_, i) => i + 1);
  const pairs = [...values, ...values];
  const shuffled = pairs.sort(() => Math.random() - 0.5);

  return shuffled.map((value, index) => ({
    id: index,
    value,
    isFlipped: false,
    isMatched: false,
  }));
};

export const checkMatch = (cards: Card[], flippedIds: number[]): boolean => {
  if (flippedIds.length !== 2) return false;
  const [first, second] = flippedIds;
  return cards[first].value === cards[second].value;
};

export const isGameComplete = (cards: Card[]): boolean => {
  return cards.every(card => card.isMatched);
};
