import React, { useEffect, useRef } from 'react';

const ASCII_CHARS = '.,-~:;=!*#$@%';

export const AsciiOverlay = ({
  density = 0.28, // Sparse occupancy (28% of cells filled)
  fontSize = 11,
  color = 'rgba(235, 240, 255, 0.11)', // Soft light gray/white with low opacity (0.08 - 0.15)
  speed = 0.35, // Very slow gentle drift
  fps = 15, // Capped between 12-18 FPS
  className = '',
}) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let lastFrameTime = 0;
    const frameInterval = 1000 / fps;

    // Check for prefers-reduced-motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    let prefersReducedMotion = mediaQuery.matches;

    const handleMotionChange = (e) => {
      prefersReducedMotion = e.matches;
      if (prefersReducedMotion) {
        if (animationFrameId) cancelAnimationFrame(animationFrameId);
        draw(0);
      } else {
        lastFrameTime = performance.now();
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleMotionChange);
    } else {
      mediaQuery.addListener(handleMotionChange);
    }

    // Grid measurements
    const charSpacingX = Math.round(fontSize * 2.2); // Large spacing for low density
    const charSpacingY = Math.round(fontSize * 2.0);

    let cols = 0;
    let rows = 0;
    let grid = [];
    let driftY = 0;
    let driftX = 0;

    const initGrid = () => {
      const dpr = window.devicePixelRatio || 1;
      const width = window.innerWidth;
      const height = window.innerHeight;

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.scale(dpr, dpr);

      cols = Math.ceil(width / charSpacingX) + 2;
      rows = Math.ceil(height / charSpacingY) + 2;

      grid = [];
      for (let r = 0; r < rows; r++) {
        const rowData = [];
        for (let c = 0; c < cols; c++) {
          const isFilled = Math.random() < density;
          if (isFilled) {
            rowData.push({
              char: ASCII_CHARS[Math.floor(Math.random() * ASCII_CHARS.length)],
              opacity: 0.08 + Math.random() * 0.06, // Opacity between 0.08 and 0.14
              flickerSpeed: 0.01 + Math.random() * 0.02,
              baseOpacity: 0.08 + Math.random() * 0.06,
            });
          } else {
            rowData.push(null);
          }
        }
        grid.push(rowData);
      }
    };

    initGrid();

    const handleResize = () => {
      initGrid();
      if (prefersReducedMotion) {
        draw(0);
      }
    };

    window.addEventListener('resize', handleResize);

    const draw = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      ctx.clearRect(0, 0, width, height);

      ctx.font = `${fontSize}px "SFMono-Regular", Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      const offsetX = driftX % charSpacingX;
      const offsetY = driftY % charSpacingY;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const cell = grid[r]?.[c];
          if (!cell) continue;

          // Subtle character morphing / flicker (low frequency)
          if (Math.random() < 0.012) {
            cell.char = ASCII_CHARS[Math.floor(Math.random() * ASCII_CHARS.length)];
          }

          const x = (c * charSpacingX - offsetX + width) % width;
          const y = (r * charSpacingY - offsetY + height) % height;

          // Gentle breathing opacity
          const currentOpacity = Math.max(
            0.06,
            Math.min(0.15, cell.baseOpacity + Math.sin(driftY * 0.05 + c + r) * 0.03)
          );

          ctx.fillStyle = `rgba(240, 245, 255, ${currentOpacity.toFixed(3)})`;
          ctx.fillText(cell.char, x, y);
        }
      }
    };

    const animate = (currentTime) => {
      animationFrameId = requestAnimationFrame(animate);

      const elapsed = currentTime - lastFrameTime;
      if (elapsed < frameInterval) return;

      lastFrameTime = currentTime - (elapsed % frameInterval);

      // Very slow drift: gentle vertical rise with subtle diagonal shift
      driftY += speed;
      driftX += speed * 0.2;

      draw();
    };

    if (prefersReducedMotion) {
      draw();
    } else {
      lastFrameTime = performance.now();
      animationFrameId = requestAnimationFrame(animate);
    }

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleMotionChange);
      } else {
        mediaQuery.removeListener(handleMotionChange);
      }
    };
  }, [density, fontSize, color, speed, fps]);

  return (
    <canvas
      id="ascii-animation-overlay"
      ref={canvasRef}
      aria-hidden="true"
      className={`fixed inset-0 w-full h-full pointer-events-none z-[1] select-none ${className}`}
    />
  );
};

export default AsciiOverlay;
