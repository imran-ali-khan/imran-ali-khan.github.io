import { gsap } from 'gsap';

export const NS = 'http://www.w3.org/2000/svg';
export const INK = '#1A1B3A';
export const MUT = '#53557E';

type Attrs = Record<string, string | number>;

/** Tiny SVG builder: S('rect', {x: 1}, parent, 'optional text'). */
export function S<K extends keyof SVGElementTagNameMap>(tag: K, attrs: Attrs = {}, parent?: Element, text?: string): SVGElementTagNameMap[K] {
  const e = document.createElementNS(NS, tag);
  for (const k in attrs) e.setAttribute(k, String(attrs[k]));
  if (text != null) e.textContent = text;
  parent?.appendChild(e);
  return e;
}

/** A rounded tile centred on (0,0). Move it with gsap x / y. */
export function tile(parent: Element, o: { w: number; h: number; fill: string; rx?: number; stroke?: string; sw?: number }) {
  const g = S('g', {}, parent);
  const r = S('rect', { x: -o.w / 2, y: -o.h / 2, width: o.w, height: o.h, rx: o.rx ?? 20, fill: o.fill, stroke: o.stroke ?? INK, 'stroke-width': o.sw ?? 4 }, g);
  return { g, r };
}

export function label(parent: Element, x: number, y: number, text: string, o: { size?: number; weight?: number; fill?: string; anchor?: string; mono?: boolean } = {}) {
  return S(
    'text',
    { x, y, 'text-anchor': o.anchor ?? 'middle', 'font-size': o.size ?? 24, 'font-weight': o.weight ?? 900, fill: o.fill ?? INK, class: o.mono ? 'mono' : '' },
    parent,
    text
  );
}

/** A heart, drawn around (0,0). On = filled coral, off = outline. */
export function heart(parent: Element, scale = 1) {
  const g = S('g', { transform: `scale(${scale})` }, parent);
  const p = S('path', { d: 'M0 12 C-30 -6 -24 -30 -9 -30 C-3 -30 0 -24 0 -22 C0 -24 3 -30 9 -30 C24 -30 30 -6 0 12Z', 'stroke-width': 3.5, 'stroke-linejoin': 'round', stroke: INK }, g);
  const set = (on: boolean) => p.setAttribute('fill', on ? '#FF6B6B' : '#fff');
  set(false);
  return { g, p, set };
}

/** A small key icon (a ring and a toothed shaft), drawn around (0,0). */
export function keyIcon(parent: Element, scale = 1, fill = '#FFC93C') {
  const g = S('g', { transform: `scale(${scale})` }, parent);
  S('circle', { cx: -14, cy: 0, r: 11, fill, stroke: INK, 'stroke-width': 3.5 }, g);
  S('circle', { cx: -14, cy: 0, r: 3.6, fill: INK }, g);
  S('path', { d: 'M-3 0 H26 M17 0 V9 M25 0 V7', fill: 'none', stroke: INK, 'stroke-width': 4, 'stroke-linecap': 'round' }, g);
  return g;
}

/** A pill that looks like "key + code", for showing which key a widget has. */
export function keyChip(parent: Element, text: string, o: { fill?: string; w?: number } = {}) {
  const w = o.w ?? Math.max(120, text.length * 11.5 + 52);
  const g = S('g', {}, parent);
  S('rect', { x: -w / 2, y: -17, width: w, height: 34, rx: 17, fill: o.fill ?? '#FFF3CF', stroke: INK, 'stroke-width': 3 }, g);
  const ic = keyIcon(g, 0.55);
  ic.setAttribute('transform', `translate(${-w / 2 + 22} 0) scale(0.55)`);
  const t = S('text', { x: 10, y: 6, 'text-anchor': 'middle', 'font-size': 17, 'font-weight': 700, fill: INK, class: 'mono' }, g, text);
  return { g, t, setText: (s: string) => (t.textContent = s) };
}

/** A banner at the bottom of a scene. Call .say(text, 'ok' | 'bad' | 'neutral'). */
export function banner(parent: Element, y: number, w = 700) {
  const pos = S('g', { transform: `translate(450 ${y})` }, parent);
  const g = S('g', {}, pos);
  const r = S('rect', { x: -w / 2, y: -30, width: w, height: 60, rx: 22, fill: '#fff', stroke: INK, 'stroke-width': 4 }, g);
  const t = S('text', { x: 0, y: 9, 'text-anchor': 'middle', 'font-size': 23, 'font-weight': 900, fill: INK }, g);
  return {
    g: pos,
    say(text: string, kind: 'ok' | 'bad' | 'neutral' = 'neutral') {
      t.textContent = text;
      r.setAttribute('fill', kind === 'ok' ? '#B8F2D6' : kind === 'bad' ? '#FFC2BA' : '#fff');
      gsap.fromTo(g, { scale: 0.92, transformOrigin: '50% 50%' }, { scale: 1, duration: 0.45, ease: 'back.out(3)', overwrite: 'auto' });
    },
  };
}

export const wait = (s: number, fn: () => void) => gsap.delayedCall(s, fn);
