import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useForm, ValidationError } from '@formspree/react';
import confetti from 'canvas-confetti';
import {
  Heart,
  Send,
  Sparkles,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Loader2,
  MessageSquareHeart,
  Flame,
} from 'lucide-react';
import { CloudBackground } from '../components/CloudBackground';
import { AsciiOverlay } from '../components/AsciiOverlay';
import { EmbersBackground } from '../components/EmbersBackground';
import { sound } from '../utils/sound';

/**
 * Formspree Integration Note for Tanvir:
 * 1. Create a free form at https://formspree.io
 * 2. Add your Formspree form ID to `.env` in the project root:
 *    VITE_FORMSPREE_FORM_ID=your_form_id_here
 * 3. Incoming messages from Sadia will be delivered directly and privately to your email inbox!
 */
const FORMSPREE_FORM_ID = import.meta.env.VITE_FORMSPREE_FORM_ID || '';

interface MessageForTanvirProps {
  onBack: () => void;
}

const REACTIONS = [
  'This made me smile 😊',
  'I am impressed 😭',
  'You are too much 😂',
  'I need to reply properly later 💌',
];

export const MessageForTanvir: React.FC<MessageForTanvirProps> = ({ onBack }) => {
  // Formspree state hook
  const [state, handleFormspreeSubmit] = useForm(FORMSPREE_FORM_ID);

  // Form input states
  const [name, setName] = useState('Sadia');
  const [message, setMessage] = useState('');
  const [selectedReaction, setSelectedReaction] = useState<string>('');
  const [hasDismissedError, setHasDismissedError] = useState(false);
  const [isSubmittingLocal, setIsSubmittingLocal] = useState(false);

  // Check if message was already sent previously to avoid duplicates
  const [isAlreadyDelivered, setIsAlreadyDelivered] = useState<boolean>(() => {
    try {
      return localStorage.getItem('sadiaBirthdayMessageSent') === 'true';
    } catch {
      return false;
    }
  });

  // Handle successful submission
  useEffect(() => {
    if (state.succeeded && !isAlreadyDelivered) {
      try {
        localStorage.setItem('sadiaBirthdayMessageSent', 'true');
      } catch (err) {
        console.warn('Could not write to localStorage:', err);
      }
      setIsAlreadyDelivered(true);

      // Subtle confetti & heart particle celebration burst
      sound.playSuccessChime();
      confetti({
        particleCount: 55,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#f43f5e', '#ec4899', '#f59e0b', '#fb7185', '#fda4af', '#fbbf24'],
        ticks: 240,
        scalar: 1.1,
      });
    }
  }, [state.succeeded, isAlreadyDelivered]);

  // Form submission handler
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (message.trim().length < 5 || state.submitting || isSubmittingLocal) {
      return;
    }

    setHasDismissedError(false);
    setIsSubmittingLocal(true);
    sound.playPop();

    try {
      await handleFormspreeSubmit(e);
    } catch (err) {
      console.error('Submission failed:', err);
    } finally {
      setIsSubmittingLocal(false);
    }
  };

  const isFormSubmitting = state.submitting || isSubmittingLocal;
  const isMessageValid = message.trim().length >= 5;
  const hasError = !hasDismissedError && (Boolean(state.errors && Object.keys(state.errors).length > 0) || (!FORMSPREE_FORM_ID && isFormSubmitting));

  return (
    <div
      id="page-messageForTanvir"
      className="min-h-screen w-full relative flex flex-col justify-between items-center text-zinc-100 overflow-x-hidden select-none p-3 sm:p-6"
    >
      {/* Existing Dark Cloud Background */}
      <CloudBackground overlay="dark" />

      {/* Atmospheric Floating Embers */}
      <EmbersBackground />

      {/* Subtle Low-Opacity ASCII Overlay */}
      <AsciiOverlay />

      {/* Floating Back Navigation Button */}
      <motion.button
        id="back-to-letter-btn"
        initial={{ opacity: 0, x: -12 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -12 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          sound.playPop();
          onBack();
        }}
        className="fixed top-3 sm:top-4 left-3 sm:left-4 z-50 flex items-center gap-1.5 sm:gap-2 py-1.5 sm:py-2 px-3 sm:px-4 rounded-full bg-zinc-900/90 backdrop-blur-md border border-white/10 text-xs sm:text-sm font-semibold text-zinc-300 hover:text-rose-400 hover:border-rose-500/40 shadow-lg transition-all cursor-pointer"
        title="Back to Birthday Letter"
      >
        <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        <span>Back to Letter</span>
      </motion.button>

      {/* Main Glassmorphism Card */}
      <main className="w-full flex-1 flex items-center justify-center pt-14 sm:pt-10 pb-8 px-2">
        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -16, scale: 0.96 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="relative w-full max-w-xl sm:max-w-2xl mx-auto rounded-3xl border border-white/10 bg-gradient-to-b from-zinc-900/95 via-zinc-900/90 to-zinc-950/95 backdrop-blur-2xl shadow-2xl shadow-black/60 p-6 sm:p-10 md:p-12 overflow-hidden"
        >
          {/* Subtle Ambient Radial Lighting */}
          <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-80 h-32 bg-gradient-to-r from-rose-500/15 via-pink-500/15 to-amber-500/15 blur-3xl rounded-full pointer-events-none" />

          {/* SUCCESS STATE */}
          {isAlreadyDelivered ? (
            <motion.div
              key="success-state"
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="flex flex-col items-center text-center py-6 sm:py-8 space-y-4"
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-rose-500/20 via-pink-500/20 to-amber-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400 shadow-xl shadow-rose-500/10 mb-2">
                <CheckCircle2 className="w-8 h-8 sm:w-10 sm:h-10 text-emerald-400 animate-pulse" />
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Message delivered 💌</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-100 font-['Outfit',sans-serif] tracking-tight max-w-md mx-auto leading-snug">
                Thank you for taking the journey, Sadia.
              </h2>

              <p className="text-sm sm:text-base text-zinc-300 max-w-md mx-auto leading-relaxed flex items-center justify-center gap-1.5 font-medium">
                <span>Now go have an amazing birthday, Lil Valcano</span>
                <Flame className="w-4 h-4 text-orange-500 fill-orange-500 inline" />
              </p>

              <div className="pt-6 border-t border-white/10 w-full max-w-sm flex flex-col gap-3">
                <button
                  type="button"
                  onClick={() => {
                    sound.playPop();
                    onBack();
                  }}
                  className="w-full py-3 px-6 rounded-full font-semibold text-sm text-zinc-200 bg-white/10 hover:bg-white/15 border border-white/15 hover:border-white/25 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Return to Birthday Experience</span>
                </button>
              </div>
            </motion.div>
          ) : (
            /* ACTIVE FORM STATE */
            <div className="relative z-10">
              {/* Header */}
              <div className="flex flex-col items-center text-center mb-6 sm:mb-8">
                {/* Small top label */}
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] sm:text-xs font-bold tracking-widest text-pink-400 bg-pink-500/10 border border-pink-500/20 mb-3 uppercase">
                  <MessageSquareHeart className="w-3.5 h-3.5 text-pink-400" />
                  <span>FINAL MESSAGE</span>
                </div>

                {/* Main Heading */}
                <h1 className="text-2xl sm:text-4xl font-extrabold text-zinc-100 font-['Outfit',sans-serif] tracking-tight leading-tight">
                  One last thing… 💌
                </h1>

                {/* Supporting Text */}
                <p className="mt-2 text-xs sm:text-sm text-zinc-300 max-w-md mx-auto leading-relaxed">
                  You reached the end of this little birthday world.
                  <br className="hidden sm:inline" />
                  {' '}If this website made you smile, leave me a message before you go.
                </p>

                {/* Optional Small Text */}
                <p className="mt-1 text-[11px] sm:text-xs text-zinc-400 flex items-center justify-center gap-1">
                  <Heart className="w-3 h-3 text-rose-400 fill-rose-400/60 inline" />
                  <span>Your message will be delivered privately to Tanvir.</span>
                </p>
              </div>

              {/* Form Element */}
              <form onSubmit={onSubmit} className="space-y-4 sm:space-y-5">
                {/* Hidden Fields for Formspree */}
                <input
                  type="hidden"
                  name="subject"
                  value="A message from Sadia’s birthday website 💌"
                />
                <input
                  type="hidden"
                  name="reaction"
                  value={selectedReaction || 'None'}
                />
                {/* Honeypot field for spam protection */}
                <input
                  type="text"
                  name="_gotcha"
                  className="hidden"
                  tabIndex={-1}
                  autoComplete="off"
                />

                {/* Name Field */}
                <div className="text-left space-y-1.5">
                  <label
                    htmlFor="field-sender-name"
                    className="block text-xs sm:text-sm font-semibold text-zinc-300"
                  >
                    From <span className="text-rose-400">*</span>
                  </label>
                  <input
                    id="field-sender-name"
                    name="name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    className="w-full px-4 py-2.5 sm:py-3 rounded-xl border border-zinc-700/80 bg-zinc-800/80 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-rose-500/50 focus:border-rose-400 transition-all font-medium text-sm sm:text-base backdrop-blur-sm"
                  />
                  <ValidationError prefix="Name" field="name" errors={state.errors} className="text-xs text-rose-400 mt-1" />
                </div>

                {/* Message Textarea */}
                <div className="text-left space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="field-message-text"
                      className="block text-xs sm:text-sm font-semibold text-zinc-300"
                    >
                      Your message <span className="text-rose-400">*</span>
                    </label>
                    <span
                      className={`text-[11px] sm:text-xs font-medium tabular-nums ${
                        message.length > 750
                          ? 'text-rose-400'
                          : message.length >= 5
                          ? 'text-zinc-400'
                          : 'text-zinc-500'
                      }`}
                    >
                      {message.length} / 800
                    </span>
                  </div>
                  <textarea
                    id="field-message-text"
                    name="message"
                    required
                    rows={4}
                    maxLength={800}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Write anything you want to tell me…"
                    className="w-full px-4 py-3 rounded-xl border border-zinc-700/80 bg-zinc-800/80 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-rose-500/50 focus:border-rose-400 transition-all font-medium text-sm sm:text-base backdrop-blur-sm resize-none leading-relaxed"
                  />
                  <ValidationError prefix="Message" field="message" errors={state.errors} className="text-xs text-rose-400 mt-1" />
                </div>

                {/* Reaction Selector (Optional Pills) */}
                <div className="text-left space-y-2 pt-1">
                  <label className="block text-xs font-semibold text-zinc-400">
                    Quick reaction <span className="text-[11px] font-normal text-zinc-500">(optional)</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {REACTIONS.map((rx) => {
                      const isSelected = selectedReaction === rx;
                      return (
                        <button
                          key={rx}
                          type="button"
                          onClick={() => {
                            sound.playMeow('chirp');
                            setSelectedReaction((prev) => (prev === rx ? '' : rx));
                          }}
                          className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer text-left ${
                            isSelected
                              ? 'bg-gradient-to-r from-rose-500/25 via-pink-500/25 to-amber-500/25 border-rose-400 text-rose-200 shadow-sm shadow-rose-500/20 scale-[1.02]'
                              : 'bg-zinc-800/70 hover:bg-zinc-800 border-zinc-700/70 text-zinc-300 hover:border-zinc-600'
                          }`}
                        >
                          {rx}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Error Banner */}
                {hasError && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3.5 rounded-xl bg-rose-950/60 border border-rose-800/80 text-rose-200 text-xs sm:text-sm flex flex-col sm:flex-row items-center justify-between gap-2.5 text-center sm:text-left"
                  >
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                      <span>The message could not be delivered right now. Please try again.</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setHasDismissedError(true)}
                      className="px-3 py-1 rounded-lg bg-rose-900/60 hover:bg-rose-900 text-rose-200 text-xs font-bold border border-rose-700/60 cursor-pointer shrink-0 transition-colors"
                    >
                      Try again
                    </button>
                  </motion.div>
                )}

                {/* Main Submit Button */}
                <div className="pt-2">
                  <motion.button
                    id="submit-message-btn"
                    type="submit"
                    disabled={!isMessageValid || isFormSubmitting}
                    whileHover={isMessageValid && !isFormSubmitting ? { scale: 1.02 } : {}}
                    whileTap={isMessageValid && !isFormSubmitting ? { scale: 0.98 } : {}}
                    className={`w-full py-3.5 px-6 rounded-full font-bold text-sm sm:text-base text-white transition-all duration-300 shadow-xl flex items-center justify-center gap-2 select-none ${
                      isMessageValid && !isFormSubmitting
                        ? 'bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 shadow-rose-500/30 cursor-pointer'
                        : 'bg-zinc-800/80 border border-zinc-700/60 text-zinc-500 cursor-not-allowed shadow-none'
                    }`}
                  >
                    {isFormSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-rose-300" />
                        <span>Delivering your message…</span>
                      </>
                    ) : (
                      <>
                        <span>Send it to Tanvir ✨</span>
                        <Send className="w-4 h-4" />
                      </>
                    )}
                  </motion.button>

                  {/* Character Requirement Hint */}
                  {!isMessageValid && message.length > 0 && (
                    <p className="text-[11px] text-zinc-400 text-center mt-2">
                      At least 5 characters required ({5 - message.trim().length} more to go)
                    </p>
                  )}
                </div>
              </form>
            </div>
          )}
        </motion.div>
      </main>

      {/* Subtle Footer with frosted glass backdrop */}
      <footer className="w-full py-2.5 px-3 text-center text-[11px] sm:text-xs font-medium text-zinc-400 bg-black/40 backdrop-blur-md border-t border-white/10 flex items-center justify-center gap-2 select-none">
        <span>Crafted with ☕ for Sadia (“Lil Valcano🌋”) • Keep shining ✨</span>
      </footer>
    </div>
  );
};

export default MessageForTanvir;
