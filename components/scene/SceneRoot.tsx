'use client';

import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import HeroScene from '@/components/sections/01-Hero/HeroScene';
import ChipScene from '@/components/sections/02-ChipBreakdown/ChipScene';
import BodyScene from '@/components/sections/03-Body/BodyScene';
import MovementScene from '@/components/sections/04-Movement/MovementScene';
import FutureScene from '@/components/sections/05-Future/FutureScene';
import CameraRig from './CameraRig';
import PostFX from './PostFX';
import ParticleField from './ParticleField';

export default function SceneRoot() {
  return (
    <div className="pointer-events-auto fixed inset-0">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        dpr={[1, 2]}
        gl={{ antialias: true, powerPreference: 'high-performance' }}
      >
        <color attach="background" args={['#05060a']} />
        <fog attach="fog" args={['#05060a', 10, 24]} />

        <ambientLight intensity={0.25} />
        <pointLight position={[5, 4, 5]} intensity={2.2} color="#00d4ff" />
        <pointLight position={[-5, -3, -5]} intensity={1.4} color="#0066ff" />
        <pointLight position={[0, 0, 4]} intensity={0.9} color="#ffffff" />

        <Suspense fallback={null}>
          <HeroScene />
          <ChipScene />
          <BodyScene />
          <MovementScene />
          <FutureScene />
          <ParticleField />
          <Environment preset="night" />
        </Suspense>

        <CameraRig />
        <PostFX />
      </Canvas>
    </div>
  );
}
