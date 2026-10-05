import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import { sound } from '../../utils/sound';

interface RunawayButtonProps {
  label: string;
  proximityThreshold?: number; // default 80px
  className?: string;
  id?: string;
  onEvade?: (count: number) => void;
}

export const RunawayButton: React.FC<RunawayButtonProps> = ({
  label,
  proximityThreshold = 80,
  className = '',
  id = 'runaway-button',
  onEvade,
}) => {
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [evadeCount, setEvadeCount] = useState(0);
  const evadeCountRef = useRef(0);
  const lastTeleportTimeRef = useRef(0);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const onEvadeRef = useRef(onEvade);
  onEvadeRef.current = onEvade;

  const teleport = useCallback(() => {
    const now = Date.now();
    // Debounce rapid re-triggers
    if (now - lastTeleportTimeRef.current < 160) {
      return;
    }
    lastTeleportTimeRef.current = now;

    // Determine viewport constraints
    const button = buttonRef.current;
    const buttonRect = button?.getBoundingClientRect();
    const btnWidth = buttonRect ? buttonRect.width : 90;
    const btnHeight = buttonRect ? buttonRect.height : 44;

    const currentLeft = buttonRect ? buttonRect.left : window.innerWidth / 2;
    const currentTop = buttonRect ? buttonRect.top : window.innerHeight / 2;

    // Strict boundary limits to prevent horizontal page overflow or clipping
    const minAllowedX = -(currentLeft - 20);
    const maxAllowedX = window.innerWidth - (currentLeft + btnWidth) - 20;
    const minAllowedY = -(currentTop - 80);
    const maxAllowedY = window.innerHeight - (currentTop + btnHeight) - 60;

    // Pick random target offset away from current spot
    const randomSignX = Math.random() > 0.5 ? 1 : -1;
    const randomSignY = Math.random() > 0.5 ? 1 : -1;

    const rawDistanceX = Math.random() * 140 + 70;
    const rawDistanceY = Math.random() * 120 + 50;

    let targetX = rawDistanceX * randomSignX;
    let targetY = rawDistanceY * randomSignY;

    // Clamp strictly within viewport
    targetX = Math.max(minAllowedX, Math.min(maxAllowedX, targetX));
    targetY = Math.max(minAllowedY, Math.min(maxAllowedY, targetY));

    setOffset({ x: targetX, y: targetY });
    const nextCount = evadeCountRef.current + 1;
    evadeCountRef.current = nextCount;
    setEvadeCount(nextCount);

    // Call outside the state setter to prevent setState-in-render warning in parent
    if (onEvadeRef.current) {
      onEvadeRef.current(nextCount);
    }

    sound.playPop();
  }, []);

  // Global mousemove tracking for 80px proximity trigger
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!buttonRef.current) return;
      const rect = buttonRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const dist = Math.hypot(e.clientX - centerX, e.clientY - centerY);

      if (dist < proximityThreshold) {
        teleport();
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [proximityThreshold, teleport]);

  return (
    <motion.button
      ref={buttonRef}
      id={id}
      type="button"
      animate={{ x: offset.x, y: offset.y }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 20,
        mass: 0.6,
      }}
      onMouseEnter={teleport}
      onTouchStart={(e) => {
        e.preventDefault();
        teleport();
      }}
      onClick={(e) => {
        e.preventDefault();
        teleport();
      }}
      className={`relative select-none cursor-pointer transition-colors ${className}`}
    >
      {label}
    </motion.button>
  );
};

export default RunawayButton;
