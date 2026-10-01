/* Escena 3D de la plaza y la entrada del salón (Three.js, local). Forma parte de la historia:
   el estado del acceso cambia según las decisiones del jugador. */
import * as THREE from '../vendor/three.module.min.js';
import { OrbitControls } from '../vendor/OrbitControls.js';

const C = {
  earth: 0xb5532f, lawn: 0x5a9a4a, path: 0xe8d3b0, wall: 0xe8b95a, wallDark: 0xc9823e, roof: 0x8a3b2a,
  door: 0x3b2a5e, wood: 0xa8693a, stone: 0xcfc3ae, ink: 0x1b1530, rail: 0xf4f0e6, sign: 0x2f6fb0,
  dirt: 0x8a5a3a, trunk: 0x8c7a5a, leaf: 0x4f8f4a, pink: 0xee7fb0,
};

const mat = (color, opts = {}) => new THREE.MeshStandardMaterial({ color, roughness: 0.85, metalness: 0, ...opts });
function box(w, h, d, color, x, y, z, parent) {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat(color));
  m.position.set(x, y, z);
  m.castShadow = true; m.receiveShadow = true;
  if (parent) parent.add(m);
  return m;
}

function person(color, x, z, y = 0) {
  const g = new THREE.Group();
  const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.22, 0.7, 4, 10), mat(color));
  body.position.y = 0.85; body.castShadow = true;
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.18, 14, 12), mat(0xd9a07a));
  head.position.y = 1.55; head.castShadow = true;
  g.add(body, head);
  g.position.set(x, y, z);
  return g;
}

function wheelchairPerson(x, z, y = 0, ry = 0) {
  const g = new THREE.Group();
  const seat = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.06, 0.5), mat(0x3a3a52));
  seat.position.y = 0.5;
  const back = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 0.05), mat(0x3a3a52));
  back.position.set(0, 0.78, -0.25);
  const torso = new THREE.Mesh(new THREE.CapsuleGeometry(0.2, 0.35, 4, 10), mat(0x3a7d44));
  torso.position.set(0, 0.88, -0.05);
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.17, 14, 12), mat(0xcf9569));
  head.position.set(0, 1.4, -0.03);
  const cap = new THREE.Mesh(new THREE.SphereGeometry(0.18, 14, 8, 0, Math.PI * 2, 0, Math.PI / 2), mat(0xe0b23a));
  cap.position.copy(head.position); cap.position.y += 0.02;
  [-0.3, 0.3].forEach((sx) => {
    const wheel = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.035, 8, 24), mat(C.ink));
    wheel.rotation.y = Math.PI / 2; wheel.position.set(sx, 0.3, 0);
    g.add(wheel);
  });
  const legs = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.12, 0.5), mat(0x2a3550));
  legs.position.set(0, 0.55, 0.3);
  g.add(seat, back, torso, head, cap, legs);
  g.traverse((o) => { if (o.isMesh) o.castShadow = true; });
  g.position.set(x, y, z);
  g.rotation.y = ry;
  return g;
}

function tree(x, z, s = 1) {
  const g = new THREE.Group();
  const pts = [[0.5, 0], [0.9, 0.8], [0.85, 1.8], [0.4, 3.2], [0.3, 3.8]].map(([r, y]) => new THREE.Vector2(r, y));
  const trunk = new THREE.Mesh(new THREE.LatheGeometry(pts, 14), mat(C.trunk));
  trunk.castShadow = true;
  g.add(trunk);
  [[0, 4.6, 0, 2.2], [-1.3, 4.2, 0.5, 1.5], [1.4, 4.4, -0.4, 1.6], [0.2, 5.3, 0.8, 1.3]].forEach(([a, b, c, r]) => {
    const l = new THREE.Mesh(new THREE.SphereGeometry(r, 14, 10), mat(C.leaf));
    l.position.set(a, b, c); l.castShadow = true; g.add(l);
  });
  [[-0.8, 5.2, 1.8], [1.2, 4.6, 1.2], [0.6, 5.9, 0.4]].forEach(([a, b, c]) => {
    const f = new THREE.Mesh(new THREE.SphereGeometry(0.22, 8, 8), mat(C.pink)); f.position.set(a, b, c); g.add(f);
  });
  g.position.set(x, 0, z); g.scale.setScalar(s);
  return g;
}

function bench(x, z, ry) {
  const g = new THREE.Group();
  box(1.6, 0.08, 0.5, C.wood, 0, 0.45, 0, g); box(1.6, 0.4, 0.06, C.wood, 0, 0.75, -0.22, g);
  box(0.08, 0.45, 0.45, C.ink, -0.7, 0.22, 0, g); box(0.08, 0.45, 0.45, C.ink, 0.7, 0.22, 0, g);
  g.position.set(x, 0, z); g.rotation.y = ry;
  return g;
}

function lamp(x, z) {
  const g = new THREE.Group();
  box(0.12, 3.4, 0.12, C.ink, 0, 1.7, 0, g);
  const b = new THREE.Mesh(new THREE.SphereGeometry(0.26, 12, 10), new THREE.MeshStandardMaterial({ color: 0xfff1b8, emissive: 0xffd37a, emissiveIntensity: 0.6 }));
  b.position.y = 3.5; g.add(b); g.position.set(x, 0, z);
  return g;
}

export function isWebGLAvailable() {
  try {
    const c = document.createElement('canvas');
    return !!(window.WebGLRenderingContext && (c.getContext('webgl2') || c.getContext('webgl')));
  } catch (e) { return false; }
}

export function createPlaza(container, { reduced = false, onFail } = {}) {
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'low-power' });
  } catch (e) { if (onFail) onFail(e); return null; }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  const canvas = renderer.domElement;
  canvas.className = 'gl-canvas';
  canvas.setAttribute('aria-hidden', 'true');
  container.appendChild(canvas);

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xf6c98a);
  scene.fog = new THREE.Fog(0xf6c98a, 28, 60);
  const camera = new THREE.PerspectiveCamera(46, 16 / 9, 0.1, 100);
  const HOME = new THREE.Vector3(5.2, 4.2, 12.5);
  camera.position.copy(HOME);

  scene.add(new THREE.HemisphereLight(0xfff0d0, 0x8a5a3a, 0.9));
  const sun = new THREE.DirectionalLight(0xfff0c0, 1.7);
  sun.position.set(-8, 14, 9); sun.castShadow = true;
  sun.shadow.mapSize.set(1024, 1024);
  Object.assign(sun.shadow.camera, { left: -16, right: 16, top: 16, bottom: -16, near: 1, far: 50 });
  scene.add(sun);

  // Terreno
  const ground = new THREE.Mesh(new THREE.CircleGeometry(40, 48), mat(C.earth));
  ground.rotation.x = -Math.PI / 2; ground.receiveShadow = true; scene.add(ground);
  const lawn = new THREE.Mesh(new THREE.CircleGeometry(7, 40), mat(C.lawn));
  lawn.rotation.x = -Math.PI / 2; lawn.position.set(-5.5, 0.01, 6); lawn.receiveShadow = true; scene.add(lawn);
  const pathMesh = new THREE.Mesh(new THREE.PlaneGeometry(2.4, 14), mat(C.path));
  pathMesh.rotation.x = -Math.PI / 2; pathMesh.position.set(0, 0.02, 6); pathMesh.receiveShadow = true; scene.add(pathMesh);
  const patio = new THREE.Mesh(new THREE.PlaneGeometry(4.2, 4), mat(C.dirt));
  patio.rotation.x = -Math.PI / 2; patio.position.set(5.6, 0.015, -0.2); scene.add(patio);

  // Edificio (fachada hacia +z, puerta alta a 0,45 m)
  const bld = new THREE.Group(); scene.add(bld);
  box(16, 4.2, 5, C.wall, 0, 2.1, -4, bld);
  box(16.6, 0.5, 5.6, C.roof, 0, 4.45, -4, bld);
  box(2.2, 2.6, 0.12, C.door, 0, 1.75, -1.46, bld);           // puerta principal
  box(1.2, 1.0, 0.1, 0x8fd0e8, -5, 2.2, -1.46, bld); box(1.2, 1.0, 0.1, 0x8fd0e8, 5, 2.2, -1.46, bld);
  box(1.0, 2.2, 0.12, C.door, 7, 1.1, -1.46, bld);            // puerta lateral (patio)
  box(3.4, 0.45, 1.0, C.stone, 0, 0.225, -0.98, bld);          // descanso
  const steps = new THREE.Group(); bld.add(steps);
  box(3.4, 0.30, 0.42, C.stone, 0, 0.15, -0.28, steps);
  box(3.4, 0.15, 0.42, C.stone, 0, 0.075, 0.14, steps);
  box(3.4, 0.30, 0.01, C.ink, 0, 0.15, -0.065, steps);
  box(3.4, 0.45, 0.01, C.ink, 0, 0.225, -0.475, steps);

  // Entorno
  scene.add(tree(-7, 5, 1.1), tree(-10.5, -1, 0.9), tree(11, 6, 1));
  scene.add(bench(-4, 8, 0.4), bench(3.8, 9, -0.3), lamp(-2.2, 4), lamp(2.6, 10));
  // Banderines
  const flagColors = [0xf4b942, 0xe0583a, 0x2bb3a3, 0xd6457f, 0xf7efe0];
  for (let i = 0; i < 12; i++) {
    const x = -6 + i * 1.1;
    const m = new THREE.Mesh(new THREE.ConeGeometry(0.22, 0.45, 3), mat(flagColors[i % 5], { side: THREE.DoubleSide }));
    m.rotation.z = Math.PI; m.position.set(x, 3.7 - Math.sin(i / 11 * Math.PI) * -0.0, -1.2); scene.add(m);
  }
  // Bordes de la plaza
  [[-2.6, 6], [2.6, 6]].forEach(([x, z]) => box(0.1, 0.12, 14, C.stone, x, 0.06, z, scene));

  // Personas del entorno (siempre presentes)
  const nel = person(0x7a4aa8, -1.6, 7.2); scene.add(nel);
  const gab = person(0xe0583a, -0.6, 8.5); scene.add(gab);

  // Estados del acceso
  const states = { carry: new THREE.Group(), improvised: new THREE.Group(), plan: new THREE.Group() };
  Object.values(states).forEach((g) => { g.visible = false; scene.add(g); });

  // Moncho (siempre en su silla): su posición cambia por estado
  const moncho = wheelchairPerson(3.4, 3.2, 0, Math.PI);
  scene.add(moncho);

  // carry: voluntarios levantando la silla en los escalones
  {
    const g = states.carry;
    [[-0.5, 0.2], [0.5, 0.2], [-0.5, -0.5], [0.5, -0.5]].forEach(([x, z], i) => {
      g.add(person([0x2f6f8f, 0xd6457f, 0x5a9a4a, 0xf4b942][i], x - 0.2 * Math.sign(x) - (x < 0 ? 0.3 : -0.3), z + 0.5, i > 1 ? 0.3 : 0.05));
    });
    const lifted = wheelchairPerson(0, 0.0, 0, 0);
    lifted.position.set(0, 0.55, 0.15); lifted.rotation.x = -0.15;
    g.add(lifted);
  }
  // improvised: tablones empinados
  {
    const g = states.improvised;
    const len = Math.hypot(1.5, 0.45), ang = Math.atan2(0.45, 1.5);
    const plank = box(1.2, 0.07, len, C.wood, 0, 0.2, 0.05, g);
    plank.rotation.x = ang; plank.position.set(0, 0.215, 0.09);
    box(0.08, 0.3, 0.08, C.wood, -0.55, 0.15, 0.5, g); box(0.08, 0.3, 0.08, C.wood, 0.55, 0.15, 0.5, g);
    // cartel de advertencia con forma (no sólo color)
    const warn = new THREE.Mesh(new THREE.ConeGeometry(0.35, 0.6, 3), mat(0xe0583a)); warn.position.set(1.3, 0.8, 0.9); warn.rotation.y = Math.PI / 2; g.add(warn);
    box(0.06, 0.8, 0.06, C.ink, 1.3, 0.4, 0.9, g);
  }
  // plan: rampa larga y suave con barandas, señal y camino
  {
    const g = states.plan;
    const L = 6.4, H = 0.45, W = 1.3;
    const shape = new THREE.Shape(); shape.moveTo(0, 0); shape.lineTo(L, 0); shape.lineTo(L, H); shape.closePath();
    const geo = new THREE.ExtrudeGeometry(shape, { depth: W, bevelEnabled: false });
    const ramp = new THREE.Mesh(geo, mat(0xd9d2c0)); ramp.position.set(-1.7 - L, 0, -1.45); ramp.castShadow = true; ramp.receiveShadow = true;
    g.add(ramp);
    // franjas de borde
    for (let i = 0; i < 10; i++) {
      const x = -1.7 - L + 0.3 + i * 0.64;
      const y = (x + 1.7 + L) / L * H;
      box(0.12, 0.012, W, i % 2 ? 0xf4b942 : C.ink, x, y + 0.005, -0.8, g);
    }
    // barandas
    [-1.45, -0.15].forEach((z) => {
      const rail = box(L, 0.05, 0.05, C.rail, -1.7 - L / 2, H / 2 + 0.95, z, g);
      rail.rotation.z = Math.atan2(H, L);
      for (let i = 0; i <= 6; i++) {
        const x = -1.7 - L + (i * L) / 6;
        const y = (i / 6) * H;
        box(0.05, 0.95, 0.05, C.rail, x, y + 0.475, z, g);
      }
    });
    // camino de acceso
    const route = new THREE.Mesh(new THREE.PlaneGeometry(2.0, 7), mat(0xf0e4c8)); route.rotation.x = -Math.PI / 2; route.position.set(-8.6, 0.03, 2.4); g.add(route);
    // cartel de recorrido
    box(0.08, 1.8, 0.08, C.ink, -9.8, 0.9, 5, g);
    const board = box(1.1, 0.8, 0.06, C.sign, -9.8, 1.9, 5, g);
    board.rotation.y = 0.4;
    const arrow = new THREE.Mesh(new THREE.ConeGeometry(0.22, 0.45, 3), mat(0xffffff)); arrow.rotation.z = -Math.PI / 2; arrow.position.set(-9.55, 1.9, 5.15); arrow.rotation.y = 0.4; g.add(arrow);
  }

  // Extras (capítulo 5)
  const extras = { signs: new THREE.Group(), shade: new THREE.Group(), interp: new THREE.Group() };
  Object.values(extras).forEach((g) => { g.visible = false; scene.add(g); });
  {
    const s = extras.signs;
    box(0.1, 2.2, 0.1, C.ink, 2.4, 1.1, 3.2, s);
    box(1.4, 1.0, 0.07, 0x15122a, 2.4, 2.4, 3.2, s);
    box(1.1, 0.12, 0.08, 0xf4b942, 2.4, 2.6, 3.24, s); box(1.1, 0.12, 0.08, 0xffffff, 2.4, 2.35, 3.24, s); box(0.8, 0.12, 0.08, 0xffffff, 2.2, 2.15, 3.24, s);
    const sh = extras.shade;
    [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([a, b]) => box(0.08, 2.4, 0.08, C.ink, 5 + a * 1.4, 1.2, 8 + b * 1.1, sh));
    const roof = new THREE.Mesh(new THREE.BoxGeometry(3.4, 0.08, 2.8), mat(0x2bb3a3)); roof.position.set(5, 2.45, 8); roof.castShadow = true; sh.add(roof);
    box(1.4, 0.08, 0.5, C.wood, 5, 0.45, 8.4, sh);
    const ip = extras.interp;
    box(2.2, 0.25, 1.6, C.wood, 0.6, 0.125, 5.2, ip);
    ip.add(person(0xf4b942, 0.6, 5.2, 0.25));
    box(1.7, 0.9, 0.06, 0x15122a, 0.6, 1.5, 4.5, ip);
    box(1.2, 0.5, 0.07, 0xffffff, 0.6, 1.5, 4.46, ip);
  }

  // Estado actual
  let current = { access: 'stairs', extras: [], moncho: 'plaza' };

  function placeMoncho() {
    const a = current.access;
    if (a === 'carry') { moncho.visible = false; }
    else if (a === 'improvised') { moncho.visible = true; moncho.position.set(0, 0, 2.2); moncho.rotation.y = Math.PI; moncho.position.x = 1.8; moncho.position.z = 2.0; }
    else if (a === 'plan') { moncho.visible = true; moncho.position.set(-5.2, 0, 3.2); moncho.rotation.set(0, Math.PI * 0.75, 0); }
    else { moncho.visible = true; moncho.position.set(1.6, 0, 1.8); moncho.rotation.set(0, Math.PI, 0); }
  }

  function setState(access, ex = []) {
    current = { access, extras: ex };
    Object.entries(states).forEach(([k, g]) => { g.visible = k === access; });
    Object.entries(extras).forEach(([k, g]) => { g.visible = ex.includes(k); });
    placeMoncho();
    render();
  }

  // Controles
  const controls = new OrbitControls(camera, canvas);
  controls.target.set(-0.5, 1.4, 1.5);
  controls.enableDamping = !reduced;
  controls.dampingFactor = 0.08;
  controls.minDistance = 5; controls.maxDistance = 26;
  controls.maxPolarAngle = Math.PI / 2 - 0.05;
  controls.enablePan = false;
  controls.update();

  let raf = 0;
  function render() { renderer.render(scene, camera); }
  function loop() {
    raf = 0;
    const moved = controls.update();
    render();
    if (moved && controls.enableDamping) raf = requestAnimationFrame(loop);
  }
  function kick() { if (!raf) raf = requestAnimationFrame(loop); }
  controls.addEventListener('change', kick);

  const offset = new THREE.Vector3();
  const sph = new THREE.Spherical();
  function orbit(dTheta, dZoom = 1) {
    offset.copy(camera.position).sub(controls.target);
    sph.setFromVector3(offset);
    sph.theta += dTheta;
    sph.radius = Math.min(controls.maxDistance, Math.max(controls.minDistance, sph.radius * dZoom));
    offset.setFromSpherical(sph);
    camera.position.copy(controls.target).add(offset);
    camera.lookAt(controls.target);
    controls.update();
    render();
  }
  function reset() { camera.position.copy(HOME); controls.target.set(-0.5, 1.4, 1.5); controls.update(); render(); }

  function resize() {
    const w = container.clientWidth || 640, h = container.clientHeight || 360;
    renderer.setSize(w, h, false);
    camera.aspect = w / h; camera.updateProjectionMatrix();
    render();
  }
  const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(resize) : null;
  if (ro) ro.observe(container); else window.addEventListener('resize', resize);

  canvas.addEventListener('webglcontextlost', (e) => { e.preventDefault(); if (onFail) onFail(new Error('contexto WebGL perdido')); });

  resize();
  setState('stairs', []);

  return {
    setState,
    left: () => orbit(-Math.PI / 6),
    right: () => orbit(Math.PI / 6),
    zoomIn: () => orbit(0, 0.8),
    zoomOut: () => orbit(0, 1.25),
    reset,
    resize,
    dispose() {
      if (ro) ro.disconnect(); else window.removeEventListener('resize', resize);
      cancelAnimationFrame(raf); controls.dispose(); renderer.dispose(); canvas.remove();
    },
    get info() { return { calls: renderer.info.render.calls, triangles: renderer.info.render.triangles }; },
  };
}
