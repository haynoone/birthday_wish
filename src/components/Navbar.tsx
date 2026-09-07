import React from 'react';
import { SceneId } from '../types';
import { experienceConfig } from '../config/experienceConfig';
import { Sparkles, Flame } from 'lucide-react';
import { sound } from '../utils/sound';

interface NavbarProps {
  currentScene: SceneId;
  onJumpToScene: (scene: SceneId) => void;
}

const sceneLabels: Record<SceneId, string> = {
  intro1: 'Intro',
  intro2: 'Welcome',
  identityGate: 'Identity',
  excitementCheck: 'Excitement',
  terminalMessage3D: 'Terminal & 3D',
  nekoCursor: 'Neko Pet',
  memoryMatchGame: 'Memory Game',
  giftReveal: 'Gift Reveal',
};

export const Navbar: React.FC<NavbarProps> = ({ currentScene, onJumpToScene }) => {
  const scenes = experienceConfig.scenes;
  const currentIndex = scenes.indexOf(currentScene);

  return (
    <header className="fixed top-0 left-0 right-0 z-30 pointer-events-none">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo / Badge */}
        <div className="pointer-events-auto flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border border-zinc-200/60 dark:border-zinc-800/60 shadow-xs">
          <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-rose-500 to-amber-500 flex items-center justify-center text-white text-xs">
            <Flame className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 font-['Outfit',sans-serif]">
            Sadia's Special Surprise
          </span>
          <span className="text-[10px] text-rose-500 font-semibold hidden sm:inline">
            • Lil Valcano🌋
          </span>
        </div>

        {/* Scene progress dots (interactive) */}
        <nav
          aria-label="Scene Progress"
          className="pointer-events-auto hidden md:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border border-zinc-200/60 dark:border-zinc-800/60 shadow-xs"
        >
          {scenes.map((scene, idx) => {
            const isActive = scene === currentScene;
            const isPassed = idx < currentIndex;

            return (
              <button
                key={scene}
                id={`scene-step-${scene}`}
                onClick={() => {
                  sound.playPop();
                  onJumpToScene(scene);
                }}
                title={`Scene: ${sceneLabels[scene]}`}
                className={`flex items-center gap-1 transition-all rounded-full py-1 px-2 text-[11px] font-semibold cursor-pointer ${
                  isActive
                    ? 'bg-rose-500 text-white shadow-xs'
                    : isPassed
                    ? 'text-zinc-700 dark:text-zinc-300 hover:text-rose-500 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                    : 'text-zinc-400 dark:text-zinc-600 hover:text-zinc-600'
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    isActive ? 'bg-white' : isPassed ? 'bg-rose-400' : 'bg-zinc-300 dark:bg-zinc-700'
                  }`}
                />
                <span className={isActive ? 'inline' : 'hidden lg:inline'}>
                  {sceneLabels[scene]}
                </span>
              </button>
            );
          })}
        </nav>

        {/* Space reserved for AudioController on the right */}
        <div className="w-24 sm:w-36" />
      </div>
    </header>
  );
};

export default Navbar;
