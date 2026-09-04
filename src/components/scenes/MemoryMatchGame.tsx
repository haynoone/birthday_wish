import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { experienceConfig } from '../../config/experienceConfig';
import { MemoryGameCard } from '../../types';
import { sound } from '../../utils/sound';
import { Sparkles, Trophy, RotateCcw, ArrowRight, Clock, Award } from 'lucide-react';

interface MemoryMatchGameProps {
  onWin: () => void;
}

export const MemoryMatchGame: React.FC<MemoryMatchGameProps> = ({ onWin }) => {
  const [cards, setCards] = useState<MemoryGameCard[]>([]);
  const [flippedCards, setFlippedCards] = useState<string[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<string[]>([]);
  const [isLocked, setIsLocked] = useState(false);
  const [moves, setMoves] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [isWon, setIsWon] = useState(false);

  // Initialize and shuffle cards on mount
  const setupGame = () => {
    const rawPairs = experienceConfig.memoryGame.cards;
    const deck: MemoryGameCard[] = [];

    rawPairs.forEach((card) => {
      // Create two instances of each pair
      deck.push({
        id: `${card.pairId}-1`,
        pairId: card.pairId,
        title: card.title,
        emoji: card.emoji,
        imageUrl: card.imageUrl,
      });
      deck.push({
        id: `${card.pairId}-2`,
        pairId: card.pairId,
        title: card.title,
        emoji: card.emoji,
        imageUrl: card.imageUrl,
      });
    });

    // Fisher-Yates shuffle
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }

    setCards(deck);
    setFlippedCards([]);
    setMatchedPairs([]);
    setIsLocked(false);
    setMoves(0);
    setSeconds(0);
    setIsWon(false);
  };

  useEffect(() => {
    setupGame();
  }, []);

  // Timer
  useEffect(() => {
    if (isWon) return;
    const interval = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isWon]);

  // Card click handler
  const handleCardClick = (card: MemoryGameCard) => {
    // Ignore if locked, already flipped, or already matched
    if (
      isLocked ||
      flippedCards.includes(card.id) ||
      matchedPairs.includes(card.pairId)
    ) {
      return;
    }

    sound.playCardFlip();
    const newFlipped = [...flippedCards, card.id];
    setFlippedCards(newFlipped);

    // If 2 cards now flipped, evaluate
    if (newFlipped.length === 2) {
      setMoves((prev) => prev + 1);
      setIsLocked(true);

      const [firstId, secondId] = newFlipped;
      const firstCard = cards.find((c) => c.id === firstId);
      const secondCard = cards.find((c) => c.id === secondId);

      if (firstCard && secondCard && firstCard.pairId === secondCard.pairId) {
        // MATCH!
        setTimeout(() => {
          sound.playSuccessChime();
          const newMatched = [...matchedPairs, firstCard.pairId];
          setMatchedPairs(newMatched);
          setFlippedCards([]);
          setIsLocked(false);

          // Check if won
          if (newMatched.length === experienceConfig.memoryGame.cards.length) {
            handleVictory();
          }
        }, 400);
      } else {
        // MISMATCH -> flip back after 900 ms as specified
        setTimeout(() => {
          setFlippedCards([]);
          setIsLocked(false);
        }, 900);
      }
    }
  };

  const handleVictory = () => {
    setIsWon(true);

    // Festive confetti bursts
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#f43f5e', '#fb7185', '#f59e0b', '#10b981', '#6366f1'],
    });
    setTimeout(() => {
      confetti({
        particleCount: 60,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
      });
      confetti({
        particleCount: 60,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
      });
    }, 400);

    // Auto-advance or allow clicking the button
    setTimeout(() => {
      onWin();
    }, 2800);
  };

  return (
    <motion.div
      id="scene-memoryMatchGame"
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-4xl mx-auto px-4 py-6 sm:py-8 flex flex-col items-center select-none"
    >
      {/* Title & Stats */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-500 border border-rose-500/20 mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Birthday Memory Match</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-zinc-50 font-['Outfit',sans-serif]">
          Match All the Memory Cards
        </h2>
        <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
          Match all 4 pairs to unlock Sadia's grand birthday surprise! 🎁
        </p>

        {/* Game Stats bar */}
        <div className="mt-4 flex items-center justify-center gap-6 text-xs sm:text-sm font-semibold text-zinc-600 dark:text-zinc-300">
          <div className="flex items-center gap-1.5 bg-white dark:bg-zinc-800 px-3.5 py-1.5 rounded-full border border-zinc-200 dark:border-zinc-700 shadow-sm">
            <Award className="w-4 h-4 text-amber-500" />
            <span>Pairs: {matchedPairs.length} / {experienceConfig.memoryGame.cards.length}</span>
          </div>
          <button
            onClick={setupGame}
            title="Restart Memory Game"
            className="flex items-center gap-1.5 bg-white dark:bg-zinc-800 px-3.5 py-1.5 rounded-full border border-zinc-200 dark:border-zinc-700 shadow-sm hover:bg-zinc-100 dark:hover:bg-zinc-700 cursor-pointer transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5 text-rose-500" />
            <span>Reset</span>
          </button>
          <div className="flex items-center gap-1.5 bg-white dark:bg-zinc-800 px-3.5 py-1.5 rounded-full border border-zinc-200 dark:border-zinc-700 shadow-sm">
            <Clock className="w-3.5 h-3.5 text-indigo-500" />
            <span>{Math.floor(seconds / 60)}:{(seconds % 60).toString().padStart(2, '0')}</span>
          </div>
        </div>
      </div>

      {/* Cards Grid: 2x4 on mobile, 4x2 on tablet/desktop */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 w-full max-w-2xl px-2">
        {cards.map((card) => {
          const isFlipped = flippedCards.includes(card.id) || matchedPairs.includes(card.pairId);
          const isMatched = matchedPairs.includes(card.pairId);

          return (
            <div
              key={card.id}
              className="relative aspect-[3/4] cursor-pointer perspective-1000"
              onClick={() => handleCardClick(card)}
            >
              <motion.div
                initial={false}
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                style={{ transformStyle: 'preserve-3d' }}
                className="w-full h-full relative"
              >
                {/* Back of Card (Face Down) */}
                <div
                  style={{ backfaceVisibility: 'hidden' }}
                  className="absolute inset-0 rounded-2xl bg-gradient-to-br from-rose-500 via-pink-500 to-amber-500 p-1 shadow-md hover:shadow-xl transition-shadow flex flex-col items-center justify-center border-2 border-white/40"
                >
                  <div className="w-full h-full rounded-xl bg-zinc-900/40 backdrop-blur-xs flex flex-col items-center justify-center p-3 text-center border border-white/20">
                    <span className="text-3xl sm:text-4xl mb-1 animate-pulse">🎁</span>
                    <span className="text-[10px] sm:text-xs font-bold text-white tracking-wider uppercase font-mono">
                      Lil Valcano
                    </span>
                  </div>
                </div>

                {/* Front of Card (Face Up) */}
                <div
                  style={{
                    backfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)',
                  }}
                  className={`absolute inset-0 rounded-2xl p-1 shadow-lg flex flex-col overflow-hidden transition-all ${
                    isMatched
                      ? 'bg-gradient-to-br from-emerald-400 to-teal-500 border-2 border-emerald-300'
                      : 'bg-gradient-to-br from-rose-400 to-amber-400 border-2 border-rose-300'
                  }`}
                >
                  <div className="w-full h-full rounded-xl bg-white dark:bg-zinc-900 overflow-hidden flex flex-col relative">
                    {/* Image */}
                    <div className="relative flex-1 w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                      <img
                        src={card.imageUrl}
                        alt={card.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        onError={(e) => {
                          // Image fallback to emoji visual
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                      {/* Floating Emoji overlay */}
                      <div className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 dark:bg-zinc-900/90 flex items-center justify-center text-lg shadow-sm">
                        {card.emoji}
                      </div>
                    </div>

                    {/* Card Title Label */}
                    <div className="py-2 px-2 text-center bg-white dark:bg-zinc-900 border-t border-zinc-100 dark:border-zinc-800">
                      <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200 truncate block">
                        {card.title}
                      </span>
                    </div>

                    {isMatched && (
                      <div className="absolute inset-0 bg-emerald-500/20 backdrop-blur-[1px] flex items-center justify-center">
                        <div className="bg-white/95 dark:bg-zinc-900/95 px-2.5 py-1 rounded-full text-[11px] font-bold text-emerald-600 shadow">
                          ✓ Matched!
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>
          );
        })}
      </div>

      {/* Win Banner Modal / Overlay */}
      <AnimatePresence>
        {isWon && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="mt-8 p-6 bg-white dark:bg-zinc-900 border border-amber-300 dark:border-amber-700/60 rounded-3xl shadow-2xl text-center max-w-md w-full"
          >
            <div className="w-14 h-14 bg-amber-100 dark:bg-amber-900/40 rounded-full flex items-center justify-center text-amber-500 mx-auto mb-3 shadow-inner">
              <Trophy className="w-8 h-8 text-amber-500" />
            </div>
            <h3 className="text-2xl font-extrabold text-zinc-900 dark:text-zinc-100 font-['Outfit',sans-serif]">
              You unlocked something! 🎉
            </h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
              All memory pairs revealed in {moves} moves. Revealing your final birthday surprise...
            </p>

            <button
              onClick={onWin}
              className="mt-5 w-full py-3 px-6 rounded-full font-bold text-white bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 shadow-lg shadow-rose-500/25 flex items-center justify-center gap-2 cursor-pointer hover:scale-102 transition-all"
            >
              <span>Open Final Gift Reveal Now</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default MemoryMatchGame;
