import { useState, useEffect } from 'react';
import { Card } from './Card';
import { generateCards, checkMatch, isGameComplete } from '../utils/gameUtils';
import { Card as CardType, GameState } from '../types/game';
import './GameBoard.css';

export const GameBoard = () => {
  const [gameState, setGameState] = useState<GameState>({
    cards: generateCards(),
    score: 0,
    moves: 0,
    isGameOver: false,
    flippedCards: [],
  });

  const handleCardClick = (cardId: number) => {
    const { cards, flippedCards, moves } = gameState;
    
    // Ignore if card is already flipped, matched, or if we already have 2 flipped cards
    if (
      cards[cardId].isFlipped ||
      cards[cardId].isMatched ||
      flippedCards.length >= 2
    ) {
      return;
    }

    // Flip the clicked card
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

    // If we have 2 flipped cards, check for a match
    if (newFlippedCards.length === 2) {
      setTimeout(() => {
        const isMatch = checkMatch(newCards, newFlippedCards);
        const updatedCards = newCards.map((card, index) => ({
          ...card,
          isMatched: card.isMatched || (isMatch && newFlippedCards.includes(index)),
          isFlipped: card.isMatched || (isMatch && newFlippedCards.includes(index)),
        }));

        setGameState(prev => ({
          ...prev,
          cards: updatedCards,
          flippedCards: [],
          score: isMatch ? prev.score + 10 : prev.score - 1,
          isGameOver: isGameComplete(updatedCards),
        }));
      }, 1000);
    }
  };

  const resetGame = () => {
    setGameState({
      cards: generateCards(),
      score: 0,
      moves: 0,
      isGameOver: false,
      flippedCards: [],
    });
  };

  return (
    <div className="game-board">
      <div className="game-info">
        <div>Score: {gameState.score}</div>
        <div>Moves: {gameState.moves}</div>
        {gameState.isGameOver && (
          <div className="game-over">
            <h2>Game Over!</h2>
            <button onClick={resetGame}>Play Again</button>
          </div>
        )}
      </div>
      <div className="cards-grid">
        {gameState.cards.map((card) => (
          <Card
            key={card.id}
            card={card}
            onClick={() => handleCardClick(card.id)}
          />
        ))}
      </div>
    </div>
  );
}; 