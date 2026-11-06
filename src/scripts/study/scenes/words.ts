import { gsap } from 'gsap';
import { q, qa, reduce, type SceneInit } from '../util';

const init: SceneInit = (root) => {
  const cards = qa('.word', root);
  const state = q('#w-state', root);
  let tick: gsap.core.Tween | null = null;

  return {
    enter() {
      gsap.fromTo(cards, { y: 30, opacity: 0, scale: 0.9 }, { y: 0, opacity: 1, scale: 1, duration: 0.7, stagger: 0.16, delay: 0.4, ease: 'back.out(1.8)', clearProps: 'transform,opacity' });
      // the counter in the State card ticks up now and then
      let n = 3;
      state.textContent = 'count = 3';
      if (!reduce) {
        tick = gsap.delayedCall(2.2, function again() {
          n = n >= 9 ? 3 : n + 1;
          state.textContent = `count = ${n}`;
          gsap.fromTo(state, { scale: 1.25 }, { scale: 1, duration: 0.45, ease: 'back.out(3)' });
          tick = gsap.delayedCall(2.2, again);
        });
      }
    },
    leave() {
      tick?.kill();
      gsap.killTweensOf(cards);
    },
  };
};
export default init;
