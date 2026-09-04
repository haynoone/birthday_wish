import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lock, Flame, KeyRound, Sparkles, PartyPopper } from 'lucide-react';
import confetti from 'canvas-confetti';
import { CountdownTimer, calculateTimeRemaining } from '../components/CountdownTimer';
import { EmbersBackground } from '../components/EmbersBackground';
import { CloudBackground } from '../components/CloudBackground';
import { AsciiOverlay } from '../components/AsciiOverlay';
import { experienceConfig } from '../config/experienceConfig';
import { sound } from '../utils/sound';

interface LockedLandingProps {
  onOpenLogin: () => void;
  onUnlocked: () => void;
}

export const LockedLanding: React.FC<LockedLandingProps> = ({
  onOpenLogin,
  onUnlocked,
}) => {
  // Check if remainingTime <= 0
  const [hasReachedUnlockTime, setHasReachedUnlockTime] = useState<boolean>(() => {
    return calculateTimeRemaining(experienceConfig.unlockDate).isComplete;
  });

  const [isOpening, setIsOpening] = useState(false);
  const hasClickedRef = useRef(false);

  // When countdown completes while user is on the page, freeze at 00 and stay on /
  const handleCountdownComplete = () => {
    setHasReachedUnlockTime(true);
  };

  // On first click/tap anywhere when hasReachedUnlockTime === true:
  const handleContainerClick = (e: React.MouseEvent | React.TouchEvent) => {
    // If not yet unlocked or already clicked, ignore
    if (!hasReachedUnlockTime || hasClickedRef.current) return;

    hasClickedRef.current = true;
    setIsOpening(true);

    // 1. Confetti burst
    try {
      confetti({
        particleCount: 90,
        spread: 75,
        origin: { y: 0.6 },
        colors: ['#fbbf24', '#f59e0b', '#f43f5e', '#ec4899', '#ffffff'],
      });

      setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 60,
          spread: 60,
          origin: { x: 0.05, y: 0.65 },
          colors: ['#f59e0b', '#fbbf24', '#ffffff'],
        });
        confetti({
          particleCount: 50,
          angle: 120,
          spread: 60,
          origin: { x: 0.95, y: 0.65 },
          colors: ['#f43f5e', '#ec4899', '#ffffff'],
        });
      }, 350);
    } catch {
      // ignore
    }

    // 2. Play celebratory unlock sound chime
    sound.playSuccessChime();

    // Persist unlocked state in localStorage
    try {
      localStorage.setItem('sadiaBirthdayUnlocked', 'true');
    } catch (err) {
      console.warn('Could not save to localStorage:', err);
    }

    // 3. After ~1.8–2.2s (2000ms), navigate to /experience
    setTimeout(() => {
      onUnlocked();
    }, 2000);
  };

  return (
    <div
      id="locked-landing-page"
      onClick={handleContainerClick}
      onTouchStart={handleContainerClick}
      className={`min-h-screen w-full relative flex flex-col justify-between items-center text-zinc-100 overflow-hidden select-none ${
        hasReachedUnlockTime ? 'cursor-pointer' : ''
      }`}
    >
      {/* Cloud & Meadow Landscape Background */}
      <CloudBackground overlay="dark" />

      {/* Background Animated Floating Embers */}
      <EmbersBackground />

      {/* Atmospheric Radial Gradients with responsive opening glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={
            isOpening
              ? { scale: [1, 1.35, 1.5], opacity: [0.2, 0.55, 0.7] }
              : { scale: 1, opacity: hasReachedUnlockTime ? 0.3 : 0.15 }
          }
          transition={{ duration: 1.8, ease: 'easeOut' }}
          className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[540px] h-[540px] bg-gradient-to-br from-amber-500/25 via-orange-600/30 to-rose-600/20 rounded-full blur-[110px] pointer-events-none"
        />
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[400px] h-[250px] bg-rose-700/10 rounded-full blur-[100px] pointer-events-none" />
      </div>

      {/* Subtle Animated ASCII Overlay between background container and main UI */}
      <AsciiOverlay />

      {/* Top subtle bar / status */}
      <header className="w-full pt-8 px-6 flex justify-center z-10 pointer-events-none">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-900/60 backdrop-blur-md border border-white/10 text-xs font-medium text-amber-200/90 shadow-lg"
        >
          {hasReachedUnlockTime ? (
            <>
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" />
              <span className="text-amber-300 font-semibold">Ready to Unbox</span>
              <span className="text-zinc-500">•</span>
              <span className="text-zinc-300">Birthday Surprise</span>
            </>
          ) : (
            <>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
              </span>
              <span>Encrypted Birthday Capsule</span>
              <span className="text-zinc-500">•</span>
              <span className="text-zinc-400">October 28</span>
            </>
          )}
        </motion.div>
      </header>

      {/* Central Hero & Countdown Section */}
      <main className="w-full max-w-4xl px-4 py-8 sm:py-12 flex flex-col items-center text-center z-10 my-auto">
        <motion.div
          animate={
            isOpening
              ? { scale: [1, 1.04, 1.06], filter: 'brightness(1.2)' }
              : { scale: 1 }
          }
          transition={{ duration: 1.8, ease: 'easeOut' }}
          className="flex flex-col items-center w-full"
        >
          {/* Glowing Volcano / Heart Badge */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.1, ease: 'easeOut' }}
            className="relative mb-6"
          >
            <div
              className={`absolute -inset-3 bg-gradient-to-r ${
                hasReachedUnlockTime
                  ? 'from-amber-400/40 via-orange-500/50 to-rose-500/40'
                  : 'from-amber-500/20 via-orange-500/30 to-rose-500/20'
              } rounded-full blur-xl animate-pulse`}
            />
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-zinc-900/80 backdrop-blur-md border border-amber-500/30 flex items-center justify-center shadow-2xl text-2xl sm:text-3xl">
              <span role="img" aria-label="volcano and heart" className="drop-shadow-md">
                🌋
              </span>
              <div
                className={`absolute -bottom-1 -right-1 p-1 rounded-full backdrop-blur-sm border ${
                  hasReachedUnlockTime
                    ? 'bg-amber-500/30 border-amber-400/60 text-amber-300'
                    : 'bg-amber-500/20 border-amber-400/40 text-amber-400'
                }`}
              >
                {hasReachedUnlockTime ? (
                  <PartyPopper className="w-3.5 h-3.5" />
                ) : (
                  <Lock className="w-3.5 h-3.5" />
                )}
              </div>
            </div>
          </motion.div>

          {/* Headline */}
          <AnimatePresence mode="wait">
            {hasReachedUnlockTime ? (
              <motion.h1
                key="unlocked-headline"
                id="locked-headline"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.5 }}
                className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white max-w-2xl leading-[1.15] drop-shadow-sm"
              >
                It’s time 🎉
              </motion.h1>
            ) : (
              <motion.h1
                key="locked-headline"
                id="locked-headline"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white max-w-2xl leading-[1.15] drop-shadow-sm"
              >
                Something special is coming…
              </motion.h1>
            )}
          </AnimatePresence>

          {/* Subtext / Message */}
          <AnimatePresence mode="wait">
            {hasReachedUnlockTime ? (
              <motion.p
                key="unlocked-subtext"
                id="locked-subtext"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="mt-3 sm:mt-4 text-base sm:text-lg text-amber-200/90 font-medium max-w-lg"
              >
                The countdown is over. Click anywhere to open your surprise.
              </motion.p>
            ) : (
              <motion.p
                key="locked-subtext"
                id="locked-subtext"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="mt-3 sm:mt-4 text-base sm:text-lg text-zinc-400 max-w-md"
              >
                This experience unlocks on{' '}
                <span className="text-amber-300 font-medium">October 28</span>.
              </motion.p>
            )}
          </AnimatePresence>

          {/* Countdown Timer (Cards freeze at 00 when hasReachedUnlockTime is true) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="mt-8 sm:mt-12 w-full"
          >
            <CountdownTimer
              targetDate={experienceConfig.unlockDate}
              frozen={hasReachedUnlockTime}
              onComplete={handleCountdownComplete}
            />
          </motion.div>

          {/* Timezone Note / Click anywhere pulse indicator */}
          {hasReachedUnlockTime ? (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 flex items-center gap-2 text-xs text-amber-300/80 font-mono tracking-wide"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400"></span>
              </span>
              <span>Tap anywhere to begin</span>
            </motion.div>
          ) : (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.55 }}
              className="mt-6 text-xs text-zinc-500 font-mono tracking-wide"
            >
              Unlocks at midnight 00:00 local time
            </motion.p>
          )}
        </motion.div>
      </main>

      {/* Footer & Discreet "Open" Button at bottom right (Hidden when hasReachedUnlockTime is true) */}
      <footer className="w-full pb-6 pt-4 px-6 flex items-center justify-between z-20 text-xs text-zinc-500">
        <div className="hidden sm:flex items-center gap-2">
          <Flame className="w-3.5 h-3.5 text-orange-500/70" />
          <span>Created with ☕</span>
        </div>

        {/* Hide the "Open" button and do not offer /login anymore when hasReachedUnlockTime === true */}
        {!hasReachedUnlockTime && (
          <motion.button
            id="locked-open-login-btn"
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              sound.playPop();
              onOpenLogin();
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900/60 hover:bg-zinc-800/80 backdrop-blur-md border border-zinc-800 hover:border-zinc-700 text-xs font-medium text-zinc-400 hover:text-zinc-200 transition-all cursor-pointer shadow-sm select-none"
            title="Enter access pass"
          >
            <KeyRound className="w-3.5 h-3.5 text-amber-400/70" />
            <span>Open</span>
          </motion.button>
        )}
      </footer>
    </div>
  );
};
export default LockedLanding;
