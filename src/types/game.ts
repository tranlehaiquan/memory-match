export interface Card {
  id: number;
  value: number;
  isFlipped: boolean;
  isMatched: boolean;
}

export interface GameState {
  cards: Card[];
  score: number;
  moves: number;
  isGameOver: boolean;
  flippedCards: number[];
  status: 'idle' | 'playing' | 'paused' | 'ended';
} 