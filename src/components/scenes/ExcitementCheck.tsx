import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RunawayButton } from '../common/RunawayButton';
import { sound } from '../../utils/sound';
import { Heart, Sparkles } from 'lucide-react';
import { BoxBottomFlame } from '../common/BoxBottomFlame';

interface ExcitementCheckProps {
  onYes: () => void;
}

const FUNNY_EVASION_MESSAGES = [
  'Wait, did you really try to click No? 😂',
  'Nice reflexes, but the button is faster! 💨',
  'There is only one true destiny here! ✨',
  'Just give up already! 😂',
  'You are tough! But so is this button 🦾',
  'Final destination is YES! 🎯',
  'Error 404: "No" button cannot be caught! 🚫',
  'Are you getting a workout chasing this button? 🏃‍♀️💨',
  'The button has supersonic evasive maneuvers! 🚀',
  'Resistance is futile! Click YES! 🎉',
  'Even NASA couldn’t calculate where this button lands! 🛸',
  'Plot twist: the YES button has been waiting for you all along ❤️',
  'Your determination is legendary, but futile! 😜',
  'Did you seriously think you could outsmart this button? 😏',
  'I could do this evasive dance all day! 🛡️',
  'Someone award you a gold medal for persistence! 🥇',
  'The "No" button just booked a one-way flight out of here! ✈️',
  'Warning: Excessive clicks will only ignite more excitement! ⚡',
  'Look closely... the YES button is literally glowing for you! ✨',
  'Blink and you missed it again! 👀',
  'The laws of physics do not apply to this No button! 🌌',
  'Come on, deep down you know you want to click YES! 🥰',
];

export const ExcitementCheck: React.FC<ExcitementCheckProps> = ({ onYes }) => {
  const [attempts, setAttempts] = useState(0);

  const handleYes = () => {
    sound.playSuccessChime();
    // Start background music looping on user gesture as specified
    sound.startMusic();
    onYes();
  };

  const getCheekyComment = () => {
    if (attempts === 0) return 'Choose wisely 😉';
    // Loop through funny messages continuously once unique list completes
    const messageIndex = (attempts - 1) % FUNNY_EVASION_MESSAGES.length;
    return FUNNY_EVASION_MESSAGES[messageIndex];
  };

  return (
    <motion.div
      id="scene-excitementCheck"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.5 }}
      className="relative flex flex-col items-center justify-center min-h-[80vh] px-6 text-center select-none"
    >
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}
        className="relative w-full max-w-2xl sm:max-w-3xl mx-auto rounded-3xl border border-white/10 bg-gradient-to-b from-zinc-900/90 via-zinc-900/80 to-zinc-950/90 backdrop-blur-xl shadow-2xl shadow-black/50 p-8 sm:p-14 overflow-visible"
      >
        {/* Liquid depth highlights */}
        <div className="absolute inset-0 bg-radial from-white/10 via-transparent to-transparent pointer-events-none rounded-3xl" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-72 h-32 bg-rose-500/10 blur-2xl rounded-full pointer-events-none" />

        {/* Floating Heart Icon */}
        <motion.div
          animate={{
            scale: [1, 1.15, 1],
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            repeat: Infinity,
            duration: 2.2,
            ease: 'easeInOut',
          }}
          className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-rose-500 to-amber-400 mx-auto flex items-center justify-center text-white shadow-lg shadow-rose-500/30 mb-6"
        >
          <Heart className="w-8 h-8 fill-white" />
        </motion.div>

        {/* Text */}
        <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-zinc-100 font-['Outfit',sans-serif] tracking-tight leading-snug drop-shadow-md max-w-2xl mx-auto">
          Are you excited for what’s next?
        </h2>

        <div className="mt-4 min-h-[32px] flex items-center justify-center max-w-xl mx-auto overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.p
              key={attempts}
              initial={{ opacity: 0, y: 5, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -5, scale: 0.96 }}
              transition={{ duration: 0.2 }}
              className="text-base sm:text-lg text-zinc-300 font-medium"
            >
              {getCheekyComment()}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Buttons container */}
        <div className="mt-10 flex items-center justify-center gap-6 min-h-[70px] relative z-10">
          {/* YES Button */}
          <motion.button
            id="excitement-yes-btn"
            onClick={handleYes}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            className="px-9 py-4 rounded-full font-bold text-base sm:text-lg text-white bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 shadow-xl shadow-rose-500/30 flex items-center gap-2.5 cursor-pointer transition-all"
          >
            <Sparkles className="w-5 h-5 text-amber-200" />
            <span>Yes, of course! ❤️</span>
          </motion.button>

          {/* RUNAWAY NO Button */}
          <RunawayButton
            id="excitement-no-btn"
            label="No 😅"
            proximityThreshold={85}
            onEvade={(count) => setAttempts(count)}
            className="px-7 py-4 rounded-full font-medium text-base text-zinc-200 bg-zinc-800/80 hover:bg-zinc-700/90 border border-zinc-700/70 backdrop-blur-sm shadow-md transition-colors cursor-pointer"
          />
        </div>

        {attempts > 0 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-8 text-xs sm:text-sm text-zinc-400 font-medium"
          >
            Runaway attempts: <span className="font-mono font-bold text-rose-400">{attempts}</span>
          </motion.p>
        )}

        {/* Landing Page Bottom Flame effect */}
        <BoxBottomFlame />
      </motion.div>
    </motion.div>
  );
};

export default ExcitementCheck;
