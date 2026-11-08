import { gsap } from 'gsap';
import { q, reduce, type SceneInit } from '../../util';
import { S, tile, label, keyIcon, INK } from './kit';

const init: SceneInit = (root) => {
  const svg = q<SVGSVGElement>('#ki-svg', root);
  const tables: SVGGElement[] = [];
  const tags: SVGGElement[] = [];
  const fills = ['#FF9DBB', '#A596FF', '#7FD3FF'];
  [165, 450, 735].forEach((x, i) => {
    const pos = S('g', { transform: `translate(${x} 430)` }, svg);
    const g = S('g', {}, pos);
    S('ellipse', { cx: 0, cy: 118, rx: 118, ry: 14, fill: INK, opacity: 0.14 }, g);
    S('rect', { x: -96, y: 78, width: 18, height: 44, fill: '#3E5AD6', stroke: INK, 'stroke-width': 3 }, g);
    S('rect', { x: 78, y: 78, width: 18, height: 44, fill: '#3E5AD6', stroke: INK, 'stroke-width': 3 }, g);
    S('rect', { x: -120, y: 40, width: 240, height: 44, rx: 18, fill: '#5B7CFF', stroke: INK, 'stroke-width': 4 }, g);
    // a guest on the table
    S('circle', { cx: 0, cy: -34, r: 34, fill: fills[i], stroke: INK, 'stroke-width': 4 }, g);
    S('circle', { cx: -11, cy: -40, r: 4.5, fill: INK }, g);
    S('circle', { cx: 11, cy: -40, r: 4.5, fill: INK }, g);
    S('path', { d: 'M-11 -22 Q0 -12 11 -22', fill: 'none', stroke: INK, 'stroke-width': 4, 'stroke-linecap': 'round' }, g);
    S('path', { d: 'M-46 40 C-46 8 -24 2 0 2 C24 2 46 8 46 40Z', fill: fills[i], stroke: INK, 'stroke-width': 4, 'stroke-linejoin': 'round' }, g);
    tables.push(g);
    const tpos = S('g', { transform: `translate(${x} 250)` }, svg);
    const t = S('g', {}, tpos);
    const tl = tile(t, { w: 120, h: 62, fill: '#FFF3CF', rx: 18 });
    void tl;
    const ic = keyIcon(t, 0.7);
    ic.setAttribute('transform', 'translate(-30 0) scale(0.7)');
    label(t, 24, 10, String(i + 1), { size: 30 });
    S('path', { d: 'M0 31 V84', stroke: INK, 'stroke-width': 3, 'stroke-dasharray': '2 8', 'stroke-linecap': 'round' }, t);
    tags.push(t);
  });
  label(svg, 450, 96, 'Which table is whose?', { size: 40, fill: INK });
  label(svg, 450, 140, 'A Key is a name tag for a widget.', { size: 26, fill: '#53557E', weight: 800 });

  return {
    enter() {
      gsap.fromTo(tables, { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, stagger: 0.14, ease: 'back.out(1.6)', delay: 0.25 });
      gsap.fromTo(tags, { y: -90, opacity: 0, rotation: -12, transformOrigin: '50% 0%' }, { y: 0, opacity: 1, rotation: 0, duration: 0.9, stagger: 0.18, ease: 'bounce.out', delay: 0.9 });
      if (!reduce) tags.forEach((t, i) => gsap.to(t, { y: -7, duration: 1.4 + i * 0.15, yoyo: true, repeat: -1, ease: 'sine.inOut', delay: 2.2 + i * 0.2 }));
    },
    leave() {
      gsap.killTweensOf([...tables, ...tags]);
    },
  };
};
export default init;
