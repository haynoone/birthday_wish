import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { sound } from '../../utils/sound';
import { Sparkles, ArrowRight, MousePointer, Compass, Smile } from 'lucide-react';
import { NekoSprite, SPRITE_SETS } from '../neko/NekoKitten';

interface NekoCursorSceneProps {
  onNext: () => void;
}

export const NekoCursorScene: React.FC<NekoCursorSceneProps> = ({ onNext }) => {
  const [petCount, setPetCount] = useState(0);
  const [selectedAngle, setSelectedAngle] = useState<keyof typeof SPRITE_SETS>('idle');
  const [animFrame, setAnimFrame] = useState(0);

  // Cycle animation frame for showcase preview
  useEffect(() => {
    const timer = setInterval(() => {
      setAnimFrame((prev) => prev + 1);
    }, 180);
    return () => clearInterval(timer);
  }, []);

  const handleContinue = () => {
    sound.playPop();
    onNext();
  };

  const handlePetAction = () => {
    sound.playMeow('meow');
    setPetCount((prev) => prev + 1);
    setSelectedAngle('tired'); // Cute meow pose
  };

  const angles: { id: keyof typeof SPRITE_SETS; label: string; icon?: string }[] = [
    { id: 'NW', label: 'North-West' },
    { id: 'N', label: 'North' },
    { id: 'NE', label: 'North-East' },
    { id: 'W', label: 'West' },
    { id: 'idle', label: 'Idle' },
    { id: 'E', label: 'East' },
    { id: 'SW', label: 'South-West' },
    { id: 'S', label: 'South' },
    { id: 'SE', label: 'South-East' },
  ];

  const specialPoses: { id: keyof typeof SPRITE_SETS; label: string }[] = [
    { id: 'alert', label: 'Alert !' },
    { id: 'sleeping', label: 'Sleeping Zzz' },
    { id: 'scratchSelf', label: 'Scratching' },
    { id: 'tired', label: 'Yawning / Meow' },
  ];

  return (
    <motion.div
      id="scene-nekoCursor"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.5 }}
      className="relative flex flex-col items-center justify-center min-h-[70vh] sm:min-h-[80vh] px-3 sm:px-4 text-center select-none w-full"
    >
      <div className="w-full max-w-xl bg-white/85 dark:bg-zinc-900/85 backdrop-blur-xl border border-zinc-200/80 dark:border-zinc-800/80 rounded-3xl p-5 sm:p-10 shadow-2xl relative overflow-hidden">
        {/* Subtle accent header */}
        <div className="inline-flex items-center gap-2 px-3 sm:px-3.5 py-1.5 rounded-full text-[11px] sm:text-xs font-semibold bg-pink-50 dark:bg-pink-950/40 text-pink-600 dark:text-pink-300 border border-pink-200/60 dark:border-pink-800/40 mb-3 sm:mb-4">
          <Sparkles className="w-3.5 h-3.5 text-pink-500" />
          <span>Your Mischievous Kitten Buddy 🐾</span>
        </div>

        <h2 className="text-2xl sm:text-4xl font-extrabold text-zinc-900 dark:text-zinc-50 font-['Outfit',sans-serif] tracking-tight">
          Meet Neko! 🐾
        </h2>

        <p className="mt-2 text-xs sm:text-base text-zinc-600 dark:text-zinc-400 max-w-md mx-auto leading-relaxed">
          Meet your tiny four-legged sidekick! Neko loves to sprint after your cursor, do goofy cat naps, and groom like a boss. Wave your mouse around to take Neko for a spin!
        </p>

        {/* Neko Spotlight Display Box */}
        <div className="my-5 sm:my-6 p-3.5 sm:p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/60 dark:border-zinc-700/60 flex flex-col items-center gap-3.5 sm:gap-4">
          {/* Animated Big Preview of Neko */}
          <button
            type="button"
            onClick={handlePetAction}
            title="Click to pet Neko! 🐾"
            className="relative flex flex-col items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-white dark:bg-zinc-900 shadow-inner border border-zinc-200/70 dark:border-zinc-700/70 cursor-pointer hover:scale-105 active:scale-95 transition-transform group"
          >
            <NekoSprite
              state={selectedAngle}
              frame={animFrame}
              size={56}
              className="drop-shadow-md dark:drop-shadow-[0_0_2px_rgba(255,255,255,0.9)]"
            />
            <span className="absolute bottom-1 text-[9px] sm:text-[10px] font-bold text-zinc-400 group-hover:text-pink-500 uppercase tracking-wider transition-colors">
              {selectedAngle}
            </span>
          </button>

          {/* 8-Directional Angle Compass Selector */}
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-semibold text-zinc-500 dark:text-zinc-400">
              <Compass className="w-3.5 h-3.5 text-pink-500" />
              <span>Neko's Poses & Tricks:</span>
            </div>

            <div className="grid grid-cols-3 gap-1.5 max-w-[240px]">
              {angles.map((ang) => (
                <button
                  key={ang.id}
                  onClick={() => {
                    setSelectedAngle(ang.id);
                    sound.playMeow('chirp');
                  }}
                  className={`px-2 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                    selectedAngle === ang.id
                      ? 'bg-rose-500 text-white border-rose-600 shadow-sm scale-105'
                      : 'bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700 hover:border-rose-300'
                  }`}
                >
                  {ang.id}
                </button>
              ))}
            </div>

            {/* Special Poses */}
            <div className="flex flex-wrap items-center justify-center gap-1.5 mt-2">
              {specialPoses.map((pose) => (
                <button
                  key={pose.id}
                  onClick={() => {
                    setSelectedAngle(pose.id);
                    sound.playMeow(pose.id === 'tired' ? 'meow' : 'chirp');
                  }}
                  className={`px-2.5 py-1 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                    selectedAngle === pose.id
                      ? 'bg-pink-600 text-white border-pink-700 shadow-sm'
                      : 'bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700 hover:border-pink-300'
                  }`}
                >
                  {pose.label}
                </button>
              ))}
            </div>
          </div>

          {/* Hint and Pet Button */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 pt-2 border-t border-zinc-200/60 dark:border-zinc-700/60 w-full">
            <button
              onClick={handlePetAction}
              className="px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-200 text-xs font-bold border border-amber-200 dark:border-amber-800 hover:bg-amber-200 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              <span>Pet Neko {petCount > 0 ? `(${petCount} pets 🐾)` : ''}</span>
            </button>

            <div className="flex items-center gap-1 text-[11px] sm:text-xs text-zinc-500 dark:text-zinc-400">
              <MousePointer className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
              <span>Move cursor or tap anywhere</span>
            </div>
          </div>
        </div>

        {/* Advance to 3D Playground & Special Notes */}
        <button
          id="neko-continue-btn"
          onClick={handleContinue}
          className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-3.5 rounded-full font-bold text-sm sm:text-base text-white bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 shadow-lg shadow-rose-500/25 flex items-center justify-center gap-2 mx-auto hover:scale-105 active:scale-95 transition-all cursor-pointer"
        >
          <span>Continue to 3D Playground & Notes 🕹️</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
};

export default NekoCursorScene;
