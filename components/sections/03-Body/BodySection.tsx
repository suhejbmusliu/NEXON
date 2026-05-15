'use client';

import { useEffect } from 'react';
import {
  motion,
  useMotionValue,
  useTransform,
  type MotionValue,
} from 'framer-motion';
import { scrollState } from '@/lib/scroll';
import { bodySubProgress, beatRange } from '@/lib/sectionRanges';

const BEATS = [
  {
    label: '03 · I  /  IMPLANT',
    headline: 'Placed where intent begins.',
    body: 'A two-millimeter wafer sits behind the neck, at the first cervical vertebra. Smaller than a coin, denser than a phone.',
  },
  {
    label: '03 · II  /  LISTEN',
    headline: 'It listens to the brain.',
    body: 'Cortical signals reach the chip in microseconds — every twitch of intention, every thought of movement before any movement happens.',
  },
  {
    label: '03 · III  /  SPEAK',
    headline: 'And speaks to the spine.',
    body: 'The signal travels the cord — nerve by nerve, vertebra by vertebra. Past the injury that severed the conversation.',
  },
  {
    label: '03 · IV  /  BRANCH',
    headline: 'Branching to every limb.',
    body: 'Through the brachial plexus, the lumbar plexus, every peripheral nerve. The chip rebuilds the wiring the body lost.',
  },
  {
    label: '03 · V  /  RETURN',
    headline: 'And movement returns.',
    body: "The hand that hadn't moved in years — moves. Twelve milliseconds of math become a finger curl, an arm raise, a life.",
  },
];

function useBodyBeatProgress() {
  const mv = useMotionValue(0);
  useEffect(() => {
    let raf = 0;
    const tick = () => {
      mv.set(bodySubProgress(scrollState.progress));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [mv]);
  return mv;
}

function BeatBlock({
  beat,
  index,
  beatProgress,
}: {
  beat: (typeof BEATS)[number];
  index: number;
  beatProgress: MotionValue<number>;
}) {
  const { start, end } = beatRange(index);
  // Tight fade in/out windows so beats hand off cleanly
  const fade = 0.06;
  const opacity = useTransform(
    beatProgress,
    [start - fade, start + fade, end - fade, end + fade],
    [0, 1, 1, 0]
  );
  const y = useTransform(
    beatProgress,
    [start - fade, start + fade, end - fade, end + fade],
    [40, 0, 0, -40]
  );

  return (
    <motion.div
      style={{ opacity, y }}
      className="pointer-events-auto absolute inset-0 flex flex-col justify-center"
    >
      <p className="mb-5 text-[11px] tracking-[0.4em] text-cyan-300/70">
        {beat.label}
      </p>
      <h2 className="text-4xl font-semibold tracking-tight neon-text md:text-6xl">
        {beat.headline}
      </h2>
      <p className="mt-6 max-w-md text-white/60 leading-relaxed">
        {beat.body}
      </p>
    </motion.div>
  );
}

export default function BodySection() {
  const beatProgress = useBodyBeatProgress();

  return (
    <section
      id="body"
      // 300vh of scroll runway — gives the 5 beats room to breathe
      className="pointer-events-none relative h-[300vh]"
    >
      <div className="sticky top-0 flex h-screen items-center px-6 md:pl-[10vw]">
        {/* Stack: each beat absolutely positioned, fades in by scroll-tied opacity */}
        <div className="relative h-[55vh] w-full max-w-xl">
          {BEATS.map((beat, i) => (
            <BeatBlock
              key={beat.label}
              beat={beat}
              index={i}
              beatProgress={beatProgress}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
