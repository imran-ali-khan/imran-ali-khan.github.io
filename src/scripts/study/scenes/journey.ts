import { gsap } from 'gsap';
import { q, qa, swap, reduce, flowHTML, type FlowItem, type SceneInit } from '../util';

const info: { t: string; x: string; f: FlowItem[] }[] = [
  { t: 'setState() is called', x: 'Your code changes a value.', f: [{ t: 'setState(fn)', c: 'y' }, { t: 'fn() runs now', c: 'n' }, { t: 'markNeedsBuild()', c: 'y' }] },
  { t: 'Mark', x: 'The Element raises a flag and joins the dirty list.', f: [{ t: 'markNeedsBuild()', c: 'y' }, { t: '_dirty = true', c: 'y' }, { t: 'scheduleBuildFor()', c: 'y' }, { t: 'dirty list', c: 'y' }] },
  { t: 'Wait', x: 'Flutter waits for the next frame. Many calls, one build.', f: [{ t: 'dirty list', c: 'y' }, { t: 'wait for next frame', c: 'n' }, { t: 'drawFrame()', c: 'b' }] },
  { t: 'Build', x: 'Only dirty Elements, in depth order. Parents first.', f: [{ t: 'buildScope()', c: 'b' }, { t: 'dirty Elements, parents first', c: 'y' }, { t: 'rebuild()', c: 'b' }, { t: 'your build()', c: 'b' }] },
  { t: 'Compare', x: 'New widget vs old widget: skip, reuse or recreate.', f: [{ t: 'build() returns new widgets', c: 'b' }, { t: 'updateChild()', c: 'b' }, { t: 'skip / reuse / recreate', c: 'y' }] },
  { t: 'Draw', x: 'Render objects that need it get layout and paint.', f: [{ t: 'Element.update()', c: 'y' }, { t: 'RenderObject updated', c: 'g' }, { t: 'layout', c: 'g' }, { t: 'paint', c: 'g' }, { t: 'screen', c: 'g' }] },
];

const init: SceneInit = (root) => {
  const svg = q('#journey', root);
  const sts = qa<SVGGElement>('.st', svg);
  const ys = sts.map((s) => Number(s.dataset.y));
  const token = q('#j-token', svg);
  const prog = q<SVGLineElement>('#j-prog', svg);
  const L = ys[ys.length - 1] - ys[0];
  const prev = q<HTMLButtonElement>('#j-prev', root);
  const next = q<HTMLButtonElement>('#j-next', root);
  let cur = -1;
  let timer: gsap.core.Tween | null = null;
  prog.style.strokeDasharray = String(L);

  function go(i: number, animate = true) {
    i = Math.max(0, Math.min(info.length - 1, i));
    const first = cur < 0;
    cur = i;
    const d = animate && !first ? 0.9 : 0.01;
    gsap.to(token, { x: 52, y: ys[i], duration: d, ease: 'power3.inOut', overwrite: 'auto' });
    gsap.to(prog, { strokeDashoffset: L - (ys[i] - ys[0]), duration: d, ease: 'power3.inOut', overwrite: 'auto' });
    sts.forEach((s, k) => {
      s.classList.toggle('done', k < i);
      s.classList.toggle('cur', k === i);
    });
    gsap.fromTo(sts[i].querySelector('.ring'), { opacity: 0.9, scale: 0.8, transformOrigin: '50% 50%' }, { opacity: 0, scale: 1.35, duration: 0.9, delay: d * 0.7, repeat: i === 2 ? 2 : 0, ease: 'power2.out' });
    q('#j-num', root).textContent = `${i + 1} / ${info.length}`;
    swap(q('#j-title', root), info[i].t);
    swap(q('#j-text', root), info[i].x);
    swap(q('#j-flow', root), flowHTML(info[i].f));
    prev.disabled = i === 0;
    next.disabled = i === info.length - 1;
  }

  const stop = () => timer?.kill();
  const auto = () => {
    stop();
    if (reduce) return;
    timer = gsap.delayedCall(2.8, () => {
      if (cur < info.length - 1) {
        go(cur + 1);
        auto();
      }
    });
  };

  sts.forEach((s, i) => {
    s.addEventListener('click', () => { stop(); go(i); });
    s.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); stop(); go(i); }
    });
  });
  prev.addEventListener('click', () => { stop(); go(cur - 1); });
  next.addEventListener('click', () => { stop(); go(cur + 1); });

  return {
    enter() {
      cur = -1;
      go(0);
      gsap.set(token, { x: 52, y: ys[0] });
      auto();
    },
    leave() {
      stop();
      gsap.killTweensOf([token, prog]);
    },
  };
};
export default init;
