import React, { useState } from 'react';
import { motion } from 'motion/react';
import { KeyRound, ArrowLeft, Lock, Unlock, AlertCircle } from 'lucide-react';
import { experienceConfig } from '../config/experienceConfig';
import { sound } from '../utils/sound';
import { CloudBackground } from '../components/CloudBackground';
import { AsciiOverlay } from '../components/AsciiOverlay';

interface LoginProps {
  onBack: () => void;
  onSuccess: () => void;
}

export const Login: React.FC<LoginProps> = ({ onBack, onSuccess }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const trimmed = password.trim();

    if (trimmed === experienceConfig.unlockPassword) {
      sound.playSuccessChime();
      setIsSubmitting(true);
      
      // Persist unlocked state in localStorage
      try {
        localStorage.setItem('sadiaBirthdayUnlocked', 'true');
      } catch (err) {
        console.warn('Could not save to localStorage:', err);
      }

      // Smooth transition to /experience
      setTimeout(() => {
        onSuccess();
      }, 400);
    } else {
      sound.playBuzzer();
      setError("That’s not the right key… 🔒");
    }
  };

  return (
    <div
      id="login-page"
      className="min-h-screen w-full relative flex flex-col justify-between items-center text-zinc-100 overflow-hidden select-none p-4"
    >
      {/* Cloud & Meadow Background */}
      <CloudBackground overlay="dark" />

      {/* Atmospheric Radial Gradients */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[460px] h-[460px] bg-amber-600/10 rounded-full blur-[100px] pointer-events-none" />
      </div>

      {/* Subtle Animated ASCII Overlay */}
      <AsciiOverlay />

      {/* Top back navigation */}
      <header className="w-full max-w-md pt-4 flex items-center justify-between z-10">
        <button
          type="button"
          id="login-back-btn"
          onClick={() => {
            sound.playPop();
            onBack();
          }}
          className="inline-flex items-center gap-2 text-xs font-medium text-zinc-400 hover:text-zinc-200 transition-colors py-1.5 px-3 rounded-lg hover:bg-zinc-900/60 border border-transparent hover:border-zinc-800 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to countdown</span>
        </button>

        <span className="text-[11px] text-zinc-600 uppercase tracking-widest font-mono">
          VIP Bypass
        </span>
      </header>

      {/* Central Login Card */}
      <main className="w-full max-w-sm z-10 my-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="rounded-3xl p-6 sm:p-8 bg-zinc-900/80 backdrop-blur-2xl border border-white/10 shadow-2xl relative overflow-hidden"
        >
          {/* Subtle top amber border highlight */}
          <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-amber-400/50 to-transparent" />

          {/* Keyhole icon badge */}
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto mb-5 text-amber-300 shadow-inner">
            <KeyRound className="w-6 h-6" />
          </div>

          <h2
            id="login-title"
            className="text-2xl font-bold text-center tracking-tight text-white"
          >
            Access Pass
          </h2>
          <p className="text-xs text-center text-zinc-400 mt-1 mb-6">
            Enter the secret key to unlock the experience early
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <input
                id="login-password-input"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError('');
                }}
                placeholder="Enter password..."
                autoFocus
                disabled={isSubmitting}
                className="w-full py-3 px-4 pr-11 rounded-xl bg-zinc-950/70 border border-zinc-800 focus:border-amber-400/80 focus:ring-2 focus:ring-amber-500/20 text-sm text-zinc-100 placeholder-zinc-500 outline-none transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-500 hover:text-zinc-300 p-1 cursor-pointer"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <Unlock className="w-4 h-4" />
                ) : (
                  <Lock className="w-4 h-4" />
                )}
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                id="login-error-message"
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-medium"
              >
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{error}</span>
              </motion.div>
            )}

            <motion.button
              id="login-unlock-btn"
              type="submit"
              disabled={isSubmitting}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3 px-4 rounded-xl font-semibold text-sm text-zinc-950 bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 hover:from-amber-200 hover:to-amber-400 shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Unlock className="w-4 h-4 animate-spin" />
                  <span>Unlocking...</span>
                </>
              ) : (
                <>
                  <Unlock className="w-4 h-4" />
                  <span>Unlock</span>
                </>
              )}
            </motion.button>
          </form>

          {/* Small hint footer inside card */}
          <div className="mt-6 pt-4 border-t border-zinc-800/80 text-center">
            <span className="text-[11px] text-zinc-500">
              Only for Sadia and authorized guests 🔑
            </span>
          </div>
        </motion.div>
      </main>

      {/* Bottom spacer */}
      <footer className="w-full py-4 text-center text-[11px] text-zinc-600 z-10">
        <span>Protected Capsule</span>
      </footer>
    </div>
  );
};
export default Login;
