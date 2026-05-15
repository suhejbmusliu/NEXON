import * as THREE from 'three';

export type V2 = [number, number];
export type V3 = [number, number, number];

// === HEAD OUTLINE (closed loop, x>=0 then mirrors to left) ===
// Drawn as a smooth oval skull tapering to jaw
export const HEAD_OUTLINE_RIGHT: V2[] = [
  [0.0, 2.58],
  [0.18, 2.56],
  [0.32, 2.48],
  [0.40, 2.32],
  [0.42, 2.12],
  [0.40, 1.94],
  [0.34, 1.82],
  [0.22, 1.76],
  [0.12, 1.74],
];

// === RIGHT BODY OUTLINE (open path, top of neck → all the way around right side and back to crotch) ===
export const BODY_OUTLINE_RIGHT: V2[] = [
  // Neck right side
  [0.16, 1.74],
  [0.16, 1.56],
  // Trapezius / shoulder slope
  [0.30, 1.46],
  [0.56, 1.40],
  [0.82, 1.36],
  [1.00, 1.30],
  // Deltoid
  [1.07, 1.16],
  [1.08, 0.96],
  // Bicep outer
  [1.05, 0.66],
  [1.00, 0.34],
  // Elbow / outer arm
  [0.96, 0.08],
  [0.93, -0.18],
  // Forearm outer
  [0.90, -0.42],
  [0.87, -0.62],
  // Wrist
  [0.87, -0.74],
  // Hand (slight palm + fingers suggestion)
  [0.93, -0.86],
  [0.96, -1.04],
  [0.88, -1.18],
  [0.74, -1.14],
  [0.70, -0.94],
  // Inner wrist back up
  [0.66, -0.72],
  // Inner forearm
  [0.64, -0.46],
  [0.64, -0.20],
  // Inner bicep
  [0.66, 0.10],
  [0.70, 0.40],
  [0.74, 0.72],
  [0.76, 1.00],
  // Armpit
  [0.70, 1.08],
  // Lat / pectoral side going down
  [0.66, 0.92],
  [0.60, 0.68],
  [0.54, 0.40],
  [0.48, 0.12],
  // Waist taper
  [0.44, -0.10],
  [0.42, -0.32],
  // Hip flare
  [0.50, -0.58],
  [0.58, -0.86],
  [0.60, -1.10],
  // Outer thigh
  [0.55, -1.42],
  [0.50, -1.78],
  // Knee
  [0.48, -2.08],
  [0.46, -2.20],
  // Outer calf
  [0.42, -2.50],
  [0.36, -2.78],
  // Foot heel
  [0.34, -2.96],
  [0.42, -3.04],
  [0.58, -3.04],
  // Foot toe
  [0.62, -2.98],
  [0.58, -2.92],
  // Inner ankle
  [0.30, -2.92],
  [0.24, -2.78],
  // Inner calf
  [0.22, -2.50],
  [0.20, -2.20],
  // Inner knee
  [0.20, -2.08],
  // Inner thigh
  [0.18, -1.78],
  [0.12, -1.42],
  [0.06, -1.18],
  // Crotch
  [0.0, -1.10],
];

// === ANATOMICAL DETAIL LINES (interior sketch marks) ===
export const ANATOMY_DETAILS: V2[][] = [
  // Collarbones
  [[0.16, 1.45], [0.34, 1.40], [0.58, 1.32], [0.82, 1.32]],
  [[-0.16, 1.45], [-0.34, 1.40], [-0.58, 1.32], [-0.82, 1.32]],
  // Sternum
  [[0, 1.38], [0, 0.55]],
  // Pectoral curves
  [[0.05, 1.32], [0.30, 1.18], [0.48, 0.95], [0.55, 0.62]],
  [[-0.05, 1.32], [-0.30, 1.18], [-0.48, 0.95], [-0.55, 0.62]],
  // Ribcage hints (right)
  [[0.10, 0.88], [0.42, 0.82]],
  [[0.10, 0.68], [0.44, 0.60]],
  [[0.10, 0.46], [0.42, 0.36]],
  // Ribcage hints (left)
  [[-0.10, 0.88], [-0.42, 0.82]],
  [[-0.10, 0.68], [-0.44, 0.60]],
  [[-0.10, 0.46], [-0.42, 0.36]],
  // Linea alba (vertical abdominal line)
  [[0, 0.20], [0, -0.42]],
  // Abs cross-lines
  [[-0.18, 0.08], [0.18, 0.08]],
  [[-0.20, -0.12], [0.20, -0.12]],
  // Hip line
  [[-0.42, -0.32], [0.42, -0.32]],
  // Pelvic V
  [[-0.32, -0.55], [0, -1.05]],
  [[0.32, -0.55], [0, -1.05]],
  // Knee caps
  [[0.20, -2.08], [0.46, -2.08]],
  [[-0.20, -2.08], [-0.46, -2.08]],
  // Jaw line subtle
  [[-0.22, 1.76], [0, 1.78], [0.22, 1.76]],
];

// === SPINE (3D, slight S-curve from base of skull to tailbone) ===
export const SPINE_POINTS: V3[] = [
  [0, 1.72, -0.05],
  [0, 1.55, -0.07],
  [0, 1.30, -0.06],
  [0, 1.00, -0.03],
  [0, 0.65, 0.02],
  [0, 0.25, 0.06],
  [0, -0.20, 0.07],
  [0, -0.65, 0.05],
  [0, -1.05, 0.02],
];

// === NERVE BRANCHES (3D, each emanating from a spine point outward) ===
// These represent peripheral nerves — brachial plexus to arms, intercostals to ribs,
// lumbar/sacral plexus down to legs, cranial up into the head.
export const NERVE_BRANCHES: V3[][] = [
  // Brachial plexus → right arm (C5-T1)
  [
    [0, 1.40, -0.04],
    [0.32, 1.36, -0.01],
    [0.62, 1.30, 0.02],
    [0.92, 1.20, 0.04],
    [1.00, 0.90, 0.04],
    [0.96, 0.55, 0.04],
    [0.93, 0.18, 0.04],
    [0.90, -0.20, 0.04],
    [0.87, -0.55, 0.05],
    [0.86, -0.85, 0.06],
    [0.84, -1.05, 0.06],
  ],
  // Brachial plexus → left arm (mirror)
  [
    [0, 1.40, -0.04],
    [-0.32, 1.36, -0.01],
    [-0.62, 1.30, 0.02],
    [-0.92, 1.20, 0.04],
    [-1.00, 0.90, 0.04],
    [-0.96, 0.55, 0.04],
    [-0.93, 0.18, 0.04],
    [-0.90, -0.20, 0.04],
    [-0.87, -0.55, 0.05],
    [-0.86, -0.85, 0.06],
    [-0.84, -1.05, 0.06],
  ],
  // Upper intercostal right
  [
    [0, 0.85, 0.0],
    [0.18, 0.82, 0.04],
    [0.36, 0.74, 0.06],
    [0.50, 0.62, 0.06],
  ],
  // Upper intercostal left
  [
    [0, 0.85, 0.0],
    [-0.18, 0.82, 0.04],
    [-0.36, 0.74, 0.06],
    [-0.50, 0.62, 0.06],
  ],
  // Mid intercostal right
  [
    [0, 0.45, 0.04],
    [0.18, 0.42, 0.06],
    [0.34, 0.32, 0.06],
    [0.44, 0.20, 0.06],
  ],
  // Mid intercostal left
  [
    [0, 0.45, 0.04],
    [-0.18, 0.42, 0.06],
    [-0.34, 0.32, 0.06],
    [-0.44, 0.20, 0.06],
  ],
  // Lumbar plexus → right leg
  [
    [0, -0.50, 0.06],
    [0.20, -0.65, 0.05],
    [0.42, -0.95, 0.04],
    [0.50, -1.40, 0.03],
    [0.46, -1.85, 0.02],
    [0.44, -2.20, 0.02],
    [0.40, -2.55, 0.02],
    [0.40, -2.92, 0.02],
  ],
  // Lumbar plexus → left leg
  [
    [0, -0.50, 0.06],
    [-0.20, -0.65, 0.05],
    [-0.42, -0.95, 0.04],
    [-0.50, -1.40, 0.03],
    [-0.46, -1.85, 0.02],
    [-0.44, -2.20, 0.02],
    [-0.40, -2.55, 0.02],
    [-0.40, -2.92, 0.02],
  ],
  // Cranial → right (up into head)
  [
    [0, 1.72, -0.04],
    [0.10, 1.88, -0.05],
    [0.18, 2.05, -0.05],
    [0.22, 2.20, -0.04],
  ],
  // Cranial → left
  [
    [0, 1.72, -0.04],
    [-0.10, 1.88, -0.05],
    [-0.18, 2.05, -0.05],
    [-0.22, 2.20, -0.04],
  ],
];

// === HELPERS ===

// Mirror right-side path to left side
export function mirrorX(points: V2[]): V2[] {
  return points.map(([x, y]) => [-x, y] as V2);
}

// Convert 2D points to 3D (z=0)
export function lift(points: V2[], z = 0): V3[] {
  return points.map(([x, y]) => [x, y, z] as V3);
}

// Smooth a polyline by interpolating Catmull-Rom curve through it
export function smooth2D(points: V2[], divisions = 64, closed = false): V3[] {
  const v3s = points.map(([x, y]) => new THREE.Vector3(x, y, 0));
  if (v3s.length < 2) return [];
  const curve = new THREE.CatmullRomCurve3(v3s, closed, 'catmullrom', 0.5);
  return curve.getPoints(divisions).map((p) => [p.x, p.y, p.z] as V3);
}

export function smooth3D(points: V3[], divisions = 60): THREE.CatmullRomCurve3 {
  const v3s = points.map(([x, y, z]) => new THREE.Vector3(x, y, z));
  return new THREE.CatmullRomCurve3(v3s, false, 'catmullrom', 0.5);
}
