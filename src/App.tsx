import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowLeft } from 'lucide-react';
import { SceneId } from './types';
import { experienceConfig } from './config/experienceConfig';
import { sound } from './utils/sound';
import { AudioController } from './components/AudioController';
import { IntroTypewriterPage } from './components/scenes/IntroTypewriterPage';
import { IdentityGate } from './components/scenes/IdentityGate';
import { ExcitementCheck } from './components/scenes/ExcitementCheck';
import { TerminalMessage3D } from './components/scenes/TerminalMessage3D';
import { NekoCursorScene } from './components/scenes/NekoCursorScene';
import { MemoryMatchGame } from './components/scenes/MemoryMatchGame';
import { GiftReveal } from './components/scenes/GiftReveal';
import { NekoKitten } from './components/neko/NekoKitten';
import { CloudBackground } from './components/CloudBackground';
import { EmbersBackground } from './components/EmbersBackground';
import { AsciiOverlay } from './components/AsciiOverlay';
import { LockedLanding } from './pages/LockedLanding';
import { Login } from './pages/Login';

// Helper to check if experience was unlocked (via localStorage key)
export const isUnlockedViaStorage = (): boolean => {
  try {
    return localStorage.getItem('sadiaBirthdayUnlocked') === 'true';
  } catch {
    return false;
  }
};

// Check if target unlock date has been reached
export const hasTargetDatePassed = (): boolean => {
  const targetTime = new Date(experienceConfig.unlockDate).getTime();
  return !isNaN(targetTime) && Date.now() >= targetTime;
};

// Normalize browser pathname / hash into app route
const getNormalizedRoute = (): string => {
  if (typeof window === 'undefined') return '/';
  let path = window.location.pathname;
  if (window.location.hash.startsWith('#/')) {
    path = window.location.hash.slice(1);
  }
  if (path.startsWith('/login')) return '/login';
  if (path.startsWith('/experience')) return '/experience';
  return '/';
};

export const App: React.FC = () => {
  // Routing state ('/', '/login', '/experience')
  const [currentRoute, setCurrentRoute] = useState<string>(() => {
    const initialRoute = getNormalizedRoute();
    const unlocked = isUnlockedViaStorage();

    // If localStorage.sadiaBirthdayUnlocked === "true", go straight to /experience
    if (unlocked) {
      return '/experience';
    }

    // Direct access to /experience blocked if not unlocked
    if (initialRoute === '/experience') {
      return '/';
    }

    // If time is reached, do not offer /login anymore
    if (initialRoute === '/login' && hasTargetDatePassed()) {
      return '/';
    }

    return initialRoute;
  });

  // State machine controlling the 8 scenes inside /experience
  const [currentScene, setCurrentScene] = useState<SceneId>('intro1');

  // Safe navigation function updating URL and React state
  const navigate = (path: string) => {
    try {
      window.history.pushState({}, '', path);
    } catch {
      try {
        window.location.hash = path;
      } catch {
        // Fallback for sandboxed iframes
      }
    }
    setCurrentRoute(path);
  };

  // Route protection and browser back/forward (popstate) listener
  useEffect(() => {
    const handleLocationChange = () => {
      const route = getNormalizedRoute();
      const unlocked = isUnlockedViaStorage();

      if (unlocked) {
        // Unlocked visitors go to /experience
        if (route !== '/experience') {
          navigate('/experience');
        } else {
          setCurrentRoute('/experience');
        }
        return;
      }

      // Not unlocked yet: /experience redirects to /
      if (route === '/experience') {
        navigate('/');
        return;
      }

      // If time reached, /login is not offered
      if (route === '/login' && hasTargetDatePassed()) {
        navigate('/');
        return;
      }

      setCurrentRoute(route);
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);

    // Run verification once on mount
    handleLocationChange();

    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  // Helper to advance to next scene in defined sequence
  const advanceToNextScene = () => {
    const scenes = experienceConfig.scenes;
    const currentIndex = scenes.indexOf(currentScene);
    if (currentIndex >= 0 && currentIndex < scenes.length - 1) {
      setCurrentScene(scenes[currentIndex + 1]);
    }
  };

  // Helper to step back to previous scene
  const goToPreviousScene = () => {
    const scenes = experienceConfig.scenes;
    const currentIndex = scenes.indexOf(currentScene);
    if (currentIndex > 0) {
      sound.playPop();
      setCurrentScene(scenes[currentIndex - 1]);
    }
  };

  // Dynamic soundtrack controller:
  // - Plays default music (src/assets/music/background.mp3) on Landing (/), Login (/login),
  //   and scenes before the Birthday Terminal (intro1, intro2, identityGate, excitementCheck)
  // - Switches to birthday celebration music at the Birthday Terminal (terminalMessage3D) and subsequent scenes
  useEffect(() => {
    const isBirthdayTerminalOrBeyond =
      currentRoute === '/experience' &&
      ['terminalMessage3D', 'nekoCursor', 'memoryMatchGame', 'giftReveal'].includes(currentScene);

    if (isBirthdayTerminalOrBeyond) {
      sound.playBirthdayMusic(true);
    } else {
      sound.playDefaultMusic(true);
    }
  }, [currentRoute, currentScene]);

  // Neko kitten overlay is active in nekoCursor, terminalMessage3D, and subsequent scenes
  const isNekoActive =
    currentRoute === '/experience' &&
    ['nekoCursor', 'terminalMessage3D', 'memoryMatchGame', 'giftReveal'].includes(currentScene);

  // 1) LOCKED LANDING ROUTE (/)
  if (currentRoute === '/') {
    return (
      <>
        <AudioController />
        <LockedLanding
          onOpenLogin={() => navigate('/login')}
          onUnlocked={() => navigate('/experience')}
        />
      </>
    );
  }

  // 2) LOGIN ACCESS PASS ROUTE (/login)
  if (currentRoute === '/login') {
    return (
      <>
        <AudioController />
        <Login
          onBack={() => navigate('/')}
          onSuccess={() => navigate('/experience')}
        />
      </>
    );
  }

  // 3) MAIN BIRTHDAY EXPERIENCE ROUTE (/experience)
  return (
    <div className="min-h-screen relative text-zinc-900 dark:text-zinc-100 flex flex-col justify-between selection:bg-rose-500 selection:text-white overflow-x-hidden font-sans">
      {/* Cloud & Meadow Background */}
      <CloudBackground overlay="glass" />

      {/* Background Animated Floating Embers identical to landing page */}
      <EmbersBackground />

      {/* Subtle Animated ASCII Overlay */}
      <AsciiOverlay />

      {/* Persistent Audio Controller */}
      <AudioController />

      {/* Floating Back Button (active on all scenes after intro1) */}
      {currentScene !== 'intro1' && (
        <motion.button
          id="global-back-button"
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -12 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={goToPreviousScene}
          className="fixed top-4 left-4 z-50 flex items-center gap-2 py-2 px-4 rounded-full bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md border border-rose-200/70 dark:border-zinc-800 text-sm font-semibold text-zinc-700 dark:text-zinc-200 hover:text-rose-600 dark:hover:text-rose-400 hover:border-rose-300 dark:hover:border-zinc-700 shadow-md hover:shadow-lg transition-all cursor-pointer select-none"
          title="Go back to previous page"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </motion.button>
      )}

      {/* Classic Neko Kitten pet cursor follower overlay */}
      <NekoKitten enabled={isNekoActive} />

      {/* Main Interactive Scene Stage */}
      <main className="flex-1 flex items-center justify-center py-8 px-4 w-full">
        <AnimatePresence mode="wait">
          {currentScene === 'intro1' && (
            <IntroTypewriterPage
              key="intro1"
              id="intro1"
              text={experienceConfig.introTexts.intro1}
              autoAdvanceDelay={2500}
              onNext={advanceToNextScene}
              badgeText="A Special Message ✨"
            />
          )}

          {currentScene === 'intro2' && (
            <IntroTypewriterPage
              key="intro2"
              id="intro2"
              text={experienceConfig.introTexts.intro2}
              autoAdvanceDelay={2500}
              onNext={advanceToNextScene}
              badgeText="Just For You ✨"
            />
          )}

          {currentScene === 'identityGate' && (
            <IdentityGate
              key="identityGate"
              onSuccess={advanceToNextScene}
            />
          )}

          {currentScene === 'excitementCheck' && (
            <ExcitementCheck
              key="excitementCheck"
              onYes={advanceToNextScene}
            />
          )}

          {currentScene === 'terminalMessage3D' && (
            <TerminalMessage3D
              key="terminalMessage3D"
              onNext={advanceToNextScene}
            />
          )}

          {currentScene === 'nekoCursor' && (
            <NekoCursorScene
              key="nekoCursor"
              onNext={advanceToNextScene}
            />
          )}

          {currentScene === 'memoryMatchGame' && (
            <MemoryMatchGame
              key="memoryMatchGame"
              onWin={advanceToNextScene}
            />
          )}

          {currentScene === 'giftReveal' && (
            <GiftReveal
              key="giftReveal"
              onRestart={() => setCurrentScene('intro1')}
            />
          )}
        </AnimatePresence>
      </main>

      {/* Subtle Footer with frosted glass backdrop */}
      <footer className="w-full py-3 text-center text-xs font-medium text-zinc-700 dark:text-zinc-300 bg-white/50 dark:bg-black/40 backdrop-blur-md border-t border-white/40 dark:border-white/10 flex items-center justify-center gap-4">
        <span>Crafted with ☕ for Sadia (“Lil Valcano🌋”) • Keep shining ✨</span>
      </footer>
    </div>
  );
};

export default App;

