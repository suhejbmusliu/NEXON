'use client';

import { useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { scrollState } from '@/lib/scroll';

type Stage = {
  p: number;
  pos: [number, number, number];
  look: [number, number, number];
  fov: number;
};

// Cinematic camera waypoints. Camera lerps between them as scroll progresses.
// New 7-viewport layout: §3 body takes 3vh and is split into 5 beats.
const STAGES: Stage[] = [
  // §1 Hero — close on chip
  { p: 0.0, pos: [0, 0, 3.2], look: [0, 0, 0], fov: 32 },
  { p: 0.1, pos: [1.5, 0.6, 3.2], look: [0, 0, 0], fov: 34 },

  // §2 Chip breakdown — pull back to see chip layers
  { p: 0.2, pos: [2.4, 1, 4.4], look: [0, 0, 0], fov: 38 },
  { p: 0.3, pos: [0, 0.4, 5.5], look: [0, 0, 0], fov: 42 },

  // §3 BODY — 5 beats (each ~0.1 of total scroll wide)
  // Beat I — IMPLANT: wide front view, body fully in frame, chip drifts in at C1
  { p: 0.383, pos: [0, 0.4, 6.6], look: [0, 0.3, 0], fov: 46 },
  // Beat II — LISTEN: orbit to right side, close on the chip at the neck
  { p: 0.483, pos: [3.0, 1.8, 2.8], look: [0, 1.9, -0.15], fov: 32 },
  // Beat III — SPEAK: pull back to see spine, slight side angle, track signal down
  { p: 0.583, pos: [1.8, 0.1, 4.5], look: [0, 0.2, 0], fov: 38 },
  // Beat IV — BRANCH: opposite-side pull-back to 3/4 view, see all nerve branches lit
  { p: 0.683, pos: [-2.5, 0.6, 6.0], look: [0, 0.3, 0], fov: 44 },
  // Beat V — RETURN: drop to hand/foot height, focus on extremities glowing
  { p: 0.783, pos: [0, -1.2, 4.5], look: [0, -1.0, 0], fov: 42 },

  // §4 Movement — focus on hand area
  { p: 0.875, pos: [0.5, -0.3, 3.8], look: [0.4, -0.2, 0], fov: 40 },

  // §5 Future — wide cinematic pull-back
  { p: 0.96, pos: [0, 0.3, 7], look: [0, 0.2, 0], fov: 50 },
  { p: 1.0, pos: [0, 0, 8], look: [0, 0, 0], fov: 52 },
];

export default function CameraRig() {
  const { camera } = useThree();
  const posVec = useMemo(() => new THREE.Vector3(), []);
  const lookVec = useMemo(() => new THREE.Vector3(), []);
  const aVec = useMemo(() => new THREE.Vector3(), []);
  const bVec = useMemo(() => new THREE.Vector3(), []);

  useFrame(() => {
    const p = scrollState.progress;

    let a = STAGES[0];
    let b = STAGES[STAGES.length - 1];
    for (let i = 0; i < STAGES.length - 1; i++) {
      if (p >= STAGES[i].p && p <= STAGES[i + 1].p) {
        a = STAGES[i];
        b = STAGES[i + 1];
        break;
      }
    }
    const span = b.p - a.p;
    const t = span > 0 ? (p - a.p) / span : 0;

    aVec.set(a.pos[0], a.pos[1], a.pos[2]);
    bVec.set(b.pos[0], b.pos[1], b.pos[2]);
    posVec.copy(aVec).lerp(bVec, t);

    aVec.set(a.look[0], a.look[1], a.look[2]);
    bVec.set(b.look[0], b.look[1], b.look[2]);
    lookVec.copy(aVec).lerp(bVec, t);

    camera.position.lerp(posVec, 0.08);
    const fov = THREE.MathUtils.lerp(a.fov, b.fov, t);
    if ((camera as THREE.PerspectiveCamera).fov !== fov) {
      (camera as THREE.PerspectiveCamera).fov = fov;
      camera.updateProjectionMatrix();
    }
    camera.lookAt(lookVec);
  });

  return null;
}
