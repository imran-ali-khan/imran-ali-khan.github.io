import { gsap } from 'gsap';
import { q, qa, reduce, type SceneInit } from '../../util';

const KEYS = [
  { n: 'No key', scope: 'default', use: 'Children keep a fixed order, or have no State of their own.', not: 'A list that reorders, inserts or removes items that have State.', code: "Text('Hello')", eg: 'A settings screen: a Text, a Switch and a Button in a fixed order.', cost: 'none', dots: 0 },
  { n: 'ValueKey', scope: 'siblings', use: 'List items that have a stable, unique id (id, email, slug).', not: 'The value changes between builds, or repeats among siblings.', code: 'ValueKey(todo.id)', eg: 'A todo list where items can be reordered or deleted.', cost: 'low', dots: 1 },
  { n: 'ObjectKey', scope: 'siblings', use: 'No id, but each item is its own object.', not: 'You create new, equal objects on every build: the identity changes.', code: 'ObjectKey(product)', eg: 'A list of Product objects that have no id field.', cost: 'low', dots: 1 },
  { n: 'UniqueKey', scope: 'siblings', use: 'You want a brand-new State on purpose (reset a form or an animation).', not: 'It sits inside build() on something that should keep its State.', code: 'UniqueKey()', eg: 'A Clear form button that gives the form a fresh State.', cost: 'low', dots: 1 },
  { n: 'PageStorageKey', scope: 'siblings', use: 'Keep scroll position or expansion when a page or tab is rebuilt.', not: 'As a general item key. Its value must be stable.', code: "PageStorageKey('inbox')", eg: 'Two tabs with long lists. Each one remembers its scroll position.', cost: 'low', dots: 1 },
  { n: 'GlobalKey', scope: 'whole app', use: "Reach a widget's State or size from outside, or move it to another parent and keep its State.", not: 'Just keeping list items straight (ValueKey is cheaper), or passing data around.', code: 'final _formKey = GlobalKey<FormState>();', eg: 'A Submit button outside the Form calls _formKey.currentState!.validate().', cost: 'higher: unique app-wide, relatively expensive to move', dots: 3 },
];

const init: SceneInit = (root) => {
  const chips = qa<HTMLButtonElement>('.kc-chip', root);
  const card = q('#kc-card', root);
  let cur = -1;

  function show(i: number, animate = true) {
    cur = i;
    chips.forEach((c, k) => c.setAttribute('aria-pressed', String(k === i)));
    const k = KEYS[i];
    card.innerHTML = `
      <div class="kc-head"><h3>${k.n}</h3><span class="kc-scope ${k.scope === 'whole app' ? 'g' : ''}">${k.scope === 'default' ? 'matched by type + position' : 'unique among ' + k.scope}</span></div>
      <div class="kc-cols">
        <div class="kc-use"><b>Use it when</b><p>${k.use}</p></div>
        <div class="kc-not"><b>Not when</b><p>${k.not}</p></div>
      </div>
      <div class="kc-row"><span>Example</span><p>${k.eg}</p></div>
      <div class="kc-row"><span>Cost</span><p><i class="kc-dots" aria-hidden="true">${'<u class="on"></u>'.repeat(k.dots)}${'<u></u>'.repeat(3 - k.dots)}</i> ${k.cost}</p></div>
      <code class="kc-code">${k.code}</code>`;
    if (animate && !reduce) gsap.fromTo(card.children, { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, stagger: 0.08, ease: 'power3.out', clearProps: 'transform,opacity' });
  }

  chips.forEach((c, i) => c.addEventListener('click', () => show(i)));
  return {
    enter() {
      show(cur < 0 ? 1 : cur, true);
    },
    leave() {
      gsap.killTweensOf(Array.from(card.children));
    },
  };
};
export default init;
