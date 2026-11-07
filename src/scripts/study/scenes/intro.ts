import { gsap } from 'gsap';
import { q, qa, reduce, type SceneInit } from '../util';

const init: SceneInit = (root) => {
  const svg = q('#iso-intro', root);
  const layers = qa<SVGGElement>('.iso-layer', svg);
  const labels = qa('.iso-label', svg);
  const hot = q('.tl-element ellipse[fill="#1A1B3A"]', svg);
  const badge = q('#logo-badge', root);

  return {
    enter() {
      gsap.fromTo(layers[0], { y: 214 }, { y: 0, duration: 1.5, ease: 'power3.out', delay: 0.3 });
      gsap.fromTo(layers[1], { y: 107 }, { y: 0, duration: 1.5, ease: 'power3.out', delay: 0.3 });
      gsap.fromTo(badge, { scale: 0, rotation: -25 }, { scale: 1, rotation: 0, duration: 0.9, delay: 0.5, ease: 'back.out(2.6)' });
      if (!reduce) gsap.to(badge, { y: -8, duration: 1.8, yoyo: true, repeat: -1, ease: 'sine.inOut', delay: 1.5 });
      gsap.fromTo(labels, { opacity: 0, x: -10 }, { opacity: 1, x: 0, duration: 0.6, stagger: 0.12, delay: 1.3, ease: 'power3.out' });
      if (!reduce && hot) gsap.to(hot, { opacity: 0.55, duration: 0.9, yoyo: true, repeat: -1, ease: 'sine.inOut' });
    },
    leave() {
      gsap.killTweensOf([...layers, ...labels, hot, badge]);
    },
  };
};
export default init;
