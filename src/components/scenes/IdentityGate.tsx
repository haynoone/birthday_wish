import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { experienceConfig } from '../../config/experienceConfig';
import { sound } from '../../utils/sound';
import { ShieldAlert, Sparkles, CheckCircle2, LockKeyhole } from 'lucide-react';
import { BoxBottomFlame } from '../common/BoxBottomFlame';

interface IdentityGateProps {
  onSuccess: () => void;
}

export const IdentityGate: React.FC<IdentityGateProps> = ({ onSuccess }) => {
  const [inputValue, setInputValue] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [shakeKey, setShakeKey] = useState(0);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanInput = inputValue.trim().toLowerCase();

    if (!cleanInput) {
      setErrorMessage('Please type an answer first!');
      sound.playBuzzer();
      inputRef.current?.focus();
      return;
    }

    const isMatch = experienceConfig.identityGate.allowedAnswers.some(
      (ans) => ans.trim().toLowerCase() === cleanInput
    );

    if (isMatch) {
      sound.playSuccessChime();
      setIsSuccess(true);
      setErrorMessage('');

      // Confetti burst on correct identity!
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#f43f5e', '#fb7185', '#f59e0b', '#fbbf24', '#a855f7'],
      });

      // Small success animation then advance to next scene
      setTimeout(() => {
        onSuccess();
      }, 1400);
    } else {
      sound.playBuzzer();
      setErrorMessage(experienceConfig.identityGate.errorMessage);
      setShakeKey((prev) => prev + 1);
      inputRef.current?.focus();
    }
  };

  return (
    <motion.div
      id="scene-identityGate"
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: isSuccess ? 1.05 : 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="flex flex-col items-center justify-center min-h-[70vh] sm:min-h-[80vh] px-3 sm:px-4 select-none w-full"
    >
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}
        className="relative w-full max-w-xl sm:max-w-2xl mx-auto rounded-3xl border border-white/10 bg-gradient-to-b from-zinc-900/90 via-zinc-900/80 to-zinc-950/90 backdrop-blur-xl shadow-2xl shadow-black/50 p-6 sm:p-8 md:p-10 overflow-hidden"
      >
        {/* Liquid depth highlights */}
        <div className="absolute inset-0 bg-radial from-white/10 via-transparent to-transparent pointer-events-none rounded-3xl" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-64 h-24 bg-rose-500/10 blur-2xl rounded-full pointer-events-none" />

        <div className="flex flex-col items-center text-center mb-5 sm:mb-6 relative z-10">
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-zinc-800/80 flex items-center justify-center text-rose-400 mb-2.5 sm:mb-3 border border-zinc-700/60 shadow-md backdrop-blur-sm">
            {isSuccess ? (
              <CheckCircle2 className="w-6 h-6 text-emerald-400 animate-bounce" />
            ) : (
              <LockKeyhole className="w-6 h-6 text-rose-400" />
            )}
          </div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-zinc-100 font-['Outfit',sans-serif] drop-shadow-md max-w-xl mx-auto leading-snug">
            {experienceConfig.identityGate.question}
          </h2>
          <p className="text-xs sm:text-sm text-zinc-300 mt-1.5 font-medium">
            You obviously know the secret code! 😮‍💨
          </p>
        </div>

        {/* Input Form with Shake Animation on error */}
        <motion.form
          key={shakeKey}
          animate={
            shakeKey > 0
              ? { x: [-10, 10, -8, 8, -4, 4, 0] }
              : {}
          }
          transition={{ duration: 0.4 }}
          onSubmit={handleSubmit}
          className="space-y-3 sm:space-y-3.5 relative z-10 max-w-md mx-auto"
        >
          <div className="relative">
            <input
              ref={inputRef}
              id="identity-gate-input"
              type="text"
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                if (errorMessage) setErrorMessage('');
              }}
              disabled={isSuccess}
              placeholder="Enter secret code..."
              className="w-full px-4 py-2.5 sm:py-3 rounded-xl border border-zinc-700/80 bg-zinc-800/80 text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-rose-500/50 focus:border-rose-400 transition-all font-medium text-center text-sm sm:text-base backdrop-blur-sm shadow-inner"
              autoComplete="off"
              spellCheck={false}
            />
          </div>

          <motion.button
            id="identity-gate-submit-btn"
            type="submit"
            disabled={isSuccess}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`w-full py-2.5 sm:py-3 px-5 rounded-xl font-semibold text-white text-sm sm:text-base transition-all duration-300 shadow-lg flex items-center justify-center gap-2 cursor-pointer ${
              isSuccess
                ? 'bg-emerald-500 shadow-emerald-500/25'
                : 'bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 shadow-rose-500/25'
            }`}
          >
            {isSuccess ? (
              <>
                <Sparkles className="w-4 h-4 text-emerald-200" />
                <span>Bingo! You cracked it! Opening... 🎉</span>
              </>
            ) : (
              <span>Unlock the Surprise ✨</span>
            )}
          </motion.button>
        </motion.form>

        {/* Error message */}
        <AnimatePresence>
          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="mt-3.5 p-2.5 sm:p-3 rounded-xl bg-amber-950/50 border border-amber-800/60 text-amber-200 text-xs sm:text-sm font-medium flex items-center justify-center gap-2 text-center max-w-md mx-auto"
            >
              <ShieldAlert className="w-4 h-4 shrink-0 text-amber-400" />
              <span>{errorMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Clue and Hint Section */}
        {experienceConfig.identityGate.hints && experienceConfig.identityGate.hints.length > 0 && (
          <div className="mt-5 pt-4 border-t border-zinc-800 space-y-2 text-left relative z-10 max-w-md mx-auto">
            {experienceConfig.identityGate.hints.map((hint, index) => (
              <div
                key={index}
                className="text-xs sm:text-[13px] text-zinc-300 bg-zinc-800/60 backdrop-blur-sm p-2.5 rounded-xl border border-zinc-700/60 leading-relaxed"
              >
                {hint}
              </div>
            ))}
          </div>
        )}

        {/* Landing Page Bottom Flame effect */}
        <BoxBottomFlame />
      </motion.div>
    </motion.div>
  );
};

export default IdentityGate;
