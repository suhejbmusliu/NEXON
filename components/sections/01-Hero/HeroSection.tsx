'use client';

import { motion } from 'framer-motion';

export default function HeroSection() {
  return (
    <section
      id="hero"
      className="pointer-events-none relative flex min-h-screen flex-col items-center justify-center px-6 text-center"
    >
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.8 }}
        className="pointer-events-auto text-[11px] tracking-[0.5em] text-white/50"
      >
        NEUROMOTION · AI
      </motion.p>

      <motion.h1
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 1 }}
        className="pointer-events-auto mt-8 text-[clamp(2.5rem,7vw,5.5rem)] font-semibold leading-[1.05] tracking-tight neon-text max-w-4xl"
      >
        Rebuilding
        <br />
        Human Movement.
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.9 }}
        className="pointer-events-auto mt-10 max-w-xl text-base leading-relaxed text-white/60 md:text-lg"
      >
        An AI-powered neural interface designed to reconnect the body and mind.
      </motion.p>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 1 }}
        className="pointer-events-auto absolute bottom-12 flex flex-col items-center gap-3"
      >
        <span className="text-[10px] tracking-[0.5em] text-white/40">SCROLL</span>
        <span className="block h-12 w-px bg-gradient-to-b from-white/40 to-transparent" />
      </motion.div>
    </section>
  );
}
