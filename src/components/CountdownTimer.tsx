import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export interface CountdownTimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isComplete: boolean;
}

interface CountdownTimerProps {
  targetDate: string; // ISO string e.g. "2026-10-28T00:00:00"
  onComplete?: () => void;
  className?: string;
  frozen?: boolean;
}

export function calculateTimeRemaining(targetDate: string): CountdownTimeRemaining {
  const target = new Date(targetDate).getTime();
  const now = Date.now();
  const difference = target - now;

  if (difference <= 0 || isNaN(difference)) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      isComplete: true,
    };
  }

  const totalSeconds = Math.floor(difference / 1000);
  const days = Math.floor(totalSeconds / (3600 * 24));
  const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return {
    days,
    hours,
    minutes,
    seconds,
    isComplete: false,
  };
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({
  targetDate,
  onComplete,
  className = '',
  frozen = false,
}) => {
  const [timeLeft, setTimeLeft] = useState<CountdownTimeRemaining>(() =>
    frozen
      ? { days: 0, hours: 0, minutes: 0, seconds: 0, isComplete: true }
      : calculateTimeRemaining(targetDate)
  );

  const completedCalledRef = useRef(false);

  useEffect(() => {
    if (frozen) {
      setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isComplete: true });
      return;
    }

    // Initial check
    const initial = calculateTimeRemaining(targetDate);
    setTimeLeft(initial);

    if (initial.isComplete && !completedCalledRef.current) {
      completedCalledRef.current = true;
      onComplete?.();
      return;
    }

    const interval = setInterval(() => {
      const updated = calculateTimeRemaining(targetDate);
      setTimeLeft(updated);

      if (updated.isComplete && !completedCalledRef.current) {
        completedCalledRef.current = true;
        clearInterval(interval);
        onComplete?.();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate, onComplete, frozen]);

  const effectiveDays = frozen ? 0 : timeLeft.days;
  const effectiveHours = frozen ? 0 : timeLeft.hours;
  const effectiveMinutes = frozen ? 0 : timeLeft.minutes;
  const effectiveSeconds = frozen ? 0 : timeLeft.seconds;

  const cards = [
    { label: 'Days', value: effectiveDays, pad: true },
    { label: 'Hours', value: effectiveHours, pad: true },
    { label: 'Minutes', value: effectiveMinutes, pad: true },
    { label: 'Seconds', value: effectiveSeconds, pad: true },
  ];

  return (
    <div
      id="countdown-timer-container"
      className={`grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4 max-w-xl mx-auto w-full px-1 sm:px-0 ${className}`}
    >
      {cards.map((item) => {
        const displayValue = item.pad
          ? String(item.value).padStart(2, '0')
          : String(item.value);

        return (
          <div
            key={item.label}
            id={`countdown-card-${item.label.toLowerCase()}`}
            className="relative group rounded-xl sm:rounded-2xl p-3 sm:p-5 bg-zinc-900/60 backdrop-blur-xl border border-white/10 hover:border-amber-500/30 shadow-2xl transition-all duration-300 flex flex-col items-center justify-center overflow-hidden"
          >
            {/* Subtle inner top glow */}
            <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-amber-400/40 to-transparent" />
            
            {/* Background ember radial glow */}
            <div className="absolute -bottom-8 -right-8 w-20 h-20 bg-amber-600/10 rounded-full blur-xl group-hover:bg-rose-500/20 transition-all duration-500 pointer-events-none" />

            {/* Digit with slide & fade Framer Motion animation */}
            <div className="h-10 sm:h-14 flex items-center justify-center font-mono font-bold text-2xl sm:text-4xl lg:text-5xl text-zinc-100 tracking-tight select-none">
              <AnimatePresence mode="popLayout">
                <motion.span
                  key={displayValue}
                  initial={{ y: 12, opacity: 0, scale: 0.95 }}
                  animate={{ y: 0, opacity: 1, scale: 1 }}
                  exit={{ y: -12, opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                  className="inline-block bg-gradient-to-b from-white via-zinc-100 to-zinc-300 bg-clip-text text-transparent drop-shadow-sm"
                >
                  {displayValue}
                </motion.span>
              </AnimatePresence>
            </div>

            {/* Label */}
            <span className="mt-1 text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-amber-300/80 group-hover:text-amber-300 transition-colors">
              {item.label}
            </span>
          </div>
        );
      })}
    </div>
  );
};
