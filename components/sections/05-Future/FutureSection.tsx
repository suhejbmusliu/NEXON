'use client';

import { motion } from 'framer-motion';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.9 } },
};

export default function FutureSection() {
  return (
    <section
      id="future"
      className="pointer-events-none relative flex min-h-screen flex-col items-center justify-center px-6 text-center"
    >
      <motion.p
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-20%' }}
        variants={fadeUp}
        className="pointer-events-auto text-[11px] tracking-[0.5em] text-white/50"
      >
        05 / THE FUTURE
      </motion.p>
      <motion.h2
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-20%' }}
        variants={fadeUp}
        transition={{ duration: 0.9, delay: 0.15 }}
        className="pointer-events-auto mt-8 max-w-3xl text-[clamp(2.5rem,7vw,5rem)] font-semibold leading-[1.05] tracking-tight neon-text"
      >
        Technology should restore possibilities.
      </motion.h2>
      <motion.p
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-20%' }}
        variants={fadeUp}
        transition={{ duration: 0.9, delay: 0.35 }}
        className="pointer-events-auto mt-8 max-w-xl text-base leading-relaxed text-white/60 md:text-lg"
      >
        NeuroMotion is enrolling participants at twelve certified neurosurgical
        centers worldwide. The next chapter of the body begins here.
      </motion.p>
      <motion.a
        href="#"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-20%' }}
        variants={fadeUp}
        transition={{ duration: 0.9, delay: 0.55 }}
        className="pointer-events-auto mt-12 rounded-full bg-white px-10 py-4 text-xs font-medium tracking-[0.3em] text-black transition hover:bg-white/90"
      >
        EXPLORE THE FUTURE
      </motion.a>
    </section>
  );
}
