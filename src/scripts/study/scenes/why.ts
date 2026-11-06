import { gsap } from 'gsap';
import { q, swap, pop, reduce, type SceneInit } from '../util';
import { mascot } from '../mascot';

const init: SceneInit = (root) => {
  const m = mascot(q('#why-m', root));
  const $v = q('#why-var', root);
  const $s = q('#why-screen', root);
  const $bubble = q('#why-bubble', root);
  const $z = q('#why-z', root);
  const wire = q<SVGPathElement>('#why-wire', root);
  const wireOn = q<SVGPathElement>('#why-wire-on', root);
  const pulse = q('#why-pulse', root);
  const cap = q('#why-cap', root);
  const bInc = q<HTMLButtonElement>('#why-inc', root);
  const bSet = q<HTMLButtonElement>('#why-set', root);
  const len = wire.getTotalLength();
  let count = 0;
  let awake = false;
  const calls: gsap.core.Tween[] = [];

  const stopDemo = () => calls.splice(0).forEach((c) => c.kill());

  function reset() {
    stopDemo();
    count = 0;
    awake = false;
    $v.textContent = '0';
    $s.textContent = '0';
    gsap.set($bubble, { opacity: 0 });
    gsap.set($z, { opacity: 1 });
    gsap.set(wireOn, { strokeDasharray: len, strokeDashoffset: len });
    gsap.set(pulse, { opacity: 0 });
    m.place(450, 548, 0.85);
    m.reset();
    m.sleep(true);
    swap(cap, 'Press <b>count++</b>.');
  }

  function inc() {
    count++;
    $v.textContent = String(count);
    pop($v, 0.6);
    if (awake) {
      awake = false;
      m.sleep();
      gsap.to($z, { opacity: 1, duration: 0.3 });
    }
    q('#why-bubble-t', root).textContent = 'Nobody told me!';
    gsap.fromTo($bubble, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.4, ease: 'back.out(2.5)' });
    swap(cap, 'The variable changed. <b>The screen did not.</b>');
  }

  function redraw() {
    stopDemo();
    gsap.to($bubble, { opacity: 0, duration: 0.2 });
    gsap.set(wireOn, { strokeDashoffset: len });
    gsap.set(pulse, { opacity: 1 });
    const o = { p: 0 };
    gsap.to(o, {
      p: 1,
      duration: 0.9,
      ease: 'power2.inOut',
      onUpdate() {
        const pt = wire.getPointAtLength(o.p * len);
        gsap.set(pulse, { x: pt.x, y: pt.y });
        gsap.set(wireOn, { strokeDashoffset: len * (1 - o.p) });
      },
      onComplete() {
        gsap.to(pulse, { opacity: 0, scale: 2, duration: 0.3, transformOrigin: '50% 50%' });
        awake = true;
        m.wake();
        gsap.to($z, { opacity: 0, duration: 0.2 });
        $s.textContent = String(count);
        pop($s, 0.4);
        swap(cap, 'Flutter was told. <b>The screen redraws.</b>');
      },
    });
  }

  bInc.addEventListener('click', () => { stopDemo(); inc(); });
  bSet.addEventListener('click', redraw);

  return {
    enter() {
      reset();
      calls.push(gsap.delayedCall(1.3, inc), gsap.delayedCall(3.1, redraw));
      if (!reduce) gsap.to($z, { y: -8, duration: 1.1, yoyo: true, repeat: -1, ease: 'sine.inOut' });
    },
    leave() {
      stopDemo();
      gsap.killTweensOf([$z, $bubble, pulse, wireOn]);
      m.stopIdle();
    },
  };
};
export default init;
