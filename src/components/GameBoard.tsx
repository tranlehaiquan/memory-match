import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from './Card';
import { Timer } from './Timer';
import { GameControls } from './GameControls';
import { GameOverlay } from './GameOverlay';
import { UserProfile } from './UserProfile';
import { PlayRecords } from './PlayRecords';
import { generateCards, checkMatch, isGameComplete } from '../utils/gameUtils';
import { GameState, GameDifficulty } from '../types/game';
import { useAuthStore } from '../store/authStore';
import { useTimerStore } from '../store/timerStore';
import { useRecordsStore } from '../store/recordsStore';

export const GameBoard = () => {
  const { username } = useAuthStore();
  const addRecord = useRecordsStore(state => state.addRecord);
  const { start: startTimer, stop: stopTimer, reset: resetTimer, elapsedTime } = useTimerStore();
  const [gameState, setGameState] = useState<GameState>({
    cards: generateCards(),
    score: 0,
    moves: 0,
    isGameOver: false,
    flippedCards: [],
    status: 'idle',
    difficulty: 'easy',
  });

  const updateHighScore = useAuthStore(state => state.updateHighScore);

  const handleDifficultyChange = (difficulty: GameDifficulty) => {
    setGameState(prev => ({
      ...prev,
      difficulty,
      cards: generateCards(difficulty),
    }));
  };

  const handleStartGame = () => {
    setGameState(prev => ({
      ...prev,
      cards: generateCards(prev.difficulty),
      status: 'playing',
      score: 0,
      moves: 0,
      isGameOver: false,
      flippedCards: [],
    }));
    startTimer();
  };

  const handlePlay = () => {
    setGameState(prev => ({ ...prev, status: 'playing' }));
    startTimer();
  };

  const handlePause = () => {
    setGameState(prev => ({ ...prev, status: 'paused' }));
    stopTimer();
  };

  const handleEnd = () => {
    setGameState(prev => ({ ...prev, status: 'ended', isGameOver: true }));
    stopTimer();
    addRecord({
      playerName: username,
      score: gameState.score,
      moves: gameState.moves,
      timeElapsed: elapsedTime,
      won: gameState.score > 0,
      difficulty: gameState.difficulty,
    });
    updateHighScore(gameState.score);
  };

  const resetGame = () => {
    setGameState({
      cards: generateCards(gameState.difficulty),
      score: 0,
      moves: 0,
      isGameOver: false,
      flippedCards: [],
      status: 'idle',
      difficulty: gameState.difficulty,
    });
    resetTimer();
  };

  const handleCardClick = (cardId: number) => {
    if (gameState.status !== 'playing') return;

    const { cards, flippedCards, moves } = gameState;

    if (cards[cardId].isFlipped || cards[cardId].isMatched || flippedCards.length >= 2) {
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

  const isWinner = gameState.status === 'ended' && gameState.score > 0;

  const getDifficultyGridCols = () => {
    switch (gameState.difficulty) {
      case 'easy':
        return 'grid-cols-2 sm:grid-cols-4';
      case 'medium':
        return 'grid-cols-3 sm:grid-cols-6';
      case 'hard':
        return 'grid-cols-3 sm:grid-cols-6';
      default:
        return 'grid-cols-2 sm:grid-cols-4';
    }
  };

  return (
    <div className="w-full h-full relative overflow-hidden">
      <GameOverlay
        status={gameState.status}
        score={gameState.score}
        isWinner={isWinner}
        onPlayAgain={gameState.status === 'ended' ? resetGame : handleStartGame}
      />

      {gameState.status === 'idle' ? (
        <div className="w-full h-full grid grid-cols-1 lg:grid-cols-2 gap-6 overflow-hidden">
          <div className="w-full h-full min-h-0 overflow-hidden order-2 lg:order-1 lg:pr-2">
            <PlayRecords />
          </div>

          <div className="w-full h-full min-h-0 order-1 lg:order-2 lg:pl-2">
            <div className="w-full h-full bg-white rounded-xl shadow-md p-4 overflow-auto">
              <UserProfile />

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center p-4 mt-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl shadow-inner"
              >
                <h2 className="text-2xl font-bold mb-3 text-blue-700">Ready to Play?</h2>
                <p className="text-gray-600 mb-4 text-md">Match all the cards to win!</p>

                <div className="mb-5 w-full max-w-xs">
                  <h3 className="text-md font-semibold text-gray-700 mb-2 text-center">
                    Select Difficulty
                  </h3>
                  <div className="flex justify-between gap-2">
                    <button
                      onClick={() => handleDifficultyChange('easy')}
                      className={`px-3 py-2 rounded text-sm font-medium flex-1 transition-colors ${
                        gameState.difficulty === 'easy'
                          ? 'bg-blue-600 text-white'
                          : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                      }`}
                    >
                      Easy
                    </button>
                    <button
                      onClick={() => handleDifficultyChange('medium')}
                      className={`px-3 py-2 rounded text-sm font-medium flex-1 transition-colors ${
                        gameState.difficulty === 'medium'
                          ? 'bg-blue-600 text-white'
                          : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                      }`}
                    >
                      Medium
                    </button>
                    <button
                      onClick={() => handleDifficultyChange('hard')}
                      className={`px-3 py-2 rounded text-sm font-medium flex-1 transition-colors ${
                        gameState.difficulty === 'hard'
                          ? 'bg-blue-600 text-white'
                          : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                      }`}
                    >
                      Hard
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1 text-center">
                    {gameState.difficulty === 'easy'
                      ? '16 cards (8 pairs)'
                      : gameState.difficulty === 'medium'
                        ? '24 cards (12 pairs)'
                        : '36 cards (18 pairs)'}
                  </p>
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleStartGame}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg text-md font-semibold shadow transition-colors"
                >
                  Start Game
                </motion.button>
              </motion.div>
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full h-full overflow-auto bg-white rounded-xl shadow-md p-4">
          <UserProfile />

          <div className="flex flex-col items-center gap-4 mb-6">
            <AnimatePresence mode="wait">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex flex-wrap justify-center gap-3 p-3 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl shadow-inner w-full"
              >
                <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg shadow-sm">
                  <span className="text-gray-600 font-medium">Score:</span>
                  <motion.span
                    key={gameState.score}
                    initial={{ scale: 1.5 }}
                    animate={{ scale: 1 }}
                    className="text-lg font-bold text-blue-600"
                  >
                    {gameState.score}
                  </motion.span>
                </div>
                <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg shadow-sm">
                  <span className="text-gray-600 font-medium">Moves:</span>
                  <motion.span
                    key={gameState.moves}
                    initial={{ scale: 1.5 }}
                    animate={{ scale: 1 }}
                    className="text-lg font-bold text-blue-600"
                  >
                    {gameState.moves}
                  </motion.span>
                </div>
                <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg shadow-sm">
                  <Timer />
                </div>
                <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg shadow-sm">
                  <span className="text-gray-600 font-medium">Difficulty:</span>
                  <span className="text-lg font-bold text-blue-600 capitalize">
                    {gameState.difficulty}
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>

            <GameControls
              status={gameState.status}
              onPlay={handlePlay}
              onPause={handlePause}
              onEnd={handleEnd}
              onReset={resetGame}
            />
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className={`grid ${getDifficultyGridCols()} gap-3 mx-auto`}
              style={{
                maxWidth:
                  gameState.difficulty === 'easy'
                    ? '450px'
                    : gameState.difficulty === 'medium'
                      ? '650px'
                      : '800px',
              }}
            >
              {gameState.cards.map(card => (
                <Card key={card.id} card={card} onClick={() => handleCardClick(card.id)} />
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};
