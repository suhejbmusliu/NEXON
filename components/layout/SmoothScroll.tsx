'use client';

import { ReactNode, useEffect } from 'react';
import Lenis from 'lenis';
import { scrollState } from '@/lib/scroll';

declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

export default function SmoothScroll({ children }: { children: ReactNode }) {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.4,
      smoothWheel: true,
    });
    window.__lenis = lenis;

    const handleScroll = ({ scroll, limit }: { scroll: number; limit: number }) => {
      scrollState.progress = limit > 0 ? scroll / limit : 0;
    };
    lenis.on('scroll', handleScroll);

    let frame = 0;
    function raf(time: number) {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    }
    frame = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
      delete window.__lenis;
    };
  }, []);

  return <>{children}</>;
}
