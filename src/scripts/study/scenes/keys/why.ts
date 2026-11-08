import { gsap } from 'gsap';
import { q, swap, pop, flowHTML, reduce, type FlowItem, type SceneInit } from '../../util';
import { S, tile, label, heart, keyChip, banner, INK, MUT } from './kit';

type Id = 'A' | 'B' | 'C';
const IDS: Id[] = ['A', 'B', 'C'];
const WHO: Record<Id, { name: string; fill: string }> = {
  A: { name: 'Ali', fill: '#FF9DBB' },
  B: { name: 'Bela', fill: '#A596FF' },
  C: { name: 'Chen', fill: '#7FD3FF' },
};
const XS = [165, 450, 735];
const CARD_Y = 160;
const EL_Y = 470;

const flows: Record<string, FlowItem[]> = {
  start: [{ t: 'rebuild', c: 'b' }, { t: 'compare old + new', c: 'n' }, { t: 'keep State or hand it over', c: 'y' }],
  nokey: [{ t: 'rebuild', c: 'b' }, { t: 'same type + same slot', c: 'n' }, { t: 'slot 1 keeps its State', c: 'y' }, { t: "Bela gets Ali's heart", c: 'r' }],
  key: [{ t: 'rebuild', c: 'b' }, { t: 'same type + same key', c: 'n' }, { t: 'Element follows its key', c: 'y' }, { t: 'Ali keeps the heart', c: 'g' }],
};

const init: SceneInit = (root) => {
  const svg = q<SVGSVGElement>('#kw-svg', root);
  const cap = q('#kw-cap', root);
  const flow = q('#kw-flow', root);
  const bMove = q<HTMLButtonElement>('#kw-move', root);
  const bKey = q<HTMLButtonElement>('#kw-key', root);
  const bReset = q<HTMLButtonElement>('#kw-reset', root);

  label(svg, 450, 44, 'Your widgets (new data, each rebuild)', { size: 24, fill: MUT });
  label(svg, 450, 352, 'Elements + State (Flutter keeps these)', { size: 24, fill: MUT });

  const lines = IDS.map((_, i) => S('line', { x1: XS[i], y1: CARD_Y + 72, x2: XS[i], y2: EL_Y - 98, stroke: INK, 'stroke-width': 4, 'stroke-dasharray': '2 10', 'stroke-linecap': 'round' }, svg));

  const cards = {} as Record<Id, { pos: SVGGElement; g: SVGGElement; r: SVGRectElement; h: ReturnType<typeof heart>; hw: SVGGElement }>;
  const els = {} as Record<Id, { pos: SVGGElement; g: SVGGElement; r: SVGRectElement; h: ReturnType<typeof heart>; hw: SVGGElement; key: ReturnType<typeof keyChip> }>;

  IDS.forEach((id, i) => {
    const pos = S('g', {}, svg);
    gsap.set(pos, { x: XS[i], y: CARD_Y });
    const g = S('g', {}, pos);
    const t = tile(g, { w: 244, h: 140, fill: '#fff' });
    S('circle', { cx: -68, cy: 0, r: 32, fill: WHO[id].fill, stroke: INK, 'stroke-width': 4 }, g);
    label(g, -68, 12, id, { size: 34 });
    label(g, -20, 11, WHO[id].name, { size: 31, anchor: 'start' });
    const hw = S('g', { transform: 'translate(88 -6)' }, g);
    const hwi = S('g', {}, hw);
    const h = heart(hwi, 0.95);
    cards[id] = { pos, g, r: t.r, h, hw: hwi };
  });

  IDS.forEach((id, i) => {
    const pos = S('g', {}, svg);
    gsap.set(pos, { x: XS[i], y: EL_Y });
    const g = S('g', {}, pos);
    const t = tile(g, { w: 244, h: 196, fill: '#FFC93C' });
    label(g, 0, -64, 'Element', { size: 22, fill: INK });
    const key = keyChip(g, "ValueKey('A')", { w: 214 });
    key.g.setAttribute('transform', 'translate(0 -30)');
    const hwi = S('g', { transform: 'translate(0 22)' }, g);
    const hw = S('g', {}, hwi);
    const h = heart(hw, 1.45);
    label(g, 0, 78, 'State (the heart)', { size: 20, fill: INK });
    els[id] = { pos, g, r: t.r, h, hw, key };
  });

  const bn = banner(svg, 632, 760);

  let keyed = false;
  let order: Id[] = ['A', 'B', 'C'];
  let tl: gsap.core.Timeline | null = null;
  let auto: gsap.core.Tween | null = null;
  const liked: Record<Id, boolean> = { A: true, B: false, C: false };

  const keyText = (id: Id) => (keyed ? `ValueKey('${id}')` : 'no key');
  const showKeys = () => {
    IDS.forEach((id) => {
      els[id].key.setText(keyText(id));
      els[id].key.g.setAttribute('opacity', keyed ? '1' : '0.55');
    });
  };

  // which element is matched to the card in slot i
  const elementFor = (i: number): Id => (keyed ? order[i] : IDS[i]);

  function settle(say = true) {
    let wrong = null as Id | null;
    let missing = false;
    order.forEach((id, i) => {
      const e = elementFor(i);
      const on = liked[e];
      cards[id].h.set(on);
      const ok = on === liked[id];
      cards[id].r.setAttribute('stroke', ok ? INK : '#E5483A');
      cards[id].r.setAttribute('stroke-width', ok ? '4' : '7');
      lines[i].setAttribute('stroke', ok ? '#2FD18B' : '#E5483A');
      lines[i].setAttribute('stroke-width', ok ? '4' : '6');
      if (!ok && on) wrong = id;
      if (!ok && !on) missing = true;
      if (!ok && !reduce) pop(cards[id].hw, 0.3);
    });
    IDS.forEach((id) => els[id].r.setAttribute('stroke', INK));
    if (!say) return;
    if (wrong || missing) {
      bn.say(wrong ? `Wrong: ${WHO[wrong].name} shows Ali's heart, and Ali lost it` : 'Wrong: Ali lost the heart', 'bad');
      swap(cap, '<b>Bug.</b> Without a key, Flutter matches by position, so the first Element (with the heart) now serves Bela.');
      swap(flow, flowHTML(flows.nokey));
    } else {
      bn.say('Correct: the heart stayed with Ali', 'ok');
      swap(cap, '<b>Fixed.</b> With a key, the Element follows its widget. Ali keeps the heart.');
      swap(flow, flowHTML(flows.key));
    }
  }

  function reset() {
    tl?.kill();
    order = ['A', 'B', 'C'];
    IDS.forEach((id, i) => {
      gsap.set(cards[id].pos, { x: XS[i], y: CARD_Y });
      gsap.set(els[id].pos, { x: XS[i], y: EL_Y });
      els[id].h.set(liked[id]);
    });
    showKeys();
    settle(false);
    lines.forEach((l) => {
      l.setAttribute('stroke', INK);
      l.setAttribute('stroke-width', '4');
    });
    cards.A.r.setAttribute('stroke', INK);
    bn.say('Ali is liked. The heart is State, kept by the Element.', 'neutral');
    swap(cap, keyed ? 'Keys are on. Press the yellow button.' : 'No keys yet. Press the yellow button.');
    swap(flow, flowHTML(flows.start));
    bMove.disabled = false;
  }

  function move() {
    reset();
    tl?.kill();
    order = ['B', 'C', 'A'];
    bMove.disabled = true;
    swap(cap, 'Ali moves to the end of the list...');
    tl = gsap.timeline({ onComplete: () => { settle(); bMove.disabled = false; } });
    IDS.forEach((id) => {
      const i = order.indexOf(id);
      tl!.to(cards[id].pos, { x: XS[i], duration: 0.9, ease: 'power3.inOut' }, 0.3);
      if (keyed) tl!.to(els[id].pos, { x: XS[i], duration: 0.9, ease: 'power3.inOut' }, 0.3);
    });
    tl.to(cards.A.pos, { y: CARD_Y - 26, duration: 0.45, yoyo: true, repeat: 1, ease: 'sine.inOut' }, 0.3);
  }

  bMove.addEventListener('click', move);
  bReset.addEventListener('click', reset);
  bKey.addEventListener('click', () => {
    keyed = !keyed;
    bKey.setAttribute('aria-pressed', String(keyed));
    reset();
  });

  return {
    enter() {
      keyed = false;
      bKey.setAttribute('aria-pressed', 'false');
      reset();
      auto = gsap.delayedCall(1.4, move);
    },
    leave() {
      tl?.kill();
      auto?.kill();
      gsap.killTweensOf(Array.from(root.querySelectorAll('g')));
    },
  };
};
export default init;
