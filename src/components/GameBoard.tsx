import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "./Card";
import { Timer } from "./Timer";
import { GameControls } from "./GameControls";
import { GameOverlay } from "./GameOverlay";
import { UserProfile } from "./UserProfile";
import { PlayRecords } from "./PlayRecords";
import { generateCards, checkMatch, isGameComplete } from "../utils/gameUtils";
import { GameState } from "../types/game";
import { useAuthStore } from "../store/authStore";
import { useTimerStore } from "../store/timerStore";
import { useRecordsStore } from "../store/recordsStore";

export const GameBoard = () => {
  const { username } = useAuthStore();
  const addRecord = useRecordsStore((state) => state.addRecord);
  const {
    start: startTimer,
    stop: stopTimer,
    reset: resetTimer,
    elapsedTime,
  } = useTimerStore();
  const [gameState, setGameState] = useState<GameState>({
    cards: generateCards(),
    score: 0,
    moves: 0,
    isGameOver: false,
    flippedCards: [],
    status: "idle",
  });

  const updateHighScore = useAuthStore((state) => state.updateHighScore);

  const handleStartGame = () => {
    setGameState((prev) => ({
      ...prev,
      cards: generateCards(),
      status: "playing",
      score: 0,
      moves: 0,
      isGameOver: false,
      flippedCards: [],
    }));
    startTimer();
  };

  const handlePlay = () => {
    setGameState((prev) => ({ ...prev, status: "playing" }));
    startTimer();
  };

  const handlePause = () => {
    setGameState((prev) => ({ ...prev, status: "paused" }));
    stopTimer();
  };

  const handleEnd = () => {
    setGameState((prev) => ({ ...prev, status: "ended", isGameOver: true }));
    stopTimer();
    addRecord({
      playerName: username,
      score: gameState.score,
      moves: gameState.moves,
      timeElapsed: elapsedTime,
      won: gameState.score > 0,
    });
    updateHighScore(gameState.score);
  };

  const resetGame = () => {
    setGameState({
      cards: generateCards(),
      score: 0,
      moves: 0,
      isGameOver: false,
      flippedCards: [],
      status: "idle",
    });
    resetTimer();
  };

  const handleCardClick = (cardId: number) => {
    if (gameState.status !== "playing") return;

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
    setGameState((prev) => ({
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
          isMatched:
            card.isMatched || (isMatch && newFlippedCards.includes(index)),
          isFlipped:
            card.isMatched || (isMatch && newFlippedCards.includes(index)),
        }));

        const newScore = isMatch ? gameState.score + 10 : gameState.score - 1;
        const isGameOver = isGameComplete(updatedCards);

        setGameState((prev) => ({
          ...prev,
          cards: updatedCards,
          flippedCards: [],
          score: newScore,
          isGameOver,
          status: isGameOver ? "ended" : "playing",
        }));

        if (isGameOver) {
          stopTimer();
          updateHighScore(newScore);
        }
      }, 1000);
    }
  };

  const isWinner = gameState.status === "ended" && gameState.score > 0;

  return (
    <>
      <GameOverlay
        status={gameState.status}
        score={gameState.score}
        isWinner={isWinner}
        onPlayAgain={gameState.status === "ended" ? resetGame : handleStartGame}
      />

      <div className={`w-full max-w-[1200px] ${gameState.status === "idle" ? "grid grid-cols-1 md:grid-cols-2 gap-8" : ""} p-4`}>
        {gameState.status === "idle" && (
          <div className="w-full">
            <PlayRecords />
          </div>
        )}

        <div className={`w-full ${gameState.status === "idle" ? "max-w-[800px]" : "max-w-[1000px] mx-auto"} grid gap-4 p-4 bg-white/10 rounded-lg`}>
          <UserProfile />
          {gameState.status === "idle" ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center p-8 bg-white rounded-lg shadow-md"
            >
              <h2 className="text-3xl font-bold mb-4 text-gray-800">
                Ready to Play?
              </h2>
              <p className="text-gray-600 mb-6">Match all the cards to win!</p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleStartGame}
                className="bg-green-500 text-white px-8 py-3 rounded-lg text-lg font-semibold"
              >
                Start Game
              </motion.button>
            </motion.div>
          ) : (
            <>
              <div className="flex flex-col items-center gap-4 mb-5">
                <AnimatePresence mode="wait">
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="flex items-center gap-8 p-4 bg-white rounded-lg shadow-md"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-gray-600 font-medium">Score:</span>
                      <motion.span
                        key={gameState.score}
                        initial={{ scale: 1.5 }}
                        animate={{ scale: 1 }}
                        className="text-2xl font-bold text-gray-900"
                      >
                        {gameState.score}
                      </motion.span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-600 font-medium">Moves:</span>
                      <motion.span
                        key={gameState.moves}
                        initial={{ scale: 1.5 }}
                        animate={{ scale: 1 }}
                        className="text-2xl font-bold text-gray-900"
                      >
                        {gameState.moves}
                      </motion.span>
                    </div>
                    <Timer />
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
                  className="grid grid-cols-4 gap-2.5 max-w-[500px] mx-auto"
                >
                  {gameState.cards.map((card) => (
                    <Card
                      key={card.id}
                      card={card}
                      onClick={() => handleCardClick(card.id)}
                    />
                  ))}
                </motion.div>
              </AnimatePresence>
            </>
          )}
        </div>
      </div>
    </>
  );
};
