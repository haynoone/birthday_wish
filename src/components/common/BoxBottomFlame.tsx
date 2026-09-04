import React, { useEffect, useRef } from 'react';
import { motion } from 'motion/react';

interface BoxBottomFlameProps {
  className?: string;
  intensity?: 'normal' | 'vibrant';
}

interface Spark {
  x: number;
  y: number;
  radius: number;
  speedY: number;
  speedX: number;
  opacity: number;
  fadeSpeed: number;
  color: string;
}

export const BoxBottomFlame: React.FC<BoxBottomFlameProps> = ({
  className = '',
  intensity = 'normal',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    // Check prefers-reduced-motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 400);
    let height = (canvas.height = 140);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = 140;
    };

    window.addEventListener('resize', handleResize);

    // Warm embers palette identical to landing page
    const emberColors = [
      'rgba(249, 115, 22, ', // orange-500
      'rgba(244, 63, 94, ',  // rose-500
      'rgba(251, 191, 36, ', // amber-400
      'rgba(239, 68, 68, ',  // red-500
    ];

    const sparkCount = Math.min(Math.floor(width / 28), 24);
    const sparks: Spark[] = [];

    const createSpark = (initialRandomY = false): Spark => {
      const colorBase = emberColors[Math.floor(Math.random() * emberColors.length)];
      return {
        x: Math.random() * width,
        y: initialRandomY ? Math.random() * height : height - Math.random() * 15,
        radius: Math.random() * 1.8 + 0.8,
        speedY: Math.random() * 0.85 + 0.35,
        speedX: (Math.random() - 0.5) * 0.5,
        opacity: Math.random() * 0.7 + 0.3,
        fadeSpeed: Math.random() * 0.008 + 0.005,
        color: colorBase,
      };
    };

    for (let i = 0; i < sparkCount; i++) {
      sparks.push(createSpark(true));
    }

    let isRunning = true;

    const render = () => {
      if (!isRunning) return;
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < sparks.length; i++) {
        const s = sparks[i];
        s.y -= s.speedY;
        s.x += s.speedX;
        s.opacity -= s.fadeSpeed;

        if (s.opacity <= 0 || s.y < 0) {
          sparks[i] = createSpark(false);
          continue;
        }

        ctx.beginPath();
        ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${s.color}${s.opacity})`;
        ctx.shadowColor = s.color.replace('rgba', 'rgb').replace(', ', ')');
        ctx.shadowBlur = s.radius * 3.5;
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      isRunning = false;
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div
      className={`absolute inset-x-0 bottom-0 pointer-events-none overflow-visible select-none ${className}`}
      aria-hidden="true"
    >
      {/* 1. Deep Atmospheric Flame Halo under the box */}
      <motion.div
        animate={{
          opacity: intensity === 'vibrant' ? [0.75, 0.95, 0.8, 1, 0.75] : [0.6, 0.85, 0.7, 0.9, 0.6],
          scaleY: [1, 1.15, 0.95, 1.1, 1],
          scaleX: [1, 0.98, 1.02, 0.98, 1],
        }}
        transition={{
          duration: 3.2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-4/5 h-24 bg-gradient-to-t from-orange-600/40 via-amber-500/25 to-transparent blur-2xl rounded-full pointer-events-none -z-10"
      />

      {/* 2. Inner warm flame wash climbing up the bottom of the card */}
      <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-orange-600/25 via-amber-500/10 to-transparent rounded-b-3xl pointer-events-none" />

      {/* 3. Small rising flame sparks canvas inside lower card area */}
      <canvas
        ref={canvasRef}
        className="absolute bottom-0 left-0 w-full h-36 pointer-events-none opacity-90 rounded-b-3xl"
      />

      {/* 4. Bottom burning rim highlight line */}
      <div className="absolute bottom-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-orange-500 via-amber-400 to-transparent shadow-[0_0_15px_rgba(245,158,11,0.7)] pointer-events-none" />

      {/* 5. Center intense focal flame glow at very bottom edge */}
      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-48 h-3 bg-amber-400/30 blur-md rounded-full pointer-events-none" />
    </div>
  );
};
