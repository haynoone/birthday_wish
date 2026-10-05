import nekoImageSrc from '../../assets/images/neko.png';

export const NEKO_IMG = nekoImageSrc || '/assets/images/neko.png';

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
