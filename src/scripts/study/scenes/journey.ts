import { gsap } from 'gsap';
import { q, qa, swap, reduce, type SceneInit } from '../util';

const info = [
  { t: 'setState() is called', x: 'Your code changes a value.', c: 'setState(() => count++);' },
  { t: 'Mark', x: 'The Element raises a flag and joins the dirty list.', c: '_dirty = true;\nowner.scheduleBuildFor(this);' },
  { t: 'Wait', x: 'Flutter waits for the next frame. Many calls, one build.', c: '// next VSync, about 16 ms\ndrawFrame();' },
  { t: 'Build', x: 'Only dirty Elements. Parents first.', c: 'buildScope();\nelement.rebuild();  // your build()' },
  { t: 'Compare', x: 'New widget vs old widget: skip, reuse or recreate.', c: 'updateChild(old, new);' },
  { t: 'Draw', x: 'Only changed values get layout and paint.', c: 'flushLayout();\nflushPaint();\ncompositeFrame();' },
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
    q('#j-code', root).textContent = info[i].c;
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
