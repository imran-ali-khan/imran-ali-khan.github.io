import { gsap } from 'gsap';
import { q, swap, pop, type SceneInit } from '../../util';
import { S, tile, label, banner, INK, MUT } from './kit';

type Mode = 'local' | 'global';
type Spot = 'other' | 'same';

const init: SceneInit = (root) => {
  const svg = q<SVGSVGElement>('#kk-svg', root);
  const cap = q('#kk-cap', root);
  const result = q('#kk-result', root);
  const bMode = [q<HTMLButtonElement>('#kk-local', root), q<HTMLButtonElement>('#kk-global', root)];
  const bSpot = [q<HTMLButtonElement>('#kk-other', root), q<HTMLButtonElement>('#kk-same', root)];

  // two parents
  const parents = [
    { x: 30, name: 'Column 1' },
    { x: 470, name: 'Column 2' },
  ];
  parents.forEach((p) => {
    S('rect', { x: p.x, y: 70, width: 400, height: 470, rx: 30, fill: '#EEF0FB', stroke: INK, 'stroke-width': 4 }, svg);
    label(svg, p.x + 200, 118, p.name, { size: 28, fill: MUT });
    label(svg, p.x + 200, 148, 'a parent: its children are siblings', { size: 17, fill: MUT, weight: 700 });
  });

  const SLOT = (col: 0 | 1, row: number) => ({ x: 230 + col * 440, y: 220 + row * 118 });
  type T = { pos: SVGGElement; g: SVGGElement; r: SVGRectElement; k: SVGTextElement };
  const make = (name: string, fill: string, col: 0 | 1, row: number): T => {
    const pos = S('g', {}, svg);
    const s = SLOT(col, row);
    gsap.set(pos, { x: s.x, y: s.y });
    const g = S('g', {}, pos);
    const t = tile(g, { w: 330, h: 96, fill: '#fff', rx: 22 });
    S('circle', { cx: -116, cy: 0, r: 28, fill, stroke: INK, 'stroke-width': 4 }, g);
    label(g, -116, 11, name, { size: 30 });
    label(g, -70, -6, 'Text widget', { size: 20, anchor: 'start', fill: MUT, weight: 800 });
    const k = label(g, -70, 24, '', { size: 18, anchor: 'start', mono: true, weight: 700 });
    return { pos, g, r: t.r, k };
  };
  const a1 = make('A', '#FF9DBB', 0, 0);
  const b1 = make('B', '#A596FF', 0, 1);
  const c2 = make('C', '#7FD3FF', 1, 0);
  const na = make('A', '#FF9DBB', 1, 1);
  const bn = banner(svg, 612, 780);
  const wire = S('path', { d: 'M395 220 C 450 330, 450 330, 505 338', fill: 'none', stroke: '#E5483A', 'stroke-width': 5, 'stroke-dasharray': '2 11', 'stroke-linecap': 'round', opacity: 0 }, svg);

  let mode: Mode = 'local';
  let spot: Spot | null = null;
  let tl: gsap.core.Timeline | null = null;

  const text = (m: Mode, id: string) => (m === 'local' ? `ValueKey('${id}')` : `GlobalKey · ${id}`);
  function labels() {
    a1.k.textContent = text(mode, 'A');
    b1.k.textContent = text(mode, 'B');
    c2.k.textContent = text(mode, 'C');
    na.k.textContent = text(mode, 'A');
  }

  function idle() {
    tl?.kill();
    spot = null;
    labels();
    gsap.set(wire, { opacity: 0 });
    [a1, b1, c2, na].forEach((t) => {
      t.r.setAttribute('stroke', INK);
      t.r.setAttribute('stroke-width', '4');
      gsap.set(t.g, { x: 0 });
    });
    gsap.set(na.pos, { opacity: 0 });
    bn.say(mode === 'local' ? 'Local keys are only compared among siblings.' : 'A GlobalKey must be unique in the whole app.', 'neutral');
    swap(cap, 'Add another <b>A</b> and see what Flutter says.');
    result.className = 'result';
    result.innerHTML = '<b>Result</b><p>Pick a place for the second A.</p>';
    bSpot.forEach((b) => b.setAttribute('aria-pressed', 'false'));
  }

  function run(where: Spot) {
    idle();
    spot = where;
    bSpot.forEach((b, i) => b.setAttribute('aria-pressed', String((['other', 'same'] as Spot[])[i] === where)));
    const target = where === 'other' ? SLOT(1, 1) : SLOT(0, 2);
    const bad = mode === 'global' || where === 'same';
    gsap.set(na.pos, { x: 450, y: 60, opacity: 0, scale: 0.8 });
    tl = gsap.timeline({ delay: 0.1 });
    tl.to(na.pos, { opacity: 1, scale: 1, duration: 0.3 })
      .to(na.pos, { x: target.x, y: target.y, duration: 0.9, ease: 'power3.inOut' })
      .call(() => {
        if (!bad) {
          [a1, na].forEach((t) => t.r.setAttribute('stroke', '#2FD18B'));
          bn.say("Fine: 'A' is in different parents", 'ok');
          result.className = 'result ok';
          result.innerHTML = '<b>OK</b><p>Siblings are compared, not the whole app. Both A can live.</p>';
          swap(cap, 'Different parents, so a local key does not clash.');
        } else {
          [a1, na].forEach((t) => {
            t.r.setAttribute('stroke', '#E5483A');
            t.r.setAttribute('stroke-width', '7');
          });
          gsap.to([a1.g, na.g], { x: 9, duration: 0.07, yoyo: true, repeat: 5, ease: 'sine.inOut', onComplete: () => gsap.set([a1.g, na.g], { x: 0 }) });
          if (where === 'other') gsap.to(wire, { opacity: 1, duration: 0.3 });
          if (where === 'same') {
            bn.say("Error: two siblings share the key 'A'", 'bad');
            result.innerHTML = '<b>Clash</b><p>Siblings must have different keys. Flutter cannot tell them apart.</p>';
          } else {
            bn.say('Error: this GlobalKey is already used elsewhere', 'bad');
            result.innerHTML = '<b>Clash</b><p>A GlobalKey is unique in the whole app. A second use asserts at runtime.</p>';
          }
          result.className = 'result bad';
          swap(cap, 'A clash. Key rules: <b>local = unique among siblings</b>, <b>global = unique everywhere</b>.');
        }
      });
  }

  bMode.forEach((b, i) =>
    b.addEventListener('click', () => {
      mode = i === 0 ? 'local' : 'global';
      bMode.forEach((x, k) => x.setAttribute('aria-pressed', String(k === i)));
      idle();
      pop(b, 0.9);
    })
  );
  bSpot.forEach((b, i) => b.addEventListener('click', () => run(i === 0 ? 'other' : 'same')));

  return {
    enter() {
      mode = 'local';
      bMode.forEach((x, k) => x.setAttribute('aria-pressed', String(k === 0)));
      idle();
      gsap.delayedCall(1.2, () => !spot && run('other'));
    },
    leave() {
      tl?.kill();
      gsap.killTweensOf(Array.from(root.querySelectorAll('g')));
    },
  };
};
export default init;
