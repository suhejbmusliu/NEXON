// Shared scroll-progress signal updated by SmoothScroll (Lenis) and read inside
// the R3F useFrame loop. Module-level mutable to avoid React re-renders on scroll.
export const scrollState = {
  progress: 0,
};
