import { gsap } from 'gsap';
import { q, swap, pop, puff, type SceneInit } from '../util';
import { mascot } from '../mascot';

type Kind = 'skip' | 'reuse' | 'recreate';

const copy: Record<Kind, { t: string; x: string; cls: string }> = {
  skip: { t: 'Skip', x: 'Same object. Nothing runs.', cls: 'ok' },
  reuse: { t: 'Reuse', x: 'Same type and key. Element and State are kept.', cls: 'ok' },
  recreate: { t: 'Recreate', x: 'Type or key changed. Old Element is removed. State is lost.', cls: 'bad' },
};

const init: SceneInit = (root) => {
  const m = mascot(q('#c-m', root));
  const old = q('#c-old', root);
  const nw = q('#c-new', root);
  const nwRect = q('#c-new-r', root);
  const oldT = q('#c-old-t', root);
  const nwT = q('#c-new-t', root);
  const bubble = q('#c-bubble', root);
  const b1 = q('#c-b1', root);
  const b2 = q('#c-b2', root);
  const ok1 = q('#c-ok1', root);
  const ok2 = q('#c-ok2', root);
  const no1 = q('#c-no1', root);
  const no2 = q('#c-no2', root);
  const state = q('#c-state', root);
  const stateT = q('#c-state-t', root);
  const phone = q('#c-phone', root);
  const screen = q('#c-screen', root);
  const star = q('#c-star', root);
  const puffG = q<SVGGElement>('#c-puff', root);
  const result = q('#c-result', root);
  const cap = q('#c-cap', root);
  const btns = ['skip', 'reuse', 'recreate'].map((k) => q<HTMLButtonElement>(`#c-${k}`, root));
  let tl: gsap.core.Timeline | null = null;
  const chart = q('#c-chart', root);
  const hit = (...ids: string[]) => ids.forEach((id) => q(`#ch-${id}`, chart).classList.add('hit'));

  function reset(label = "Text('5')") {
    tl?.kill();
    gsap.killTweensOf([m.root, state, old, nw, bubble]);
    m.reset();
    m.place(450, 425, 1);
    m.startIdle();
    gsap.set(old, { x: 200, y: 330, rotation: -3, opacity: 1, scale: 1 });
    gsap.set(nw, { x: -170, y: 175, rotation: -3, opacity: 0, scale: 1 });
    gsap.set(nwRect, { attr: { fill: '#5B7CFF' } });
    gsap.set(bubble, { x: 450, y: 250, opacity: 0 });
    gsap.set([ok1, ok2, no1, no2], { opacity: 0 });
    gsap.set(state, { x: 450, y: 506, scale: 1 });
    gsap.set(phone, { x: 770, y: 330 });
    gsap.set(star, { opacity: 0 });
    gsap.set(screen, { opacity: 1 });
    oldT.textContent = label;
    stateT.textContent = 'taps = 3';
    screen.textContent = '5';
    puffG.innerHTML = '';
    chart.querySelectorAll('.hit').forEach((e) => e.classList.remove('hit'));
  }

  function run(kind: Kind) {
    reset(kind === 'skip' ? 'const Header()' : "Text('5')");
    btns.forEach((b, i) => b.setAttribute('aria-pressed', String(['skip', 'reuse', 'recreate'][i] === kind)));
    result.className = 'result';
    result.innerHTML = '<b>Comparing...</b><p>&nbsp;</p>';
    swap(cap, 'A new widget arrives.');

    const E = 'power3.inOut';
    nwT.textContent = kind === 'skip' ? 'const Header()' : kind === 'reuse' ? "Text('6')" : 'Icon(★)';
    if (kind === 'recreate') gsap.set(nwRect, { attr: { fill: '#FF6B6B' } });
    b1.textContent = kind === 'skip' ? 'same object?' : 'same type?';
    b2.textContent = kind === 'skip' ? '' : 'same key?';

    tl = gsap.timeline({ delay: 0.2 });
    tl.set(nw, { opacity: 1 })
      .to(nw, { x: 200, duration: 0.9, ease: E })
      .call(() => m.look(-26, -8))
      .fromTo(bubble, { opacity: 0, y: 262 }, { opacity: 1, y: 250, duration: 0.4, ease: 'back.out(2.5)' }, '+=0.2')
      .call(() => hit('start', 'l0', 'q1'))
      .call(() => swap(cap, 'Flutter asks: <b>' + (kind === 'skip' ? 'same object?' : 'same type? same key?') + '</b>'));

    if (kind === 'skip') {
      tl.to(ok1, { opacity: 1, duration: 0.3 }, '+=0.4')
        .call(() => hit('l1y', 'skip'))
        .call(() => m.nod())
        .to(nw, { y: 330, opacity: 0, duration: 0.7, ease: E }, '+=0.2')
        .to(bubble, { opacity: 0, duration: 0.3 }, '<');
    } else if (kind === 'reuse') {
      tl.to(ok1, { opacity: 1, duration: 0.3 }, '+=0.4')
        .call(() => hit('l1n', 'q2'))
        .to(ok2, { opacity: 1, duration: 0.3 }, '+=0.35')
        .call(() => hit('l2y', 'reuse'))
        .call(() => m.nod())
        .to(state, { scale: 1.12, duration: 0.2, yoyo: true, repeat: 1, transformOrigin: '50% 50%' }, '<')
        .to(old, { x: 330, y: 20, rotation: 22, opacity: 0, duration: 0.8, ease: 'power3.in' }, '+=0.15')
        .to(nw, { y: 330, duration: 0.8, ease: E }, '<0.1')
        .to(bubble, { opacity: 0, duration: 0.3 }, '<')
        .call(() => { screen.textContent = '6'; pop(screen, 0.5); }, [], '-=0.3');
    } else {
      tl.to(no1, { opacity: 1, duration: 0.3 }, '+=0.4')
        .call(() => hit('l1n', 'q2', 'l2n', 'recreate'))
        .call(() => m.shake())
        .to(bubble, { opacity: 0, duration: 0.3 }, '+=0.5')
        .call(() => swap(cap, 'The old Element <b>leaves</b>. State is lost.'))
        .to(m.root, { scale: 0, transformOrigin: '50% 50%', duration: 0.35, ease: 'back.in(2)' })
        .call(() => puff(puffG, 450, 425))
        .to(state, { scale: 0, duration: 0.25, transformOrigin: '50% 50%' }, '<')
        .to(old, { opacity: 0, duration: 0.2 }, '<')
        .call(() => { stateT.textContent = 'taps = 0'; swap(cap, 'A <b>new Element</b> is born. State starts at 0.'); })
        .to(m.root, { scale: 1, duration: 0.55, ease: 'back.out(3)' })
        .to(state, { scale: 1, duration: 0.4, ease: 'back.out(3)' }, '<')
        .to(nw, { y: 330, duration: 0.8, ease: E }, '<')
        .call(() => { gsap.set(screen, { opacity: 0 }); gsap.set(star, { opacity: 1 }); pop(star, 0.3); });
    }
    tl.call(() => {
      const c = copy[kind];
      result.className = `result ${c.cls}`;
      result.innerHTML = `<b>${c.t}</b><p>${c.x}</p>`;
      swap(cap, 'Follow the blue path in the chart.');
      m.look(0, 0);
    });
  }

  btns.forEach((b, i) => b.addEventListener('click', () => run((['skip', 'reuse', 'recreate'] as Kind[])[i])));

  return {
    enter() {
      reset();
      swap(cap, 'Pick a new widget:');
      result.className = 'result';
      result.innerHTML = '<b>Result</b><p>Pick one.</p>';
      gsap.delayedCall(1.2, () => run('reuse'));
    },
    leave() {
      tl?.kill();
      gsap.killTweensOf(m.root);
      m.stopIdle();
    },
  };
};
export default init;
