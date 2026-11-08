import { gsap } from 'gsap';
import { q, qa, swap, type SceneInit } from '../../util';
import { S, label, INK, MUT } from './kit';

type Leaf = 'global' | 'value' | 'object' | 'page' | 'none';

const LEAF: Record<Leaf, { name: string; fill: string }> = {
  global: { name: 'GlobalKey', fill: '#FFC93C' },
  value: { name: 'ValueKey(item.id)', fill: '#B4C2FF' },
  object: { name: 'ObjectKey(item)', fill: '#CFC6FF' },
  page: { name: 'PageStorageKey', fill: '#B0F2D3' },
  none: { name: 'No key', fill: '#E4E5F2' },
};

// edge id -> the question it leaves and the question it reaches (if any)
const EDGE: Record<string, { from: string; to?: string; leaf?: Leaf }> = {
  q1y: { from: 'q1', leaf: 'global' },
  q1n: { from: 'q1', to: 'q2' },
  q2y: { from: 'q2', to: 'q3' },
  q2n: { from: 'q2', to: 'q4' },
  q3y: { from: 'q3', leaf: 'value' },
  q3n: { from: 'q3', leaf: 'object' },
  q4y: { from: 'q4', leaf: 'page' },
  q4n: { from: 'q4', leaf: 'none' },
};

const SCEN: { path: string[]; why: string }[] = [
  { path: ['q1n', 'q2y', 'q3y'], why: 'Many siblings, each with a stable id. ValueKey(id) keeps every State with its own item.' },
  { path: ['q1y'], why: "You need the Form's State from a button outside it. Only a GlobalKey reaches across the tree." },
  { path: ['q1y'], why: 'You move one widget to another parent and keep its State. Only a GlobalKey can reparent it.' },
  { path: ['q1n', 'q2n', 'q4y'], why: 'The scroll position must survive page changes. A PageStorageKey saves and restores it.' },
  { path: ['q1n', 'q2y', 'q3n'], why: 'No id, but each item is its own object. ObjectKey(item) uses that object as the identity.' },
  { path: ['q1n', 'q2n', 'q4n'], why: 'Fixed widgets that never reorder. Flutter matches by type and position. No key needed.' },
];

const init: SceneInit = (root) => {
  const svg = q<SVGSVGElement>('#kq-svg', root);
  const result = q('#kq-result', root);
  const cap = q('#kq-cap', root);
  const btns = qa<HTMLButtonElement>('.kq-s', root);

  const defs = S('defs', {}, svg);
  const mk = S('marker', { id: 'kq-ar', viewBox: '0 0 10 10', refX: 8, refY: 5, markerWidth: 14, markerHeight: 14, markerUnits: 'userSpaceOnUse', orient: 'auto' }, defs);
  S('path', { d: 'M0 0 L10 5 L0 10z', fill: INK }, mk);

  const edges: Record<string, SVGPathElement> = {};
  const nodes: Record<string, SVGRectElement> = {};
  const edge = (id: string, d: string) => {
    edges[id] = S('path', { d, fill: 'none', stroke: INK, 'stroke-width': 4, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'marker-end': 'url(#kq-ar)', opacity: 0.5 }, svg);
  };
  const yn = (x: number, y: number, t: string) => label(svg, x, y, t, { size: 20, fill: MUT, anchor: 'start' });
  const question = (id: string, cy: number, lines: string[]) => {
    nodes[id] = S('rect', { x: 50, y: cy - 43, width: 400, height: 86, rx: 24, fill: '#fff', stroke: INK, 'stroke-width': 4 }, svg);
    lines.forEach((t, i) => label(svg, 250, cy - 6 + i * 28, t, { size: 20, weight: 800 }));
  };
  const leaf = (id: string, cy: number, k: Leaf) => {
    nodes[id] = S('rect', { x: 570, y: cy - 30, width: 280, height: 60, rx: 20, fill: LEAF[k].fill, stroke: INK, 'stroke-width': 4 }, svg);
    label(svg, 710, cy + 8, LEAF[k].name, { size: 23, mono: true, weight: 700 });
  };

  question('q1', 70, ['Need its State or size from outside,', 'or move it and keep its State?']);
  question('q2', 190, ['Is it one of many siblings that', 'reorder, insert or get removed?']);
  question('q3', 310, ['Does each item have a', 'stable unique id?']);
  question('q4', 480, ['Must its scroll position survive', 'page or tab changes?']);
  leaf('global', 70, 'global');
  leaf('value', 280, 'value');
  leaf('object', 350, 'object');
  leaf('page', 450, 'page');
  leaf('none', 525, 'none');

  edge('q1y', 'M450 70 H 566');
  edge('q1n', 'M250 113 V 145');
  edge('q2y', 'M250 233 V 265');
  edge('q2n', 'M50 190 H 24 V 480 H 46');
  edge('q3y', 'M450 280 H 566');
  edge('q3n', 'M450 345 H 566');
  edge('q4y', 'M450 460 H 566');
  edge('q4n', 'M450 505 H 566');
  yn(462, 56, 'yes');
  yn(262, 136, 'no');
  yn(262, 258, 'yes');
  yn(4, 176, 'no');
  yn(462, 266, 'yes');
  yn(462, 332, 'no');
  yn(462, 446, 'yes');
  yn(462, 494, 'no');
  label(svg, 450, 625, 'Start at the top. Follow yes or no.', { size: 22, fill: MUT, weight: 800 });

  function clear() {
    Object.values(edges).forEach((e) => {
      e.setAttribute('stroke', INK);
      e.setAttribute('opacity', '0.5');
      e.setAttribute('stroke-width', '4');
    });
    Object.values(nodes).forEach((n) => {
      n.setAttribute('stroke', INK);
      n.setAttribute('stroke-width', '4');
    });
  }
  const glow = (n?: string) => {
    if (!n) return;
    nodes[n].setAttribute('stroke', '#3E5AD6');
    nodes[n].setAttribute('stroke-width', '8');
  };

  let tl: gsap.core.Timeline | null = null;
  function pick(i: number) {
    tl?.kill();
    clear();
    btns.forEach((b, k) => b.setAttribute('aria-pressed', String(k === i)));
    const s = SCEN[i];
    result.className = 'result';
    result.innerHTML = '<b>Thinking...</b><p>&nbsp;</p>';
    tl = gsap.timeline();
    let last: Leaf = 'none';
    s.path.forEach((id, k) => {
      tl!.call(() => {
        const e = EDGE[id];
        glow(e.from);
        edges[id].setAttribute('stroke', '#3E5AD6');
        edges[id].setAttribute('opacity', '1');
        edges[id].setAttribute('stroke-width', '7');
        glow(e.to);
        if (e.leaf) glow(e.leaf);
      }, [], k * 0.4);
      const e = EDGE[id];
      if (e.leaf) last = e.leaf;
    });
    tl.call(() => {
      result.className = 'result ok';
      result.innerHTML = `<b>${LEAF[last].name}</b><p>${s.why}</p>`;
      swap(cap, 'Follow the blue path in the chart.');
    }, [], s.path.length * 0.4 + 0.15);
  }

  btns.forEach((b, i) => b.addEventListener('click', () => pick(i)));

  let auto: gsap.core.Tween | null = null;
  return {
    enter() {
      clear();
      result.className = 'result';
      result.innerHTML = '<b>Result</b><p>Pick a situation.</p>';
      swap(cap, 'Pick a situation:');
      auto = gsap.delayedCall(1.0, () => pick(0));
    },
    leave() {
      auto?.kill();
      tl?.kill();
    },
  };
};
export default init;
