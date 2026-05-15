// Quick GLB inspector — reads the JSON header of a GLB file and reports its structure.
import { readFileSync } from 'node:fs';

const path = process.argv[2];
if (!path) {
  console.error('Usage: node inspect-glb.mjs <path-to-glb>');
  process.exit(1);
}

const buf = readFileSync(path);
// GLB header
const magic = buf.toString('ascii', 0, 4);
if (magic !== 'glTF') {
  console.error('Not a GLB file');
  process.exit(1);
}
const version = buf.readUInt32LE(4);
const totalLen = buf.readUInt32LE(8);

// First chunk = JSON
const jsonChunkLen = buf.readUInt32LE(12);
const jsonChunkType = buf.toString('ascii', 16, 20);
if (jsonChunkType !== 'JSON') {
  console.error('Expected JSON chunk first');
  process.exit(1);
}
const jsonStr = buf.toString('utf8', 20, 20 + jsonChunkLen);
const gltf = JSON.parse(jsonStr);

console.log(`=== GLB INSPECTION: ${path} ===`);
console.log(`Version: ${version}`);
console.log(`File size: ${(buf.length / 1024 / 1024).toFixed(2)} MB`);
console.log();

console.log(`Asset:`, gltf.asset);
console.log();

console.log(`Scenes: ${gltf.scenes?.length ?? 0}`);
console.log(`Nodes: ${gltf.nodes?.length ?? 0}`);
console.log(`Meshes: ${gltf.meshes?.length ?? 0}`);
console.log(`Materials: ${gltf.materials?.length ?? 0}`);
console.log(`Animations: ${gltf.animations?.length ?? 0}`);
console.log(`Skins: ${gltf.skins?.length ?? 0}`);
console.log(`Images: ${gltf.images?.length ?? 0}`);
console.log(`Textures: ${gltf.textures?.length ?? 0}`);
console.log();

// Total triangle count
let totalTris = 0;
let totalVerts = 0;
for (const mesh of gltf.meshes ?? []) {
  for (const prim of mesh.primitives ?? []) {
    if (prim.indices !== undefined) {
      const acc = gltf.accessors[prim.indices];
      totalTris += Math.floor(acc.count / 3);
    }
    if (prim.attributes?.POSITION !== undefined) {
      const acc = gltf.accessors[prim.attributes.POSITION];
      totalVerts += acc.count;
    }
  }
}
console.log(`Total triangles: ${totalTris.toLocaleString()}`);
console.log(`Total vertices: ${totalVerts.toLocaleString()}`);
console.log();

// Mesh names
console.log(`--- Meshes ---`);
(gltf.meshes ?? []).forEach((m, i) => {
  let tris = 0;
  for (const prim of m.primitives ?? []) {
    if (prim.indices !== undefined) {
      tris += Math.floor(gltf.accessors[prim.indices].count / 3);
    }
  }
  console.log(`  [${i}] ${m.name ?? '(unnamed)'} — ${tris.toLocaleString()} tris, ${m.primitives.length} primitive(s)`);
});

// Material names
console.log();
console.log(`--- Materials ---`);
(gltf.materials ?? []).forEach((m, i) => {
  console.log(`  [${i}] ${m.name ?? '(unnamed)'}`);
});

// Top-level scene nodes
console.log();
console.log(`--- Top-level scene nodes ---`);
const scene = gltf.scenes?.[gltf.scene ?? 0];
if (scene) {
  for (const nodeIdx of scene.nodes) {
    const node = gltf.nodes[nodeIdx];
    console.log(`  [${nodeIdx}] ${node.name ?? '(unnamed)'} — children: ${node.children?.length ?? 0}, mesh: ${node.mesh ?? 'none'}`);
  }
}

// Bounding box from POSITION accessors (rough)
console.log();
console.log(`--- Bounding box (from accessor min/max) ---`);
const bb = { min: [Infinity, Infinity, Infinity], max: [-Infinity, -Infinity, -Infinity] };
for (const mesh of gltf.meshes ?? []) {
  for (const prim of mesh.primitives ?? []) {
    const posAcc = gltf.accessors[prim.attributes?.POSITION];
    if (posAcc?.min && posAcc?.max) {
      for (let i = 0; i < 3; i++) {
        bb.min[i] = Math.min(bb.min[i], posAcc.min[i]);
        bb.max[i] = Math.max(bb.max[i], posAcc.max[i]);
      }
    }
  }
}
console.log(`  min: [${bb.min.map(v => v.toFixed(3)).join(', ')}]`);
console.log(`  max: [${bb.max.map(v => v.toFixed(3)).join(', ')}]`);
const size = bb.max.map((v, i) => v - bb.min[i]);
console.log(`  size: [${size.map(v => v.toFixed(3)).join(', ')}]`);
