'use client';

import { useMemo, useRef } from 'react';
import { useGLTF } from '@react-three/drei';
import { ThreeEvent } from '@react-three/fiber';
import * as THREE from 'three';

// Tuning constants — applied at the WRAPPER group level only
const MODEL_SCALE = 0.075;
const MODEL_POSITION: [number, number, number] = [-0.96, -2.5, 0.44];
const MODEL_ROTATION: [number, number, number] = [-Math.PI / 2, 0, 0];

type Props = {
  onPointerDown?: (e: ThreeEvent<PointerEvent>) => void;
  onPointerOver?: (e: ThreeEvent<PointerEvent>) => void;
  onPointerOut?: (e: ThreeEvent<PointerEvent>) => void;
};

export default function AnatomyModel({ onPointerDown, onPointerOver, onPointerOut }: Props) {
  const groupRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF('/models/anatomy.glb');

  // Extract the raw geometries from the GLB. We discard the scene tree entirely
  // because the Sketchfab wrapper had degenerate matrices collapsing world bounds.
  const meshData = useMemo(() => {
    const result: { geometry: THREE.BufferGeometry; name: string; matIdx: number }[] = [];
    scene.traverse((obj) => {
      const m = obj as THREE.Mesh;
      if (m.isMesh && m.geometry) {
        // Determine which of the 3 source materials this mesh used (for layer fades later)
        const matName = (Array.isArray(m.material) ? m.material[0] : m.material)?.name ?? '';
        const matIdx = parseInt(matName.replace(/\D/g, ''), 10) || 0;
        result.push({ geometry: m.geometry, name: m.name, matIdx });
      }
    });
    // eslint-disable-next-line no-console
    console.log(
      `[AnatomyModel] extracted ${result.length} geometries:`,
      result.map((r) => `${r.name}→mat${r.matIdx}`).join(', ')
    );
    return result;
  }, [scene]);

  return (
    <group
      ref={groupRef}
      position={MODEL_POSITION}
      rotation={MODEL_ROTATION}
      scale={MODEL_SCALE}
    >
      {meshData.map((d, i) => (
        <mesh
          key={`${d.name}-${i}`}
          geometry={d.geometry}
          frustumCulled={false}
          onPointerDown={onPointerDown}
          onPointerOver={onPointerOver}
          onPointerOut={onPointerOut}
        >
          {/* MeshBasicMaterial + additive blending = X-ray glow, no PBR cost,
              no alpha-sort cost. Big perf win for 419k transparent triangles. */}
          <meshBasicMaterial
            color="#0a8acf"
            transparent
            opacity={0.18}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            side={THREE.DoubleSide}
            toneMapped={false}
          />
        </mesh>
      ))}
    </group>
  );
}

useGLTF.preload('/models/anatomy.glb');
