import { gsap } from 'gsap';
import { q, qa, reduce, type SceneInit } from '../util';

const init: SceneInit = (root) => {
  const cards = qa('.acard', root);
  const scene = q('.scene', root);
  q('#again', root).addEventListener('click', () => document.dispatchEvent(new CustomEvent('deck:goto', { detail: 0 })));
  q('#to-expert', root).addEventListener('click', () => document.dispatchEvent(new CustomEvent('deck:goto', { detail: 9 })));

  function burst() {
    if (reduce) return;
    const colors = ['#FFC93C', '#5B7CFF', '#3DDC97', '#FF6B6B'];
    const w = scene.clientWidth;
    for (let i = 0; i < 26; i++) {
      const c = document.createElement('i');
      c.className = 'confetti';
      c.style.background = colors[i % 4];
      scene.appendChild(c);
      gsap.fromTo(
        c,
        { x: w / 2, y: 30, rotation: 0, opacity: 1 },
        { x: w / 2 + (Math.random() - 0.5) * w * 0.9, y: 140 + Math.random() * 320, rotation: Math.random() * 540, opacity: 0, duration: 1.4 + Math.random() * 0.8, ease: 'power2.out', onComplete: () => c.remove() }
      );
    }
  }

  return {
    enter() {
      gsap.fromTo(cards, { y: 36, opacity: 0, scale: 0.96 }, { y: 0, opacity: 1, scale: 1, duration: 0.7, stagger: 0.18, delay: 0.3, ease: 'back.out(1.6)' });
      gsap.delayedCall(0.5, burst);
    },
    leave() {
      gsap.killTweensOf(cards);
    },
  };
};
export default init;
