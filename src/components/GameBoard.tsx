import { useState } from 'react';
import { Card } from './Card';
import { Timer } from './Timer';
import { GameControls } from './GameControls';
import { generateCards, checkMatch, isGameComplete } from '../utils/gameUtils';
import { Card as CardType, GameState } from '../types/game';
import { useAuthStore } from '../store/authStore';
import { useTimerStore } from '../store/timerStore';

export const GameBoard = () => {
  const updateHighScore = useAuthStore((state) => state.updateHighScore);
  const { start: startTimer, stop: stopTimer, reset: resetTimer } = useTimerStore();
  const [gameState, setGameState] = useState<GameState>({
    cards: generateCards(),
    score: 0,
    moves: 0,
    isGameOver: false,
    flippedCards: [],
    status: 'idle',
  });

  const handlePlay = () => {
    if (gameState.status === 'idle') {
      setGameState(prev => ({
        ...prev,
        cards: generateCards(),
        status: 'playing'
      }));
    } else {
      setGameState(prev => ({ ...prev, status: 'playing' }));
    }
    startTimer();
  };

  const handlePause = () => {
    setGameState(prev => ({ ...prev, status: 'paused' }));
    stopTimer();
  };

  const handleEnd = () => {
    setGameState(prev => ({ ...prev, status: 'ended', isGameOver: true }));
    stopTimer();
    updateHighScore(gameState.score);
  };

  const resetGame = () => {
    setGameState({
      cards: generateCards(),
      score: 0,
      moves: 0,
      isGameOver: false,
      flippedCards: [],
      status: 'idle',
    });
    resetTimer();
  };

  const handleCardClick = (cardId: number) => {
    if (gameState.status !== 'playing') return;
    
    const { cards, flippedCards, moves } = gameState;
    
    if (
      cards[cardId].isFlipped ||
      cards[cardId].isMatched ||
      flippedCards.length >= 2
    ) {
      return;
    }

    const newCards = cards.map((card, index) =>
      index === cardId ? { ...card, isFlipped: true } : card
    );

    const newFlippedCards = [...flippedCards, cardId];
    setGameState(prev => ({
      ...prev,
      cards: newCards,
      flippedCards: newFlippedCards,
      moves: prev.moves + 1,
    }));

    if (newFlippedCards.length === 2) {
      setTimeout(() => {
        const isMatch = checkMatch(newCards, newFlippedCards);
        const updatedCards = newCards.map((card, index) => ({
          ...card,
          isMatched: card.isMatched || (isMatch && newFlippedCards.includes(index)),
          isFlipped: card.isMatched || (isMatch && newFlippedCards.includes(index)),
        }));

        const newScore = isMatch ? gameState.score + 10 : gameState.score - 1;
        const isGameOver = isGameComplete(updatedCards);

        setGameState(prev => ({
          ...prev,
          cards: updatedCards,
          flippedCards: [],
          score: newScore,
          isGameOver,
          status: isGameOver ? 'ended' : 'playing',
        }));

        if (isGameOver) {
          stopTimer();
          updateHighScore(newScore);
        }
      }, 1000);
    }
  };

  return (
    <div className="flex flex-col items-center p-5">
      <div className="flex flex-col items-center gap-4 mb-5">
        {gameState.status !== 'idle' && (
          <div className="flex gap-5 text-2xl font-bold text-gray-800">
            <div>Score: {gameState.score}</div>
            <div>Moves: {gameState.moves}</div>
            <Timer />
          </div>
        )}
        
        <GameControls
          status={gameState.status}
          onPlay={handlePlay}
          onPause={handlePause}
          onEnd={handleEnd}
          onReset={resetGame}
        />
      </div>

      {gameState.status !== 'idle' && (
        <div className="grid grid-cols-4 gap-2.5 max-w-[500px]">
          {gameState.cards.map((card) => (
            <Card
              key={card.id}
              card={card}
              onClick={() => handleCardClick(card.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}; 