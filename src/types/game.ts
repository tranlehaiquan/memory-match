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

export interface PlayRecord {
  id: string;
  playerName: string;
  score: number;
  moves: number;
  timeElapsed: number;
  completedAt: string;
  won: boolean;
} 