'use client';

import { forwardRef, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const HEX_R = 0.5;
const HEX_H = 0.14;
const SEGS = 6;

type Props = {
  pulse?: number;
};

const NeuralChip = forwardRef<THREE.Group, Props>(function NeuralChip({ pulse = 0 }, ref) {
  const internalRoot = useRef<THREE.Group>(null);
  const root = (ref as React.RefObject<THREE.Group>) ?? internalRoot;

  const channelsRef = useRef<THREE.Group>(null);
  const ringsRef = useRef<THREE.Group>(null);
  const ledsRef = useRef<(THREE.Mesh | null)[]>([]);
  const coreRef = useRef<THREE.Mesh>(null);
  const cageRef = useRef<THREE.Mesh>(null);
  const perimeterGlowRef = useRef<THREE.Mesh>(null);

  const boltPositions = useMemo(() => {
    return Array.from({ length: 6 }, (_, i) => {
      const a = (Math.PI / 3) * i + Math.PI / 6;
      const r = HEX_R * 0.82;
      return new THREE.Vector3(Math.cos(a) * r, 0, Math.sin(a) * r);
    });
  }, []);

  const channelAngles = useMemo(
    () => Array.from({ length: 6 }, (_, i) => (Math.PI / 3) * i),
    []
  );

  const ledPositions = useMemo(() => {
    const r = HEX_R * 0.7;
    return Array.from({ length: 12 }, (_, i) => {
      const a = ((Math.PI * 2) / 12) * i + Math.PI / 12;
      return new THREE.Vector3(Math.cos(a) * r, HEX_H / 2 + 0.014, Math.sin(a) * r);
    });
  }, []);

  const padPositions = useMemo(() => {
    const pts: THREE.Vector3[] = [new THREE.Vector3(0, 0, 0)];
    [0.13, 0.24].forEach((r, ringIdx) => {
      const count = (ringIdx + 1) * 6;
      for (let i = 0; i < count; i++) {
        const a = ((Math.PI * 2) / count) * i;
        pts.push(new THREE.Vector3(Math.cos(a) * r, 0, Math.sin(a) * r));
      }
    });
    return pts;
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    if (channelsRef.current) {
      channelsRef.current.children.forEach((child, i) => {
        const mesh = child as THREE.Mesh;
        const mat = mesh.material as THREE.MeshBasicMaterial;
        const phase = (i / 6) * Math.PI * 2;
        const wave = Math.sin(t * 1.8 + phase) * 0.5 + 0.5;
        mat.opacity = 0.35 + wave * 0.55;
      });
    }

    if (ringsRef.current) {
      const [r0, r1, r2] = ringsRef.current.children as THREE.Object3D[];
      if (r0) {
        r0.rotation.z = t * 0.4;
        r0.rotation.y = Math.sin(t * 0.3) * 0.45;
      }
      if (r1) {
        r1.rotation.z = -t * 0.55;
        r1.rotation.x = Math.cos(t * 0.4) * 0.4;
      }
      if (r2) {
        r2.rotation.x = t * 0.32;
        r2.rotation.y = -t * 0.5;
      }
    }

    ledsRef.current.forEach((led, i) => {
      if (!led) return;
      const mat = led.material as THREE.MeshBasicMaterial;
      const sweep = (t * 1.4) % 12;
      const dist = Math.min(
        Math.abs(i - sweep),
        Math.abs(i - sweep + 12),
        Math.abs(i - sweep - 12)
      );
      const intensity = Math.max(0, 1 - dist * 0.45);
      mat.opacity = 0.18 + intensity * 0.82;
    });

    if (coreRef.current) {
      const mat = coreRef.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 2.6 + Math.sin(t * 4) * 0.55 + pulse * 2.5;
      const s = 1 + Math.sin(t * 3.5) * 0.07;
      coreRef.current.scale.setScalar(s);
    }

    if (cageRef.current) {
      cageRef.current.rotation.y = t * 0.6;
      cageRef.current.rotation.x = t * 0.4;
    }

    if (perimeterGlowRef.current) {
      const mat = perimeterGlowRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.4 + (Math.sin(t * 2.2) * 0.5 + 0.5) * 0.35;
    }
  });

  return (
    <group ref={root}>
      {/* === MAIN HEX BODY (dark metal) === */}
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[HEX_R, HEX_R, HEX_H, SEGS]} />
        <meshStandardMaterial color="#0a0e16" metalness={0.92} roughness={0.38} />
      </mesh>

      {/* Top bevel (chamfer) */}
      <mesh position={[0, HEX_H / 2 + 0.005, 0]}>
        <cylinderGeometry args={[HEX_R * 0.95, HEX_R, 0.018, SEGS]} />
        <meshStandardMaterial color="#161c2a" metalness={0.95} roughness={0.25} />
      </mesh>

      {/* Bottom bevel */}
      <mesh position={[0, -HEX_H / 2 - 0.005, 0]}>
        <cylinderGeometry args={[HEX_R, HEX_R * 0.95, 0.018, SEGS]} />
        <meshStandardMaterial color="#161c2a" metalness={0.95} roughness={0.25} />
      </mesh>

      {/* Top inset platform */}
      <mesh position={[0, HEX_H / 2 + 0.013, 0]}>
        <cylinderGeometry args={[HEX_R * 0.88, HEX_R * 0.92, 0.008, SEGS]} />
        <meshStandardMaterial color="#0d1320" metalness={0.9} roughness={0.42} />
      </mesh>

      {/* Recessed central well (exposes core) */}
      <mesh position={[0, HEX_H / 2 + 0.005, 0]}>
        <cylinderGeometry args={[HEX_R * 0.4, HEX_R * 0.42, 0.04, SEGS]} />
        <meshStandardMaterial color="#02050b" metalness={0.55} roughness={0.7} side={THREE.DoubleSide} />
      </mesh>

      {/* Concentric grooves */}
      {[0.7, 0.78, 0.86].map((r, i) => (
        <mesh
          key={`groove-${i}`}
          position={[0, HEX_H / 2 + 0.018, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <ringGeometry args={[HEX_R * r - 0.004, HEX_R * r, 64]} />
          <meshBasicMaterial color="#000" side={THREE.DoubleSide} />
        </mesh>
      ))}

      {/* === RADIAL LIGHT CHANNELS (etched glowing slots) === */}
      <group ref={channelsRef}>
        {channelAngles.map((angle, i) => (
          <mesh
            key={`channel-${i}`}
            position={[
              Math.cos(angle) * HEX_R * 0.65,
              HEX_H / 2 + 0.019,
              Math.sin(angle) * HEX_R * 0.65,
            ]}
            rotation={[-Math.PI / 2, 0, -angle + Math.PI / 2]}
          >
            <planeGeometry args={[0.018, HEX_R * 0.36]} />
            <meshBasicMaterial
              color="#00d4ff"
              transparent
              opacity={0.7}
              toneMapped={false}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </mesh>
        ))}
      </group>

      {/* Side perimeter emissive ring */}
      <mesh ref={perimeterGlowRef}>
        <cylinderGeometry args={[HEX_R * 1.005, HEX_R * 1.005, 0.018, SEGS, 1, true]} />
        <meshBasicMaterial
          color="#00d4ff"
          transparent
          opacity={0.55}
          side={THREE.DoubleSide}
          toneMapped={false}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* === EDGE BOLTS (6 around the rim) === */}
      {boltPositions.map((p, i) => (
        <group key={`bolt-${i}`} position={[p.x, HEX_H / 2 + 0.014, p.z]}>
          <mesh>
            <cylinderGeometry args={[0.022, 0.026, 0.022, 6]} />
            <meshStandardMaterial color="#1c2230" metalness={0.97} roughness={0.28} />
          </mesh>
          <mesh position={[0, 0.012, 0]}>
            <boxGeometry args={[0.028, 0.002, 0.005]} />
            <meshStandardMaterial color="#000" roughness={1} />
          </mesh>
          <mesh position={[0, 0.012, 0]}>
            <boxGeometry args={[0.005, 0.002, 0.028]} />
            <meshStandardMaterial color="#000" roughness={1} />
          </mesh>
        </group>
      ))}

      {/* === STATUS LEDS (sweeping ring) === */}
      {ledPositions.map((p, i) => (
        <mesh
          key={`led-${i}`}
          position={p}
          ref={(el) => {
            ledsRef.current[i] = el;
          }}
        >
          <sphereGeometry args={[0.011, 8, 8]} />
          <meshBasicMaterial
            color="#00d4ff"
            transparent
            opacity={0.4}
            toneMapped={false}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      ))}

      {/* === HOLOGRAPHIC RINGS (floating, multi-axis rotation) === */}
      <group ref={ringsRef}>
        <mesh>
          <torusGeometry args={[HEX_R * 1.32, 0.005, 8, 96]} />
          <meshBasicMaterial
            color="#00d4ff"
            transparent
            opacity={0.45}
            toneMapped={false}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
        <mesh>
          <torusGeometry args={[HEX_R * 1.5, 0.003, 8, 96]} />
          <meshBasicMaterial
            color="#00d4ff"
            transparent
            opacity={0.3}
            toneMapped={false}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
        <mesh>
          <torusGeometry args={[HEX_R * 1.2, 0.004, 8, 96]} />
          <meshBasicMaterial
            color="#7ae8ff"
            transparent
            opacity={0.35}
            toneMapped={false}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      </group>

      {/* === EXPOSED CORE (the pulsing AI heart) === */}
      <mesh ref={coreRef}>
        <icosahedronGeometry args={[0.14, 2]} />
        <meshStandardMaterial
          color="#00d4ff"
          emissive="#00d4ff"
          emissiveIntensity={2.6}
          toneMapped={false}
        />
      </mesh>

      {/* Core containment cage (wireframe) */}
      <mesh ref={cageRef}>
        <icosahedronGeometry args={[0.21, 1]} />
        <meshBasicMaterial
          color="#00d4ff"
          wireframe
          transparent
          opacity={0.28}
          toneMapped={false}
        />
      </mesh>

      {/* === UNDERSIDE: contact pads (hex grid) === */}
      <group position={[0, -HEX_H / 2 - 0.005, 0]}>
        {padPositions.map((p, i) => (
          <mesh key={`pad-${i}`} position={p}>
            <cylinderGeometry args={[0.018, 0.018, 0.004, 12]} />
            <meshStandardMaterial
              color="#3a4658"
              metalness={0.85}
              roughness={0.4}
              emissive="#00d4ff"
              emissiveIntensity={0.18}
            />
          </mesh>
        ))}
      </group>

      {/* === UNDERSIDE: central data port === */}
      <mesh position={[0, -HEX_H / 2 - 0.012, 0]}>
        <cylinderGeometry args={[0.07, 0.07, 0.01, SEGS]} />
        <meshStandardMaterial color="#1a1f2e" metalness={0.92} roughness={0.4} />
      </mesh>
      <mesh position={[0, -HEX_H / 2 - 0.02, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 0.006, SEGS]} />
        <meshBasicMaterial
          color="#00d4ff"
          transparent
          opacity={0.7}
          toneMapped={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
});

export default NeuralChip;
