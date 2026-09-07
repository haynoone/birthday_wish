import React, { useState, useRef, useEffect } from 'react';
import Spline from '@splinetool/react-spline';
import type { Application } from '@splinetool/runtime';
import { Sparkles, Loader2 } from 'lucide-react';

interface SplineLoveSceneProps {
  sceneUrl?: string;
  onLoaded?: () => void;
}

export const SplineLoveScene: React.FC<SplineLoveSceneProps> = ({
  sceneUrl = 'https://prod.spline.design/TqiNgTcnfA2Nnj24/scene.splinecode',
  onLoaded,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const splineAppRef = useRef<Application | null>(null);

  // Deep logo removal helper: scans the container and any child shadow roots
  const stripSplineWatermarks = () => {
    if (!containerRef.current) return;
    const root = containerRef.current;

    // Remove any anchor tags linking to spline or elements with spline branding
    const targetSelectors = [
      '#spline-logo',
      '#spline',
      '#logo',
      '.spline-watermark',
      'a[href*="spline.design"]',
      'a[href*="spline"]',
      '[id*="spline"] a',
      'canvas + a',
    ];

    targetSelectors.forEach((selector) => {
      root.querySelectorAll(selector).forEach((el) => {
        (el as HTMLElement).style.display = 'none';
        (el as HTMLElement).style.opacity = '0';
        (el as HTMLElement).style.pointerEvents = 'none';
        el.remove();
      });
    });

    // Check shadow roots if present
    const elementsWithShadow = root.querySelectorAll('*');
    elementsWithShadow.forEach((el) => {
      const shadow = (el as any).shadowRoot;
      if (shadow) {
        targetSelectors.forEach((selector) => {
          shadow.querySelectorAll(selector).forEach((innerEl: Element) => {
            (innerEl as HTMLElement).style.display = 'none';
            innerEl.remove();
          });
        });
      }
    });
  };

  useEffect(() => {
    stripSplineWatermarks();

    // Set up MutationObserver to aggressively catch and remove any watermark elements injected by Spline runtime
    let observer: MutationObserver | null = null;
    if (containerRef.current) {
      observer = new MutationObserver(() => {
        stripSplineWatermarks();
      });
      observer.observe(containerRef.current, {
        childList: true,
        subtree: true,
      });
    }

    const intervalId = setInterval(stripSplineWatermarks, 500);

    return () => {
      observer?.disconnect();
      clearInterval(intervalId);
    };
  }, []);

  const handleSplineLoad = (splineApp: Application) => {
    splineAppRef.current = splineApp;
    setIsLoading(false);

    // Disable internal logo pass if exposed on the renderer pipeline
    try {
      const app = splineApp as any;
      if (app._renderer?.pipeline?.logoOverlayPass) {
        app._renderer.pipeline.logoOverlayPass.enabled = false;
      }
      if (typeof app.setLogoVisible === 'function') {
        app.setLogoVisible(false);
      }
    } catch {
      // Safe fallback
    }

    stripSplineWatermarks();
    onLoaded?.();
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full flex items-center justify-center overflow-hidden select-none"
      style={{ touchAction: 'none' }}
    >
      {/* Loading state indicator */}
      {isLoading && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-zinc-950/80 backdrop-blur-sm gap-3">
          <div className="relative">
            <Loader2 className="w-8 h-8 text-rose-500 animate-spin" />
            <Sparkles className="w-4 h-4 text-amber-300 absolute inset-0 m-auto animate-pulse" />
          </div>
          <span className="text-xs font-semibold text-zinc-300 tracking-wide">
            Loading Interactive 3D Scene... ✨
          </span>
        </div>
      )}

      {/* Spline Canvas Component */}
      {!loadError ? (
        <div className="w-full h-full relative cursor-grab active:cursor-grabbing">
          <Spline
            scene={sceneUrl}
            onLoad={handleSplineLoad}
            style={{ width: '100%', height: '100%' }}
          />

          {/* Corner camouflage overlay: seamlessly blends over the bottom-right corner to shield any WebGL watermark stamp */}
          <div
            className="absolute bottom-0 right-0 w-36 h-12 pointer-events-none z-10 bg-gradient-to-tl from-zinc-950/90 via-zinc-950/40 to-transparent"
            aria-hidden="true"
          />
        </div>
      ) : (
        <div className="text-center p-6 text-zinc-400">
          <Sparkles className="w-10 h-10 text-rose-500/50 mx-auto mb-2" />
          <p className="text-sm">Unable to load 3D scene</p>
        </div>
      )}
    </div>
  );
};

export default SplineLoveScene;
