import { gsap } from 'gsap';
import { q, qa, reduce, type SceneInit } from '../../util';

const questions = [
  "When would you choose a GlobalKey over a ValueKey, and what's a common downside of overusing GlobalKey?",
  "When would you choose a GlobalKey over a ValueKey, and what's a common downside of overusing GlobalKey?",
];

const init: SceneInit = (root) => {
  const arts = [q('#x-a1', root), q('#x-a2', root)];
  const btns = [q<HTMLButtonElement>('#x-b1', root), q<HTMLButtonElement>('#x-b2', root)];
  const qEl = q('#x-q', root);
  const note = q('#x-note', root);
  const box = q('.expert', root);
  let cur = 0;

  function show(i: number, animate = true) {
    cur = i;
    arts.forEach((a, k) => (a.hidden = k !== i));
    btns.forEach((b, k) => b.setAttribute('aria-pressed', String(k === i)));
    qEl.innerHTML = `<b>Q.</b> ${questions[i]}`;
    note.textContent = '';
    box.scrollTop = 0;
    if (animate && !reduce) {
      gsap.fromTo(arts[i].children, { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.55, stagger: 0.07, ease: 'power3.out', clearProps: 'transform,opacity' });
    }
  }

  btns.forEach((b, i) => b.addEventListener('click', () => show(i)));
  q('#x-copy', root).addEventListener('click', async () => {
    const text = `Q. ${questions[cur]}\n\n${arts[cur].innerText}`;
    try {
      await navigator.clipboard.writeText(text);
      note.textContent = 'Copied.';
    } catch {
      note.textContent = 'Could not copy. Select the text and copy it.';
    }
  });

  return {
    enter() {
      show(0);
    },
    leave() {
      gsap.killTweensOf(qa('#x-a1 > *, #x-a2 > *', root));
    },
  };
};
export default init;
