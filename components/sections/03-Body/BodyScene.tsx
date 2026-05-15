'use client';

import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Line } from '@react-three/drei';
import * as THREE from 'three';
import { scrollState } from '@/lib/scroll';
import { remap01, easeInOut, clamp01 } from '@/lib/easing';
import { SECTIONS, bodySubProgress } from '@/lib/sectionRanges';
import {
  HEAD_OUTLINE_RIGHT,
  BODY_OUTLINE_RIGHT,
  ANATOMY_DETAILS,
  SPINE_POINTS,
  NERVE_BRANCHES,
  mirrorX,
  smooth2D,
  smooth3D,
} from '@/lib/bodyAnatomy';
import NeuralChip from '@/components/scene/NeuralChip';
import AnatomyModel from '@/components/scene/AnatomyModel';

const PULSE_COUNT = 8;
// Toggle the old hand-drawn silhouette + interior anatomy lines.
const SHOW_SKETCH_OUTLINES = false;

// Indices into NERVE_BRANCHES whose LAST point is a limb extremity.
// Used for the Beat V "limb endpoint glow" effect.
const LIMB_ENDPOINT_BRANCH_INDICES = [0, 1, 6, 7]; // R arm, L arm, R leg, L leg

const CHIP_RESTING_POS: [number, number, number] = [0, 2.05, -0.15];

export default function BodyScene() {
  const groupRef = useRef<THREE.Group>(null);
  const spineRef = useRef<THREE.Mesh>(null);
  const spinePulseRef = useRef<THREE.Mesh>(null);
  const beatSpinePulseRef = useRef<THREE.Mesh>(null);
  const chipRef = useRef<THREE.Group>(null);
  const haloRef = useRef<THREE.Mesh>(null);
  const nerveRefs = useRef<THREE.Mesh[]>([]);
  const pulseRefs = useRef<(THREE.Mesh | null)[]>([]);
  const endpointRefs = useRef<(THREE.Mesh | null)[]>([]);

  // ---------- Drag-to-rotate state ----------
  const userRotY = useRef(0);
  const userRotX = useRef(0);
  const dragVel = useRef({ x: 0, y: 0 });
  const isDragging = useRef(false);
  const lastPtr = useRef({ x: 0, y: 0 });
  const hasInteracted = useRef(false);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (!isDragging.current) return;
      const dx = e.clientX - lastPtr.current.x;
      const dy = e.clientY - lastPtr.current.y;
      lastPtr.current = { x: e.clientX, y: e.clientY };
      userRotY.current += dx * 0.005;
      userRotX.current += dy * 0.005;
      userRotX.current = Math.max(-0.7, Math.min(0.7, userRotX.current));
      dragVel.current = { y: dx * 0.005, x: dy * 0.005 };
      hasInteracted.current = true;
    };
    const onUp = () => {
      isDragging.current = false;
      document.body.style.cursor = '';
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
    };
  }, []);

  // ---------- Body silhouette curves (legacy, hidden by flag) ----------
  const headPoints = useMemo(() => {
    const right = HEAD_OUTLINE_RIGHT;
    const left = mirrorX(right).reverse();
    return smooth2D([...right, ...left.slice(1)], 200, true);
  }, []);
  const bodyRightPoints = useMemo(() => smooth2D(BODY_OUTLINE_RIGHT, 240), []);
  const bodyLeftPoints = useMemo(
    () => smooth2D(mirrorX(BODY_OUTLINE_RIGHT), 240),
    []
  );
  const detailLines = useMemo(
    () => ANATOMY_DETAILS.map((line) => smooth2D(line, Math.max(line.length * 8, 16))),
    []
  );

  // ---------- Spine ----------
  const spineCurve = useMemo(() => smooth3D(SPINE_POINTS), []);
  const spineGeometry = useMemo(
    () => new THREE.TubeGeometry(spineCurve, 100, 0.028, 8, false),
    [spineCurve]
  );

  // ---------- Nerve branches ----------
  const nerveCurves = useMemo(() => NERVE_BRANCHES.map((b) => smooth3D(b)), []);
  const nerveGeometries = useMemo(
    () => nerveCurves.map((c) => new THREE.TubeGeometry(c, 60, 0.012, 6, false)),
    [nerveCurves]
  );

  // ---------- Limb endpoint positions (for Beat V glow) ----------
  const endpointPositions = useMemo(
    () =>
      LIMB_ENDPOINT_BRANCH_INDICES.map((i) => {
        const branch = NERVE_BRANCHES[i];
        const last = branch[branch.length - 1];
        return new THREE.Vector3(last[0], last[1], last[2]);
      }),
    []
  );

  // ---------- Traveling pulses ----------
  const pulseAssignments = useMemo(
    () =>
      Array.from({ length: PULSE_COUNT }, (_, i) => ({
        curveIdx: i % nerveCurves.length,
        phase: Math.random(),
        speed: 0.16 + Math.random() * 0.18,
      })),
    [nerveCurves.length]
  );

  useFrame((state) => {
    const p = scrollState.progress;
    const t = state.clock.elapsedTime;

    // Body fades IN once §3 begins and STAYS visible from there on
    const visibility = easeInOut(
      remap01(p, SECTIONS.body.start - 0.04, SECTIONS.body.start + 0.06)
    );

    // ---------- 5 narrative beats within §3 (sub-progress 0-1) ----------
    const sub = bodySubProgress(p);
    const beatI   = clamp01(remap01(sub, 0.0,  0.2));   // IMPLANT — chip drifts in
    const beatII  = clamp01(remap01(sub, 0.18, 0.42));  // LISTEN — halo flash
    const beatIII = clamp01(remap01(sub, 0.4,  0.62));  // SPEAK — spine pulse
    const beatIV  = clamp01(remap01(sub, 0.6,  0.82));  // BRANCH — nerves light up
    const beatV   = clamp01(remap01(sub, 0.78, 1.0));   // RETURN — limb endpoints glow

    // ---------- Drag inertia decay ----------
    if (
      !isDragging.current &&
      (Math.abs(dragVel.current.y) > 0.0005 || Math.abs(dragVel.current.x) > 0.0005)
    ) {
      userRotY.current += dragVel.current.y;
      userRotX.current += dragVel.current.x;
      userRotX.current = Math.max(-0.7, Math.min(0.7, userRotX.current));
      dragVel.current.y *= 0.93;
      dragVel.current.x *= 0.93;
    }

    if (groupRef.current) {
      groupRef.current.visible = visibility > 0.01;
      groupRef.current.scale.setScalar(visibility);
      const auto = hasInteracted.current
        ? 0
        : Math.sin(t * 0.18 + p * Math.PI * 2) * 0.45;
      const targetY = auto + userRotY.current;
      const targetX = userRotX.current;
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        targetY,
        0.25
      );
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        targetX,
        0.25
      );
    }

    // Spine baseline glow
    if (spineRef.current) {
      const mat = spineRef.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 1.4 + Math.sin(t * 2.5) * 0.4 + beatIII * 1.6;
    }

    // Ambient looping spine pulse (keeps the body feeling alive)
    if (spinePulseRef.current) {
      const cycle = (t * 0.22) % 1;
      const pt = spineCurve.getPointAt(cycle);
      spinePulseRef.current.position.copy(pt);
      spinePulseRef.current.visible = visibility > 0.1;
      const m = spinePulseRef.current.material as THREE.MeshBasicMaterial;
      // Dim the ambient pulse during Beat III so the highlighted one stands out
      m.opacity = visibility * (1 - beatIII * 0.6);
    }

    // BEAT III — bright signal traveling C1 → tailbone, locked to scroll
    if (beatSpinePulseRef.current) {
      const u = clamp01(beatIII);
      const pt = spineCurve.getPointAt(u);
      beatSpinePulseRef.current.position.copy(pt);
      beatSpinePulseRef.current.visible = beatIII > 0.02 && beatIII < 0.99 && visibility > 0.1;
      const m = beatSpinePulseRef.current.material as THREE.MeshBasicMaterial;
      m.opacity = visibility * 0.95;
      const s = 1 + Math.sin(t * 6) * 0.15;
      beatSpinePulseRef.current.scale.setScalar(s);
    }

    // BEAT IV — nerve branches light up sequentially as beat progresses
    nerveRefs.current.forEach((mesh, i) => {
      if (!mesh) return;
      const mat = mesh.material as THREE.MeshStandardMaterial;
      const wave = Math.sin(t * 1.4 + i * 0.6) * 0.5 + 0.5;
      // Each branch's "light-up threshold" is its index / total
      const threshold = i / nerveCurves.length;
      const lit = clamp01((beatIV - threshold) * 8); // sharp ramp
      // Base intensity always present; lit boosts it a lot
      mat.emissiveIntensity = (0.35 + wave * 0.3) * (0.5 + lit * 1.2);
    });

    // Traveling pulses on nerve branches (ambient flow)
    pulseRefs.current.forEach((sphere, i) => {
      if (!sphere) return;
      const a = pulseAssignments[i];
      const curve = nerveCurves[a.curveIdx];
      const u = (t * a.speed + a.phase) % 1;
      const pt = curve.getPointAt(u);
      sphere.position.copy(pt);
      sphere.visible = visibility > 0.1;
      const mat = sphere.material as THREE.MeshBasicMaterial;
      const edgeFade = Math.min(u * 4, (1 - u) * 4, 1);
      mat.opacity = visibility * edgeFade * 0.95;
      const s = 0.6 + 0.4 * Math.sin(t * 6 + i);
      sphere.scale.setScalar(s * 0.8 + 0.5);
    });

    // BEAT V — limb endpoints (hands & feet) glow
    endpointRefs.current.forEach((sphere) => {
      if (!sphere) return;
      const mat = sphere.material as THREE.MeshBasicMaterial;
      mat.opacity = beatV * visibility;
      const s = 1 + Math.sin(t * 4) * 0.15 + beatV * 0.5;
      sphere.scale.setScalar(s);
      sphere.visible = beatV > 0.02 && visibility > 0.1;
    });

    // BEAT I — chip drifts down from above and locks at C1
    if (chipRef.current) {
      const driftY = THREE.MathUtils.lerp(
        CHIP_RESTING_POS[1] + 1.6,
        CHIP_RESTING_POS[1],
        easeInOut(beatI)
      );
      chipRef.current.position.set(CHIP_RESTING_POS[0], driftY, CHIP_RESTING_POS[2]);
      // Spin slows as it locks in
      const spinSpeed = THREE.MathUtils.lerp(1.5, 0.25, easeInOut(beatI));
      chipRef.current.rotation.z = t * spinSpeed;
    }

    // BEAT II — halo flash at chip site
    if (haloRef.current) {
      const haloMat = haloRef.current.material as THREE.MeshBasicMaterial;
      // Triangle wave: 0 → 1 → 0 over beatII
      const flash = beatII < 0.5 ? beatII * 2 : (1 - beatII) * 2;
      const baseOpacity = 0.1 + beatI * 0.15; // grows with chip lock
      haloMat.opacity = baseOpacity + flash * 0.7;
      const s = 1 + flash * 1.4;
      haloRef.current.scale.setScalar(s);
      // Halo follows the chip's drift-in y position
      haloRef.current.position.y = chipRef.current?.position.y ?? CHIP_RESTING_POS[1];
    }
  });

  return (
    <group ref={groupRef} visible={false}>
      {/* === REAL ANATOMICAL MODEL === */}
      <AnatomyModel
        onPointerDown={(e) => {
          isDragging.current = true;
          lastPtr.current = { x: e.clientX, y: e.clientY };
          dragVel.current = { x: 0, y: 0 };
          document.body.style.cursor = 'grabbing';
          e.stopPropagation();
        }}
        onPointerOver={() => {
          if (!isDragging.current) document.body.style.cursor = 'grab';
        }}
        onPointerOut={() => {
          if (!isDragging.current) document.body.style.cursor = '';
        }}
      />

      {/* Legacy sketch outlines */}
      {SHOW_SKETCH_OUTLINES && (
        <>
          <Line points={headPoints} color="#5fc8ff" lineWidth={1.4} transparent opacity={0.62} toneMapped={false} />
          <Line points={bodyRightPoints} color="#5fc8ff" lineWidth={1.4} transparent opacity={0.62} toneMapped={false} />
          <Line points={bodyLeftPoints} color="#5fc8ff" lineWidth={1.4} transparent opacity={0.62} toneMapped={false} />
          {detailLines.map((pts, i) => (
            <Line
              key={`detail-${i}`}
              points={pts}
              color="#3a9bd1"
              lineWidth={0.9}
              transparent
              opacity={0.32}
              toneMapped={false}
            />
          ))}
        </>
      )}

      {/* === GLOWING SPINE === */}
      <mesh ref={spineRef} geometry={spineGeometry}>
        <meshStandardMaterial
          color="#00d4ff"
          emissive="#00d4ff"
          emissiveIntensity={1.6}
          toneMapped={false}
        />
      </mesh>

      {/* === NERVE BRANCHES === */}
      {nerveGeometries.map((geom, i) => (
        <mesh
          key={`nerve-${i}`}
          geometry={geom}
          ref={(el) => {
            if (el) nerveRefs.current[i] = el;
          }}
        >
          <meshStandardMaterial
            color="#00d4ff"
            emissive="#00d4ff"
            emissiveIntensity={0.5}
            transparent
            opacity={0.85}
            toneMapped={false}
          />
        </mesh>
      ))}

      {/* === AMBIENT TRAVELING PULSES === */}
      {pulseAssignments.map((_, i) => (
        <mesh
          key={`pulse-${i}`}
          ref={(el) => {
            pulseRefs.current[i] = el;
          }}
        >
          <sphereGeometry args={[0.035, 12, 12]} />
          <meshBasicMaterial
            color="#ffffff"
            toneMapped={false}
            transparent
            opacity={0.9}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      ))}

      {/* Ambient looping spine pulse */}
      <mesh ref={spinePulseRef}>
        <sphereGeometry args={[0.075, 24, 24]} />
        <meshBasicMaterial
          color="#ffffff"
          toneMapped={false}
          transparent
          opacity={1}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* BEAT III — scroll-locked bright signal traveling the spine */}
      <mesh ref={beatSpinePulseRef} visible={false}>
        <sphereGeometry args={[0.11, 24, 24]} />
        <meshBasicMaterial
          color="#ffffff"
          toneMapped={false}
          transparent
          opacity={0}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* BEAT V — limb endpoint glows (hands and feet) */}
      {endpointPositions.map((pos, i) => (
        <mesh
          key={`endpoint-${i}`}
          position={pos}
          ref={(el) => {
            endpointRefs.current[i] = el;
          }}
          visible={false}
        >
          <sphereGeometry args={[0.13, 16, 16]} />
          <meshBasicMaterial
            color="#7ae8ff"
            toneMapped={false}
            transparent
            opacity={0}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      ))}

      {/* === THE CHIP — drifts in during Beat I === */}
      <group
        ref={chipRef}
        position={CHIP_RESTING_POS}
        rotation={[Math.PI / 2, 0, 0]}
        scale={0.28}
      >
        <NeuralChip />
      </group>

      {/* Halo at chip site — flashes during Beat II */}
      <mesh ref={haloRef} position={CHIP_RESTING_POS}>
        <sphereGeometry args={[0.18, 16, 16]} />
        <meshBasicMaterial
          color="#00d4ff"
          transparent
          opacity={0.1}
          toneMapped={false}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}
