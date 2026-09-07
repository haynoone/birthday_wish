import confetti from 'canvas-confetti';
import { sound } from './sound';

export interface CelebrationOptions {
  originY?: number;
  playSound?: boolean;
  intensity?: 'gentle' | 'normal' | 'grand';
}

/**
 * Triggers a detailed, multi-stage celebratory confetti explosion
 * with gold sparkles, colorful ribbons, and plays a soft chime sound.
 */
export const triggerCelebration = (options: CelebrationOptions = {}) => {
  const { originY = 0.65, playSound = true, intensity = 'normal' } = options;

  if (playSound) {
    sound.playCelebrationSoftSound();
  }

  const baseColors = ['#f43f5e', '#fb7185', '#f59e0b', '#10b981', '#6366f1', '#ec4899', '#fbbf24'];

  // Stage 1: Central fountain blast
  confetti({
    particleCount: intensity === 'grand' ? 120 : intensity === 'gentle' ? 45 : 85,
    spread: intensity === 'grand' ? 100 : 75,
    startVelocity: intensity === 'grand' ? 45 : 35,
    origin: { y: originY },
    colors: baseColors,
    scalar: 1.1,
    ticks: 240,
    shapes: ['circle', 'square'],
  });

  // Stage 2: Left and right flanking bursts (delicate ribbons & sparks)
  setTimeout(() => {
    confetti({
      particleCount: intensity === 'grand' ? 60 : 40,
      angle: 60,
      spread: 60,
      origin: { x: 0.05, y: originY + 0.05 },
      colors: ['#fbbf24', '#f43f5e', '#ec4899', '#38bdf8'],
      scalar: 1.2,
      ticks: 200,
    });
    confetti({
      particleCount: intensity === 'grand' ? 60 : 40,
      angle: 120,
      spread: 60,
      origin: { x: 0.95, y: originY + 0.05 },
      colors: ['#fbbf24', '#f43f5e', '#ec4899', '#38bdf8'],
      scalar: 1.2,
      ticks: 200,
    });
  }, 180);

  // Stage 3: Gentle lingering golden star fall
  if (intensity !== 'gentle') {
    setTimeout(() => {
      confetti({
        particleCount: intensity === 'grand' ? 50 : 30,
        spread: 120,
        startVelocity: 25,
        decay: 0.92,
        origin: { y: originY - 0.2 },
        colors: ['#f59e0b', '#fbbf24', '#fef08a', '#fda4af'],
        scalar: 0.9,
        ticks: 260,
      });
    }, 420);
  }
};
