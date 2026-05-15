'use client';

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { scrollState } from '@/lib/scroll';
import { remap01, easeInOut } from '@/lib/easing';
import { SECTIONS } from '@/lib/sectionRanges';
import NeuralChip from '@/components/scene/NeuralChip';

const THREAD_COUNT = 140;
const THREAD_LENGTH = 2.6;

function fibonacciSphere(n: number): THREE.Vector3[] {
  const phi = Math.PI * (3 - Math.sqrt(5));
  return Array.from({ length: n }, (_, i) => {
    const y = 1 - (i / (n - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const theta = phi * i;
    return new THREE.Vector3(Math.cos(theta) * r, y, Math.sin(theta) * r);
  });
}

export default function HeroScene() {
  const groupRef = useRef<THREE.Group>(null);
  const chipRef = useRef<THREE.Group>(null);
  const threadsRef = useRef<THREE.Group>(null);

  const directions = useMemo(() => fibonacciSphere(THREAD_COUNT), []);
  const quaternions = useMemo(() => {
    const yAxis = new THREE.Vector3(0, 1, 0);
    return directions.map((d) =>
      new THREE.Quaternion().setFromUnitVectors(yAxis, d)
    );
  }, [directions]);
  const phases = useMemo(
    () => Array.from({ length: THREAD_COUNT }, () => Math.random() * Math.PI * 2),
    []
  );
  const speeds = useMemo(
    () => Array.from({ length: THREAD_COUNT }, () => 1.5 + Math.random() * 2),
    []
  );

  useFrame((state) => {
    const p = scrollState.progress;
    const t = state.clock.elapsedTime;

    // Hero is dominant through §1; fades out as §3 body takes over
    const heroVisibility = 1 - easeInOut(remap01(p, SECTIONS.body.start, SECTIONS.body.start + 0.08));
    const growth = easeInOut(remap01(p, 0.10, 0.34));
    const pulse = easeInOut(remap01(p, 0.30, 0.55));

    threadsRef.current?.children.forEach((child, i) => {
      const mesh = child as THREE.Mesh;
      const len = THREAD_LENGTH * growth;
      mesh.scale.y = Math.max(len, 0.0001);
      const dir = directions[i];
      mesh.position.set(dir.x * (len / 2), dir.y * (len / 2), dir.z * (len / 2));
      mesh.visible = len > 0.02 && heroVisibility > 0.05;

      const mat = mesh.material as THREE.MeshBasicMaterial;
      const wave = Math.sin(t * speeds[i] + phases[i]) * 0.5 + 0.5;
      mat.opacity = (0.18 + wave * (0.35 + pulse * 0.45)) * heroVisibility;
    });

    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.08 + p * Math.PI * 1.4;
      groupRef.current.rotation.x = Math.sin(t * 0.2) * 0.1;
      groupRef.current.scale.setScalar(heroVisibility);
      groupRef.current.visible = heroVisibility > 0.02;
    }

    if (chipRef.current) {
      chipRef.current.rotation.y = t * 0.3;
      chipRef.current.rotation.x = Math.sin(t * 0.4) * 0.08;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Threads — neural radiation */}
      <group ref={threadsRef}>
        {directions.map((_, i) => (
          <mesh key={i} quaternion={quaternions[i]} scale={[1, 0.0001, 1]}>
            <cylinderGeometry args={[0.006, 0.006, 1, 6]} />
            <meshBasicMaterial
              color="#00d4ff"
              transparent
              opacity={0.25}
              toneMapped={false}
            />
          </mesh>
        ))}
      </group>

      {/* Sci-fi neural chip — dark metal shell, glowing channels, exposed core */}
      <NeuralChip ref={chipRef} />
    </group>
  );
}
