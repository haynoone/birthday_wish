import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'motion/react';
import { TypingEffect } from '../common/TypingEffect';
import { sound } from '../../utils/sound';
import { Sparkles, ArrowRight } from 'lucide-react';
import { BoxBottomFlame } from '../common/BoxBottomFlame';

interface IntroTypewriterPageProps {
  id: string;
  text: string;
  autoAdvanceDelay?: number; // default 3000ms
  charSpeed?: number; // default 60ms
  onNext: () => void;
  badgeText?: string;
}

export const IntroTypewriterPage: React.FC<IntroTypewriterPageProps> = ({
  id,
  text,
  autoAdvanceDelay = 3000,
  charSpeed = 60,
  onNext,
  badgeText = 'October 28 • Surprise',
}) => {
  const [typingComplete, setTypingComplete] = useState(false);
  const onNextRef = useRef(onNext);
  onNextRef.current = onNext;

  useEffect(() => {
    setTypingComplete(false);
  }, [id, text]);

  useEffect(() => {
    if (!typingComplete) return;

    const timer = setTimeout(() => {
      onNextRef.current();
    }, autoAdvanceDelay);

    return () => clearTimeout(timer);
  }, [typingComplete, autoAdvanceDelay]);

  const handleSkip = () => {
    sound.playPop();
    onNext();
  };

  return (
    <motion.div
      id={`scene-${id}`}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="relative flex flex-col items-center justify-center min-h-[70vh] sm:min-h-[80vh] px-3 sm:px-6 text-center select-none w-full"
      onClick={handleSkip}
    >
      {/* Background ambient glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none -z-10">
        <div className="w-80 h-80 bg-rose-500/10 rounded-full blur-3xl" />
        <div className="w-60 h-60 bg-amber-400/10 rounded-full blur-2xl" />
      </div>

      {/* Main Dark Liquid Glassmorphism Card */}
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}
        className="relative w-full max-w-2xl sm:max-w-3xl lg:max-w-4xl mx-auto rounded-3xl border border-white/10 bg-gradient-to-b from-zinc-900/90 via-zinc-900/80 to-zinc-950/90 backdrop-blur-xl shadow-2xl shadow-black/50 p-6 sm:p-14 md:p-16 overflow-hidden flex flex-col items-center"
      >
        {/* Subtle liquid inner depth highlights */}
        <div className="absolute inset-0 bg-radial from-white/10 via-transparent to-transparent pointer-events-none rounded-3xl" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-80 h-32 bg-rose-500/10 blur-2xl rounded-full pointer-events-none" />

        {/* Festive badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15, duration: 0.4 }}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide bg-zinc-800/80 text-rose-300 border border-zinc-700/60 mb-5 sm:mb-8 shadow-sm backdrop-blur-sm"
        >
          <Sparkles className="w-3.5 h-3.5 text-rose-400" />
          <span>{badgeText}</span>
        </motion.div>

        {/* Main typewriter text */}
        <div className="max-w-2xl sm:max-w-3xl min-h-[90px] sm:min-h-[120px] flex items-center justify-center relative z-10 px-2 sm:px-4">
          <h1 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-zinc-100 font-['Outfit',sans-serif] leading-tight drop-shadow-md text-center">
            <TypingEffect
              text={text}
              speed={charSpeed}
              onComplete={() => setTypingComplete(true)}
              className="text-balance"
              cursorClassName="text-rose-400 font-normal"
            />
          </h1>
        </div>

        {/* Action prompt */}
        <div className="mt-6 sm:mt-8 flex flex-col items-center gap-4 relative z-10">
          <button
            id={`skip-btn-${id}`}
            onClick={(e) => {
              e.stopPropagation();
              handleSkip();
            }}
            className="inline-flex items-center gap-2 text-xs font-medium text-zinc-300 hover:text-white transition-all py-2 px-4 rounded-full bg-zinc-800/80 hover:bg-zinc-700/90 border border-zinc-700/60 backdrop-blur-sm cursor-pointer shadow-md"
          >
            <span>Tap anywhere or click to continue</span>
            <ArrowRight className="w-3.5 h-3.5 text-zinc-400" />
          </button>
        </div>

        {/* Landing Page Bottom Flame effect */}
        <BoxBottomFlame />
      </motion.div>
    </motion.div>
  );
};

export default IntroTypewriterPage;
