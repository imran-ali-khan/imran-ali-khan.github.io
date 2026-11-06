import { gsap } from 'gsap';
import { q, qa, swap, pop, type SceneInit } from '../util';

const init: SceneInit = (root) => {
  const chips = qa<SVGGElement>('.chip', root);
  const lates = qa('.late', root);
  const tag = q('#b-tag', root);
  const tagRect = q('rect', tag);
  const flag = q('#b-flag', root);
  const fill = q('#b-fill', root);
  const done = q('#b-done', root);
  const cap = q('#b-cap', root);
  const $calls = q('#b-calls', root);
  const $builds = q('#b-builds', root);
  let tl: gsap.core.Timeline | null = null;
  let calls = 0;

  function reset() {
    tl?.kill();
    calls = 0;
    $calls.textContent = '0';
    $builds.textContent = '0';
    gsap.set(chips, { opacity: 0, y: -70, x: (i: number) => 150 + i * 150, rotation: 0 });
    gsap.set(tag, { opacity: 0, x: 450, y: 356, scale: 0.6, transformOrigin: '50% 50%' });
    gsap.set(tagRect, { attr: { fill: '#FFC93C' } });
    gsap.set(flag, { opacity: 0.25, y: 40 });
    gsap.set(lates, { opacity: 0, y: 0 });
    gsap.set(fill, { attr: { width: 0 } });
    gsap.set(done, { opacity: 0 });
    swap(cap, 'The first call raises a flag. The rest see: <b>already dirty</b>.');
  }

  function play() {
    reset();
    tl = gsap.timeline({ delay: 0.3 });
    const count = () => { calls++; $calls.textContent = String(calls); pop($calls, 0.6); };
    chips.forEach((chip, i) => {
      const t = i * 0.6;
      tl!.set(chip, { opacity: 1 }, t).call(count, [], t + 0.3);
      if (i === 0) {
        tl!.to(chip, { x: 450, y: 356, duration: 0.7, ease: 'bounce.out' }, t)
          .to(tag, { opacity: 1, scale: 1, duration: 0.35, ease: 'back.out(3)' }, t + 0.5)
          .to(chip, { opacity: 0, duration: 0.15 }, t + 0.55)
          .to(flag, { y: 0, opacity: 1, duration: 0.5, ease: 'back.out(3)' }, t + 0.5);
      } else {
        tl!.to(chip, { y: 205, duration: 0.45, ease: 'power2.in' }, t)
          .to(chip, { y: 110, opacity: 0, rotation: i % 2 ? 24 : -24, duration: 0.5, ease: 'power2.out' }, t + 0.45)
          .fromTo(lates[i - 1], { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.3 }, t + 0.45)
          .to(lates[i - 1], { opacity: 0, duration: 0.4 }, t + 1.3);
      }
    });
    tl.to(fill, { attr: { width: 592 }, duration: 1.8, ease: 'none' }, '+=0.2')
      .call(() => {
        $builds.textContent = '1';
        pop($builds, 0.5);
        swap(cap, 'One frame. <b>One build().</b> Not five.');
      })
      .to(tagRect, { attr: { fill: '#3DDC97' }, duration: 0.3 })
      .to(flag, { y: 40, opacity: 0.25, duration: 0.4 }, '<')
      .fromTo(done, { opacity: 0, scale: 0.6, transformOrigin: '50% 50%' }, { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(3)' }, '<');
  }

  q('#b-go', root).addEventListener('click', play);

  return {
    enter() {
      reset();
      play();
    },
    leave() {
      tl?.kill();
    },
  };
};
export default init;
