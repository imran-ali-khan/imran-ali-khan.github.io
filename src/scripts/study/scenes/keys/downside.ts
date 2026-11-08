import { gsap } from 'gsap';
import { q, qa, swap, puff, type SceneInit } from '../../util';
import { S, tile, label, keyChip, banner, INK, MUT } from './kit';

type Mode = 0 | 1 | 2;

const init: SceneInit = (root) => {
  const svg = q<SVGSVGElement>('#kd-svg', root);
  const result = q('#kd-result', root);
  const cap = q('#kd-cap', root);
  const segs = qa<HTMLButtonElement>('.kd-m', root);
  const run1 = q<HTMLButtonElement>('#kd-run', root);
  const run2 = q<HTMLButtonElement>('#kd-run2', root);

  const g0 = S('g', {}, svg);
  const g1 = S('g', {}, svg);
  const g2 = S('g', {}, svg);
  const bn = banner(svg, 628, 800);

  /* 0 · key created inside build() */
  const frame = S('rect', { x: 60, y: 90, width: 780, height: 430, rx: 34, fill: '#EEF0FB', stroke: INK, 'stroke-width': 4 }, g0);
  label(g0, 450, 138, 'Parent (it rebuilds)', { size: 26, fill: MUT });
  const childPos = S('g', {}, g0);
  gsap.set(childPos, { x: 450, y: 330 });
  const child = S('g', {}, childPos);
  tile(child, { w: 340, h: 210, fill: '#fff', rx: 28 });
  label(child, 0, -52, 'Counter (has State)', { size: 24, fill: MUT, weight: 800 });
  const count = label(child, 0, 22, 'taps = 5', { size: 54, mono: true, weight: 700 });
  const chip0 = keyChip(child, '_key  (kept in State)');
  chip0.g.setAttribute('transform', 'translate(0 76)');
  const puffG = S('g', {}, g0);

  /* 1 · same key twice */
  const dup: { pos: SVGGElement; r: SVGRectElement }[] = [];
  [230, 670].forEach((x, i) => {
    const pos = S('g', {}, g1);
    gsap.set(pos, { x, y: 300 });
    const g = S('g', {}, pos);
    const t = tile(g, { w: 340, h: 190, fill: '#fff', rx: 28 });
    label(g, 0, -34, `Widget ${i + 1}`, { size: 30 });
    label(g, 0, 8, i === 0 ? 'in Column 1' : 'in Column 2', { size: 21, fill: MUT, weight: 800 });
    keyChip(g, 'GlobalKey · A', { w: 220 }).g.setAttribute('transform', 'translate(0 58)');
    dup.push({ pos, r: t.r });
  });
  const err = S('g', {}, g1);
  gsap.set(err, { opacity: 0 });
  S('rect', { x: 120, y: 440, width: 660, height: 92, rx: 22, fill: '#2A2B4D' }, err);
  label(err, 450, 480, 'Multiple widgets used the same GlobalKey.', { size: 25, fill: '#FFC2BA', mono: true, weight: 700 });
  label(err, 450, 514, '(an assertion error, at runtime)', { size: 20, fill: '#B8B9D8', weight: 700 });

  /* 2 · moving a keyed subtree */
  [{ x: 40, n: 'Old parent' }, { x: 500, n: 'New parent' }].forEach((r) => {
    S('rect', { x: r.x, y: 100, width: 360, height: 360, rx: 30, fill: '#EEF0FB', stroke: INK, 'stroke-width': 4 }, g2);
    label(g2, r.x + 180, 146, r.n, { size: 26, fill: MUT });
  });
  const subPos = S('g', {}, g2);
  gsap.set(subPos, { x: 220, y: 300 });
  const sub = S('g', {}, subPos);
  S('path', { d: 'M0 -20 L-70 60 M0 -20 L70 60', stroke: INK, 'stroke-width': 4 }, sub);
  tile(sub, { w: 200, h: 70, fill: '#FFC93C', rx: 22 }).g.setAttribute('transform', 'translate(0 -40)');
  label(sub, 0, -30, 'Video', { size: 28 });
  [-70, 70].forEach((dx) => {
    const c = S('g', { transform: `translate(${dx} 76)` }, sub);
    tile(c, { w: 120, h: 54, fill: '#fff', rx: 18 });
    label(c, 0, 8, 'child', { size: 22, fill: MUT, weight: 800 });
  });
  keyChip(sub, 'GlobalKey', { w: 160 }).g.setAttribute('transform', 'translate(0 142)');
  const deps: SVGRectElement[] = [];
  [{ x: 250 }, { x: 650 }].forEach((d) => {
    const g = S('g', { transform: `translate(${d.x} 536)` }, g2);
    const t = tile(g, { w: 300, h: 60, fill: '#fff', rx: 20 });
    label(g, 0, 8, 'depends on a Theme', { size: 22, fill: MUT, weight: 800 });
    deps.push(t.r);
  });

  let mode: Mode = 0;
  let tl: gsap.core.Timeline | null = null;
  const T: Record<Mode, { a: string; b: string; cap: string; res: string; say: string }> = {
    0: { a: 'Bad: key in build()', b: 'Good: key in State', cap: 'The parent rebuilds. Watch the counter.', res: '<b>Result</b><p>Press a button.</p>', say: 'The counter has 5 taps.' },
    1: { a: 'Use the key twice', b: '', cap: 'Two widgets, one GlobalKey.', res: '<b>Result</b><p>Press the button.</p>', say: 'Two widgets want the same GlobalKey.' },
    2: { a: 'Move the subtree', b: '', cap: 'Move a keyed subtree to a new parent.', res: '<b>Result</b><p>Press the button.</p>', say: 'A keyed subtree can move. What does it cost?' },
  };

  function resetAll() {
    tl?.kill();
    gsap.set(childPos, { scale: 1, opacity: 1 });
    count.textContent = 'taps = 5';
    chip0.setText('_key  (kept in State)');
    chip0.g.setAttribute('opacity', '1');
    frame.setAttribute('stroke', INK);
    frame.setAttribute('stroke-width', '4');
    dup.forEach((d) => {
      d.r.setAttribute('stroke', INK);
      d.r.setAttribute('stroke-width', '4');
    });
    gsap.set(err, { opacity: 0 });
    gsap.set(subPos, { x: 220, y: 300 });
    deps.forEach((d) => {
      d.setAttribute('fill', '#fff');
      d.setAttribute('stroke', INK);
    });
    puffG.innerHTML = '';
    result.className = 'result';
    result.innerHTML = T[mode].res;
    bn.say(T[mode].say, 'neutral');
  }

  function show(m: Mode) {
    mode = m;
    segs.forEach((b, i) => b.setAttribute('aria-pressed', String(i === m)));
    gsap.set([g0, g1, g2], { display: 'none' });
    gsap.set([g0, g1, g2][m], { display: 'inline' });
    run1.textContent = T[m].a;
    run2.textContent = T[m].b;
    run2.hidden = m !== 0;
    swap(cap, T[m].cap);
    resetAll();
  }

  function rebuild(bad: boolean) {
    resetAll();
    tl = gsap.timeline();
    tl.call(() => {
      frame.setAttribute('stroke', '#E0A21A');
      frame.setAttribute('stroke-width', '8');
      bn.say('The parent rebuilds...', 'neutral');
    }).to({}, { duration: 0.7 });
    if (bad) {
      tl.call(() => {
        chip0.setText('GlobalKey()  new key!');
        chip0.g.setAttribute('opacity', '1');
      })
        .to(childPos, { scale: 0, duration: 0.3, ease: 'back.in(2)', transformOrigin: '0px 0px' }, '+=0.4')
        .call(() => {
          puff(puffG, 450, 330, ['#FF6B6B', '#fff', '#FFC93C']);
          count.textContent = 'taps = 0';
          chip0.setText('GlobalKey()  new!');
        })
        .to(childPos, { scale: 1, duration: 0.5, ease: 'back.out(3)' }, '+=0.15')
        .call(() => {
          frame.setAttribute('stroke', INK);
          frame.setAttribute('stroke-width', '4');
          bn.say('New key each build: old subtree and State thrown away', 'bad');
          result.className = 'result bad';
          result.innerHTML = '<b>State lost</b><p>A new key is a new identity: the old subtree (taps 5) is dropped. Create the key once, in a State.</p>';
          swap(cap, 'Never create a GlobalKey in <b>build()</b>. Let a <b>State</b> own it.');
        });
    } else {
      tl.to(childPos, { scale: 1.06, duration: 0.2, yoyo: true, repeat: 1, transformOrigin: '0px 0px' }, '+=0.2').call(() => {
        frame.setAttribute('stroke', INK);
        frame.setAttribute('stroke-width', '4');
        bn.say('Same key: the State is kept (taps = 5)', 'ok');
        result.className = 'result ok';
        result.innerHTML = '<b>State kept</b><p>The State creates the key once (for example in initState). The identity never changes.</p>';
        swap(cap, 'The safe way: <b>one key, owned by a State</b>.');
      });
    }
  }

  function dupRun() {
    resetAll();
    tl = gsap.timeline();
    tl.call(() => {
      dup.forEach((d) => {
        d.r.setAttribute('stroke', '#E5483A');
        d.r.setAttribute('stroke-width', '8');
      });
    })
      .to(dup.map((d) => d.pos), { x: '+=0', duration: 0.01 })
      .to(err, { opacity: 1, duration: 0.35 })
      .call(() => {
        bn.say('Two widgets, one GlobalKey: it asserts', 'bad');
        result.className = 'result bad';
        result.innerHTML = '<b>Assertion error</b><p>A GlobalKey is unique in the whole app. Two widgets cannot share one.</p>';
        swap(cap, 'In a big app, GlobalKeys need <b>careful ownership</b>.');
      });
  }

  function moveRun() {
    resetAll();
    tl = gsap.timeline();
    tl.to(subPos, { y: 210, duration: 0.4, ease: 'power2.out' })
      .to(subPos, { x: 680, duration: 0.8, ease: 'power2.inOut' })
      .to(subPos, { y: 300, duration: 0.4, ease: 'bounce.out' })
      .call(() => bn.say('1. deactivate() runs on its State and all below it', 'neutral'))
      .to({}, { duration: 1.1 })
      .call(() => {
        bn.say('2. InheritedWidget dependents rebuild', 'neutral');
        deps.forEach((d) => {
          d.setAttribute('fill', '#FFC93C');
          d.setAttribute('stroke', '#E0A21A');
        });
      })
      .to({}, { duration: 1.1 })
      .call(() => {
        bn.say('It works, but it is relatively expensive', 'bad');
        result.className = 'result bad';
        result.innerHTML = '<b>Not free</b><p>Moving deactivates the State and its descendants, then rebuilds InheritedWidget dependents.</p>';
        swap(cap, 'Powerful, but <b>not a default</b>.');
      });
  }

  segs.forEach((b, i) => b.addEventListener('click', () => show(i as Mode)));
  run1.addEventListener('click', () => (mode === 0 ? rebuild(true) : mode === 1 ? dupRun() : moveRun()));
  run2.addEventListener('click', () => rebuild(false));

  let auto: gsap.core.Tween | null = null;
  return {
    enter() {
      show(0);
      auto = gsap.delayedCall(1.2, () => mode === 0 && rebuild(true));
    },
    leave() {
      auto?.kill();
      tl?.kill();
    },
  };
};
export default init;
