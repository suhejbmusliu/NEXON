'use client';

import { Sparkles } from '@react-three/drei';

export default function ParticleField() {
  return (
    <Sparkles
      count={70}
      scale={12}
      size={1.8}
      speed={0.25}
      color="#a8e8ff"
      opacity={0.45}
    />
  );
}
