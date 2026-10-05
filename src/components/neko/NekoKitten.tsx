import React, { useEffect, useRef, useState, useCallback } from 'react';
import { sound } from '../../utils/sound';
import nekoImageSrc from '../../assets/images/neko.png';

const NEKO_IMG = nekoImageSrc || '/assets/images/neko.png';

/**
 * Coordinate mapping for the 256x128 Oneko sprite sheet (8 cols x 4 rows, each 32x32).
 * Values are [col, row] in negative offset indices matching standard Oneko background-position.
 */
export const SPRITE_SETS: Record<string, [number, number][]> = {
  idle: [[-3, -3]],
  alert: [[-7, -3]],
  scratchSelf: [
    [-5, 0],
    [-6, 0],
    [-7, 0],
  ],
  scratchWallN: [
    [0, 0],
    [0, -1],
  ],
  scratchWallS: [
    [-7, -1],
    [-6, -2],
  ],
  scratchWallE: [
    [-2, -2],
    [-2, -3],
  ],
  scratchWallW: [
    [-4, 0],
    [-4, -1],
  ],
  tired: [[-3, -2]],
  sleeping: [
    [-2, 0],
    [-2, -1],
  ],
  N: [
    [-1, -2],
    [-1, -3],
  ],
  NE: [
    [0, -2],
    [0, -3],
  ],
  E: [
    [-3, 0],
    [-3, -1],
  ],
  SE: [
    [-5, -1],
    [-5, -2],
  ],
  S: [
    [-6, -3],
    [-7, -2],
  ],
  SW: [
    [-5, -3],
    [-6, -1],
  ],
  W: [
    [-4, -2],
    [-4, -3],
  ],
  NW: [
    [-1, 0],
    [-1, -1],
  ],
};

export interface NekoSpriteProps {
  state: keyof typeof SPRITE_SETS | string;
  frame?: number;
  size?: number; // in pixels (default 48px, 1.5x scale of 32px)
  className?: string;
}

/**
 * Reusable component to render any angle or pose directly from src/assets/images/neko.png
 */
export const NekoSprite: React.FC<NekoSpriteProps> = ({
  state,
  frame = 0,
  size = 48,
  className = '',
}) => {
  const frames = SPRITE_SETS[state] || SPRITE_SETS.idle;
  const activeFrame = frames[frame % frames.length];
  const [col, row] = activeFrame;

  const scale = size / 32;
  const bgWidth = 256 * scale;
  const bgHeight = 128 * scale;
  const posX = col * 32 * scale;
  const posY = row * 32 * scale;

  return (
    <div
      style={{
        width: `${size}px`,
        height: `${size}px`,
        backgroundImage: `url(${NEKO_IMG})`,
        backgroundSize: `${bgWidth}px ${bgHeight}px`,
        backgroundPosition: `${posX}px ${posY}px`,
        imageRendering: 'pixelated',
      }}
      className={`inline-block select-none pointer-events-none ${className}`}
    />
  );
};

interface NekoKittenProps {
  enabled?: boolean;
}

export const NekoKitten: React.FC<NekoKittenProps> = ({ enabled = true }) => {
  // Sprite size in pixels (48px provides clear retro readability on modern monitors)
  const SPRITE_SIZE = 48;
  const SCALE = SPRITE_SIZE / 32;
  const BG_WIDTH = 256 * SCALE;
  const BG_HEIGHT = 128 * SCALE;

  const [position, setPosition] = useState({ x: 120, y: 120 });
  const [spriteState, setSpriteState] = useState<keyof typeof SPRITE_SETS>('idle');
  const [spriteFrame, setSpriteFrame] = useState(0);
  const [petReaction, setPetReaction] = useState<string | null>(null);

  const nekoPosRef = useRef({ x: 120, y: 120 });
  const targetPosRef = useRef({ x: 120, y: 120 });
  const idleTimeRef = useRef(0);
  const idleAnimationRef = useRef<string | null>(null);
  const idleAnimFrameRef = useRef(0);
  const frameCountRef = useRef(0);
  const alertCountdownRef = useRef(0);
  const lastTickRef = useRef(performance.now());
  const animFrameIdRef = useRef<number | null>(null);
  const reactionTimerRef = useRef<number | null>(null);

  // Mouse & touch handlers
  useEffect(() => {
    if (!enabled) return;

    // Initial center placement
    if (typeof window !== 'undefined') {
      const initX = Math.min(window.innerWidth - 60, Math.max(60, window.innerWidth / 2));
      const initY = Math.min(window.innerHeight - 60, Math.max(60, window.innerHeight / 2));
      nekoPosRef.current = { x: initX, y: initY };
      targetPosRef.current = { x: initX, y: initY };
      setPosition({ x: initX, y: initY });
    }

    const handleMouseMove = (e: MouseEvent) => {
      targetPosRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        targetPosRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };

    const handleWindowClick = (e: MouseEvent) => {
      // Allow user to click anywhere to attract Neko
      targetPosRef.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchstart', handleTouchMove, { passive: true });
    window.addEventListener('click', handleWindowClick);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchstart', handleTouchMove);
      window.removeEventListener('click', handleWindowClick);
    };
  }, [enabled]);

  // Main classic Oneko game-loop with 100ms tick interval
  useEffect(() => {
    if (!enabled) return;

    const SPEED = 11; // Pixels per tick
    const TICK_MS = 95; // ~10.5 FPS tick rate (classic retro speed)

    const updateFrame = (now: number) => {
      if (now - lastTickRef.current >= TICK_MS) {
        lastTickRef.current = now;
        frameCountRef.current += 1;

        const currentX = nekoPosRef.current.x;
        const currentY = nekoPosRef.current.y;
        const targetX = targetPosRef.current.x;
        const targetY = targetPosRef.current.y;

        const diffX = currentX - targetX;
        const diffY = currentY - targetY;
        const distance = Math.hypot(diffX, diffY);

        // Distance threshold to stop and enter idle state (around cursor radius)
        if (distance < 36) {
          // Arrived at target!
          idleTimeRef.current += 1;

          // Trigger idle behaviors periodically
          if (
            idleTimeRef.current > 12 &&
            Math.floor(Math.random() * 20) === 0 &&
            idleAnimationRef.current === null
          ) {
            const available: string[] = ['sleeping', 'scratchSelf'];
            if (currentX < 40) available.push('scratchWallW');
            if (currentY < 40) available.push('scratchWallN');
            if (currentX > window.innerWidth - 40) available.push('scratchWallE');
            if (currentY > window.innerHeight - 40) available.push('scratchWallS');

            idleAnimationRef.current = available[Math.floor(Math.random() * available.length)];
            idleAnimFrameRef.current = 0;
          }

          if (idleAnimationRef.current) {
            switch (idleAnimationRef.current) {
              case 'sleeping': {
                if (idleAnimFrameRef.current < 6) {
                  // Yawn first
                  setSpriteState('tired');
                  setSpriteFrame(0);
                } else {
                  // Curled up sleeping with Zzz
                  setSpriteState('sleeping');
                  setSpriteFrame(Math.floor(idleAnimFrameRef.current / 3));
                }
                if (idleAnimFrameRef.current > 160) {
                  // Wake up after sleeping for a while
                  idleAnimationRef.current = null;
                  idleAnimFrameRef.current = 0;
                }
                break;
              }
              case 'scratchSelf':
              case 'scratchWallN':
              case 'scratchWallS':
              case 'scratchWallE':
              case 'scratchWallW': {
                setSpriteState(idleAnimationRef.current as keyof typeof SPRITE_SETS);
                setSpriteFrame(idleAnimFrameRef.current);
                if (idleAnimFrameRef.current > 11) {
                  idleAnimationRef.current = null;
                  idleAnimFrameRef.current = 0;
                }
                break;
              }
              default: {
                setSpriteState('idle');
                setSpriteFrame(0);
                break;
              }
            }
            idleAnimFrameRef.current += 1;
          } else {
            // Calm sitting idle
            setSpriteState('idle');
            setSpriteFrame(0);
          }
        } else {
          // In motion!
          idleAnimationRef.current = null;
          idleAnimFrameRef.current = 0;

          // If transitioning from deep idle to moving, show alert expression first!
          if (idleTimeRef.current > 1) {
            if (alertCountdownRef.current === 0) {
              alertCountdownRef.current = Math.min(Math.floor(idleTimeRef.current / 2), 4);
            }
            setSpriteState('alert');
            setSpriteFrame(0);
            alertCountdownRef.current -= 1;
            if (alertCountdownRef.current <= 0) {
              idleTimeRef.current = 0;
            }
          } else {
            // Calculate precise 8-directional vector
            let direction = '';
            direction += diffY / distance > 0.4 ? 'N' : '';
            direction += diffY / distance < -0.4 ? 'S' : '';
            direction += diffX / distance > 0.4 ? 'W' : '';
            direction += diffX / distance < -0.4 ? 'E' : '';

            if (!direction) {
              direction = diffY > 0 ? 'N' : 'S';
            }

            setSpriteState(direction as keyof typeof SPRITE_SETS);
            setSpriteFrame(frameCountRef.current % 2);

            // Step position toward target
            const stepX = (diffX / distance) * Math.min(SPEED, distance);
            const stepY = (diffY / distance) * Math.min(SPEED, distance);

            const nextX = Math.min(
              Math.max(SPRITE_SIZE / 2, currentX - stepX),
              window.innerWidth - SPRITE_SIZE / 2
            );
            const nextY = Math.min(
              Math.max(SPRITE_SIZE / 2, currentY - stepY),
              window.innerHeight - SPRITE_SIZE / 2
            );

            nekoPosRef.current = { x: nextX, y: nextY };
            setPosition({ x: nextX, y: nextY });
          }
        }
      }

      animFrameIdRef.current = requestAnimationFrame(updateFrame);
    };

    animFrameIdRef.current = requestAnimationFrame(updateFrame);

    return () => {
      if (animFrameIdRef.current !== null) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, [enabled]);

  // Petting interaction
  const handlePetKitten = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      e.stopPropagation();
      sound.playMeow();

      // Show temporary reaction
      const reactions = ['😺 purrr~', '🐾 meow!', '✨ nya~', '😸 *happy*', '⭐ *headbutt*'];
      const chosen = reactions[Math.floor(Math.random() * reactions.length)];
      setPetReaction(chosen);

      // Cute alert or yawn reaction
      setSpriteState('tired');
      setSpriteFrame(0);
      idleTimeRef.current = 0;
      idleAnimationRef.current = null;

      if (reactionTimerRef.current) {
        window.clearTimeout(reactionTimerRef.current);
      }
      reactionTimerRef.current = window.setTimeout(() => {
        setPetReaction(null);
      }, 1200);
    },
    []
  );

  if (!enabled) return null;

  // Active sprite coordinates
  const activeFrames = SPRITE_SETS[spriteState] || SPRITE_SETS.idle;
  const currentCoords = activeFrames[spriteFrame % activeFrames.length];
  const [col, row] = currentCoords;

  const bgPosX = col * 32 * SCALE;
  const bgPosY = row * 32 * SCALE;

  return (
    <div
      id="neko-kitten-overlay"
      style={{
        transform: `translate3d(${position.x - SPRITE_SIZE / 2}px, ${position.y - SPRITE_SIZE / 2}px, 0)`,
        width: `${SPRITE_SIZE}px`,
        height: `${SPRITE_SIZE}px`,
      }}
      className="fixed top-0 left-0 z-50 select-none pointer-events-none transition-none will-change-transform"
    >
      {/* Floating Reaction Message */}
      {petReaction && (
        <span className="absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs font-bold text-rose-500 dark:text-rose-300 bg-white/95 dark:bg-zinc-900/95 px-2.5 py-0.5 rounded-full shadow-lg border border-rose-200 dark:border-rose-800 animate-bounce pointer-events-none">
          {petReaction}
        </span>
      )}

      {/* Interactive Neko Sprite */}
      <div
        id="neko-sprite-element"
        onClick={handlePetKitten}
        title="Neko Pet: Click me to pet! 🐾"
        style={{
          width: `${SPRITE_SIZE}px`,
          height: `${SPRITE_SIZE}px`,
          backgroundImage: `url(${NEKO_IMG})`,
          backgroundSize: `${BG_WIDTH}px ${BG_HEIGHT}px`,
          backgroundPosition: `${bgPosX}px ${bgPosY}px`,
          imageRendering: 'pixelated',
        }}
        className="pointer-events-auto cursor-pointer drop-shadow-md hover:scale-110 active:scale-95 transition-transform duration-75 dark:drop-shadow-[0_0_1.5px_rgba(255,255,255,0.95)]"
      />
    </div>
  );
};

export default NekoKitten;

