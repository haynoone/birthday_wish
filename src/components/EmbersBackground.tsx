import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  radius: number;
  speedY: number;
  speedX: number;
  opacity: number;
  fadeSpeed: number;
  color: string;
}

export const EmbersBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Color palette of warm embers (volcano/ember glow)
    const emberColors = [
      'rgba(249, 115, 22, ', // orange-500
      'rgba(244, 63, 94, ',  // rose-500
      'rgba(251, 191, 36, ', // amber-400
      'rgba(239, 68, 68, ',  // red-500
    ];

    const particleCount = Math.min(Math.floor(width / 24), 55);
    const particles: Particle[] = [];

    const createParticle = (initialRandomY = false): Particle => {
      const colorBase = emberColors[Math.floor(Math.random() * emberColors.length)];
      return {
        x: Math.random() * width,
        y: initialRandomY ? Math.random() * height : height + 10 + Math.random() * 20,
        radius: Math.random() * 2 + 1,
        speedY: Math.random() * 0.7 + 0.25,
        speedX: (Math.random() - 0.5) * 0.4,
        opacity: Math.random() * 0.6 + 0.2,
        fadeSpeed: Math.random() * 0.004 + 0.002,
        color: colorBase,
      };
    };

    for (let i = 0; i < particleCount; i++) {
      particles.push(createParticle(true));
    }

    let isRunning = true;

    const render = () => {
      if (!isRunning) return;
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.y -= p.speedY;
        p.x += p.speedX;
        p.opacity -= p.fadeSpeed;

        if (p.opacity <= 0 || p.y < -10) {
          particles[i] = createParticle(false);
          continue;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${p.opacity})`;
        ctx.shadowColor = p.color.replace('rgba', 'rgb').replace(', ', ')');
        ctx.shadowBlur = p.radius * 3;
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
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      aria-hidden="true"
    />
  );
};
