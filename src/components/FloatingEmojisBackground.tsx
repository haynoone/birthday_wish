import React, { useMemo } from 'react';
import { motion } from 'motion/react';

interface FloatingEmoji {
  id: number;
  emoji: string;
  left: number; // percentage (0 - 100)
  size: number; // px
  duration: number; // seconds
  delay: number; // seconds
  driftX: number; // px horizontal drift
  initialRotate: number;
  rotateDelta: number;
  maxOpacity: number;
}

const BIRTHDAY_EMOJIS = [
  '🎂', // Birthday cake
  '🎈', // Balloon
  '🎉', // Party popper
  '✨', // Sparkles
  '💖', // Sparkling pink heart
  '🐱', // Kitten (Sadia's love for cats)
  '🌋', // Volcano ("Lil Valcano")
  '🍰', // Cake slice
  '🌟', // Glowing star
  '🎁', // Wrapped gift
  '💌', // Love letter
  '🌸', // Cherry blossom
  '🐾', // Cat paw prints
  '🧁', // Cupcake
  '🥳', // Party face
  '🌺', // Flower
];

interface FloatingEmojisBackgroundProps {
  count?: number;
  className?: string;
  intensity?: 'subtle' | 'vibrant';
}

export const FloatingEmojisBackground: React.FC<FloatingEmojisBackgroundProps> = ({
  count = 22,
  className = '',
  intensity = 'vibrant',
}) => {
  // Generate a balanced set of whimsical floating emojis
  const emojis = useMemo<FloatingEmoji[]>(() => {
    const list: FloatingEmoji[] = [];
    const baseOpacity = intensity === 'vibrant' ? 0.75 : 0.45;

    for (let i = 0; i < count; i++) {
      // Pick emoji with good variety
      const emoji = BIRTHDAY_EMOJIS[i % BIRTHDAY_EMOJIS.length];
      
      // Evenly distribute across the width with slight jitter
      const slotWidth = 100 / count;
      const left = Math.max(3, Math.min(97, slotWidth * i + (Math.random() * slotWidth * 0.8 - slotWidth * 0.4)));
      
      // Varied sizes from 18px to 34px
      const size = 18 + Math.floor(Math.random() * 18);
      
      // Float duration between 9s and 18s
      const duration = 10 + Math.random() * 8;
      
      // Stagger delays so emojis are already visible upon mount (-duration * random)
      // and continue indefinitely
      const delay = -(Math.random() * duration);
      
      // Horizontal gentle sway
      const driftX = (Math.random() - 0.5) * 50;
      
      // Rotation
      const initialRotate = (Math.random() - 0.5) * 40;
      const rotateDelta = (Math.random() - 0.5) * 90;
      
      const maxOpacity = baseOpacity * (0.65 + Math.random() * 0.35);

      list.push({
        id: i,
        emoji,
        left,
        size,
        duration,
        delay,
        driftX,
        initialRotate,
        rotateDelta,
        maxOpacity,
      });
    }
    return list;
  }, [count, intensity]);

  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 pointer-events-none select-none overflow-hidden z-0 ${className}`}
    >
      {emojis.map((item) => (
        <motion.div
          key={item.id}
          className="absolute will-change-transform flex items-center justify-center filter drop-shadow-[0_2px_10px_rgba(244,63,94,0.25)] dark:drop-shadow-[0_2px_12px_rgba(251,191,36,0.2)]"
          style={{
            left: `${item.left}%`,
            fontSize: `${item.size}px`,
            lineHeight: 1,
            bottom: '-40px',
          }}
          initial={{
            y: 0,
            x: 0,
            rotate: item.initialRotate,
            opacity: 0,
            scale: 0.8,
          }}
          animate={{
            y: ['0vh', '-120vh'],
            x: [
              0,
              item.driftX,
              -item.driftX * 0.7,
              item.driftX * 1.1,
              0,
            ],
            rotate: [
              item.initialRotate,
              item.initialRotate + item.rotateDelta * 0.5,
              item.initialRotate - item.rotateDelta * 0.3,
              item.initialRotate + item.rotateDelta,
            ],
            opacity: [
              0,
              item.maxOpacity,
              item.maxOpacity * 0.95,
              item.maxOpacity * 0.7,
              0,
            ],
            scale: [0.75, 1, 1.05, 0.9, 0.7],
          }}
          transition={{
            duration: item.duration,
            repeat: Infinity,
            ease: 'linear',
            delay: item.delay,
          }}
        >
          {item.emoji}
        </motion.div>
      ))}
    </div>
  );
};

export default FloatingEmojisBackground;
