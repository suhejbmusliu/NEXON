'use client';

import { motion } from 'framer-motion';

const LAYERS = [
  { label: 'NEURAL PROCESSING', body: 'Reads cortical signals at micro-volt resolution.' },
  { label: 'SIGNAL TRANSLATION', body: 'Decodes intention into precise nerve impulse patterns.' },
  { label: 'MOVEMENT RESTORATION', body: 'Routes the signal past the injury, into the body.' },
  { label: 'ADAPTIVE AI LEARNING', body: 'Continuously calibrates to the person it lives inside.' },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.7 },
  }),
};

export default function ChipSection() {
  return (
    <section
      id="chip"
      className="pointer-events-none relative flex min-h-screen flex-col justify-center px-6 md:items-end md:pr-[10vw]"
    >
      <div className="pointer-events-auto max-w-xl">
        <motion.p
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-20%' }}
          variants={fadeUp}
          custom={0}
          className="mb-5 text-[11px] tracking-[0.4em] text-white/40"
        >
          02 / THE CHIP
        </motion.p>
        <motion.h2
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-20%' }}
          variants={fadeUp}
          custom={1}
          className="text-5xl font-semibold tracking-tight neon-text md:text-6xl"
        >
          Four layers. One mind.
        </motion.h2>
        <motion.p
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-20%' }}
          variants={fadeUp}
          custom={2}
          className="mt-6 max-w-md text-white/60 leading-relaxed"
        >
          NeuroMotion is built in four stacked layers, each a discipline the chip
          masters in real time.
        </motion.p>

        <ul className="mt-12 space-y-5">
          {LAYERS.map((layer, i) => (
            <motion.li
              key={layer.label}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-20%' }}
              variants={fadeUp}
              custom={3 + i}
              className="rounded-xl glass px-5 py-4"
            >
              <p className="text-[10px] tracking-[0.35em] text-cyan-300/80">
                {String(i + 1).padStart(2, '0')} · {layer.label}
              </p>
              <p className="mt-1 text-sm text-white/70">{layer.body}</p>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
