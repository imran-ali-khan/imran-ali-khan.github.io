import { gsap } from 'gsap';
import { q, qa, swap, puff, type SceneInit } from '../../util';
import { S, tile, label, keyChip, INK, MUT } from './kit';

type Mode = 0 | 1 | 2;

const init: SceneInit = (root) => {
  const svg = q<SVGSVGElement>('#kp-svg', root);
  const result = q('#kp-result', root);
  const cap = q('#kp-cap', root);
  const segs = qa<HTMLButtonElement>('.kp-m', root);
  const run = q<HTMLButtonElement>('#kp-run', root);
  const keyBox = q('#kp-keybox', root);
  const keyOn = q<HTMLInputElement>('#kp-keyon', root);

  const gR = S('g', {}, svg);
  const gM = S('g', {}, svg);
  const gS = S('g', {}, svg);

  /* ---- 1. reach the State ---- */
  S('rect', { x: 70, y: 120, width: 460, height: 350, rx: 30, fill: '#EEF0FB', stroke: INK, 'stroke-width': 4 }, gR);
  label(gR, 300, 170, 'Form', { size: 30, fill: MUT });
  keyChip(gR, 'GlobalKey<FormState>', { w: 290 }).g.setAttribute('transform', 'translate(300 215)');
  const field = S('rect', { x: 110, y: 260, width: 380, height: 78, rx: 16, fill: '#fff', stroke: INK, 'stroke-width': 4 }, gR);
  label(gR, 132, 310, 'Name', { size: 26, anchor: 'start', fill: '#9a9cc0', weight: 800 });
  const err = label(gR, 110, 380, 'Please enter a name', { size: 24, anchor: 'start', fill: '#E5483A' });
  gsap.set(err, { opacity: 0 });
  const btnPos = S('g', {}, gR);
  gsap.set(btnPos, { x: 770, y: 300 });
  tile(btnPos, { w: 170, h: 84, fill: '#5B7CFF', rx: 24 });
  label(btnPos, 0, 11, 'Submit', { size: 30, fill: '#fff' });
  label(gR, 770, 372, 'a button outside the Form', { size: 19, fill: MUT, weight: 800 });
  const wireR = S('path', { d: 'M685 290 C 640 200, 580 210, 534 280', fill: 'none', stroke: INK, 'stroke-width': 4, 'stroke-dasharray': '2 11', 'stroke-linecap': 'round' }, gR);
  label(gR, 640, 92, 'formKey.currentState!.validate()', { size: 21, mono: true, weight: 700 });
  const dot = S('circle', { r: 13, fill: '#FFC93C', stroke: INK, 'stroke-width': 3.5, opacity: 0 }, gR);

  /* ---- 2. move without losing State ---- */
  const rooms = [
    { x: 40, name: 'Portrait layout' },
    { x: 500, name: 'Landscape layout' },
  ];
  rooms.forEach((r) => {
    S('rect', { x: r.x, y: 130, width: 360, height: 420, rx: 30, fill: '#EEF0FB', stroke: INK, 'stroke-width': 4 }, gM);
    label(gM, r.x + 180, 178, r.name, { size: 26, fill: MUT });
  });
  S('path', { d: 'M412 340 H488', stroke: INK, 'stroke-width': 4, 'stroke-dasharray': '2 11', 'stroke-linecap': 'round', 'marker-end': 'url(#kp-ar)' }, gM);
  const defs = S('defs', {}, svg);
  const mk = S('marker', { id: 'kp-ar', viewBox: '0 0 10 10', refX: 8, refY: 5, markerWidth: 16, markerHeight: 16, markerUnits: 'userSpaceOnUse', orient: 'auto' }, defs);
  S('path', { d: 'M0 0 L10 5 L0 10z', fill: INK }, mk);
  const makePlayer = () => {
    const pos = S('g', {}, gM);
    const g = S('g', {}, pos);
    tile(g, { w: 270, h: 200, fill: '#fff', rx: 26 });
    S('circle', { cx: 0, cy: -44, r: 30, fill: '#FF9DBB', stroke: INK, 'stroke-width': 4 }, g);
    S('path', { d: 'M-8 -58 L16 -44 L-8 -30Z', fill: INK }, g);
    const time = label(g, 0, 36, '1:23', { size: 46, mono: true, weight: 700 });
    const chip = keyChip(g, 'GlobalKey', { w: 160 });
    chip.g.setAttribute('transform', 'translate(0 76)');
    return { pos, g, time, chip };
  };
  let player = makePlayer();
  gsap.set(player.pos, { x: 220, y: 360 });
  let sec = 83;
  let ticker: gsap.core.Tween | null = null;
  const fmt = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
  const tick = () => {
    sec += 1;
    player.time.textContent = fmt(sec);
    ticker = gsap.delayedCall(1, tick);
  };

  /* ---- 3. measure ---- */
  const boxPos = S('g', {}, gS);
  gsap.set(boxPos, { x: 450, y: 320 });
  tile(boxPos, { w: 380, h: 160, fill: '#D9F7EA', rx: 26 });
  label(boxPos, 0, 14, 'Card', { size: 44 });
  keyChip(gS, 'GlobalKey', { w: 160 }).g.setAttribute('transform', 'translate(450 200)');
  S('path', { d: 'M260 450 H640 M260 438 V462 M640 438 V462', fill: 'none', stroke: INK, 'stroke-width': 4, 'stroke-linecap': 'round' }, gS);
  const wTxt = label(gS, 450, 496, 'width = ?', { size: 30, mono: true, weight: 700 });
  S('path', { d: 'M690 240 V400 M678 240 H702 M678 400 H702', fill: 'none', stroke: INK, 'stroke-width': 4, 'stroke-linecap': 'round' }, gS);
  const hTxt = label(gS, 790, 330, 'height = ?', { size: 30, mono: true, weight: 700 });
  const note = label(gS, 450, 560, 'key.currentContext gives you the widget itself', { size: 22, fill: MUT, weight: 800 });
  void note;

  let mode: Mode = 0;
  let tl: gsap.core.Timeline | null = null;

  const text: Record<Mode, { run: string; cap: string; res: string }> = {
    0: { run: 'Press Submit', cap: 'The Form is far from the button. How does the button reach it?', res: '<b>Result</b><p>Press the button.</p>' },
    1: { run: 'Move the player', cap: 'Rotate the phone: the player moves to a new parent.', res: '<b>Result</b><p>Press the button.</p>' },
    2: { run: 'Read the size', cap: 'Sometimes you only need to know how big a widget is.', res: '<b>Result</b><p>Press the button.</p>' },
  };

  function resetAll() {
    tl?.kill();
    ticker?.kill();
    gsap.set(dot, { opacity: 0 });
    gsap.set(err, { opacity: 0 });
    field.setAttribute('stroke', INK);
    gsap.set(field, { x: 0 });
    wTxt.textContent = 'width = ?';
    hTxt.textContent = 'height = ?';
    player.pos.remove();
    player = makePlayer();
    gsap.set(player.pos, { x: 220, y: 360 });
    sec = 83;
    player.time.textContent = fmt(sec);
    player.chip.g.setAttribute('opacity', keyOn.checked ? '1' : '0');
    if (mode === 1) ticker = gsap.delayedCall(1, tick);
    result.className = 'result';
    result.innerHTML = text[mode].res;
  }

  function show(m: Mode) {
    mode = m;
    segs.forEach((b, i) => b.setAttribute('aria-pressed', String(i === m)));
    gsap.set([gR, gM, gS], { display: 'none' });
    gsap.set([gR, gM, gS][m], { display: 'inline' });
    keyBox.hidden = m !== 1;
    run.textContent = text[m].run;
    swap(cap, text[m].cap);
    resetAll();
  }

  function go() {
    resetAll();
    result.className = 'result';
    if (mode === 0) {
      const L = wireR.getTotalLength();
      const o = { v: 0 };
      gsap.set(dot, { opacity: 1 });
      tl = gsap.timeline();
      tl.to(o, { v: 1, duration: 1.1, ease: 'power2.inOut', onUpdate() { const p = wireR.getPointAtLength(o.v * L); dot.setAttribute('cx', String(p.x)); dot.setAttribute('cy', String(p.y)); } })
        .to(dot, { opacity: 0, duration: 0.2 })
        .call(() => {
          field.setAttribute('stroke', '#E5483A');
          gsap.to(err, { opacity: 1, duration: 0.3 });
          gsap.to(field, { x: 9, duration: 0.07, yoyo: true, repeat: 5, ease: 'sine.inOut', onComplete: () => gsap.set(field, { x: 0 }) });
          result.className = 'result ok';
          result.innerHTML = "<b>Reached</b><p>The button ran code inside the Form's State. A key made that possible.</p>";
          swap(cap, '<b>currentState</b> is the State of the widget that has the key.');
        });
    } else if (mode === 1) {
      const target = { x: 680, y: 360 };
      if (keyOn.checked) {
        tl = gsap.timeline();
        tl.to(player.pos, { y: 250, duration: 0.4, ease: 'power2.out' })
          .to(player.pos, { x: target.x, duration: 0.8, ease: 'power2.inOut' })
          .to(player.pos, { y: target.y, duration: 0.45, ease: 'bounce.out' })
          .call(() => {
            result.className = 'result ok';
            result.innerHTML = `<b>State kept</b><p>The same Element moved. The time kept going (${fmt(sec)}).</p>`;
            swap(cap, 'The <b>Element moved</b>. It was not recreated, so its State came along.');
          });
      } else {
        tl = gsap.timeline();
        const old = player;
        tl.to(old.pos, { scale: 0, duration: 0.3, ease: 'back.in(2)' })
          .call(() => {
            old.pos.remove();
            ticker?.kill();
            player = makePlayer();
            sec = 0;
            player.time.textContent = fmt(sec);
            player.chip.g.setAttribute('opacity', '0');
            gsap.set(player.pos, { x: target.x, y: target.y, scale: 0 });
            const pg = S('g', {}, gM);
            puff(pg, target.x, target.y);
            ticker = gsap.delayedCall(1, tick);
          })
          .call(() => { gsap.to(player.pos, { scale: 1, duration: 0.5, ease: 'back.out(3)' }); }, [], '+=0.1')
          .call(() => {
            result.className = 'result bad';
            result.innerHTML = '<b>State lost</b><p>No key: a new Element was made. The time restarted at 0:00.</p>';
            swap(cap, 'Without a global key the old Element is removed and a <b>new one is born</b>.');
          });
      }
    } else {
      tl = gsap.timeline();
      const o = { w: 0, h: 0 };
      tl.to(o, { w: 240, h: 100, duration: 1, ease: 'power2.out', onUpdate() { wTxt.textContent = `width = ${Math.round(o.w)}`; hTxt.textContent = `height = ${Math.round(o.h)}`; } }).call(() => {
        result.className = 'result ok';
        result.innerHTML = '<b>Measured</b><p>The key reaches the widget, so you can ask for its size (example numbers).</p>';
        swap(cap, '<b>currentContext</b> lets you ask for size and position.');
      });
    }
  }

  segs.forEach((b, i) => b.addEventListener('click', () => show(i as Mode)));
  run.addEventListener('click', go);
  keyOn.addEventListener('change', () => resetAll());

  return {
    enter() {
      show(0);
      gsap.delayedCall(1.2, () => mode === 0 && go());
    },
    leave() {
      tl?.kill();
      ticker?.kill();
    },
  };
};
export default init;
