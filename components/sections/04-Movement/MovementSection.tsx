'use client';

import { motion } from 'framer-motion';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8 } },
};

export default function MovementSection() {
  return (
    <section
      id="movement"
      className="pointer-events-none relative flex min-h-screen flex-col justify-center px-6 md:items-end md:pr-[10vw]"
    >
      <div className="pointer-events-auto max-w-xl">
        <motion.p
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-20%' }}
          variants={fadeUp}
          className="mb-5 text-[11px] tracking-[0.4em] text-white/40"
        >
          04 / MOVEMENT
        </motion.p>
        <motion.h2
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-20%' }}
          variants={fadeUp}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-5xl font-semibold tracking-tight neon-text md:text-6xl"
        >
          The first movement back.
        </motion.h2>
        <motion.p
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-20%' }}
          variants={fadeUp}
          transition={{ duration: 0.8, delay: 0.25 }}
          className="mt-6 max-w-md text-white/60 leading-relaxed"
        >
          A finger. Then a hand. Then a glass of water raised, alone, for the
          first time in years. Decoded in twelve milliseconds. Returned to the
          body that was always trying.
        </motion.p>
      </div>
    </section>
  );
}
