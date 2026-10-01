/* Lectura en voz alta con la SpeechSynthesis del navegador.
   - Nunca arranca sin una acción explícita del usuario (la decide app.js).
   - Cada lectura nueva cancela la anterior (sin voces superpuestas).
   - Pausar/reanudar se resuelve por fragmentos, porque pause() nativo no es fiable en todos los navegadores.
   - Si no hay síntesis o falla, avisa y la historia sigue completa en texto. */

const synth = typeof window !== 'undefined' && 'speechSynthesis' in window ? window.speechSynthesis : null;
const Utter = typeof window !== 'undefined' ? window.SpeechSynthesisUtterance : null;

export const supported = !!(synth && Utter);

let voices = [];
let chosen = null;
let token = 0;           // cambia con cada cancelación
let chunks = [];
let pos = 0;
let state = 'idle';      // idle | speaking | paused
let rate = 1;
let failed = false;
let startTimer = null;
const listeners = new Set();

export function onChange(fn) { listeners.add(fn); return () => listeners.delete(fn); }
function emit(extra = {}) { listeners.forEach((fn) => fn({ state, failed, voice: chosen, supported, ...extra })); }

function langOf(v) { return (v.lang || '').replace('_', '-').toLowerCase(); }

function pickVoice() {
  if (!voices.length) { chosen = null; return; }
  const es = voices.filter((v) => langOf(v).startsWith('es'));
  const rank = (v) => {
    const l = langOf(v);
    let s = 0;
    if (l === 'es-ar') s += 100;
    else if (l === 'es-419' || l === 'es-us' || l === 'es-mx') s += 60;
    else s += 30;
    if (/google|natural|online|neural/i.test(v.name)) s += 5;
    if (v.localService) s += 2;
    return s;
  };
  es.sort((a, b) => rank(b) - rank(a));
  chosen = es[0] || null;
}

function loadVoices() {
  if (!synth) return;
  try { voices = synth.getVoices() || []; } catch (e) { voices = []; }
  pickVoice();
  emit();
}

export function init() {
  if (!supported) { emit(); return; }
  loadVoices();
  try { synth.addEventListener('voiceschanged', loadVoices); } catch (e) { synth.onvoiceschanged = loadVoices; }
  // Algunos navegadores cargan las voces de forma tardía y sin evento: reintentos acotados.
  let tries = 0;
  const t = setInterval(() => {
    tries += 1;
    if (voices.length || tries > 10) { clearInterval(t); return; }
    loadVoices();
  }, 500);
}

export function setRate(r) { rate = r; }
export function getState() { return { state, failed, voice: chosen, supported, hasVoices: voices.length > 0 }; }

/* Divide en fragmentos cortos (evita el corte de lecturas largas de Chrome). */
function split(text) {
  const out = [];
  String(text).replace(/\s+/g, ' ').trim().split(/(?<=[.!?…:])\s+/).forEach((s) => {
    let rest = s;
    while (rest.length > 180) {
      let cut = rest.lastIndexOf(', ', 180);
      if (cut < 60) cut = rest.lastIndexOf(' ', 180);
      if (cut < 1) cut = 180;
      out.push(rest.slice(0, cut + 1).trim());
      rest = rest.slice(cut + 1);
    }
    if (rest.trim()) out.push(rest.trim());
  });
  return out;
}

function fail(reason) {
  failed = true;
  state = 'idle';
  try { synth.cancel(); } catch (e) { /* nada */ }
  emit({ reason });
}

function next(myToken) {
  if (myToken !== token) return;
  if (pos >= chunks.length) { state = 'idle'; emit({ done: true }); return; }
  const u = new Utter(chunks[pos]);
  u.lang = chosen ? chosen.lang : 'es-AR';
  if (chosen) u.voice = chosen;
  u.rate = rate;
  u.pitch = 1;
  let started = false;
  u.onstart = () => { started = true; clearTimeout(startTimer); };
  u.onend = () => { if (myToken !== token) return; pos += 1; next(myToken); };
  u.onerror = (e) => {
    if (myToken !== token) return;
    if (e && (e.error === 'interrupted' || e.error === 'canceled')) return;
    fail(e && e.error ? e.error : 'error');
  };
  clearTimeout(startTimer);
  // Si en 6 s no empezó nada, asumimos que no hay voz utilizable.
  startTimer = setTimeout(() => { if (!started && myToken === token && state === 'speaking') fail('timeout'); }, 6000);
  try { synth.speak(u); } catch (e) { fail('exception'); }
}

/* Lee una lista de textos (o uno solo). Cancela lo anterior. */
export function speak(parts) {
  if (!supported) { emit({ reason: 'unsupported' }); return false; }
  cancel(true);
  const list = Array.isArray(parts) ? parts : [parts];
  chunks = list.flatMap(split);
  pos = 0;
  if (!chunks.length) return false;
  failed = false;
  state = 'speaking';
  emit();
  const my = ++token;
  setTimeout(() => next(my), 60); // pausa breve: Chrome pierde el speak() inmediato tras cancel()
  return true;
}

export function cancel(silent) {
  token += 1;
  clearTimeout(startTimer);
  if (synth) { try { synth.cancel(); } catch (e) { /* nada */ } }
  if (state !== 'idle') { state = 'idle'; if (!silent) emit(); }
}

export function stop() { cancel(false); chunks = []; pos = 0; }

export function pause() {
  if (state !== 'speaking') return;
  token += 1;
  clearTimeout(startTimer);
  try { synth.cancel(); } catch (e) { /* nada */ }
  state = 'paused';
  emit();
}

export function resume() {
  if (state !== 'paused') return;
  state = 'speaking';
  emit();
  const my = ++token;
  setTimeout(() => next(my), 60);
}

export function isSpeaking() { return state === 'speaking'; }
