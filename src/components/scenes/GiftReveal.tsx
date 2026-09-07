import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { experienceConfig } from '../../config/experienceConfig';
import { sound } from '../../utils/sound';
import { triggerCelebration } from '../../utils/celebration';
import {
  Volume2,
  VolumeX,
  Sparkles,
  ExternalLink,
  RotateCcw,
  PartyPopper,
  Calendar,
  Flame,
  Cake,
} from 'lucide-react';

interface GiftRevealProps {
  onRestart: () => void;
}

export const GiftReveal: React.FC<GiftRevealProps> = ({ onRestart }) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const gift = experienceConfig.finalGift;

  useEffect(() => {
    // Grand celebration sequence with detailed multi-tier confetti and soft chime
    triggerCelebration({ intensity: 'grand', playSound: true });
    const timer = setTimeout(() => {
      triggerCelebration({ intensity: 'gentle', playSound: false });
    }, 1400);
    return () => clearTimeout(timer);
  }, []);

  // Voice narration using window.speechSynthesis
  const handlePlayVoice = () => {
    if (!('speechSynthesis' in window)) {
      console.warn('Speech synthesis is not supported on this browser.');
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel(); // Stop any pending speech
    sound.playPop();

    const voiceText = `Happy Birthday, ${gift.recipientName}! May your year ahead be as bright and explosive with joy as Lil Valcano! Wishing you endless happiness, good health, and many blessings. Have the most wonderful day today!`;

    const utterance = new SpeechSynthesisUtterance(voiceText);
    utterance.rate = 0.95;
    utterance.pitch = 1.1;

    // Pick a pleasant voice if available
    const voices = window.speechSynthesis.getVoices();
    const friendlyVoice = voices.find(
      (v) =>
        v.lang.startsWith('en') &&
        (v.name.includes('Natural') ||
          v.name.includes('Google') ||
          v.name.includes('Samantha') ||
          v.name.includes('Karen'))
    );
    if (friendlyVoice) {
      utterance.voice = friendlyVoice;
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const triggerMoreConfetti = () => {
    triggerCelebration({ intensity: 'normal', playSound: true });
  };

  return (
    <motion.div
      id="scene-giftReveal"
      initial={{ opacity: 0, scale: 0.94 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.94 }}
      transition={{ duration: 0.6 }}
      className="w-full max-w-3xl mx-auto px-4 py-8 flex flex-col items-center select-none"
    >
      {/* Grand Glowing Container */}
      <div className="w-full relative group">
        {/* Animated ambient radiant background glow */}
        <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-rose-500 via-amber-400 to-violet-500 opacity-60 blur-xl group-hover:opacity-80 transition duration-1000 -z-10 animate-pulse" />

        <div className="w-full bg-white/95 dark:bg-zinc-900/95 backdrop-blur-2xl border-2 border-rose-300/60 dark:border-rose-700/60 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
          {/* Top Decorative Banner */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-6 border-b border-zinc-100 dark:border-zinc-800">
            <div className="flex items-center gap-2">
              <span className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-500 to-amber-500 text-white flex items-center justify-center shadow-md">
                <Cake className="w-5 h-5" />
              </span>
              <div>
                <h3 className="text-base sm:text-lg font-black text-zinc-900 dark:text-zinc-100 font-['Outfit',sans-serif]">
                  {gift.recipientName} • Special Day
                </h3>
                <div className="flex items-center gap-2 text-xs text-rose-500 font-medium">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{gift.birthdayDate}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1 font-semibold">
                    <Flame className="w-3.5 h-3.5 text-orange-500" />
                    {gift.nickname}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Confetti & Voice controls */}
            <div className="flex items-center gap-2">
              <button
                id="play-voice-btn"
                onClick={handlePlayVoice}
                className={`px-3.5 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm ${
                  isSpeaking
                    ? 'bg-rose-500 text-white animate-pulse'
                    : 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-300 border border-rose-200 dark:border-rose-800 hover:bg-rose-100'
                }`}
              >
                {isSpeaking ? (
                  <>
                    <VolumeX className="w-3.5 h-3.5" />
                    <span>Stop Voice</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Play Voice Wish 🎙️</span>
                  </>
                )}
              </button>

              <button
                id="more-confetti-btn"
                onClick={triggerMoreConfetti}
                title="Launch Confetti!"
                className="p-2 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-300 border border-amber-200 dark:border-amber-800 hover:bg-amber-100 cursor-pointer transition-transform hover:scale-110"
              >
                <PartyPopper className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Birthday Headline */}
          <div className="my-8 text-center">
            <h1 className="text-3xl sm:text-5xl font-extrabold text-zinc-900 dark:text-zinc-50 font-['Outfit',sans-serif] tracking-tight bg-gradient-to-r from-rose-600 via-pink-600 to-amber-500 bg-clip-text text-transparent">
              {gift.title}
            </h1>
            <p className="text-base sm:text-lg font-semibold text-zinc-600 dark:text-zinc-300 mt-2 flex items-center justify-center gap-1.5">
              <span>{gift.subtitle}</span>
            </p>
          </div>

          {/* Birthday Letter Card */}
          <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-b from-rose-50/50 to-amber-50/30 dark:from-zinc-800/60 dark:to-zinc-800/30 border border-rose-100 dark:border-zinc-700/60 shadow-inner">
            <div className="prose dark:prose-invert max-w-none text-zinc-800 dark:text-zinc-200 text-sm sm:text-base leading-relaxed whitespace-pre-line font-sans">
              {gift.message}
            </div>
          </div>

          {/* Optional Gift Link */}
          {gift.link && (
            <div className="mt-8 flex justify-center">
              <a
                id="gift-link-anchor"
                href={gift.link.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => sound.playPop()}
                className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full font-bold text-base sm:text-lg text-white bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 shadow-xl shadow-rose-500/30 hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                <Sparkles className="w-5 h-5" />
                <span>{gift.link.label}</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          )}

          {/* Restart Experience Action */}
          <div className="mt-8 pt-6 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-center">
            <button
              id="replay-experience-btn"
              onClick={() => {
                sound.playPop();
                onRestart();
              }}
              className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors py-2 px-4 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Replay the Special Experience ✨</span>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default GiftReveal;
