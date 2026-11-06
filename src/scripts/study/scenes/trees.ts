import { gsap } from 'gsap';
import { q, qa, swap, reduce, type SceneInit } from '../util';

const init: SceneInit = (root) => {
  const svg = q('#iso-trees', root);
  const layers = qa<SVGGElement>('.iso-layer', svg);
  const labels = qa('.iso-label', svg);
  const bolt = q('.bolt', svg);
  const wt = qa('.tl-widget', svg);
  const et = qa('.tl-element', svg);
  const cap = q('#trees-cap', root);
  let tl: gsap.core.Timeline | null = null;
  let demo: gsap.core.Tween | null = null;

  function play() {
    demo?.kill();
    tl?.kill();
    gsap.set([...wt, ...et], { clearProps: 'transform' });
    swap(cap, 'Widgets are <b>replaced</b>...');
    tl = gsap
      .timeline()
      .fromTo(bolt, { x: 185, y: 10, opacity: 0 }, { y: 44, opacity: 1, duration: 0.35, ease: 'power2.out' })
      .to(bolt, { y: 112, duration: 0.3, ease: 'power3.in' })
      .to(bolt, { opacity: 0, duration: 0.15 })
      .to(wt, { scaleY: 0, transformOrigin: '50% 50%', duration: 0.22, stagger: 0.07, ease: 'power2.in' }, '-=0.05')
      .to(wt, { scaleY: 1, transformOrigin: '50% 50%', duration: 0.55, stagger: 0.07, ease: 'back.out(2.4)' })
      .to(et, { scale: 1.14, transformOrigin: '50% 50%', duration: 0.18, yoyo: true, repeat: 1, stagger: 0.04, ease: 'power1.inOut' }, '-=0.3')
      .call(() => swap(cap, '...but the <b>Elements stay</b>. So does the State.'));
  }

  q('#trees-go', root).addEventListener('click', play);

  return {
    enter() {
      swap(cap, 'Press the button.');
      gsap.set(bolt, { x: 185, y: 10, opacity: 0 });
      gsap.fromTo(layers[0], { y: 214 }, { y: 0, duration: 1.3, ease: 'power3.out', delay: 0.25 });
      gsap.fromTo(layers[1], { y: 107 }, { y: 0, duration: 1.3, ease: 'power3.out', delay: 0.25 });
      gsap.fromTo(labels, { opacity: 0, x: -10 }, { opacity: 1, x: 0, duration: 0.6, stagger: 0.12, delay: 1.2, ease: 'power3.out' });
      if (!reduce) demo = gsap.delayedCall(2.6, play);
    },
    leave() {
      demo?.kill();
      tl?.kill();
      gsap.killTweensOf([...layers, ...labels, bolt]);
    },
  };
};
export default init;
