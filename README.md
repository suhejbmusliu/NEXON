# NeuroMotion AI (NEXON)

Scroll-driven 3D landing page for **NeuroMotion AI**, a concept product: an
AI-powered neural interface that reconnects the body and mind.

One full-screen WebGL scene sits behind the page. As you scroll, the camera
moves through five sections and each 3D scene fades in and out with its
text.

---

## What's inside

| # | Section | Scene |
|---|---|---|
| 01 | Hero | intro scene + particle field |
| 02 | The Chip | neural chip breakdown |
| 03 | The Body | anatomy model (`public/models/anatomy.glb`), five story beats over 300vh |
| 04 | Movement | movement scene |
| 05 | The Future | closing scene |

Also: smooth scrolling (Lenis), a scroll progress bar, a navbar that
smooth-scrolls to each section, bloom + vignette post-processing.

---

## Tech stack

| Area | Tool |
|---|---|
| Framework | Next.js 14 (App Router) + React 18 |
| Language | TypeScript |
| 3D | three.js, React Three Fiber, drei, @react-three/postprocessing |
| Scrolling | Lenis |
| Text animation | Framer Motion |
| Styling | Tailwind CSS v3 |
| Font | Inter via `next/font` |

`gsap` is installed but not used in the code yet.

---

## Getting started

```bash
npm install
npm run dev        # http://localhost:3000
```

No environment variables are needed. The anatomy model is about 16 MB, so
the first load takes a moment.

---

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run start` | Run the production build |
| `npm run lint` | `next lint` |
| `node scripts/inspect-glb.mjs <file.glb>` | Print the structure of a GLB model (meshes, nodes, materials) |

---

## Project structure

```
app/
  layout.tsx             font, page title and description
  page.tsx               SmoothScroll + 3D canvas + the five sections
components/
  scene/
    SceneRoot.tsx        the single <Canvas>: lights, fog, environment, all scenes
    CameraRig.tsx        moves the camera with scroll progress
    AnatomyModel.tsx     loads anatomy.glb
    NeuralChip.tsx, ParticleField.tsx, PostFX.tsx
  sections/
    01-Hero/ … 05-Future/   each has <Name>Section.tsx (HTML text) and <Name>Scene.tsx (3D)
  layout/                NavBar, Footer, SmoothScroll (Lenis)
  ui/ScrollProgress.tsx
lib/
  scroll.ts              shared scroll progress (0 → 1), written by Lenis, read in useFrame
  sectionRanges.ts       which part of the scroll each section owns
  bodyAnatomy.ts, easing.ts
public/models/anatomy.glb
scripts/inspect-glb.mjs
```

---

## How the scroll works

`SmoothScroll` writes the page scroll (0 → 1) into `scrollState.progress`
(`lib/scroll.ts`). Scenes and the camera read it every frame instead of
through React state, so scrolling doesn't re-render the page. The ranges in
`lib/sectionRanges.ts` must match the section heights in the DOM (hero,
chip, movement and future are 100vh each; body is 300vh). Change both
together.

---

## Deployment

There is no hosting config in the repo. It is a standard Next.js app, so it
deploys to Vercel as-is.
