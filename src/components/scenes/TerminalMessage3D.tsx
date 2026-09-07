import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { AnimatedTerminal } from '../common/AnimatedTerminal';
import { Interactive3DPanel } from '../three/Interactive3DPanel';
import { experienceConfig } from '../../config/experienceConfig';
import { sound } from '../../utils/sound';
import { ArrowRight, Sparkles } from 'lucide-react';

interface TerminalMessage3DProps {
  onNext: () => void;
}

export const TerminalMessage3D: React.FC<TerminalMessage3DProps> = ({ onNext }) => {
  const [isTerminalDone, setIsTerminalDone] = useState(false);

  useEffect(() => {
    // Start background music when this scene mounts if not playing already
    sound.startMusic();
  }, []);

  const handleNext = () => {
    sound.playPop();
    onNext();
  };

  return (
    <motion.div
      id="scene-terminalMessage3D"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-6xl mx-auto px-4 py-6 sm:py-10 flex flex-col items-center select-none"
    >
      {/* Scene Header */}
      <div className="text-center mb-6 sm:mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-500 border border-rose-500/20 mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Special Thoughts & 3D Playground 🎮</span>
          <span className="text-zinc-300 dark:text-zinc-700">•</span>
          <span className="text-zinc-600 dark:text-zinc-300">Neko's Tagging Along 🐾</span>
        </div>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-zinc-900 dark:text-zinc-50 font-['Outfit',sans-serif]">
          A Little Note For You! 🎉
        </h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1 max-w-md mx-auto">
          Fun thoughts rolling in just for you, plus a neat 3D toy you can spin around! 🕹️✨
        </p>
      </div>

      {/* Two Column Layout on Desktop, Stacked on Mobile */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        {/* Left Column: Animated Terminal */}
        <div className="flex flex-col h-full">
          <AnimatedTerminal
            lines={experienceConfig.terminalMessages}
            typingSpeed={40}
            lineDelay={450}
            onAllCompleted={() => setIsTerminalDone(true)}
            className="h-full flex-1"
          />
        </div>

        {/* Right Column: Interactive 3D Panel */}
        <div className="flex flex-col h-full">
          <Interactive3DPanel />
        </div>
      </div>

      {/* Advance to next scene button */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-8 flex flex-col items-center gap-3"
      >
        <button
          id="terminal-3d-continue-btn"
          onClick={handleNext}
          className="group px-7 py-3.5 rounded-full font-bold text-base text-white bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 shadow-xl shadow-rose-500/25 flex items-center gap-2.5 transition-all hover:scale-105 active:scale-95 cursor-pointer"
        >
          <span>Continue to Memory Game 🧩</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
        <span className="text-xs text-zinc-400">
          {isTerminalDone ? '✨ All messages loaded!' : 'Feel free to jump ahead whenever you are ready!'}
        </span>
      </motion.div>
    </motion.div>
  );
};

export default TerminalMessage3D;
