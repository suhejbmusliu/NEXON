'use client';

import { useEffect, useRef } from 'react';
import { scrollState } from '@/lib/scroll';

export default function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf = 0;
    const tick = () => {
      if (barRef.current) {
        barRef.current.style.transform = `scaleX(${scrollState.progress})`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className="fixed inset-x-0 top-0 z-[60] h-px bg-white/5">
      <div
        ref={barRef}
        className="h-full origin-left bg-gradient-to-r from-cyan-400 via-cyan-300 to-blue-500"
        style={{ transform: 'scaleX(0)' }}
      />
    </div>
  );
}
