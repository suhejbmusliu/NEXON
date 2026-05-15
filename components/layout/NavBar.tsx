'use client';

import { MouseEvent } from 'react';

const NAV_LINKS = [
  { href: '#chip', label: 'THE CHIP' },
  { href: '#body', label: 'THE BODY' },
  { href: '#movement', label: 'MOVEMENT' },
  { href: '#future', label: 'THE FUTURE' },
];

function smoothScrollTo(e: MouseEvent<HTMLAnchorElement>, href: string) {
  e.preventDefault();
  const target = document.querySelector(href) as HTMLElement | null;
  if (!target) return;
  const lenis = window.__lenis;
  if (lenis) {
    // Lenis smooth scroll — duration tuned to feel cinematic, easeInOutCubic
    lenis.scrollTo(target, {
      duration: 1.6,
      easing: (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
    });
  } else {
    target.scrollIntoView({ behavior: 'smooth' });
  }
}

export default function NavBar() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 px-6 py-4">
      <nav className="mx-auto flex max-w-6xl items-center justify-between rounded-full glass px-6 py-3">
        <a
          href="#hero"
          onClick={(e) => smoothScrollTo(e, '#hero')}
          className="text-sm font-bold tracking-[0.3em]"
        >
          NEUROMOTION
        </a>
        <ul className="hidden gap-8 text-[11px] tracking-[0.3em] text-white/70 md:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                onClick={(e) => smoothScrollTo(e, link.href)}
                className="transition hover:text-white"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
        <a
          href="#future"
          onClick={(e) => smoothScrollTo(e, '#future')}
          className="rounded-full bg-white px-4 py-2 text-[11px] font-medium tracking-[0.25em] text-black transition hover:bg-white/90"
        >
          EXPLORE
        </a>
      </nav>
    </header>
  );
}
