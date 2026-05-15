'use client';

import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';

export default function PostFX() {
  return (
    <EffectComposer>
      <Bloom
        intensity={1.4}
        luminanceThreshold={0.18}
        luminanceSmoothing={0.9}
        mipmapBlur
      />
      <Vignette eskil={false} offset={0.35} darkness={0.7} />
    </EffectComposer>
  );
}
