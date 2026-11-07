import { gsap } from 'gsap';
import {
  Color,
  CylinderGeometry,
  DirectionalLight,
  ExtrudeGeometry,
  HemisphereLight,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  PerspectiveCamera,
  Scene,
  Shape,
  SphereGeometry,
  TorusGeometry,
  Vector3,
  WebGLRenderer,
  type BufferGeometry,
} from 'three';
import { q, qa, swap, pop, reduce, type SceneInit } from '../util';

type Layer = 'widget' | 'element' | 'render';
interface Def {
  id: string;
  name: string;
  par: string | null;
  x: number;
  z: number;
  canConst?: boolean;
}

// The same small app, drawn three times: once per tree.
const NODES: Def[] = [
  { id: 'app', name: 'MyApp', par: null, x: 0, z: -3.2 },
  { id: 'home', name: 'HomePage', par: 'app', x: 0, z: -1.5 },
  { id: 'head', name: 'Header', par: 'home', x: -3.3, z: 0.4, canConst: true },
  { id: 'cbox', name: 'CounterBox', par: 'home', x: 0, z: 0.4 },
  { id: 'foot', name: 'Footer', par: 'home', x: 3.3, z: 0.4, canConst: true },
  { id: 'txt', name: 'Text', par: 'cbox', x: 1.9, z: 2.7 },
];
const byId = (id: string) => NODES.find((n) => n.id === id)!;
const kids = (id: string) => NODES.filter((n) => n.par === id).map((n) => n.id);

const L: Record<Layer, { y: number; name: string; base: string; hot: string; plate: string }> = {
  widget: { y: 5.2, name: 'Widget tree', base: '#B4C2FF', hot: '#5B7CFF', plate: '#E3E8FF' },
  element: { y: 0, name: 'Element tree', base: '#FFE79A', hot: '#FFC93C', plate: '#FFF3CC' },
  render: { y: -5.2, name: 'RenderObject tree', base: '#B0F2D3', hot: '#3DDC97', plate: '#D8F8EA' },
};
const LAYERS = Object.keys(L) as Layer[];
const CORAL = '#FF6B6B';

function slab(w: number, d: number, h: number, r: number): BufferGeometry {
  const s = new Shape();
  const x = -w / 2;
  const y = -d / 2;
  s.moveTo(x + r, y);
  s.lineTo(x + w - r, y);
  s.quadraticCurveTo(x + w, y, x + w, y + r);
  s.lineTo(x + w, y + d - r);
  s.quadraticCurveTo(x + w, y + d, x + w - r, y + d);
  s.lineTo(x + r, y + d);
  s.quadraticCurveTo(x, y + d, x, y + d - r);
  s.lineTo(x, y + r);
  s.quadraticCurveTo(x, y, x + r, y);
  const g = new ExtrudeGeometry(s, { depth: h, bevelEnabled: true, bevelSize: 0.05, bevelThickness: 0.05, bevelSegments: 3, curveSegments: 6 });
  g.rotateX(-Math.PI / 2); // lie flat, extrude upward
  g.translate(0, -h / 2, 0);
  return g;
}

const init: SceneInit = (root) => {
  const host = q('#reach', root);
  const bA = q<HTMLButtonElement>('#r-a', root);
  const bB = q<HTMLButtonElement>('#r-b', root);
  const cConst = q<HTMLInputElement>('#r-const', root);
  const cType = q<HTMLInputElement>('#r-type', root);
  const verdict = q('#r-verdict', root);
  const stepEls = qa('#r-steps li', root);
  const s3 = q('#r-s3', root);
  const n1 = q('#r-n1', root);
  const n2 = q('#r-n2', root);
  const n3 = q('#r-n3', root);

  let owner = 'home';
  let tl: gsap.core.Timeline | null = null;
  let gl: ReturnType<typeof buildGL> | null = null;
  let glFailed = false;

  function setStep(n: number) {
    stepEls.forEach((li, i) => {
      li.classList.toggle('on', i + 1 === n);
      li.classList.toggle('done', i + 1 < n);
    });
  }

  function buildGL() {
    const canvas = document.createElement('canvas');
    host.appendChild(canvas);
    const renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setClearColor(0x000000, 0);
    const scene = new Scene();
    const cam = new PerspectiveCamera(30, 1, 0.1, 120);
    scene.add(new HemisphereLight(0xffffff, 0xaab2e6, 2.1));
    const sun = new DirectionalLight(0xffffff, 1.9);
    sun.position.set(6, 14, 9);
    scene.add(sun);

    const blockGeo = slab(1.9, 1.0, 0.5, 0.26);
    const plateGeo = slab(10.8, 8.6, 0.2, 0.7);
    const disposables: { dispose(): void }[] = [blockGeo, plateGeo];

    // ----- tags that follow 3D positions -----
    const tags: { el: HTMLElement; at: () => Vector3; dy: number }[] = [];
    const wide = () => host.clientWidth > 700;
    function addTag(text: string, cls: string, at: () => Vector3, dy: number) {
      const el = document.createElement('div');
      el.className = `tag3d ${cls}`;
      el.textContent = text;
      host.appendChild(el);
      const t = { el, at, dy };
      tags.push(t);
      return t;
    }
    function dropTag(t: { el: HTMLElement }) {
      t.el.remove();
      const i = tags.findIndex((x) => x.el === t.el);
      if (i >= 0) tags.splice(i, 1);
    }

    // ----- plates, blocks, edges -----
    type NodeObj = { mesh: Mesh; mat: MeshStandardMaterial; name?: { el: HTMLElement } };
    const blocks: Record<Layer, Map<string, NodeObj>> = { widget: new Map(), element: new Map(), render: new Map() };
    const badges: { el: HTMLElement }[] = [];
    const pos = (layer: Layer, id: string) => new Vector3(byId(id).x, L[layer].y, byId(id).z);

    function makeBlock(layer: Layer, id: string, color = L[layer].base): NodeObj {
      const mat = new MeshStandardMaterial({ color: new Color(color), roughness: 0.55, metalness: 0, transparent: true });
      const mesh = new Mesh(blockGeo, mat);
      mesh.position.copy(pos(layer, id));
      scene.add(mesh);
      return { mesh, mat };
    }

    for (const layer of LAYERS) {
      const plateMat = new MeshStandardMaterial({ color: new Color(L[layer].plate), roughness: 0.8, transparent: true, opacity: 0.9 });
      disposables.push(plateMat);
      const plate = new Mesh(plateGeo, plateMat);
      plate.position.set(0, L[layer].y - 0.32, -0.4);
      scene.add(plate);
      addTag(L[layer].name, `layername ${layer}`, () => new Vector3(-4.5, L[layer].y - 0.5, 4.3), 0);
    }
    const edgeMat = new MeshStandardMaterial({ color: 0xffffff, roughness: 0.6 });
    const linkMat = new MeshBasicMaterial({ color: 0x1a1b3a, transparent: true, opacity: 0.18 });
    disposables.push(edgeMat, linkMat);
    function bar(a: Vector3, b: Vector3, r: number, mat: MeshStandardMaterial | MeshBasicMaterial) {
      const g = new CylinderGeometry(r, r, a.distanceTo(b), 8);
      disposables.push(g);
      const m = new Mesh(g, mat);
      m.position.copy(a).add(b).multiplyScalar(0.5);
      m.lookAt(b);
      m.rotateX(Math.PI / 2);
      scene.add(m);
    }
    for (const layer of LAYERS) {
      for (const n of NODES) {
        if (n.par) bar(pos(layer, n.par), pos(layer, n.id), 0.07, edgeMat);
      }
    }
    // vertical links: the same node in the three trees
    for (const n of NODES) bar(pos('widget', n.id), pos('render', n.id), 0.035, linkMat);

    function addNameTags() {
      NODES.forEach((n) => {
        LAYERS.forEach((layer) => {
          if (layer !== 'widget' && !wide()) return;
          const o = blocks[layer].get(n.id)!;
          const t = addTag(n.name, 'nm', () => o.mesh.position, -0.62);
          o.name = t;
        });
      });
    }

    function buildAll() {
      LAYERS.forEach((layer) => NODES.forEach((n) => blocks[layer].set(n.id, makeBlock(layer, n.id))));
      addNameTags();
    }
    function clearAll() {
      badges.splice(0).forEach((b) => b.el.remove());
      LAYERS.forEach((layer) =>
        blocks[layer].forEach((o) => {
          scene.remove(o.mesh);
          o.mat.dispose();
          if (o.name) dropTag(o.name);
        })
      );
      LAYERS.forEach((l) => blocks[l].clear());
    }
    buildAll();

    function badge(layer: Layer, id: string, text: string, kind: 'new' | 'ok' | 'dirty' | 'bad' | 'dim') {
      const o = blocks[layer].get(id)!;
      const t = addTag(text, `bd ${kind}`, () => o.mesh.position, 0.95);
      badges.push(t);
      gsap.fromTo(t.el, { scale: 0.3, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.45, ease: 'back.out(3)' });
    }

    // ----- camera -----
    const view = { focus: 0, drag: 0 };
    let down = false;
    let lx = 0;
    canvas.addEventListener('pointerdown', (e) => { down = true; lx = e.clientX; canvas.setPointerCapture(e.pointerId); gsap.killTweensOf(view, 'drag'); });
    canvas.addEventListener('pointermove', (e) => {
      if (!down) return;
      view.drag = Math.max(-1, Math.min(1, view.drag - (e.clientX - lx) * 0.006));
      lx = e.clientX;
    });
    const release = () => { down = false; gsap.to(view, { drag: 0, duration: 1.4, delay: 1.5, ease: 'power2.inOut' }); };
    canvas.addEventListener('pointerup', release);
    canvas.addEventListener('pointercancel', release);

    let w = 1;
    let h = 1;
    let dist = 24;
    const fit = () => {
      w = host.clientWidth || 1;
      h = host.clientHeight || 1;
      renderer.setPixelRatio(Math.min(devicePixelRatio, 1.75));
      renderer.setSize(w, h, false);
      cam.aspect = w / h;
      cam.updateProjectionMatrix();
      const t = Math.tan((cam.fov * Math.PI) / 360);
      dist = Math.max(14.2 / 2 / t, 13 / 2 / (t * cam.aspect)) * 1.06;
    };
    const ro = new ResizeObserver(() => { fit(); rebuildNames(); });
    ro.observe(host);
    fit();
    function rebuildNames() {
      // show node names on every tree only when there is room
      const want = wide();
      const has = !!blocks.element.get('app')?.name;
      if (want === has) return;
      LAYERS.forEach((layer) => {
        if (layer === 'widget') return;
        blocks[layer].forEach((o, id) => {
          if (want && !o.name) o.name = addTag(byId(id).name, 'nm', () => o.mesh.position, -0.62);
          if (!want && o.name) { dropTag(o.name); o.name = undefined; }
        });
      });
    }

    const v = new Vector3();
    let raf = 0;
    const frame = (t: number) => {
      raf = requestAnimationFrame(frame);
      const ang = 0.5 + (reduce ? 0 : Math.sin(t * 0.00035) * 0.22) + view.drag;
      cam.position.set(Math.sin(ang) * dist * 0.55, view.focus + dist * 0.5, Math.cos(ang) * dist);
      cam.lookAt(0, view.focus, 0);
      for (const tag of tags) {
        v.copy(tag.at());
        v.y += tag.dy;
        v.project(cam);
        tag.el.style.left = `${(v.x * 0.5 + 0.5) * w}px`;
        tag.el.style.top = `${(-v.y * 0.5 + 0.5) * h}px`;
        tag.el.style.visibility = v.z < 1 ? 'visible' : 'hidden';
      }
      renderer.render(scene, cam);
    };

    // ----- effects -----
    function ring(at: Vector3, color = 0xffc93c, size = 2.4) {
      const m = new MeshBasicMaterial({ color, transparent: true, opacity: 0.9 });
      const r = new Mesh(new TorusGeometry(1, 0.06, 10, 48), m);
      r.position.copy(at);
      r.rotation.x = Math.PI / 2;
      scene.add(r);
      gsap.to(r.scale, { x: size, y: size, z: size, duration: 0.9, ease: 'power2.out' });
      gsap.to(m, { opacity: 0, duration: 0.9, onComplete: () => { scene.remove(r); r.geometry.dispose(); m.dispose(); } });
    }
    function paint(o: NodeObj, color: string, d = 0.3) {
      const c = new Color(color);
      gsap.to(o.mat.color, { r: c.r, g: c.g, b: c.b, duration: d });
    }
    function bounce(o: NodeObj, s = 1.18) {
      gsap.fromTo(o.mesh.scale, { x: 1, y: 1, z: 1 }, { x: s, y: s, z: s, duration: 0.2, yoyo: true, repeat: 1, ease: 'power2.out' });
    }
    function beam(a: Vector3, b: Vector3, color: number) {
      const g = new CylinderGeometry(0.1, 0.1, a.distanceTo(b), 10);
      const m = new MeshBasicMaterial({ color, transparent: true, opacity: 0.9 });
      const c = new Mesh(g, m);
      c.position.copy(a).add(b).multiplyScalar(0.5);
      c.lookAt(b);
      c.rotateX(Math.PI / 2);
      scene.add(c);
      gsap.fromTo(c.scale, { x: 0.2, z: 0.2 }, { x: 1, z: 1, duration: 0.25 });
      gsap.to(m, { opacity: 0, duration: 0.7, delay: 0.2, onComplete: () => { scene.remove(c); g.dispose(); m.dispose(); } });
    }

    /** A brand new widget drops in; the old one lifts away. */
    function newWidget(id: string, color = L.widget.hot, label?: string) {
      const old = blocks.widget.get(id)!;
      const fresh = makeBlock('widget', id, color);
      fresh.mesh.position.y += 3.4;
      fresh.mesh.scale.set(0.4, 0.4, 0.4);
      gsap.to(fresh.mesh.position, { y: L.widget.y, duration: 0.85, ease: 'bounce.out' });
      gsap.to(fresh.mesh.scale, { x: 1, y: 1, z: 1, duration: 0.5, ease: 'back.out(2)' });
      gsap.to(old.mesh.position, { y: L.widget.y + 2.4, duration: 0.55, ease: 'power2.in' });
      gsap.to(old.mat, { opacity: 0, duration: 0.5, onComplete: () => { scene.remove(old.mesh); old.mat.dispose(); } });
      if (old.name) {
        fresh.name = old.name;
        if (label) old.name.el.textContent = label;
      }
      const t = tags.find((x) => x.el === old.name?.el);
      if (t) t.at = () => fresh.mesh.position;
      blocks.widget.set(id, fresh);
    }

    function swapBlock(layer: Layer, id: string, color: string) {
      const old = blocks[layer].get(id)!;
      const fresh = makeBlock(layer, id, color);
      fresh.mesh.scale.set(0.01, 0.01, 0.01);
      gsap.to(old.mesh.scale, { x: 0.01, y: 0.01, z: 0.01, duration: 0.35, ease: 'back.in(2)', onComplete: () => { scene.remove(old.mesh); old.mat.dispose(); } });
      gsap.to(fresh.mesh.scale, { x: 1, y: 1, z: 1, duration: 0.6, delay: 0.35, ease: 'back.out(3)' });
      fresh.name = old.name;
      const t = tags.find((x) => x.el === old.name?.el);
      if (t) t.at = () => fresh.mesh.position;
      blocks[layer].set(id, fresh);
    }

    function coin(to: Vector3, done: () => void) {
      const m = new MeshStandardMaterial({ color: 0xffc93c, roughness: 0.4 });
      const c = new Mesh(new SphereGeometry(0.42, 20, 16), m);
      c.position.set(to.x, 10.6, to.z);
      scene.add(c);
      const t = addTag('setState()', 'bd dirty', () => c.position, 0.9);
      gsap.to(c.position, {
        y: to.y + 0.6,
        duration: 1.05,
        ease: 'power2.in',
        onComplete: () => {
          done();
          gsap.to(c.scale, { x: 0, y: 0, z: 0, duration: 0.25, onComplete: () => { scene.remove(c); c.geometry.dispose(); m.dispose(); dropTag(t); } });
        },
      });
    }

    return {
      blocks, badges, view, newWidget, swapBlock, paint, bounce, ring, beam, coin, badge, pos, clearAll, buildAll,
      start() { cancelAnimationFrame(raf); raf = requestAnimationFrame(frame); },
      stop() { cancelAnimationFrame(raf); },
      dispose() { ro.disconnect(); disposables.forEach((d) => d.dispose()); renderer.dispose(); },
    };
  }

  // ----- what happens, as data -----
  function simulate(constOn: boolean, typeOn: boolean) {
    const rebuilt: string[] = [];
    const skipped: string[] = [];
    const visit = (id: string) => {
      for (const k of kids(id)) {
        if (constOn && byId(k).canConst) { skipped.push(k); continue; }
        rebuilt.push(k);
        visit(k);
      }
    };
    visit(owner);
    const touched = new Set([owner, ...rebuilt]);
    const recreated = typeOn && rebuilt.includes('txt') ? 'txt' : null;
    const repaint = rebuilt.includes('txt') ? ['txt'] : [];
    const untouched = NODES.map((n) => n.id).filter((id) => !touched.has(id) && !skipped.includes(id));
    return { rebuilt, skipped, recreated, repaint, untouched, touched };
  }

  function resetScene() {
    tl?.kill();
    if (!gl) return;
    gl.clearAll();
    gl.buildAll();
    gsap.killTweensOf(gl.view, 'focus');
    gsap.to(gl.view, { focus: 0, duration: 0.8, ease: 'power2.inOut' });
    setStep(0);
    n1.textContent = n2.textContent = n3.textContent = '0';
    verdict.className = 'result';
    verdict.innerHTML = '<b>Result</b><p>Working...</p>';
    s3.textContent = 'Each Element is checked: reused, not recreated.';
  }

  function run() {
    resetScene();
    const g = gl;
    const sim = simulate(cConst.checked, cType.checked);
    const typeOn = cType.checked;
    const ownerEl = g ? g.pos('element', owner) : null;
    tl = gsap.timeline({ delay: 0.4 });

    // 1 · the Element is marked dirty
    tl.call(() => setStep(1));
    if (g && ownerEl) {
      tl.call(() => g.coin(ownerEl, () => {
        const o = g.blocks.element.get(owner)!;
        g.paint(o, '#FF9F1C');
        g.bounce(o, 1.25);
        g.ring(ownerEl, 0xff9f1c, 3);
        g.badge('element', owner, 'dirty', 'dirty');
        g.badge('widget', owner, 'same', 'dim');
      }));
    }
    tl.to({}, { duration: 1.9 });

    // 2 · build() creates NEW widgets
    tl.call(() => {
      setStep(2);
      if (g) gsap.to(g.view, { focus: 2.6, duration: 1.1, ease: 'power2.inOut' });
    });
    tl.to({}, { duration: 0.7 });
    sim.rebuilt.forEach((id) => {
      tl!.call(() => {
        if (!g) return;
        const isType = typeOn && id === 'txt';
        g.newWidget(id, isType ? CORAL : L.widget.hot, isType ? 'Icon' : undefined);
        g.badge('widget', id, isType ? 'NEW type' : 'NEW', isType ? 'bad' : 'new');
      });
      tl!.to({}, { duration: 0.55 });
    });
    sim.skipped.forEach((id) => tl!.call(() => g?.badge('widget', id, 'const', 'dim')));
    tl.to({}, { duration: 1 });

    // 3 · Elements are reused (or, if the type changed, recreated)
    tl.call(() => {
      setStep(3);
      if (typeOn && sim.recreated) s3.textContent = 'Type changed: that Element is recreated. State is lost.';
      if (g) gsap.to(g.view, { focus: 0, duration: 1.1, ease: 'power2.inOut' });
    });
    tl.to({}, { duration: 0.7 });
    sim.rebuilt.forEach((id) => {
      tl!.call(() => {
        if (!g) return;
        const wPos = g.blocks.widget.get(id)!.mesh.position;
        const ePos = g.pos('element', id);
        g.beam(new Vector3(wPos.x, L.widget.y, wPos.z), ePos, id === sim.recreated ? 0xff6b6b : 0xffc93c);
        const o = g.blocks.element.get(id)!;
        if (id === sim.recreated) {
          g.swapBlock('element', id, CORAL);
          g.badge('element', id, 'NEW', 'bad');
          g.ring(ePos, 0xff6b6b, 2.4);
        } else {
          g.paint(o, L.element.hot);
          g.bounce(o, 1.12);
          g.badge('element', id, 'reused', 'ok');
        }
      });
      tl!.to({}, { duration: 0.55 });
    });
    tl.to({}, { duration: 1 });

    // 4 · RenderObjects: only changed values repaint
    tl.call(() => {
      setStep(4);
      if (g) gsap.to(g.view, { focus: -2.6, duration: 1.1, ease: 'power2.inOut' });
    });
    tl.to({}, { duration: 0.7 });
    sim.rebuilt.forEach((id) => {
      tl!.call(() => {
        if (!g) return;
        const rPos = g.pos('render', id);
        if (id === sim.recreated) {
          g.swapBlock('render', id, CORAL);
          g.badge('render', id, 'NEW', 'bad');
          g.ring(rPos, 0xff6b6b, 2.4);
        } else if (sim.repaint.includes(id)) {
          const o = g.blocks.render.get(id)!;
          g.paint(o, L.render.hot);
          g.bounce(o, 1.2);
          g.ring(rPos, 0x3ddc97, 2.4);
          g.badge('render', id, 'repaint', 'ok');
        } else {
          g.badge('render', id, 'no paint', 'dim');
        }
      });
      tl!.to({}, { duration: 0.5 });
    });
    tl.to({}, { duration: 0.8 });

    // summary
    tl.call(() => {
      setStep(5);
      if (g) {
        gsap.to(g.view, { focus: 0, duration: 1.2, ease: 'power2.inOut' });
        sim.untouched.forEach((id) => LAYERS.forEach((l) => gsap.to(g.blocks[l].get(id)!.mat, { opacity: 0.4, duration: 0.5 })));
      }
      n1.textContent = String(sim.rebuilt.length);
      n2.textContent = sim.recreated ? '1' : '0';
      n3.textContent = String(sim.repaint.length);
      [n1, n2, n3].forEach((e) => pop(e, 0.6));
      verdict.className = sim.recreated ? 'result bad' : 'result ok';
      swap(
        verdict,
        sim.recreated
          ? '<b>New at the changed spot: all three</b><p>A new widget, a new Element and a new RenderObject. The old State is lost.</p>'
          : '<b>New: only widgets</b><p>Elements are reused and RenderObjects are only updated. Only changed values repaint.</p>'
      );
    });
  }

  const choose = (which: 'home' | 'cbox') => {
    owner = which;
    bA.setAttribute('aria-pressed', String(which === 'home'));
    bB.setAttribute('aria-pressed', String(which === 'cbox'));
    run();
  };
  bA.addEventListener('click', () => choose('home'));
  bB.addEventListener('click', () => choose('cbox'));
  cConst.addEventListener('change', run);
  cType.addEventListener('change', run);
  q('#r-go', root).addEventListener('click', run);

  return {
    enter() {
      if (!gl && !glFailed) {
        try {
          gl = buildGL();
        } catch {
          glFailed = true;
          host.innerHTML = '<p style="padding:24px;font-weight:800;color:#53557E">3D is not available on this device. The numbers still work.</p>';
        }
      }
      gl?.start();
      if (gl) resetScene();
      verdict.className = 'result';
      verdict.innerHTML = '<b>Result</b><p>Press the button.</p>';
      gsap.delayedCall(1.4, run);
    },
    leave() {
      tl?.kill();
      gl?.stop();
    },
  };
};
export default init;
