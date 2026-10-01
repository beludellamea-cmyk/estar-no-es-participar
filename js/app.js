import { CHAPTERS, CHARACTERS, RIGHTS, SOURCES, ENDINGS, QUESTION, endingFor } from './story.js';
import { bgSVG, charSVG, CHAR_NAMES, flyerSVG, FLYER_SMALL_PRINT } from './art.js';
import * as voice from './voice.js';

const $ = (id) => document.getElementById(id);
const KEY = 'enp-v1';
const SCALES = [1, 1.15, 1.3, 1.5, 1.75];
const reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const params = new URLSearchParams(location.search);

/* ---------- Lista plana de escenas ---------- */
const BEATS = [];
CHAPTERS.forEach((c, ci) => c.beats.forEach((b) => BEATS.push({ ...b, ch: ci })));
const CHOICE_IDX = {};   // 'c1' -> índice
BEATS.forEach((b, i) => { if (b.type === 'choice') CHOICE_IDX[b.id] = i; });
const TITLE_IDX = CHAPTERS.map((c, ci) => BEATS.findIndex((b) => b.ch === ci && b.type === 'title'));
const CHOICE_IDS = Object.keys(CHOICE_IDX);

/* ---------- Estado ---------- */
const S = { idx: 0, d: {}, maxIdx: 0, mode: 'solo', scale: 0, rate: 1, started: false, revisit: false, narrOn: false, hist: [], sel: null };

function save() {
  try {
    localStorage.setItem(KEY, JSON.stringify({ idx: S.idx, d: S.d, maxIdx: S.maxIdx, mode: S.mode, scale: S.scale, rate: S.rate, started: S.started, revisit: S.revisit }));
  } catch (e) { /* sin almacenamiento: la experiencia sigue funcionando */ }
}
function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const o = JSON.parse(raw);
    return o && typeof o === 'object' ? o : null;
  } catch (e) { return null; }
}
function clearSave() { try { localStorage.removeItem(KEY); } catch (e) { /* nada */ } }

/* ---------- Utilidades de texto ---------- */
const val = (v) => { const r = typeof v === 'function' ? v(S) : v; return r == null ? '' : r; };
const nameOf = (id) => (CHAR_NAMES[id] || '');
const visible = (b) => !b.when || !!b.when(S);

function chapterOf(idx) { return CHAPTERS[BEATS[idx].ch]; }
function choiceOf(b) { return BEATS[CHOICE_IDX[b.of]]; }
function optionOf(choiceBeat, id) { return choiceBeat.options.find((o) => o.id === id); }

function perspFor(idx) {
  const b = BEATS[idx];
  if (b.persp) return b.persp;
  if (b.type === 'choice') {
    for (let i = idx - 1; i >= 0 && BEATS[i].ch === b.ch; i--) {
      if (BEATS[i].type === 'choice') break;
      if (BEATS[i].persp && visible(BEATS[i])) return BEATS[i].persp;
    }
  }
  return null;
}

function propFor(idx) {
  const b = BEATS[idx];
  if (b.prop !== 'flyer') return null;
  const after = idx > CHOICE_IDX.c1 && S.d.c1;
  return { acc: after && S.d.c1 === 'c', after };
}

/* Lectura de la escena: mismo contenido que se ve en pantalla. */
function speechFor(idx) {
  const b = BEATS[idx];
  const n = nameOf(b.who);
  const say = (t) => (n ? `${n} dice: ${t}` : t);
  if (b.type === 'title') return [val(b.text)];
  if (b.type === 'choice') {
    const out = [val(b.prompt), '¿Qué harías?'];
    b.options.forEach((o, i) => out.push(`Opción ${i + 1}. ${o.label}`));
    if (S.mode === 'group') out.push('Modo grupal: conversen entre ustedes antes de elegir y confirmen la respuesta del grupo.');
    return out;
  }
  if (b.type === 'explain') {
    const ch = choiceOf(b); const o = optionOf(ch, S.d[ch.id]);
    const e = b.info[S.d[ch.id]];
    if (!o || !e) return [];
    return [`Tu elección: ${o.label}`, `Qué barrera apareció: ${e.barrier}`, `Derecho relacionado: ${e.right}`, `Qué acción podría abrir la participación: ${e.action}`,
      'Esto no mide qué tipo de persona sos. Podés volver a pensar esta decisión.'];
  }
  if (b.type === 'ending') return endingSpeech();
  return [say(val(b.text))];
}

function endingSpeech() {
  const e = ENDINGS[endingFor(S.d)];
  const out = [e.title, e.summary, 'Ejemplos de tu recorrido.'];
  CHAPTERS.forEach((c, i) => { const ch = BEATS[CHOICE_IDX['c' + (i + 1)]]; const o = optionOf(ch, S.d['c' + (i + 1)]); if (o) out.push(`Capítulo ${c.n}, ${c.title}. ${o.recap}`); });
  out.push(e.note, QUESTION);
  return out;
}

/* ---------- Escenario ---------- */
const stage = $('stage');
let bgFlip = false, curBg = null;
function setBg(name) {
  if (name === curBg) return;
  curBg = name;
  const next = $(bgFlip ? 'bg-a' : 'bg-b'), prev = $(bgFlip ? 'bg-b' : 'bg-a');
  next.innerHTML = bgSVG(name);
  next.classList.add('on'); prev.classList.remove('on');
  bgFlip = !bgFlip;
}

const POS = { 0: [], 1: [50], 2: [30, 70], 3: [20, 50, 80], 4: [14, 38, 62, 86] };
function setChars(ids, speaker) {
  const box = $('chars');
  const list = [...ids];
  if (speaker && !list.includes(speaker)) list.push(speaker);
  const pos = POS[Math.min(list.length, 4)];
  [...box.children].forEach((el) => { if (!list.includes(el.dataset.id)) { el.classList.add('leaving'); setTimeout(() => el.remove(), reduced ? 0 : 450); } });
  list.slice(0, 4).forEach((id, i) => {
    let el = box.querySelector(`.char[data-id="${id}"]:not(.leaving)`);
    if (!el) {
      el = document.createElement('div');
      el.className = 'char entering';
      el.dataset.id = id;
      el.innerHTML = `${charSVG(id)}<span class="nameplate">${nameOf(id)}</span>`;
      el.style.left = pos[i] + '%';
      box.appendChild(el);
      requestAnimationFrame(() => requestAnimationFrame(() => el.classList.remove('entering')));
    }
    el.style.left = pos[i] + '%';
    el.classList.toggle('speaking', id === speaker);
    el.classList.toggle('dim', !!speaker && id !== speaker);
    el.setAttribute('role', 'img');
    el.setAttribute('aria-label', nameOf(id) + (id === speaker ? ' (habla)' : ''));
  });
}

/* ---------- Escena 3D ---------- */
const ACCESS_TEXT = {
  stairs: 'La entrada principal tiene tres escalones. La puerta lateral da a un patio de tierra con desnivel.',
  carry: 'La entrada sigue teniendo tres escalones. Cuatro voluntarios cargan la silla de Moncho para subirla.',
  improvised: 'Una rampa de tablones, corta y casi vertical, sin barandas ni bordes. Moncho no puede usarla sola ni solo con seguridad.',
  plan: 'Una rampa larga y suave, con barandas y bordes marcados, junto a un cartel que indica el recorrido. Los escalones siguen ahí, pero ya no son la única forma de entrar.',
};
const EXTRA_TEXT = { signs: 'Carteles de alto contraste.', shade: 'Un lugar de descanso con sombra.', interp: 'Un espacio con escenario bajo para una persona intérprete de lengua de señas.' };
const g3 = { api: null, loading: null, failed: false, simple: params.get('sin3d') === '1', access: 'stairs', extras: [], before: false };

async function ensure3D() {
  if (g3.api || g3.failed || g3.simple) return;
  if (g3.loading) return g3.loading;
  g3.loading = (async () => {
    try {
      const mod = await import('./scene3d.js');
      if (!mod.isWebGLAvailable()) throw new Error('sin WebGL');
      g3.api = mod.createPlaza($('gl-host'), { reduced, onFail: () => failTo2D('El navegador perdió el contexto 3D.') });
      if (!g3.api) throw new Error('no se pudo crear la escena');
    } catch (e) {
      g3.failed = true; g3.api = null;
    }
  })();
  await g3.loading; g3.loading = null;
}
function failTo2D() { g3.failed = true; if (g3.api) { try { g3.api.dispose(); } catch (e) { /* nada */ } g3.api = null; } if (!$('gl-host').hidden) refresh3D(); }

function sideView(access, extras) {
  const rise = 66, gy = 300, doorX = 600;
  let inner = '';
  inner += `<rect x="560" y="60" width="240" height="${gy - 60}" fill="#e8b95a" stroke="#1b1530" stroke-width="4"/><rect x="590" y="${gy - rise - 150}" width="120" height="150" fill="#3b2a5e" stroke="#1b1530" stroke-width="4"/>`;
  inner += `<rect x="560" y="${gy - rise}" width="120" height="${rise}" fill="#cfc3ae" stroke="#1b1530" stroke-width="3"/>`;
  [0, 1, 2].forEach((i) => { inner += `<rect x="${560 - (i + 1) * 40}" y="${gy - rise + (i + 1) * 22}" width="40" height="${rise - (i + 1) * 22}" fill="#cfc3ae" stroke="#1b1530" stroke-width="3"/>`; });
  inner += `<text x="440" y="${gy + 28}" font-size="16" font-family="Arial" fill="#f7efe0" text-anchor="middle">3 escalones</text>`;
  const person = (x, y, label) => `<g transform="translate(${x} ${y})"><circle cx="0" cy="-50" r="11" fill="#cf9569" stroke="#1b1530" stroke-width="3"/><rect x="-12" y="-38" width="24" height="26" rx="6" fill="#3a7d44" stroke="#1b1530" stroke-width="3"/><circle cx="-4" cy="-4" r="18" fill="none" stroke="#1b1530" stroke-width="5"/><text x="0" y="28" font-size="15" font-family="Arial" fill="#f7efe0" text-anchor="middle">${label}</text></g>`;
  if (access === 'carry') {
    inner += person(430, gy - 70, 'Moncho, cargado');
    [380, 480].forEach((x) => { inner += `<circle cx="${x}" cy="${gy - 80}" r="11" fill="#d6457f" stroke="#1b1530" stroke-width="3"/><rect x="${x - 11}" y="${gy - 68}" width="22" height="50" rx="6" fill="#2f6f8f" stroke="#1b1530" stroke-width="3"/>`; });
    inner += `<text x="430" y="${gy - 130}" font-size="17" font-family="Arial" fill="#f7efe0" text-anchor="middle">Voluntarios cargan la silla</text>`;
  } else if (access === 'improvised') {
    inner += `<polygon points="470,${gy} 560,${gy - rise} 560,${gy - rise + 8} 474,${gy}" fill="#a8693a" stroke="#1b1530" stroke-width="3"/>`;
    inner += person(330, gy - 18, 'Moncho');
    inner += `<text x="440" y="${gy - 130}" font-size="17" font-family="Arial" fill="#f7efe0" text-anchor="middle">Rampa corta: pendiente muy fuerte, sin barandas</text>`;
  } else if (access === 'plan') {
    inner += `<polygon points="50,${gy} 560,${gy - rise} 560,${gy}" fill="#d9d2c0" stroke="#1b1530" stroke-width="3"/>`;
    inner += `<path d="M50 ${gy - 70}L560 ${gy - rise - 70}" stroke="#f4f0e6" stroke-width="5"/>`;
    [50, 220, 390, 560].forEach((x) => { inner += `<path d="M${x} ${gy - (x - 50) / 510 * rise}v-70" stroke="#f4f0e6" stroke-width="4"/>`; });
    inner += person(260, gy - 30, 'Moncho');
    inner += `<text x="300" y="${gy - 150}" font-size="17" font-family="Arial" fill="#f7efe0" text-anchor="middle">Rampa larga y suave, con barandas y cartel de recorrido</text>`;
  } else {
    inner += person(330, gy - 18, 'Moncho');
    inner += `<text x="300" y="${gy - 130}" font-size="17" font-family="Arial" fill="#f7efe0" text-anchor="middle">Sólo escalones: no hay recorrido accesible</text>`;
  }
  let ex = '', ey = 40;
  extras.forEach((k) => { ex += `<text x="20" y="${ey}" font-size="16" font-family="Arial" fill="#f4b942">+ ${EXTRA_TEXT[k]}</text>`; ey += 24; });
  return `<svg viewBox="0 0 800 360" class="side-view" role="img" aria-label="Vista lateral de la entrada. ${ACCESS_TEXT[access]}" xmlns="http://www.w3.org/2000/svg"><rect width="800" height="360" fill="#2d2250"/><rect y="${gy}" width="800" height="60" fill="#b5532f"/>${inner}${ex}</svg>`;
}

async function refresh3D() {
  const host = $('gl-host'), cap = $('caption3d');
  const access = g3.before ? 'stairs' : g3.access, extras = g3.before ? [] : g3.extras;
  await ensure3D();
  const useGL = !!g3.api && !g3.simple;
  host.hidden = false;
  stage.classList.add('is3d');
  const old = host.querySelector('.side-view-wrap');
  if (old) old.remove();
  const gl = host.querySelector('canvas');
  if (gl) gl.style.display = useGL ? '' : 'none';
  if (useGL) { g3.api.setState(access, extras); g3.api.resize(); }
  else {
    const w = document.createElement('div'); w.className = 'side-view-wrap'; w.innerHTML = sideView(access, extras); host.appendChild(w);
  }
  ['c3-left', 'c3-right', 'c3-in', 'c3-out', 'c3-reset'].forEach((id) => { $(id).disabled = !useGL; });
  $('c3-help').hidden = useGL;
  if (useGL && !host.querySelector('.gl-hint')) { const h = el('span', 'gl-hint', 'Arrastrá para girar'); h.setAttribute('aria-hidden', 'true'); host.append(h); }
  const hint = host.querySelector('.gl-hint'); if (hint) hint.hidden = !useGL;
  $('c3-help').textContent = useGL ? 'Arrastrá para girar la escena, o usá los botones.' : (g3.simple && !g3.failed ? 'Estás en la vista simple: un corte lateral de la entrada.' : 'Tu navegador no pudo abrir la vista 3D. Esta vista lateral muestra lo mismo y podés seguir con la historia.');
  $('c3-mode').hidden = g3.failed;
  $('c3-mode').textContent = g3.simple ? 'Usar vista 3D' : 'Usar vista simple';
  $('c3-mode').setAttribute('aria-pressed', String(g3.simple));
  $('c3-toggle').textContent = g3.before ? 'Ver cómo está ahora' : 'Ver cómo era antes';
  $('c3-toggle').setAttribute('aria-pressed', String(g3.before));
  cap.textContent = (g3.before ? 'Vista original: ' : 'Vista actual: ') + ACCESS_TEXT[access] + ' ' + extras.map((k) => EXTRA_TEXT[k]).join(' ');
}

function hide3D() { $('gl-host').hidden = true; $('controls3d').hidden = true; stage.classList.remove('is3d'); }

/* ---------- Render de una escena ---------- */
const body = $('beat-body');

function el(tag, cls, text) { const e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }

function render(opts = {}) {
  const idx = S.idx, b = BEATS[idx];
  S.maxIdx = Math.max(S.maxIdx, idx);
  voice.stop();
  S.sel = null;

  // Progreso
  const c = chapterOf(idx);
  $('progress-text').textContent = `Capítulo ${c.n} de ${CHAPTERS.length} · ${c.title}`;
  $('progress-fill').style.width = ((c.n - 1) / CHAPTERS.length * 100 + (idx - TITLE_IDX[c.n - 1]) / (BEATS.filter((x) => x.ch === c.n - 1).length) * (100 / CHAPTERS.length)) + '%';
  $('mode-badge').textContent = S.mode === 'group' ? 'Modo grupal' : 'Modo individual';

  // Escenario
  setBg(b.bg || 'plaza');
  const speaker = b.who || null;
  setChars(b.chars || [], speaker);
  const card = $('chapter-card');
  card.hidden = b.type !== 'title';
  if (b.type === 'title') { const [a, ...r] = val(b.text).split('. '); card.innerHTML = ''; card.append(el('span', 'cc-n', a), el('span', 'cc-t', r.join('. '))); }

  // Utilería (afiche)
  const prop = $('prop'), pf = propFor(idx);
  prop.hidden = !pf;
  stage.classList.toggle('has-prop', !!pf);
  if (pf) { prop.innerHTML = flyerSVG(pf.acc); prop.dataset.acc = pf.acc ? '1' : ''; }
  $('btn-print').hidden = !pf || pf.acc;
  $('small-print').hidden = true;

  // 3D
  if (b.scene3d) {
    g3.access = val(b.scene3d.access) || 'stairs';
    g3.extras = b.scene3d.extras ? val(b.scene3d.extras) : [];
    g3.before = false;
    $('controls3d').hidden = false;
    refresh3D();
  } else hide3D();

  // Cuerpo
  body.innerHTML = '';
  $('persp-box').hidden = true;
  $('extra-actions').innerHTML = '';
  const sp = $('speaker');
  sp.hidden = !speaker;
  sp.textContent = speaker ? CHARACTERS[speaker].name : '';
  $('dialogue').classList.toggle('narration', !speaker);
  const next = $('btn-next');
  next.hidden = false; next.disabled = false;
  next.textContent = 'Continuar →';
  $('btn-prev').disabled = S.hist.length === 0;

  const persp = perspFor(idx);
  $('btn-persp').hidden = !persp;
  $('btn-persp').setAttribute('aria-expanded', 'false');

  if (b.type === 'choice') renderChoice(b);
  else if (b.type === 'explain') renderExplain(b);
  else if (b.type === 'ending') renderEnding();
  else if (b.type === 'wait') {
    body.append(el('p', 'beat-text', val(b.text)));
    const tiles = el('div', 'wait-tiles'); tiles.setAttribute('aria-hidden', 'true');
    for (let i = 0; i < 4; i++) tiles.append(el('span', 'wait-tile'));
    body.append(tiles);
    next.textContent = (b.cta || 'Continuar') + ' →';
  } else {
    const p = el('p', 'beat-text', val(b.text));
    if (b.type === 'title') p.classList.add('title-text');
    body.append(p);
  }

  save();
  if (!opts.noFocus) { const f = body.querySelector('[data-focus]') || body; try { f.focus({ preventScroll: true }); } catch (e) { /* nada */ } }
  if (!opts.noScroll) { try { $('view-story').scrollIntoView({ block: 'start', behavior: 'auto' }); } catch (e) { /* nada */ } }
  if (S.narrOn) speakCurrent();
}

function renderChoice(b) {
  const idx = S.idx;
  const p = el('p', 'beat-text', val(b.prompt)); body.append(p);
  const h = el('h2', 'ask', '¿Qué harías?'); h.tabIndex = -1; h.dataset.focus = '1'; body.append(h);
  const prev = S.d[b.id];
  const list = el('div', 'options'); list.setAttribute('role', S.mode === 'group' ? 'radiogroup' : 'group'); list.setAttribute('aria-label', 'Opciones');
  b.options.forEach((o, i) => {
    const btn = el('button', 'option');
    btn.type = 'button';
    btn.dataset.opt = o.id;
    btn.append(el('span', 'opt-n', String(i + 1)), el('span', 'opt-t', o.label));
    if (prev === o.id) btn.append(el('span', 'opt-prev', 'Tu elección anterior'));
    if (S.mode === 'group') {
      btn.setAttribute('role', 'radio'); btn.setAttribute('aria-checked', 'false');
      btn.addEventListener('click', () => {
        S.sel = o.id;
        list.querySelectorAll('.option').forEach((x) => { const on = x.dataset.opt === o.id; x.setAttribute('aria-checked', String(on)); x.classList.toggle('selected', on); });
        const ok = $('group-confirm'); ok.disabled = false; ok.textContent = 'Ya debatimos: confirmar la respuesta del grupo (opción ' + (i + 1) + ')';
      });
    } else btn.addEventListener('click', () => choose(b, o.id));
    list.append(btn);
  });
  body.append(list);
  const next = $('btn-next');
  if (S.mode === 'group') {
    const box = el('div', 'discuss');
    box.append(el('h3', null, 'Antes de elegir, conversen'));
    const ul = el('ul'); ['¿Quién se ve afectado por esta decisión?', '¿A quién habría que consultar?', '¿Qué cambia para cada persona según lo que elijamos?'].forEach((t) => ul.append(el('li', null, t)));
    box.append(ul); body.append(box);
    next.hidden = true;
    const ok = el('button', 'btn btn-primary btn-big', 'Elegí una opción para confirmar'); ok.type = 'button'; ok.id = 'group-confirm'; ok.disabled = true;
    ok.addEventListener('click', () => { if (S.sel) choose(b, S.sel); });
    $('extra-actions').append(ok);
  } else {
    next.hidden = true;
  }
  void idx;
}

function choose(b, optId) {
  S.d[b.id] = optId;
  goNext();
}

function renderExplain(b) {
  const ch = choiceOf(b), id = S.d[ch.id];
  const o = optionOf(ch, id), e = b.info[id];
  if (!o || !e) { body.append(el('p', 'beat-text', 'Todavía no tomaste esta decisión.')); return; }
  const h = el('h2', 'ask', 'Lo que pasó con tu decisión'); h.tabIndex = -1; h.dataset.focus = '1';
  body.append(h, el('p', 'chosen', 'Tu elección: ' + o.label));
  const card = (cls, label, text, refs) => {
    const c = el('section', 'xcard ' + cls); c.append(el('h3', null, label), el('p', null, text));
    if (refs) { const r = el('p', 'refs'); refs.forEach((k) => { const bt = el('button', 'chip', RIGHTS[k].n.replace('Artículo', 'Art.')); bt.type = 'button'; bt.addEventListener('click', () => openRights(k)); r.append(bt); }); c.append(r); }
    return c;
  };
  const grid = el('div', 'xgrid');
  grid.append(card('x-barrier', 'Qué barrera apareció', e.barrier), card('x-right', 'Qué derecho se relaciona', e.right, e.refs), card('x-action', 'Qué acción podría abrir la participación', e.action));
  body.append(grid);
  body.append(el('p', 'note', 'Esto no mide qué tipo de persona sos: muestra qué pasa con cada camino. Podés volver a pensar la decisión cuando quieras.'));
  const again = el('button', 'btn', 'Volver a pensar esta decisión'); again.type = 'button';
  again.addEventListener('click', () => reviseDecision(ch.id));
  $('extra-actions').append(again);
  if (S.revisit) {
    const k = CHOICE_IDS.indexOf(ch.id);
    const calc = el('button', 'btn btn-primary', 'Recalcular mi final'); calc.type = 'button';
    calc.addEventListener('click', () => { S.revisit = false; S.hist.push(S.idx); go(BEATS.length - 1); });
    const cont = el('button', 'btn', 'Seguir la historia desde acá'); cont.type = 'button';
    cont.addEventListener('click', () => { CHOICE_IDS.slice(k + 1).forEach((c) => delete S.d[c]); S.revisit = false; goNext(); });
    $('extra-actions').append(cont, calc);
    $('btn-next').hidden = true;
  }
}

function renderEnding() {
  const n = endingFor(S.d), e = ENDINGS[n];
  const wrap = el('div', 'ending');
  const h = el('h2', 'ending-title', e.title); h.tabIndex = -1; h.dataset.focus = '1';
  wrap.append(h, el('p', 'beat-text', e.summary), el('h3', null, 'Ejemplos de tu recorrido'));
  const ul = el('ul', 'recap');
  CHAPTERS.forEach((c, i) => {
    const o = optionOf(BEATS[CHOICE_IDX['c' + (i + 1)]], S.d['c' + (i + 1)]);
    if (o) { const li = el('li'); li.append(el('strong', null, `Capítulo ${c.n} · ${c.title}: `), document.createTextNode(o.recap)); ul.append(li); }
  });
  wrap.append(ul, el('p', 'note', e.note));
  const q = el('blockquote', 'final-q', QUESTION);
  wrap.append(q);
  const row = el('div', 'btn-row');
  const rev = el('button', 'btn btn-primary btn-big', 'Volver a mirar mis decisiones'); rev.type = 'button'; rev.id = 'btn-review';
  rev.addEventListener('click', openReview);
  const rts = el('button', 'btn', 'Derechos y fuentes'); rts.type = 'button'; rts.addEventListener('click', () => openRights());
  const nw = el('button', 'btn btn-ghost', 'Empezar de nuevo'); nw.type = 'button'; nw.addEventListener('click', () => $('dlg-confirm').showModal());
  row.append(rev, rts, nw);
  wrap.append(row);
  body.append(wrap);
  $('btn-next').hidden = true;
}

/* ---------- Navegación ---------- */
function go(idx, opts) { S.idx = idx; showView('story'); render(opts); }
function goNext() {
  S.hist.push(S.idx);
  let i = S.idx + 1;
  while (i < BEATS.length - 1 && !visible(BEATS[i])) i++;
  go(Math.min(i, BEATS.length - 1));
}
function goPrev() {
  if (!S.hist.length) return;
  go(S.hist.pop());
}
function reviseDecision(cid) {
  const k = CHOICE_IDS.indexOf(cid);
  const complete = CHOICE_IDS.every((c) => S.d[c]);
  S.revisit = complete;
  S.hist.push(S.idx);
  go(CHOICE_IDX[cid]);
  void k;
}

/* ---------- Vistas ---------- */
function showView(name) {
  ['start', 'story', 'review'].forEach((v) => { $('view-' + v).hidden = v !== name; });
  document.body.dataset.view = name;
  if (name !== 'story') { voice.stop(); }
}

function openReview() {
  voice.stop();
  showView('review');
  const list = $('review-list'); list.innerHTML = '';
  CHAPTERS.forEach((c, i) => {
    const id = 'c' + (i + 1), cb = BEATS[CHOICE_IDX[id]], o = optionOf(cb, S.d[id]);
    const li = el('li', 'review-item');
    li.append(el('h3', null, `Capítulo ${c.n} · ${c.title}`));
    li.append(el('p', null, 'Tu elección: ' + (o ? o.label : 'sin decidir')));
    if (o) li.append(el('p', 'small', 'Qué pasó: ' + o.recap));
    const bt = el('button', 'btn', 'Volver a esta decisión'); bt.type = 'button';
    bt.addEventListener('click', () => reviseDecision(id));
    li.append(bt); list.append(li);
  });
  $('review-ending').textContent = 'Final actual: ' + ENDINGS[endingFor(S.d)].title + '.';
  $('review-title').focus({ preventScroll: true });
  window.scrollTo(0, 0);
}

/* ---------- Voz ---------- */
const vstatus = $('voice-status');
function speakCurrent() {
  if (!voice.supported) return;
  voice.speak(speechFor(S.idx));
}
function speakPersp(p) {
  if (!voice.supported) return;
  voice.speak([`Otra perspectiva. ${nameOf(p.who)} dice: ${val(p.text)}`]);
}
function updateVoiceUI(info = {}) {
  const st = voice.getState();
  const L = $('v-listen'), P = $('v-pause'), T = $('v-toggle');
  const dis = !voice.supported;
  [L, P, $('v-stop'), T].forEach((b) => { b.disabled = dis; });
  L.textContent = st.state === 'speaking' || spokenOnce ? '🔁 Repetir' : '🔊 Escuchar';
  P.textContent = st.state === 'paused' ? '▶ Reanudar' : '⏸ Pausar';
  P.disabled = dis || st.state === 'idle';
  T.textContent = S.narrOn ? '🔇 Desactivar narración' : '🔈 Activar narración';
  T.setAttribute('aria-pressed', String(S.narrOn));
  let msg = '';
  if (dis) msg = 'Tu navegador no ofrece lectura en voz alta. No pasa nada: la historia completa está escrita y podés seguir leyendo.';
  else if (st.failed) msg = 'No se pudo reproducir la voz en este dispositivo. Podés seguir leyendo el texto: la historia está completa. Probá con otro navegador o revisá que tenga una voz en español instalada.';
  else if (st.state === 'speaking') msg = 'Leyendo en voz alta…' + (st.voice ? ` (voz: ${st.voice.name})` : '');
  else if (st.state === 'paused') msg = 'Lectura en pausa.';
  else if (info.stopped) msg = 'Lectura detenida. Podés volver a escuchar con “Escuchar”.';
  else if (info.done) msg = 'Lectura terminada. Continuá cuando quieras.';
  else if (S.narrOn) msg = 'Narración activada.' + (st.voice ? ` Voz: ${st.voice.name}.` : '');
  else msg = 'Narración desactivada. Podés escuchar esta escena cuando quieras con “Escuchar”.';
  if (!dis && !st.failed && S.narrOn && !st.voice && st.hasVoices) msg += ' No se encontró una voz en español: se usa la predeterminada del dispositivo.';
  vstatus.textContent = msg;
  const sm = $('start-voice-msg');
  if (dis) { sm.hidden = false; sm.textContent = 'Este navegador no tiene lectura en voz alta. Podés jugar igual: todo el contenido está escrito.'; } else if (st.failed) { sm.hidden = false; sm.textContent = 'La voz falló en este dispositivo. Podés seguir con texto.'; } else sm.hidden = true;
}
let spokenOnce = false;
voice.onChange((info) => { if (info.state === 'speaking') spokenOnce = true; updateVoiceUI(info); });

function bindVoiceBar() {
  $('v-listen').addEventListener('click', () => { spokenOnce = true; speakCurrent(); });
  $('v-pause').addEventListener('click', () => { if (voice.getState().state === 'paused') voice.resume(); else voice.pause(); });
  $('v-stop').addEventListener('click', () => { voice.stop(); updateVoiceUI({ stopped: true }); });
  $('v-toggle').addEventListener('click', () => {
    S.narrOn = !S.narrOn;
    if (S.narrOn) speakCurrent(); else voice.stop();
    updateVoiceUI();
  });
  $('v-rate').addEventListener('change', (e) => { S.rate = parseFloat(e.target.value); voice.setRate(S.rate); save(); });
}

/* ---------- Diálogos ---------- */
function fillDialogs() {
  const rl = $('rights-list');
  Object.entries(RIGHTS).forEach(([k, r]) => {
    const s = el('section', 'right'); s.id = 'r-' + k;
    const h = el('h3', null, `${r.n}. ${r.t}`); s.append(h, el('p', null, r.p)); rl.append(s);
  });
  SOURCES.forEach((s) => { const li = el('li'); const a = el('a', null, s.t); a.href = s.u; a.target = '_blank'; a.rel = 'noopener noreferrer'; li.append(a); $('sources-list').append(li); });
  const cl = $('chars-list');
  Object.values(CHARACTERS).forEach((c) => {
    const li = el('li', 'char-card');
    li.append(el('h3', null, `${c.name}, ${c.age}`), el('p', 'role', c.role), el('p', null, c.bio)); cl.append(li);
  });
  document.querySelectorAll('dialog').forEach((d) => {
    d.addEventListener('click', (e) => { if (e.target === d || e.target.closest('[data-close]')) d.close(); });
  });
}
function openRights(k) {
  $('dlg-rights').showModal();
  if (k) { const t = $('r-' + k); if (t) t.scrollIntoView({ block: 'start' }); } else $('dlg-rights').querySelector('.dlg-in').scrollTop = 0;
}
function openChapters() {
  const ol = $('chapters-list'); ol.innerHTML = '';
  CHAPTERS.forEach((c, i) => {
    const li = el('li'); const bt = el('button', 'btn', `Capítulo ${c.n}. ${c.title}`); bt.type = 'button';
    const reached = S.started && S.maxIdx >= TITLE_IDX[i];
    bt.disabled = !reached;
    if (!reached) bt.append(el('small', null, ' (todavía no lo viste)'));
    bt.addEventListener('click', () => { $('dlg-chapters').close(); S.revisit = false; S.hist.push(S.idx); go(TITLE_IDX[i]); });
    li.append(bt); ol.append(li);
  });
  $('dlg-chapters').showModal();
}

/* ---------- Tamaño del texto ---------- */
function applyScale() { document.documentElement.style.fontSize = (SCALES[S.scale] * 100) + '%'; $('btn-smaller').disabled = S.scale === 0; $('btn-bigger').disabled = S.scale === SCALES.length - 1; if (!$('gl-host').hidden && g3.api) g3.api.resize(); }

/* ---------- Inicio ---------- */
function startGame(narr, fresh) {
  const mode = document.querySelector('input[name="mode"]:checked').value;
  if (fresh) { S.d = {}; S.idx = 0; S.maxIdx = 0; S.revisit = false; S.mode = mode; }
  S.hist = []; S.started = true; S.narrOn = narr && voice.supported;
  if (narr) spokenOnce = true;
  voice.setRate(S.rate);
  go(S.idx, { noScroll: false });
  updateVoiceUI();
}

function resetAll() {
  voice.stop(); clearSave();
  Object.assign(S, { idx: 0, d: {}, maxIdx: 0, started: false, revisit: false, narrOn: false, hist: [] });
  curBg = null; $('chars').innerHTML = ''; hide3D();
  showView('start'); showResume(); updateVoiceUI();
  window.scrollTo(0, 0);
}

function showResume() {
  const saved = load();
  const ok = saved && saved.started && Number.isInteger(saved.idx) && saved.idx > 0 && saved.idx < BEATS.length;
  $('resume-box').hidden = !ok;
  if (ok) {
    const c = BEATS[saved.idx].ch;
    $('resume-info').textContent = `Capítulo ${c + 1}: ${CHAPTERS[c].title}. Modo ${saved.mode === 'group' ? 'grupal' : 'individual'}.`;
  }
  $('new-box').querySelectorAll('button').forEach((b) => { b.disabled = false; });
}

function init() {
  voice.init();
  fillDialogs();
  bindVoiceBar();
  const saved = load();
  if (saved) {
    S.scale = Math.min(SCALES.length - 1, Math.max(0, saved.scale | 0));
    S.rate = [0.8, 1, 1.2].includes(saved.rate) ? saved.rate : 1;
    $('v-rate').value = String(S.rate);
  } else S.scale = 0;
  applyScale();
  $('start-art').innerHTML = bgSVG('plaza') + `<div class="start-chars">${['lucia', 'moncho', 'abril', 'nelida', 'gabriel'].map((c) => `<div class="start-char">${charSVG(c)}</div>`).join('')}</div>`;
  showView('start'); showResume(); updateVoiceUI();

  $('start-narr').addEventListener('click', () => startGame(true, true));
  $('start-text').addEventListener('click', () => startGame(false, true));
  const restore = (narr) => {
    const sv = load();
    if (!sv) return startGame(narr, true);
    S.d = sv.d && typeof sv.d === 'object' ? sv.d : {};
    S.idx = sv.idx; S.maxIdx = sv.maxIdx || sv.idx; S.mode = sv.mode === 'group' ? 'group' : 'solo'; S.revisit = !!sv.revisit;
    startGame(narr, false);
  };
  $('resume-narr').addEventListener('click', () => restore(true));
  $('resume-text').addEventListener('click', () => restore(false));
  $('resume-new').addEventListener('click', () => { clearSave(); $('resume-box').hidden = true; });

  $('btn-next').addEventListener('click', goNext);
  $('btn-prev').addEventListener('click', goPrev);
  $('btn-persp').addEventListener('click', () => {
    const p = perspFor(S.idx); if (!p) return;
    const box = $('persp-box'); box.hidden = false; box.innerHTML = '';
    box.append(el('h3', null, 'Otra perspectiva: ' + CHARACTERS[p.who].name), el('p', null, '“' + val(p.text) + '”'));
    $('btn-persp').setAttribute('aria-expanded', 'true');
    const rd = el('button', 'btn btn-small', '🔊 Leer esta perspectiva'); rd.type = 'button'; rd.addEventListener('click', () => speakPersp(p)); box.append(rd);
    if (S.narrOn) speakPersp(p);
    box.tabIndex = -1; box.focus({ preventScroll: true });
  });
  $('btn-print').addEventListener('click', () => {
    const sp = $('small-print'); sp.hidden = !sp.hidden;
    sp.textContent = 'Letra chica del afiche, transcripta: ' + FLYER_SMALL_PRINT;
  });
  $('btn-chapters').addEventListener('click', openChapters);
  $('btn-chars').addEventListener('click', () => $('dlg-chars').showModal());
  $('btn-rights').addEventListener('click', () => openRights());
  $('btn-reset').addEventListener('click', () => $('dlg-confirm').showModal());
  $('confirm-yes').addEventListener('click', () => { $('dlg-confirm').close(); resetAll(); });
  $('btn-smaller').addEventListener('click', () => { S.scale = Math.max(0, S.scale - 1); applyScale(); save(); });
  $('btn-bigger').addEventListener('click', () => { S.scale = Math.min(SCALES.length - 1, S.scale + 1); applyScale(); save(); });
  $('review-back').addEventListener('click', () => { S.revisit = false; go(BEATS.length - 1); });
  $('review-rights').addEventListener('click', () => openRights());

  $('c3-left').addEventListener('click', () => g3.api && g3.api.left());
  $('c3-right').addEventListener('click', () => g3.api && g3.api.right());
  $('c3-in').addEventListener('click', () => g3.api && g3.api.zoomIn());
  $('c3-out').addEventListener('click', () => g3.api && g3.api.zoomOut());
  $('c3-reset').addEventListener('click', () => g3.api && g3.api.reset());
  $('c3-toggle').addEventListener('click', () => { g3.before = !g3.before; refresh3D(); });
  $('c3-mode').addEventListener('click', () => { g3.simple = !g3.simple; refresh3D(); });
  $('gl-host').addEventListener('keydown', (e) => {
    if (!g3.api) return;
    const m = { ArrowLeft: 'left', ArrowRight: 'right', '+': 'zoomIn', '=': 'zoomIn', '-': 'zoomOut' }[e.key];
    if (m) { e.preventDefault(); g3.api[m](); }
  });
  $('gl-host').tabIndex = 0;
  $('gl-host').setAttribute('aria-label', 'Escena 3D de la plaza y la entrada. Con las flechas izquierda y derecha girás la vista; con más y menos acercás o alejás.');
  window.addEventListener('pagehide', () => voice.stop());
  window.__enp = { S, BEATS, g3 };   // ayuda para pruebas manuales
}

init();
