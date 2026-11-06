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
  PCFShadowMap,
  PerspectiveCamera,
  PlaneGeometry,
  Scene,
  Shape,
  ShadowMaterial,
  TorusGeometry,
  Vector3,
  WebGLRenderer,
} from 'three';
import { q, swap, pop, reduce, type SceneInit } from '../util';

interface Def {
  id: string;
  name: string;
  p: [number, number, number];
  par: string | null;
  canConst?: boolean;
}
const defs: Def[] = [
  { id: 'app', name: 'MyApp', p: [0, 0, 0], par: null },
  { id: 'home', name: 'HomePage', p: [0, -2.2, 0], par: 'app' },
  { id: 'head', name: 'Header', p: [-3.6, -4.4, 0.6], par: 'home', canConst: true },
  { id: 'cbox', name: 'CounterBox', p: [0, -4.4, -0.6], par: 'home' },
  { id: 'foot', name: 'Footer', p: [3.6, -4.4, 0.6], par: 'home', canConst: true },
  { id: 'txt', name: 'Text', p: [-1.3, -6.6, -1], par: 'cbox' },
  { id: 'icon', name: 'Icon', p: [1.3, -6.6, -1], par: 'cbox' },
];
const kids = (id: string) => defs.filter((d) => d.par === id).map((d) => d.id);

const BASE = new Color('#C9C6EA');
const YEL = new Color('#FFC93C');
const BLUE = new Color('#5B7CFF');
const GREY = new Color('#B2AEC8');

function roundedBox(w: number, h: number, d: number, r: number) {
  const s = new Shape();
  const x = -w / 2;
  const y = -h / 2;
  s.moveTo(x + r, y);
  s.lineTo(x + w - r, y);
  s.quadraticCurveTo(x + w, y, x + w, y + r);
  s.lineTo(x + w, y + h - r);
  s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  s.lineTo(x + r, y + h);
  s.quadraticCurveTo(x, y + h, x, y + h - r);
  s.lineTo(x, y + r);
  s.quadraticCurveTo(x, y, x + r, y);
  const g = new ExtrudeGeometry(s, { depth: d, bevelEnabled: true, bevelSize: 0.05, bevelThickness: 0.05, bevelSegments: 4, curveSegments: 8 });
  g.translate(0, 0, -d / 2);
  return g;
}

const init: SceneInit = (root) => {
  const host = q('#reach', root);
  const bA = q<HTMLButtonElement>('#r-a', root);
  const bB = q<HTMLButtonElement>('#r-b', root);
  const cConst = q<HTMLInputElement>('#r-const', root);
  const verdict = q('#r-verdict', root);
  const n1 = q('#r-n1', root);
  const n2 = q('#r-n2', root);
  const n3 = q('#r-n3', root);

  let owner = 'home';
  let tl: gsap.core.Timeline | null = null;
  let gl: ReturnType<typeof buildGL> | null = null;
  let glFailed = false;

  function buildGL() {
    const canvas = document.createElement('canvas');
    host.appendChild(canvas);
    const renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setClearColor(0x000000, 0);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = PCFShadowMap;
    const scene = new Scene();
    const cam = new PerspectiveCamera(32, 1, 0.1, 100);
    scene.add(new HemisphereLight(0xffffff, 0xaab2e6, 1.9));
    const sun = new DirectionalLight(0xffffff, 2.2);
    sun.position.set(6, 12, 8);
    sun.castShadow = true;
    sun.shadow.mapSize.set(1024, 1024);
    sun.shadow.radius = 5;
    Object.assign(sun.shadow.camera, { left: -12, right: 12, top: 12, bottom: -12 });
    scene.add(sun);
    const ground = new Mesh(new PlaneGeometry(80, 80), new ShadowMaterial({ opacity: 0.16 }));
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -7.4;
    ground.receiveShadow = true;
    scene.add(ground);

    const nodes = new Map<string, { mesh: Mesh; mat: MeshStandardMaterial; tag: HTMLElement }>();
    for (const d of defs) {
      const mat = new MeshStandardMaterial({ color: BASE.clone(), roughness: 0.55, metalness: 0, transparent: true });
      const mesh = new Mesh(roundedBox(1.7, 0.8, 0.9, 0.25), mat);
      mesh.position.set(...d.p);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      scene.add(mesh);
      const tag = document.createElement('div');
      tag.className = 'tag3d';
      tag.textContent = d.name;
      host.appendChild(tag);
      nodes.set(d.id, { mesh, mat, tag });
    }
    const link = new MeshStandardMaterial({ color: 0xffffff, roughness: 0.6 });
    for (const d of defs) {
      if (!d.par) continue;
      const a = nodes.get(d.par)!.mesh.position;
      const b = nodes.get(d.id)!.mesh.position;
      const c = new Mesh(new CylinderGeometry(0.07, 0.07, a.distanceTo(b), 10), link);
      c.position.copy(a).add(b).multiplyScalar(0.5);
      c.lookAt(b);
      c.rotateX(Math.PI / 2);
      c.castShadow = true;
      scene.add(c);
    }
    const hint = document.createElement('div');
    hint.className = 'hint3d';
    hint.textContent = 'Drag to turn';
    host.appendChild(hint);

    let drag = 0;
    let down = false;
    let lx = 0;
    canvas.addEventListener('pointerdown', (e) => { down = true; lx = e.clientX; canvas.setPointerCapture(e.pointerId); gsap.killTweensOf(state); });
    canvas.addEventListener('pointermove', (e) => {
      if (!down) return;
      drag = Math.max(-1, Math.min(1, drag - (e.clientX - lx) * 0.006));
      lx = e.clientX;
    });
    const release = () => { down = false; gsap.to(state, { drag: 0, duration: 1.4, delay: 1.5, ease: 'power2.inOut' }); };
    canvas.addEventListener('pointerup', release);
    canvas.addEventListener('pointercancel', release);
    const state = { get drag() { return drag; }, set drag(v: number) { drag = v; } };

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
      dist = Math.max(8.6 / 2 / t, 9.4 / 2 / (t * cam.aspect)) * 1.12;
    };
    const ro = new ResizeObserver(fit);
    ro.observe(host);
    fit();

    const v = new Vector3();
    let raf = 0;
    const frame = (t: number) => {
      raf = requestAnimationFrame(frame);
      const ang = 0.55 + (reduce ? 0 : Math.sin(t * 0.0004) * 0.25) + drag;
      cam.position.set(Math.sin(ang) * dist * 0.55, -0.6, Math.cos(ang) * dist);
      cam.lookAt(0, -3.4, 0);
      nodes.forEach(({ mesh, tag }) => {
        v.copy(mesh.position).project(cam);
        tag.style.left = `${(v.x * 0.5 + 0.5) * w}px`;
        tag.style.top = `${(-v.y * 0.5 + 0.5) * h}px`;
      });
      renderer.render(scene, cam);
    };

    return {
      nodes,
      scene,
      start() { cancelAnimationFrame(raf); raf = requestAnimationFrame(frame); },
      stop() { cancelAnimationFrame(raf); },
    };
  }

  function simulate(constOn: boolean) {
    const seq: { id: string; status: 'source' | 'rebuilt' | 'skipped' }[] = [{ id: owner, status: 'source' }];
    const touched = new Set([owner]);
    const skipped = new Set<string>();
    const visit = (id: string) => {
      for (const k of kids(id)) {
        const d = defs.find((x) => x.id === k)!;
        if (constOn && d.canConst) {
          skipped.add(k);
          seq.push({ id: k, status: 'skipped' });
          continue;
        }
        touched.add(k);
        seq.push({ id: k, status: 'rebuilt' });
        visit(k);
      }
    };
    visit(owner);
    const untouched = defs.map((d) => d.id).filter((id) => !touched.has(id) && !skipped.has(id));
    return { seq, touched, skipped, untouched };
  }

  function resetColors() {
    gl?.nodes.forEach(({ mat, mesh }) => {
      gsap.to(mat.color, { r: BASE.r, g: BASE.g, b: BASE.b, duration: 0.3 });
      gsap.to(mat, { opacity: 1, duration: 0.3 });
      gsap.to(mesh.scale, { x: 1, y: 1, z: 1, duration: 0.3 });
    });
  }

  function ring(id: string) {
    if (!gl) return;
    const n = gl.nodes.get(id)!;
    const r = new Mesh(new TorusGeometry(1.2, 0.05, 12, 48), new MeshBasicMaterial({ color: 0xffc93c, transparent: true, opacity: 0.9 }));
    r.position.copy(n.mesh.position);
    r.rotation.x = Math.PI / 2;
    gl.scene.add(r);
    gsap.to(r.scale, { x: 2.6, y: 2.6, z: 2.6, duration: 1, ease: 'power2.out' });
    gsap.to(r.material, { opacity: 0, duration: 1, onComplete: () => { gl!.scene.remove(r); r.geometry.dispose(); (r.material as MeshBasicMaterial).dispose(); } });
  }

  function run() {
    tl?.kill();
    resetColors();
    const sim = simulate(cConst.checked);
    n1.textContent = n2.textContent = n3.textContent = '0';
    verdict.className = 'result';
    verdict.innerHTML = '<b>Result</b><p>Working...</p>';
    tl = gsap.timeline({ delay: 0.35 });
    tl.call(() => ring(owner));
    sim.seq.forEach((s, i) => {
      const n = gl?.nodes.get(s.id);
      const col = s.status === 'source' ? YEL : s.status === 'rebuilt' ? BLUE : GREY;
      tl!.call(() => {
        if (n) {
          gsap.to(n.mat.color, { r: col.r, g: col.g, b: col.b, duration: 0.25 });
          if (s.status !== 'skipped') gsap.fromTo(n.mesh.scale, { x: 1, y: 1, z: 1 }, { x: 1.2, y: 1.2, z: 1.2, duration: 0.18, yoyo: true, repeat: 1, ease: 'power2.out' });
        }
      }, [], i === 0 ? '>' : '>+0.2');
    });
    tl.call(() => {
      sim.untouched.forEach((id) => gl && gsap.to(gl.nodes.get(id)!.mat, { opacity: 0.4, duration: 0.4 }));
      n1.textContent = String(sim.touched.size);
      n2.textContent = String(sim.skipped.size);
      n3.textContent = String(sim.untouched.length);
      [n1, n2, n3].forEach((e) => pop(e, 0.6));
      verdict.className = 'result ok';
      swap(verdict, owner === 'home'
        ? '<b>Not the whole app</b><p>Only HomePage and below' + (sim.skipped.size ? ', minus the const widgets' : '') + '.</p>'
        : `<b>Just ${sim.touched.size} Elements</b><p>HomePage, Header and Footer never ran build().</p>`);
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
      resetColors();
      n1.textContent = n2.textContent = n3.textContent = '0';
      verdict.className = 'result';
      verdict.innerHTML = '<b>Result</b><p>Press the button.</p>';
      gsap.delayedCall(1.2, run);
    },
    leave() {
      tl?.kill();
      gl?.stop();
    },
  };
};
export default init;
