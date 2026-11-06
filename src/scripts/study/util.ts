import { gsap } from 'gsap';

export const q = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document) => root.querySelector(sel) as T;
export const qa = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document) =>
  Array.from(root.querySelectorAll(sel)) as T[];

// ?still shows every scene in its final state (for reviewing). Reduced motion does the same.
export const still = location.search.includes('still');
export const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches || still;

export const NS = 'http://www.w3.org/2000/svg';

export interface Scene {
  enter(): void;
  leave(): void;
}
export type SceneInit = (root: HTMLElement) => Scene;

/** Replace text with a short slide-in, so captions feel alive. */
export function swap(el: Element, html: string) {
  el.innerHTML = html;
  if (!reduce) gsap.fromTo(el, { y: 8, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, ease: 'power3.out', overwrite: true });
}

/** A number or word that pops when it changes. */
export function pop(el: Element, from = 0.5) {
  gsap.fromTo(el, { scale: from, transformOrigin: '50% 50%' }, { scale: 1, duration: 0.5, ease: 'back.out(3)', overwrite: 'auto' });
}

/** A small burst of coloured dots (used for "poof" moments). */
export function puff(g: SVGGElement, x: number, y: number, colors = ['#FFC93C', '#fff', '#5B7CFF']) {
  g.innerHTML = '';
  for (let i = 0; i < 12; i++) {
    const c = document.createElementNS(NS, 'circle');
    c.setAttribute('r', String(8 + Math.random() * 10));
    c.setAttribute('fill', colors[i % colors.length]);
    c.setAttribute('stroke', '#1A1B3A');
    c.setAttribute('stroke-width', '3');
    g.appendChild(c);
    const a = (i / 12) * Math.PI * 2;
    gsap.fromTo(
      c,
      { x, y, opacity: 1, scale: 1 },
      { x: x + Math.cos(a) * 170, y: y + Math.sin(a) * 120, opacity: 0, scale: 0.2, duration: 0.8, ease: 'power2.out' }
    );
  }
}
