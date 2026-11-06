import { gsap } from 'gsap';

const MOUTH = {
  smile: 'M-16 20 Q0 34 16 20',
  flat: 'M-14 26 Q0 26 14 26',
  open: 'M-18 16 Q0 48 18 16',
  sad: 'M-16 34 Q0 16 16 34',
};

/** Controls "Elly", the Element mascot. */
export function mascot(root: Element) {
  const part = (s: string) => root.querySelector(s) as SVGElement;
  const body = part('.m-body');
  const eyes = part('.m-eyes');
  const pupils = part('.m-pupils');
  const pl = part('.m-pl');
  const pr = part('.m-pr');
  const mouth = part('.m-mouth');
  let idle = false;
  let awake = true;
  let blinkTimer = 0;

  const bob = () => {
    if (idle) gsap.to(body, { y: -6, duration: 1.3, yoyo: true, repeat: -1, ease: 'sine.inOut' });
  };
  const fresh = () => {
    gsap.killTweensOf(body);
    gsap.set(body, { x: 0, y: 0, scaleX: 1, scaleY: 1 });
  };

  const api = {
    root,
    place(x: number, y: number, s = 1) {
      gsap.set(root, { x, y, scale: s });
    },
    look(x: number, y: number, d = 0.35) {
      gsap.to([pl, pr], { x, y, duration: d, ease: 'power2.out', overwrite: 'auto' });
    },
    mood(m: keyof typeof MOUTH) {
      gsap.to(mouth, { attr: { d: MOUTH[m] }, duration: 0.25 });
    },
    sleep(instant = false) {
      awake = false;
      idle = false;
      fresh();
      gsap.to(eyes, { scaleY: 0.08, transformOrigin: '50% 50%', duration: instant ? 0.01 : 0.4 });
      gsap.set(pupils, { opacity: 0 });
      api.mood('flat');
    },
    wake() {
      awake = true;
      gsap.set(pupils, { opacity: 1 });
      gsap.to(eyes, { scaleY: 1, transformOrigin: '50% 50%', duration: 0.3, ease: 'back.out(3)' });
      api.mood('open');
      api.jump();
    },
    jump() {
      fresh();
      gsap.fromTo(body, { y: 0 }, { y: -36, duration: 0.2, yoyo: true, repeat: 1, ease: 'power2.out', onComplete: bob });
    },
    nod() {
      fresh();
      gsap.to(body, { scaleY: 0.9, scaleX: 1.05, transformOrigin: '50% 100%', duration: 0.14, yoyo: true, repeat: 1, onComplete: bob });
    },
    shake() {
      fresh();
      gsap.to(body, { x: -14, duration: 0.07, yoyo: true, repeat: 5, ease: 'sine.inOut', onComplete: () => { gsap.set(body, { x: 0 }); bob(); } });
    },
    startIdle() {
      idle = true;
      bob();
      window.clearInterval(blinkTimer);
      blinkTimer = window.setInterval(() => {
        if (awake) gsap.fromTo(eyes, { scaleY: 1 }, { scaleY: 0.1, transformOrigin: '50% 50%', duration: 0.07, yoyo: true, repeat: 1 });
      }, 2800);
    },
    stopIdle() {
      idle = false;
      window.clearInterval(blinkTimer);
      fresh();
    },
    reset() {
      awake = true;
      fresh();
      gsap.set(eyes, { scaleY: 1 });
      gsap.set(pupils, { opacity: 1 });
      gsap.set([pl, pr], { x: 0, y: 0 });
      api.mood('smile');
    },
  };
  return api;
}
