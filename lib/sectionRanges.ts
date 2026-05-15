// Scroll-progress ranges for each cinematic section. The whole page scroll runs
// 0 → 1; each section claims a slice. Scenes and the camera rig reference these.
//
// DOM heights: hero=100vh, chip=100vh, body=300vh, movement=100vh, future=100vh.
// Total page = 700vh, scrollable = 600vh. Ranges below reflect where each section's
// DOM occupies the scroll range (so a scene fades in/out where the user actually
// sees it).

export const SECTIONS = {
  hero: { start: 0.0, end: 0.167, label: '01', name: 'Hero' },
  chip: { start: 0.167, end: 0.333, label: '02', name: 'The Chip' },
  body: { start: 0.333, end: 0.833, label: '03', name: 'The Body' },
  movement: { start: 0.833, end: 0.917, label: '04', name: 'Movement' },
  future: { start: 0.917, end: 1.0, label: '05', name: 'The Future' },
} as const;

export type SectionKey = keyof typeof SECTIONS;

// Body section is split into 5 narrative beats. Helper to compute sub-progress
// (0-1 within the body section) from overall page progress.
export const BODY_BEAT_COUNT = 5;

export function bodySubProgress(pageProgress: number): number {
  const span = SECTIONS.body.end - SECTIONS.body.start;
  if (span <= 0) return 0;
  const sub = (pageProgress - SECTIONS.body.start) / span;
  return Math.max(0, Math.min(1, sub));
}

// Each beat occupies an equal slice of the body section's sub-progress.
export function beatRange(index: number): { start: number; end: number } {
  const w = 1 / BODY_BEAT_COUNT;
  return { start: index * w, end: (index + 1) * w };
}
