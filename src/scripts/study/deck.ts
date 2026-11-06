import { gsap } from 'gsap';
import { q, qa, reduce, still, type Scene, type SceneInit } from './util';

type Loader = () => Promise<{ default: SceneInit }>;

// Each act is its own chunk. The heavy one (3D) is only fetched when you get close to it.
const loaders: Loader[] = [
  () => import('./scenes/intro'),
  () => import('./scenes/why'),
  () => import('./scenes/trees'),
  () => import('./scenes/journey'),
  () => import('./scenes/batch'),
  () => import('./scenes/compare'),
  () => import('./scenes/reach'),
  () => import('./scenes/answers'),
];

export function initDeck() {
  if (still) document.documentElement.classList.add('still');
  if (reduce) gsap.globalTimeline.timeScale(60);
  document.addEventListener('visibilitychange', () => gsap.globalTimeline.paused(document.hidden));

  const acts = qa<HTMLElement>('.act');
  const dots = qa<HTMLButtonElement>('#dots button');
  const label = q('#label');
  const prevBtn = q<HTMLButtonElement>('#prev');
  const nextBtn = q<HTMLButtonElement>('#next');
  const total = acts.length;

  const modules: Promise<{ default: SceneInit }>[] = [];
  const scenes: (Scene | null)[] = acts.map(() => null);
  const load = (i: number) => (modules[i] ??= loaders[i]());
  const ensure = async (i: number) => {
    if (!scenes[i]) scenes[i] = (await load(i)).default(acts[i]);
    return scenes[i] as Scene;
  };

  let cur = -1;
  let busy = false;

  function paint() {
    dots.forEach((d, i) => {
      d.setAttribute('aria-current', String(i === cur));
      d.classList.toggle('done', i < cur);
    });
    label.textContent = acts[cur].dataset.label || '';
    prevBtn.disabled = cur === 0;
    nextBtn.disabled = cur === total - 1;
    history.replaceState(null, '', `#${cur + 1}`);
  }

  async function go(i: number) {
    i = Math.max(0, Math.min(total - 1, i));
    if (i === cur || busy) return;
    const prev = cur;
    const dir = i > prev ? 1 : -1;
    cur = i;
    busy = true;
    paint();

    const incoming = acts[i];
    if (prev < 0) acts.forEach((a) => a !== incoming && a.classList.remove('on')); // deep link: hide the default first act
    if (prev >= 0) {
      const out = acts[prev];
      scenes[prev]?.leave();
      // CSS does the fade-out and a real timer cleans up, so a slow device can never leave two acts stacked.
      out.style.setProperty('--dx', `${-50 * dir}px`);
      out.classList.remove('on');
      out.classList.add('leaving');
      window.setTimeout(() => out.classList.remove('leaving'), reduce ? 20 : 360);
    }

    incoming.classList.add('on');
    // The first act is already painted by the HTML, so it is not faded in again (faster first paint).
    if (prev >= 0) {
      gsap.fromTo(incoming, { x: 60 * dir, opacity: 0 }, { x: 0, opacity: 1, duration: reduce ? 0.01 : 0.55, ease: 'power3.out', delay: 0.12, clearProps: 'transform,opacity' });
    }
    if (!reduce && prev >= 0) {
      gsap.from(incoming.querySelectorAll('.panel > *'), { y: 22, opacity: 0, duration: 0.6, ease: 'power3.out', stagger: 0.06, delay: 0.3, clearProps: 'transform,opacity' });
      gsap.from(incoming.querySelector('.scene'), { scale: 0.96, duration: 0.7, ease: 'power3.out', delay: 0.2, clearProps: 'transform' });
    }

    const scene = await ensure(i);
    scene.enter();
    busy = false;

    // fetch the next act while the browser is idle
    const idle = (window as any).requestIdleCallback || ((f: () => void) => setTimeout(f, 800));
    idle(() => {
      if (i + 1 < total) void load(i + 1);
    });
  }

  nextBtn.addEventListener('click', () => go(cur + 1));
  prevBtn.addEventListener('click', () => go(cur - 1));
  dots.forEach((d, i) => d.addEventListener('click', () => go(i)));
  q('#start')?.addEventListener('click', () => go(1));
  document.addEventListener('deck:goto', ((e: CustomEvent) => go(e.detail)) as unknown as EventListener);

  document.addEventListener('keydown', (e) => {
    const t = e.target as HTMLElement;
    if (t && /^(INPUT|TEXTAREA|SELECT|SUMMARY)$/.test(t.tagName)) return;
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    if (e.key === 'ArrowRight' || e.key === 'PageDown') go(cur + 1);
    else if (e.key === 'ArrowLeft' || e.key === 'PageUp') go(cur - 1);
    else if (e.key === 'Home') go(0);
    else if (e.key === 'End') go(total - 1);
  });

  // swipe on touch screens (not on buttons, 3D, or text)
  let sx = 0;
  let sy = 0;
  let ok = false;
  const stage = q('#stage');
  stage.addEventListener('pointerdown', (e) => {
    ok = e.pointerType === 'touch' && !(e.target as HTMLElement).closest('button, input, label, details, canvas, pre');
    sx = e.clientX;
    sy = e.clientY;
  });
  stage.addEventListener('pointerup', (e) => {
    if (!ok) return;
    const dx = e.clientX - sx;
    const dy = e.clientY - sy;
    if (Math.abs(dx) > 70 && Math.abs(dx) > Math.abs(dy) * 1.5) go(dx < 0 ? cur + 1 : cur - 1);
    ok = false;
  });

  const m = location.hash.match(/^#(\d+)$/);
  void go(m ? Number(m[1]) - 1 : 0);
}
