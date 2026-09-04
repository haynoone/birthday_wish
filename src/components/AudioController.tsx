import React, { useEffect, useState } from 'react';
import { Volume2, VolumeX, Music, Disc } from 'lucide-react';
import { sound } from '../utils/sound';
import { experienceConfig } from '../config/experienceConfig';

export const AudioController: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(sound.isPlaying());

  useEffect(() => {
    const unsubscribe = sound.subscribe(() => {
      setIsPlaying(sound.isPlaying());
    });
    return () => unsubscribe();
  }, []);

  const handleToggle = () => {
    sound.playPop();
    sound.toggleMusic();
  };

  return (
    <div
      id="audio-controller-wrapper"
      className="fixed top-4 right-4 z-50 flex items-center gap-2"
    >
      <button
        id="audio-toggle-btn"
        onClick={handleToggle}
        title={isPlaying ? 'Pause Background Music' : 'Play Background Music'}
        className={`group flex items-center gap-2 px-3 py-2 rounded-full border transition-all duration-300 shadow-md backdrop-blur-md cursor-pointer ${
          isPlaying
            ? 'bg-rose-500/15 border-rose-400/40 text-rose-600 dark:text-rose-300 hover:bg-rose-500/25'
            : 'bg-white/80 dark:bg-zinc-900/80 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
        }`}
      >
        {/* Animated vinyl / note icon */}
        <div className="relative flex items-center justify-center">
          {isPlaying ? (
            <Disc className="w-4 h-4 text-rose-500 animate-spin" style={{ animationDuration: '3s' }} />
          ) : (
            <Music className="w-4 h-4 text-zinc-500" />
          )}
        </div>

        {/* Dynamic equalizer visualizer bars */}
        <div className="flex items-end gap-[2px] h-3 w-4">
          <span
            className={`w-[2.5px] rounded-full transition-all duration-200 ${
              isPlaying ? 'bg-rose-500 animate-pulse h-3' : 'bg-zinc-400 h-1'
            }`}
          />
          <span
            className={`w-[2.5px] rounded-full transition-all duration-200 ${
              isPlaying ? 'bg-rose-500 animate-bounce h-2' : 'bg-zinc-400 h-1.5'
            }`}
            style={{ animationDelay: '150ms' }}
          />
          <span
            className={`w-[2.5px] rounded-full transition-all duration-200 ${
              isPlaying ? 'bg-rose-500 animate-pulse h-3' : 'bg-zinc-400 h-1'
            }`}
            style={{ animationDelay: '300ms' }}
          />
        </div>

        {/* Label & Status */}
        <span className="text-xs font-semibold tracking-wide select-none hidden sm:inline">
          {isPlaying ? 'Music: Playing' : 'Music: Paused'}
        </span>

        {isPlaying ? (
          <Volume2 className="w-3.5 h-3.5 text-rose-500" />
        ) : (
          <VolumeX className="w-3.5 h-3.5 text-zinc-400" />
        )}
      </button>
    </div>
  );
};

export default AudioController;
