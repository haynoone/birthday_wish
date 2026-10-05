import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { experienceConfig } from '../../config/experienceConfig';
import { MemoryGameCard } from '../../types';
import { sound } from '../../utils/sound';
import { triggerCelebration } from '../../utils/celebration';
import {
  Sparkles,
  Trophy,
  RotateCcw,
  ArrowRight,
  Clock,
  Award,
  FastForward,
  CheckCircle2,
  Maximize2,
  X,
} from 'lucide-react';

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
  const [previewPhoto, setPreviewPhoto] = useState<{ url: string; title: string; emoji: string } | null>(null);

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

  // Skip button handler
  const handleSkip = () => {
    sound.playPop();
    triggerCelebration({ intensity: 'gentle', playSound: true });
    onWin();
  };

  // Card click handler
  const handleCardClick = (card: MemoryGameCard) => {
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

    // If 2 cards are now flipped, evaluate match
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

          // Check if all pairs are solved
          if (newMatched.length === experienceConfig.memoryGame.cards.length) {
            handleVictory();
          }
        }, 350);
      } else {
        // MISMATCH -> flip back after 850 ms
        setTimeout(() => {
          setFlippedCards([]);
          setIsLocked(false);
        }, 850);
      }
    }
  };

  const handleVictory = () => {
    setIsWon(true);
    triggerCelebration({ intensity: 'grand', playSound: true });

    // Allow user to click button or auto-advance smoothly
    setTimeout(() => {
      onWin();
    }, 3200);
  };

  const totalPairs = experienceConfig.memoryGame.cards.length;

  return (
    <motion.div
      id="scene-memoryMatchGame"
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-4xl mx-auto px-3 sm:px-6 py-4 sm:py-6 flex flex-col items-center select-none"
    >
      {/* Top Header Card */}
      <div className="w-full text-center mb-5">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold bg-rose-500/10 dark:bg-rose-500/20 text-rose-600 dark:text-rose-300 border border-rose-500/20 mb-2.5 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Card Memory Challenge 🧩</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-zinc-50 font-['Outfit',sans-serif] tracking-tight">
          Match The Mystery Cards
        </h2>
        <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1 max-w-md mx-auto">
          Flip cards to find the matching pairs and unlock the grand surprise!
        </p>

        {/* Progress & Control Bar */}
        <div className="mt-4 max-w-2xl mx-auto flex flex-wrap items-center justify-between gap-2 p-2 rounded-2xl bg-white/70 dark:bg-zinc-900/70 backdrop-blur-md border border-zinc-200/80 dark:border-zinc-800 shadow-sm text-xs sm:text-sm font-semibold text-zinc-700 dark:text-zinc-300">
          {/* Pairs Solved Medallion */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-100/80 dark:bg-zinc-800/80">
            <Award className="w-4 h-4 text-amber-500 shrink-0" />
            <span>Pairs: <strong className="text-zinc-900 dark:text-white font-mono">{matchedPairs.length}</strong> / {totalPairs}</span>
            {/* Visual Mini Progress Dots */}
            <div className="flex items-center gap-1 ml-1">
              {Array.from({ length: totalPairs }).map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    i < matchedPairs.length
                      ? 'bg-emerald-500 scale-110 shadow-xs shadow-emerald-500/50'
                      : 'bg-zinc-300 dark:bg-zinc-700'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Moves & Timer */}
          <div className="flex items-center gap-3">
            <div className="text-xs text-zinc-500 dark:text-zinc-400">
              Moves: <strong className="text-zinc-800 dark:text-zinc-200 font-mono">{moves}</strong>
            </div>

            <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-300 text-xs font-mono">
              <Clock className="w-3.5 h-3.5" />
              <span>{Math.floor(seconds / 60)}:{(seconds % 60).toString().padStart(2, '0')}</span>
            </div>
          </div>

          {/* Actions: Reset & Small Skip Button */}
          <div className="flex items-center gap-1.5 ml-auto sm:ml-0">
            <button
              id="memory-game-reset-btn"
              onClick={setupGame}
              title="Restart Memory Game"
              className="px-2.5 py-1.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-300 transition-colors cursor-pointer flex items-center gap-1 text-xs"
            >
              <RotateCcw className="w-3.5 h-3.5 text-zinc-500" />
              <span className="hidden sm:inline">Reset</span>
            </button>

            {/* Requested Small Skip Button */}
            <button
              id="memory-game-skip-btn"
              onClick={handleSkip}
              title="Skip straight to surprise"
              className="group px-3 py-1.5 rounded-xl bg-gradient-to-r from-rose-500/15 via-amber-500/15 to-rose-500/15 hover:from-rose-500/25 hover:to-amber-500/25 border border-rose-500/30 text-rose-600 dark:text-rose-300 transition-all cursor-pointer flex items-center gap-1.5 text-xs font-bold active:scale-95 shadow-xs"
            >
              <span>Skip</span>
              <FastForward className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* Cards Grid: Sized for optimal clarity & full visibility */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 sm:gap-5 w-full max-w-3xl sm:max-w-4xl px-1">
        {cards.map((card) => {
          const isFlipped = flippedCards.includes(card.id) || matchedPairs.includes(card.pairId);
          const isMatched = matchedPairs.includes(card.pairId);

          return (
            <motion.div
              key={card.id}
              whileHover={!isFlipped ? { y: -4, scale: 1.02 } : { y: -2 }}
              whileTap={!isFlipped ? { scale: 0.98 } : {}}
              className="relative aspect-[1/1.22] sm:aspect-[1/1.2] cursor-pointer perspective-1000 group"
              onClick={() => handleCardClick(card)}
            >
              <motion.div
                initial={false}
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ duration: 0.45, ease: [0.23, 1, 0.32, 1] }}
                style={{ transformStyle: 'preserve-3d' }}
                className="w-full h-full relative"
              >
                {/* Back of Card (Face Down) - Premium Holographic Foil Feel */}
                <div
                  style={{ backfaceVisibility: 'hidden' }}
                  className="absolute inset-0 rounded-2xl bg-gradient-to-br from-rose-500 via-pink-500 to-amber-500 p-[2.5px] shadow-md hover:shadow-xl hover:shadow-rose-500/20 transition-all flex flex-col items-center justify-center border border-white/30"
                >
                  <div className="w-full h-full rounded-[13px] bg-gradient-to-b from-zinc-900/90 via-zinc-950 to-zinc-900/95 backdrop-blur-sm flex flex-col items-center justify-center p-3 text-center relative overflow-hidden border border-white/10">
                    {/* Subtle geometric background pattern */}
                    <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#f43f5e_1px,transparent_1px)] [background-size:12px_12px] pointer-events-none" />
                    
                    {/* Glowing Center Badge */}
                    <div className="relative z-10 w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-rose-500/20 to-amber-500/20 border border-white/20 flex items-center justify-center shadow-inner mb-1.5 group-hover:scale-105 transition-transform">
                      <span className="text-xl sm:text-2xl filter drop-shadow-sm animate-pulse">✨</span>
                    </div>

                    <span className="relative z-10 text-[11px] font-bold text-zinc-100 tracking-wider uppercase font-['Outfit',sans-serif]">
                      Lil Valcano
                    </span>
                    <span className="relative z-10 text-[9px] text-rose-300/80 font-medium tracking-wide mt-0.5">
                      Tap to flip
                    </span>
                  </div>
                </div>

                {/* Front of Card (Face Up) */}
                <div
                  style={{
                    backfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)',
                  }}
                  className={`absolute inset-0 rounded-2xl p-[2px] shadow-lg flex flex-col overflow-hidden transition-all duration-300 ${
                    isMatched
                      ? 'bg-gradient-to-br from-emerald-400 via-teal-400 to-emerald-500 ring-2 ring-emerald-400/80 shadow-emerald-500/25'
                      : 'bg-gradient-to-br from-rose-400 to-amber-400 shadow-md'
                  }`}
                >
                  <div className="w-full h-full rounded-[14px] bg-white dark:bg-zinc-900 overflow-hidden flex flex-col relative">
                    {/* Card Photo: 1:1 square ratio for 100% full visibility with zero edge-cropping */}
                    <div className="relative w-full aspect-square overflow-hidden bg-zinc-950 flex items-center justify-center">
                      <img
                        src={card.imageUrl}
                        alt={card.title}
                        className="w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-[1.03]"
                        loading="lazy"
                      />

                      {/* Matched Pill Badge: compact corner highlight so photo stays 100% visible */}
                      {isMatched && (
                        <div className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-full bg-emerald-500/90 text-white text-[10px] font-bold shadow-md backdrop-blur-xs flex items-center gap-1 border border-emerald-400/40">
                          <CheckCircle2 className="w-3 h-3 text-white shrink-0" />
                          <span>Matched</span>
                        </div>
                      )}

                      {/* Full-view Zoom Lightbox button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setPreviewPhoto({ url: card.imageUrl, title: card.title, emoji: card.emoji });
                        }}
                        title="View photo full size"
                        className="absolute top-1.5 right-1.5 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-black/60 hover:bg-black/85 backdrop-blur-md text-white flex items-center justify-center opacity-75 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity shadow-sm cursor-pointer"
                      >
                        <Maximize2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                      </button>
                    </div>

                    {/* Card Title & Emoji Label Footer */}
                    <div className="flex-1 w-full min-h-[32px] px-2 flex items-center justify-center gap-1.5 bg-white/95 dark:bg-zinc-900/95 border-t border-zinc-100 dark:border-zinc-800/80">
                      <span className="text-xs">{card.emoji}</span>
                      <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200 truncate font-['Outfit',sans-serif]">
                        {card.title}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          );
        })}
      </div>

      {/* Win Banner Modal / Overlay */}
      <AnimatePresence>
        {isWon && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="mt-6 p-6 sm:p-8 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl border border-amber-300/80 dark:border-amber-700/60 rounded-3xl shadow-2xl text-center max-w-md w-full"
          >
            <div className="w-16 h-16 bg-gradient-to-tr from-amber-400 to-rose-400 rounded-2xl flex items-center justify-center text-white mx-auto mb-3.5 shadow-lg shadow-amber-500/30">
              <Trophy className="w-8 h-8 text-white" />
            </div>

            <h3 className="text-2xl font-extrabold text-zinc-900 dark:text-zinc-100 font-['Outfit',sans-serif]">
              You Unlocked The Surprise! 🎉
            </h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1.5">
              All memory pairs revealed in <strong className="text-rose-500">{moves} moves</strong>. Unveiling your grand final surprise...
            </p>

            <button
              onClick={onWin}
              className="mt-5 w-full py-3.5 px-6 rounded-full font-bold text-base text-white bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 shadow-xl shadow-rose-500/25 flex items-center justify-center gap-2 cursor-pointer hover:scale-102 active:scale-98 transition-all"
            >
              <span>Open Final Surprise! 🎁</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Full Photo Lightbox Preview Modal */}
      <AnimatePresence>
        {previewPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
            onClick={() => setPreviewPhoto(null)}
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-md sm:max-w-lg w-full bg-zinc-900 rounded-3xl overflow-hidden border border-white/20 shadow-2xl flex flex-col"
            >
              <div className="p-3.5 px-4 flex items-center justify-between border-b border-white/10 bg-zinc-900/90">
                <div className="flex items-center gap-2">
                  <span className="text-base">{previewPhoto.emoji}</span>
                  <h4 className="text-sm font-bold text-white font-['Outfit',sans-serif]">
                    {previewPhoto.title}
                  </h4>
                </div>
                <button
                  type="button"
                  onClick={() => setPreviewPhoto(null)}
                  className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="w-full aspect-square bg-black flex items-center justify-center overflow-hidden">
                <img
                  src={previewPhoto.url}
                  alt={previewPhoto.title}
                  className="w-full h-full object-contain"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default MemoryMatchGame;
