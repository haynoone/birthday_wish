import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { sound } from '../../utils/sound';
import { Sparkles, Heart, ArrowRight, MousePointer, Compass } from 'lucide-react';
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
    sound.playSuccessChime();
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
      className="relative flex flex-col items-center justify-center min-h-[80vh] px-4 text-center select-none"
    >
      <div className="w-full max-w-xl bg-white/85 dark:bg-zinc-900/85 backdrop-blur-xl border border-zinc-200/80 dark:border-zinc-800/80 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
        {/* Subtle accent header */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-pink-50 dark:bg-pink-950/40 text-pink-600 dark:text-pink-300 border border-pink-200/60 dark:border-pink-800/40 mb-4">
          <Sparkles className="w-3.5 h-3.5 text-pink-500" />
          <span>Interactive Desktop Companion</span>
        </div>

        <h2 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-zinc-50 font-['Outfit',sans-serif] tracking-tight">
          Meet Neko, Your Birthday Pet! 🐾
        </h2>

        <p className="mt-2 text-sm sm:text-base text-zinc-600 dark:text-zinc-400 max-w-md mx-auto leading-relaxed">
          Neko has all 8-directional movement angles, alert poses, ear scratching, and sweet snoozing! Move your cursor around to watch Neko follow you.
        </p>

        {/* Neko Spotlight Display Box */}
        <div className="my-6 p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/60 dark:border-zinc-700/60 flex flex-col items-center gap-4">
          {/* Animated Big Preview of Neko */}
          <div className="relative flex flex-col items-center justify-center w-24 h-24 rounded-2xl bg-white dark:bg-zinc-900 shadow-inner border border-zinc-200/70 dark:border-zinc-700/70">
            <NekoSprite
              state={selectedAngle}
              frame={animFrame}
              size={64}
              className="drop-shadow-md dark:drop-shadow-[0_0_2px_rgba(255,255,255,0.9)]"
            />
            <span className="absolute bottom-1 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
              {selectedAngle}
            </span>
          </div>

          {/* 8-Directional Angle Compass Selector */}
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
              <Compass className="w-3.5 h-3.5 text-pink-500" />
              <span>Angle & Movement Compass:</span>
            </div>

            <div className="grid grid-cols-3 gap-1.5 max-w-[240px]">
              {angles.map((ang) => (
                <button
                  key={ang.id}
                  onClick={() => {
                    setSelectedAngle(ang.id);
                    sound.playPop();
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
                    sound.playPop();
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
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2 border-t border-zinc-200/60 dark:border-zinc-700/60 w-full">
            <button
              onClick={handlePetAction}
              className="px-4 py-2 rounded-full bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300 text-xs font-bold border border-rose-200 dark:border-rose-800 hover:bg-rose-200 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
              <span>Pet Neko {petCount > 0 ? `(${petCount} pets ❤️)` : ''}</span>
            </button>

            <div className="flex items-center gap-1 text-xs text-zinc-500 dark:text-zinc-400">
              <MousePointer className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
              <span>Move cursor anywhere to lead Neko</span>
            </div>
          </div>
        </div>

        {/* Advance to Memory Match Game */}
        <button
          id="neko-continue-btn"
          onClick={handleContinue}
          className="w-full sm:w-auto px-8 py-3.5 rounded-full font-bold text-base text-white bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 shadow-lg shadow-rose-500/25 flex items-center justify-center gap-2 mx-auto hover:scale-105 active:scale-95 transition-all cursor-pointer"
        >
          <span>Continue to Birthday Memory Game 🎮</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
};

export default NekoCursorScene;
