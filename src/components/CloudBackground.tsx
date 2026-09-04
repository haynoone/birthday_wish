import React from 'react';
import { motion } from 'motion/react';
import backgroundImage from '../assets/images/background.jpg';

interface CloudBackgroundProps {
  overlay?: 'light' | 'dark' | 'glass';
  className?: string;
}

export const CloudBackground: React.FC<CloudBackgroundProps> = ({
  overlay = 'light',
  className = '',
}) => {
  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 w-full h-full -z-20 overflow-hidden pointer-events-none select-none ${className}`}
    >
      {/* Anime Cloud & Meadow Landscape Background Image */}
      <motion.img
        initial={{ opacity: 0, scale: 1.05 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
        src={backgroundImage}
        alt="Anime Cloud Landscape"
        referrerPolicy="no-referrer"
        className="w-full h-full object-cover object-center"
      />

      {/* Atmospheric Overlays for Optimal Visual Contrast */}
      {overlay === 'dark' ? (
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/40 via-zinc-950/50 to-zinc-950/70 backdrop-blur-[1px]" />
      ) : overlay === 'glass' ? (
        <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-white/10 to-amber-50/20 dark:from-black/40 dark:via-black/30 dark:to-black/50 backdrop-blur-[0.5px]" />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-white/30 dark:from-black/30 dark:via-black/20 dark:to-black/40" />
      )}

      {/* Subtle Ambient Radial Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.15)_100%)] pointer-events-none" />
    </div>
  );
};

export default CloudBackground;
