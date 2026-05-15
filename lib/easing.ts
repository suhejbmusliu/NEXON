export const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

export const remap01 = (v: number, a: number, b: number) =>
  clamp01((v - a) / (b - a));

export const easeInOut = (t: number) =>
  t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

export const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

export const easeIn = (t: number) => t * t * t;
