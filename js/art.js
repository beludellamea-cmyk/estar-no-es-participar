/* Arte original del proyecto: personajes, escenarios y afiche, dibujados en SVG por código.
   No se usan fotos ni imágenes de terceros. */

const INK = '#1b1530';

/* ---------- Personajes ---------- */

const FACE = (skin, eyes = INK) => `
  <circle cx="100" cy="88" r="33" fill="${skin}" stroke="${INK}" stroke-width="3"/>
  <circle cx="88" cy="88" r="3.6" fill="${eyes}"/><circle cx="112" cy="88" r="3.6" fill="${eyes}"/>
  <path d="M91 103 Q100 111 109 103" fill="none" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>`;

const HAIR = {
  bun: (c) => `<circle cx="100" cy="46" r="13" fill="${c}" stroke="${INK}" stroke-width="3"/>
    <path d="M66 84 Q64 52 100 52 Q136 52 134 84 Q122 68 100 68 Q78 68 66 84Z" fill="${c}" stroke="${INK}" stroke-width="3"/>`,
  short: (c) => `<path d="M66 86 Q62 50 100 50 Q138 50 134 86 Q124 66 100 66 Q76 66 66 86Z" fill="${c}" stroke="${INK}" stroke-width="3"/>`,
  long: (c) => `<path d="M64 120 Q58 50 100 48 Q142 50 136 120 L124 120 Q128 76 100 66 Q72 76 76 120Z" fill="${c}" stroke="${INK}" stroke-width="3"/>`,
  curly: (c) => [[70, 66], [82, 54], [100, 50], [118, 54], [130, 66], [66, 82], [134, 82]]
    .map(([x, y]) => `<circle cx="${x}" cy="${y}" r="13" fill="${c}" stroke="${INK}" stroke-width="3"/>`).join('')
    + `<path d="M74 80 Q100 62 126 80 L126 74 Q100 58 74 74Z" fill="${c}"/>`,
  cap: (c, c2 = '#e0583a') => `<path d="M66 82 Q64 48 100 48 Q136 48 134 82Z" fill="${c2}" stroke="${INK}" stroke-width="3"/>
    <path d="M104 78 L152 80 Q150 90 104 86Z" fill="${c2}" stroke="${INK}" stroke-width="3"/>
    <path d="M68 86 Q66 80 70 76 L74 90Z" fill="${c}"/>`,
  white: (c) => `<path d="M64 90 Q56 46 100 46 Q144 46 136 90 Q126 62 100 62 Q74 62 64 90Z" fill="${c}" stroke="${INK}" stroke-width="3"/>
    <circle cx="66" cy="80" r="9" fill="${c}" stroke="${INK}" stroke-width="3"/><circle cx="134" cy="80" r="9" fill="${c}" stroke="${INK}" stroke-width="3"/>`,
};

function standingBody(p, arms) {
  return `
  <ellipse cx="100" cy="368" rx="52" ry="8" fill="rgba(0,0,0,.28)"/>
  <rect x="76" y="226" width="22" height="132" rx="9" fill="${p.pants}" stroke="${INK}" stroke-width="3"/>
  <rect x="102" y="226" width="22" height="132" rx="9" fill="${p.pants}" stroke="${INK}" stroke-width="3"/>
  <ellipse cx="84" cy="360" rx="17" ry="8" fill="${INK}"/><ellipse cx="116" cy="360" rx="17" ry="8" fill="${INK}"/>
  ${arms}
  <path d="M62 142 Q62 120 84 118 L116 118 Q138 120 138 142 L144 244 L56 244Z" fill="${p.shirt}" stroke="${INK}" stroke-width="3"/>
  ${p.shirtDetail || ''}
  <rect x="90" y="108" width="20" height="16" fill="${p.skin}" stroke="${INK}" stroke-width="3"/>`;
}

const armsRelaxed = (p) => `
  <rect x="40" y="128" width="20" height="104" rx="10" fill="${p.shirt}" stroke="${INK}" stroke-width="3" transform="rotate(6 50 128)"/>
  <rect x="140" y="128" width="20" height="104" rx="10" fill="${p.shirt}" stroke="${INK}" stroke-width="3" transform="rotate(-6 150 128)"/>
  <circle cx="44" cy="238" r="11" fill="${p.skin}" stroke="${INK}" stroke-width="3"/><circle cx="156" cy="238" r="11" fill="${p.skin}" stroke="${INK}" stroke-width="3"/>`;

const SPECS = {
  lucia: { skin: '#e2a67d', hair: 'bun', hairC: '#2b1b3a', shirt: '#d6457f', pants: '#2c2c54',
    extra: () => `<rect x="58" y="150" width="24" height="46" rx="5" fill="#f4b942" stroke="${INK}" stroke-width="3"/>` },
  marcela: { skin: '#c98a62', hair: 'long', hairC: '#3b2316', shirt: '#2f6f8f', pants: '#1f2a44',
    shirtDetail: `<path d="M84 118 L100 160 L116 118Z" fill="#f7efe0" stroke="${INK}" stroke-width="3"/>`,
    extra: () => `<rect x="130" y="196" width="34" height="42" rx="3" fill="#f7efe0" stroke="${INK}" stroke-width="3" transform="rotate(8 147 217)"/>
      <path d="M136 208h22M136 216h22M136 224h16" stroke="${INK}" stroke-width="2.4"/>` },
  nelida: { skin: '#d9a07a', hair: 'white', hairC: '#e8e6ee', shirt: '#7a4aa8', pants: '#3a2f4a',
    shirtDetail: `<path d="M80 150h40M80 170h40M80 190h40M80 210h40" stroke="#c9a8e8" stroke-width="3"/>`,
    extra: () => `<g fill="none" stroke="${INK}" stroke-width="5"><circle cx="88" cy="88" r="12" fill="rgba(255,255,255,.35)"/><circle cx="112" cy="88" r="12" fill="rgba(255,255,255,.35)"/><path d="M100 88h0M76 86L68 82M124 86L132 82"/></g>
      <g transform="translate(150 190)"><circle cx="10" cy="-6" r="17" fill="rgba(180,230,255,.55)" stroke="${INK}" stroke-width="4"/><path d="M0 8L-14 34" stroke="${INK}" stroke-width="6" stroke-linecap="round"/></g>` },
  abril: { skin: '#b9784f', hair: 'curly', hairC: '#1d1228', shirt: '#2bb3a3', pants: '#3b3560',
    extra: () => `<g><rect x="64" y="150" width="72" height="54" rx="7" fill="#1b1530" stroke="#f7efe0" stroke-width="3"/>
      ${[0, 1, 2].map((r) => [0, 1, 2, 3].map((c) => `<rect x="${70 + c * 16}" y="${156 + r * 16}" width="12" height="12" rx="2" fill="${['#f4b942', '#e0583a', '#f7efe0', '#d6457f'][(r + c) % 4]}"/>`).join('')).join('')}
      </g><path d="M72 120 Q100 150 128 120" fill="none" stroke="#f4b942" stroke-width="4"/>` },
  gabriel: { skin: '#e0a88a', hair: 'short', hairC: '#111', shirt: '#e0583a', pants: '#26324a',
    shirtDetail: `<circle cx="100" cy="196" r="14" fill="#f4b942" stroke="${INK}" stroke-width="3"/><path d="M93 196h14M100 189v14" stroke="${INK}" stroke-width="2.4"/>`,
    arms: (p) => `
      <rect x="38" y="140" width="20" height="78" rx="10" fill="${p.shirt}" stroke="${INK}" stroke-width="3" transform="rotate(-38 48 140)"/>
      <rect x="142" y="140" width="20" height="78" rx="10" fill="${p.shirt}" stroke="${INK}" stroke-width="3" transform="rotate(38 152 140)"/>
      <circle cx="28" cy="196" r="13" fill="${p.skin}" stroke="${INK}" stroke-width="3"/><circle cx="172" cy="196" r="13" fill="${p.skin}" stroke="${INK}" stroke-width="3"/>
      <path d="M20 184l-6-10M26 182l-2-12M33 184l3-11" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>` },
  tadeo: { skin: '#c68a63', hair: 'short', hairC: '#4a2c14', shirt: '#f4b942', pants: '#1f3d2f',
    shirtDetail: `<text x="100" y="205" font-size="34" font-weight="900" text-anchor="middle" fill="${INK}" font-family="Arial">7</text>`,
    extra: () => '' },
};

function movedPerson(id) {
  const p = SPECS[id];
  const face = FACE(p.skin);
  const hair = HAIR[p.hair](p.hairC);
  const arms = p.arms ? p.arms(p) : armsRelaxed(p);
  return `<svg class="sprite" viewBox="0 0 200 380" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
    ${standingBody(p, arms)}${face}${hair}${p.extra ? p.extra() : ''}</svg>`;
}

function monchoSVG() {
  const skin = '#cf9569', shirt = '#3a7d44', pants = '#2a3550';
  return `<svg class="sprite" viewBox="0 0 200 380" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
  <ellipse cx="100" cy="368" rx="86" ry="8" fill="rgba(0,0,0,.28)"/>
  <circle cx="34" cy="318" r="50" fill="none" stroke="${INK}" stroke-width="9"/><circle cx="34" cy="318" r="40" fill="none" stroke="#8a8aa6" stroke-width="3"/>
  <circle cx="166" cy="318" r="50" fill="none" stroke="${INK}" stroke-width="9"/><circle cx="166" cy="318" r="40" fill="none" stroke="#8a8aa6" stroke-width="3"/>
  <circle cx="34" cy="318" r="7" fill="${INK}"/><circle cx="166" cy="318" r="7" fill="${INK}"/>
  <rect x="48" y="264" width="104" height="14" rx="6" fill="#3a3a52" stroke="${INK}" stroke-width="3"/>
  <rect x="80" y="276" width="20" height="66" rx="9" fill="${pants}" stroke="${INK}" stroke-width="3"/>
  <rect x="102" y="276" width="20" height="66" rx="9" fill="${pants}" stroke="${INK}" stroke-width="3"/>
  <ellipse cx="90" cy="346" rx="17" ry="8" fill="${INK}"/><ellipse cx="112" cy="346" rx="17" ry="8" fill="${INK}"/>
  <rect x="38" y="128" width="20" height="112" rx="10" fill="${shirt}" stroke="${INK}" stroke-width="3" transform="rotate(10 48 128)"/>
  <rect x="142" y="128" width="20" height="112" rx="10" fill="${shirt}" stroke="${INK}" stroke-width="3" transform="rotate(-10 152 128)"/>
  <path d="M62 142 Q62 120 84 118 L116 118 Q138 120 138 142 L142 272 L58 272Z" fill="${shirt}" stroke="${INK}" stroke-width="3"/>
  <rect x="70" y="170" width="30" height="16" rx="3" fill="#f7efe0" stroke="${INK}" stroke-width="2.5"/><path d="M75 178h20" stroke="${INK}" stroke-width="2.5"/>
  <circle cx="34" cy="246" r="11" fill="${skin}" stroke="${INK}" stroke-width="3"/><circle cx="166" cy="246" r="11" fill="${skin}" stroke="${INK}" stroke-width="3"/>
  <rect x="90" y="108" width="20" height="16" fill="${skin}" stroke="${INK}" stroke-width="3"/>
  ${FACE(skin)}
  <path d="M86 100 Q100 94 114 100" fill="none" stroke="#2b1b1b" stroke-width="4" stroke-linecap="round"/>
  ${HAIR.cap('#2b1b1b', '#e0b23a')}
  </svg>`;
}

export const CHAR_NAMES = {
  lucia: 'Lucía', marcela: 'Marcela', nelida: 'Nélida', abril: 'Abril', gabriel: 'Gabriel', tadeo: 'Tadeo', moncho: 'Moncho',
};

export function charSVG(id) {
  if (id === 'moncho') return monchoSVG();
  return movedPerson(id);
}

/* ---------- Escenarios ---------- */

const TREE = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})">
  <path d="M-18 0 Q-34 -90 -10 -190 L10 -190 Q34 -90 18 0Z" fill="#8c7a5a" stroke="#4a3c2a" stroke-width="3"/>
  ${[[-14, -120], [10, -90], [-8, -60], [14, -150], [-12, -160]].map(([a, b]) => `<path d="M${a} ${b}l5 -8l5 8z" fill="#4a3c2a"/>`).join('')}
  <ellipse cx="0" cy="-230" rx="130" ry="70" fill="#4f8f4a" stroke="#2f5a2c" stroke-width="3"/>
  <ellipse cx="-70" cy="-210" rx="70" ry="44" fill="#5ea555"/><ellipse cx="60" cy="-250" rx="70" ry="40" fill="#468640"/>
  <circle cx="-40" cy="-250" r="9" fill="#ee7fb0"/><circle cx="30" cy="-210" r="8" fill="#ee7fb0"/><circle cx="76" cy="-262" r="8" fill="#ee7fb0"/><circle cx="-92" cy="-218" r="7" fill="#ee7fb0"/>
</g>`;

const BUNTING = (x1, y1, x2, y2, n = 12) => {
  const cols = ['#f4b942', '#e0583a', '#2bb3a3', '#d6457f', '#f7efe0'];
  let out = `<path d="M${x1} ${y1} Q${(x1 + x2) / 2} ${(y1 + y2) / 2 + 60} ${x2} ${y2}" fill="none" stroke="#2b2145" stroke-width="3"/>`;
  for (let i = 1; i < n; i++) {
    const t = i / n;
    const x = x1 + (x2 - x1) * t;
    const y = (1 - t) * (1 - t) * y1 + 2 * (1 - t) * t * ((y1 + y2) / 2 + 60) + t * t * y2;
    out += `<path d="M${x - 16} ${y - 2} L${x + 16} ${y - 2} L${x} ${y + 36}Z" fill="${cols[i % 5]}" stroke="#2b2145" stroke-width="2"/>`;
  }
  return out;
};

const HOUSES = (y, fill) => [[0, 150, 190], [200, 210, 140], [430, 130, 220], [590, 190, 150], [800, 160, 200], [980, 220, 150], [1220, 140, 190], [1380, 200, 160]]
  .map(([x, w, h]) => `<rect x="${x}" y="${y - h}" width="${w}" height="${h}" fill="${fill}"/><rect x="${x + 20}" y="${y - h + 30}" width="30" height="40" fill="rgba(255,235,180,.5)"/>`).join('');

const BACKGROUNDS = {
  taller: (u) => `<svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
  <defs><linearGradient id="${u}w" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2d2250"/><stop offset="1" stop-color="#4a2f5e"/></linearGradient>
  <radialGradient id="${u}l" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#ffd37a" stop-opacity=".85"/><stop offset="1" stop-color="#ffd37a" stop-opacity="0"/></radialGradient></defs>
  <rect width="1600" height="900" fill="url(#${u}w)"/>
  <g class="far"><rect x="1050" y="120" width="380" height="330" rx="10" fill="#14284b" stroke="#f7efe0" stroke-width="8"/>
    <path d="M1240 120v330M1050 285h380" stroke="#f7efe0" stroke-width="6"/>
    <circle cx="1130" cy="200" r="26" fill="#f7efe0"/><path d="M1300 420v-90h30v90M1345 420v-130h30v130M1390 420v-70h30v70" fill="#26405f"/></g>
  <g class="mid">${[[170, 90], [420, 110], [680, 90]].map(([x, y]) => `<g><rect x="${x - 80}" y="${y + 40}" width="160" height="200" rx="6" fill="#f7efe0" stroke="${INK}" stroke-width="4" transform="rotate(${x % 5 - 2} ${x} ${y + 140})"/>
      <rect x="${x - 60}" y="${y + 60}" width="120" height="70" fill="${['#e0583a', '#2bb3a3', '#f4b942'][x % 3]}"/><path d="M${x - 60} ${y + 150}h120M${x - 60} ${y + 172}h90M${x - 60} ${y + 194}h100" stroke="${INK}" stroke-width="5"/></g>`).join('')}</g>
  <circle cx="400" cy="130" r="170" fill="url(#${u}l)"/><circle cx="1200" cy="90" r="150" fill="url(#${u}l)"/>
  <path d="M400 0v90M1200 0v60" stroke="#1b1530" stroke-width="4"/><circle cx="400" cy="110" r="20" fill="#ffd37a"/><circle cx="1200" cy="80" r="20" fill="#ffd37a"/>
  <rect y="690" width="1600" height="210" fill="#3a2744"/><rect y="690" width="1600" height="8" fill="#1b1530"/>
  <g><rect x="320" y="590" width="960" height="40" rx="8" fill="#a8693a" stroke="${INK}" stroke-width="5"/><rect x="360" y="630" width="26" height="150" fill="#7a4a28"/><rect x="1214" y="630" width="26" height="150" fill="#7a4a28"/>
  <rect x="960" y="500" width="190" height="92" rx="6" fill="#262626" stroke="${INK}" stroke-width="4"/><rect x="972" y="510" width="166" height="72" fill="#7fe0ff" opacity=".85"/><path d="M930 596h250l16 18h-282z" fill="#444"/>
  <circle cx="470" cy="570" r="24" fill="#e0583a"/><circle cx="520" cy="574" r="20" fill="#2bb3a3"/><rect x="560" y="556" width="26" height="36" fill="#f4b942" stroke="${INK}" stroke-width="3"/></g>
  </svg>`,

  plaza: (u) => `<svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
  <defs><linearGradient id="${u}s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4f9ccf"/><stop offset=".7" stop-color="#f6c98a"/><stop offset="1" stop-color="#f4a261"/></linearGradient></defs>
  <rect width="1600" height="900" fill="url(#${u}s)"/>
  <circle cx="1280" cy="200" r="80" fill="#fff3c4"/>
  <g class="far"><ellipse cx="260" cy="150" rx="140" ry="28" fill="#fff" opacity=".7"/><ellipse cx="720" cy="100" rx="110" ry="22" fill="#fff" opacity=".6"/><ellipse cx="1000" cy="190" rx="130" ry="24" fill="#fff" opacity=".55"/></g>
  <g class="far">${HOUSES(600, '#a85d4a')}</g>
  <g class="mid">${TREE(300, 700, 1.1)}${TREE(1320, 690, 0.9)}</g>
  ${BUNTING(120, 150, 1480, 190, 18)}
  <rect y="620" width="1600" height="280" fill="#b5532f"/><path d="M0 760 Q800 690 1600 760 L1600 900 L0 900Z" fill="#c8704a"/>
  <path d="M640 900 L760 640 L880 640 L1060 900Z" fill="#e8d3b0" opacity=".9"/>
  <g class="near"><rect x="80" y="760" width="220" height="16" rx="5" fill="#6b3f22" stroke="${INK}" stroke-width="3"/><rect x="100" y="776" width="12" height="40" fill="#6b3f22"/><rect x="270" y="776" width="12" height="40" fill="#6b3f22"/>
  <rect x="1300" y="770" width="220" height="16" rx="5" fill="#6b3f22" stroke="${INK}" stroke-width="3"/><rect x="1320" y="786" width="12" height="40" fill="#6b3f22"/><rect x="1490" y="786" width="12" height="40" fill="#6b3f22"/>
  <path d="M0 900 Q60 820 120 900Z M1500 900 Q1560 830 1600 900Z" fill="#3c7a3a"/></g>
  </svg>`,

  puesto: (u) => `<svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
  <defs><linearGradient id="${u}s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6cb3e0"/><stop offset="1" stop-color="#f7d49a"/></linearGradient></defs>
  <rect width="1600" height="900" fill="url(#${u}s)"/>
  <g class="far">${HOUSES(620, '#9a5a7a')}</g>
  <g class="mid">${TREE(1400, 700, 1)}</g>
  <rect y="640" width="1600" height="260" fill="#c8704a"/>
  <g>${Array.from({ length: 10 }, (_, i) => `<path d="M${200 + i * 120} 60 L${260 + i * 120} 60 L${300 + i * 120} 250 L${160 + i * 120} 250Z" fill="${i % 2 ? '#f7efe0' : '#2bb3a3'}" stroke="${INK}" stroke-width="3"/>`).join('')}
  <path d="M160 250 Q700 330 1360 250" fill="none" stroke="${INK}" stroke-width="6"/>
  <path d="M170 250l-10 600M1350 250l10 600" stroke="#6b3f22" stroke-width="14"/></g>
  <rect x="300" y="620" width="1000" height="40" rx="8" fill="#a8693a" stroke="${INK}" stroke-width="5"/><rect x="330" y="660" width="24" height="200" fill="#7a4a28"/><rect x="1246" y="660" width="24" height="200" fill="#7a4a28"/>
  <g>${Array.from({ length: 14 }, (_, i) => {
    const x = 340 + (i % 7) * 130, y = 540 + Math.floor(i / 7) * 0;
    const c = ['#f4b942', '#e0583a', '#2bb3a3', '#d6457f', '#7a4aa8'][i % 5];
    return `<g transform="translate(${x} ${y - (i % 2) * 18})"><rect width="92" height="78" rx="14" fill="#f7efe0" stroke="${INK}" stroke-width="4"/><path d="M14 52 Q46 8 78 40 L60 58 Q46 36 30 62Z" fill="${c}" stroke="${INK}" stroke-width="3"/><circle cx="62" cy="30" r="4" fill="${INK}"/></g>`;
  }).join('')}</g>
  <g class="near"><path d="M0 900 Q60 820 120 900Z M1480 900 Q1540 820 1600 900Z" fill="#3c7a3a"/></g>
  </svg>`,

  salon: (u) => `<svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
  <defs><linearGradient id="${u}w" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e8b95a"/><stop offset="1" stop-color="#c9823e"/></linearGradient></defs>
  <rect width="1600" height="900" fill="url(#${u}w)"/>
  <g class="far"><rect x="90" y="110" width="260" height="300" fill="#8fd0e8" stroke="${INK}" stroke-width="8"/><path d="M220 110v300M90 260h260" stroke="${INK}" stroke-width="6"/>
  <rect x="1250" y="110" width="260" height="300" fill="#8fd0e8" stroke="${INK}" stroke-width="8"/><path d="M1380 110v300M1250 260h260" stroke="${INK}" stroke-width="6"/></g>
  ${BUNTING(0, 80, 1600, 90, 22)}
  <g class="mid"><rect x="560" y="140" width="480" height="150" rx="8" fill="#f7efe0" stroke="${INK}" stroke-width="6"/>
  <text x="800" y="190" font-size="30" font-weight="800" text-anchor="middle" fill="${INK}" font-family="Arial, sans-serif">MURO DE VOCES</text>
  <text x="800" y="228" font-size="19" text-anchor="middle" fill="${INK}" font-family="Arial, sans-serif">Pasá al micrófono. Un minuto.</text>
  <text x="800" y="258" font-size="19" text-anchor="middle" fill="${INK}" font-family="Arial, sans-serif">Contá qué querés de tu barrio.</text></g>
  <rect y="650" width="1600" height="250" fill="#7a4a28"/>${Array.from({ length: 12 }, (_, i) => `<path d="M${i * 140} 650L${i * 140 - 60} 900" stroke="#5e3718" stroke-width="3"/>`).join('')}
  <g><rect x="1000" y="540" width="520" height="110" fill="#5e3718" stroke="${INK}" stroke-width="5"/><rect x="1000" y="540" width="520" height="22" fill="#a8693a"/>
  <rect x="940" y="600" width="60" height="50" fill="#6e4222" stroke="${INK}" stroke-width="4"/><rect x="880" y="625" width="60" height="25" fill="#6e4222" stroke="${INK}" stroke-width="4"/>
  <path d="M1260 540v-170" stroke="${INK}" stroke-width="7"/><rect x="1246" y="340" width="28" height="48" rx="12" fill="#444" stroke="${INK}" stroke-width="4"/></g>
  <g class="near">${[0, 1, 2, 3].map((i) => `<g transform="translate(${60 + i * 150} 780)"><rect width="100" height="14" rx="4" fill="#2b2145"/><rect x="8" y="14" width="10" height="70" fill="#2b2145"/><rect x="82" y="14" width="10" height="70" fill="#2b2145"/></g>`).join('')}</g>
  </svg>`,

  cierre: (u) => `<svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
  <defs><linearGradient id="${u}s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3a2a6a"/><stop offset=".55" stop-color="#d6457f"/><stop offset="1" stop-color="#f4a261"/></linearGradient></defs>
  <rect width="1600" height="900" fill="url(#${u}s)"/>
  <circle cx="800" cy="560" r="130" fill="#ffd37a"/>
  <g class="far">${HOUSES(640, '#3a2350')}</g>
  <g class="mid">${TREE(260, 720, 1.2)}${TREE(1360, 710, 1)}</g>
  <rect y="650" width="1600" height="250" fill="#7a3a3a"/><path d="M0 760 Q800 700 1600 770 L1600 900 L0 900Z" fill="#8f4a40"/>
  <g><rect x="500" y="690" width="600" height="30" rx="8" fill="#a8693a" stroke="${INK}" stroke-width="5"/><rect x="540" y="720" width="22" height="120" fill="#7a4a28"/><rect x="1038" y="720" width="22" height="120" fill="#7a4a28"/>
  <circle cx="640" cy="676" r="14" fill="#f7efe0"/><circle cx="700" cy="680" r="12" fill="#f4b942"/><rect x="900" y="650" width="70" height="40" rx="6" fill="#2bb3a3" stroke="${INK}" stroke-width="3"/></g>
  <path d="M120 100 L120 640" stroke="${INK}" stroke-width="8"/><circle cx="120" cy="96" r="22" fill="#ffd37a" stroke="${INK}" stroke-width="4"/>
  </svg>`,
};

let uid = 0;
export function bgSVG(name) {
  const f = BACKGROUNDS[name] || BACKGROUNDS.plaza;
  uid += 1;
  return f('b' + uid);
}

/* ---------- Afiche (capítulo 1) ---------- */

export const FLYER_SMALL_PRINT = 'Sábado, 16 h · Salón de la Comisión Vecinal, frente a la plaza, El Colorado · Música, feria de oficios y Muro de voces · Entrada libre y gratuita · Para participar, escribí al grupo de WhatsApp.';

export function flyerSVG(accessible = false) {
  const title = `<rect width="600" height="800" fill="#2b1f5e"/>
    <circle cx="470" cy="150" r="120" fill="#f4b942"/><circle cx="130" cy="640" r="150" fill="#d6457f"/>
    <path d="M0 520 Q150 440 300 520 T600 520 V800 H0Z" fill="#e0583a"/>
    <path d="M0 600 Q150 540 300 600 T600 600 V800 H0Z" fill="#2bb3a3"/>`;
  if (!accessible) {
    return `<svg viewBox="0 0 600 800" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Afiche de la jornada: una sola imagen, con título grande y letra muy pequeña con los datos.">
      ${title}
      <text x="300" y="250" font-size="92" font-weight="900" text-anchor="middle" fill="#f7efe0" font-family="Arial Black, Arial, sans-serif">EL BARRIO</text>
      <text x="300" y="350" font-size="92" font-weight="900" text-anchor="middle" fill="#f4b942" font-family="Arial Black, Arial, sans-serif">SUENA</text>
      <text x="300" y="400" font-size="26" text-anchor="middle" fill="#f7efe0" font-family="Arial, sans-serif">Jornada comunitaria · Mes de la Inclusión</text>
      <text x="300" y="740" font-size="8.5" text-anchor="middle" fill="#f7efe0" font-family="Arial, sans-serif">${FLYER_SMALL_PRINT.slice(0, 74)}</text>
      <text x="300" y="754" font-size="8.5" text-anchor="middle" fill="#f7efe0" font-family="Arial, sans-serif">${FLYER_SMALL_PRINT.slice(75, 150)}</text>
      <text x="300" y="768" font-size="8.5" text-anchor="middle" fill="#f7efe0" font-family="Arial, sans-serif">${FLYER_SMALL_PRINT.slice(150)}</text>
    </svg>`;
  }
  return `<svg viewBox="0 0 600 800" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Afiche con letra grande y datos claros: sábado a las 16 h, salón de la comisión vecinal, información de acceso.">
    <rect width="600" height="800" fill="#15122a"/>
    <text x="300" y="120" font-size="64" font-weight="900" text-anchor="middle" fill="#f4b942" font-family="Arial Black, Arial, sans-serif">EL BARRIO SUENA</text>
    <g font-family="Arial, sans-serif" font-weight="700" fill="#ffffff" font-size="40">
      <text x="40" y="220">Sábado · 16 h</text>
      <text x="40" y="290">Salón de la Comisión</text>
      <text x="40" y="340">Vecinal, frente a la plaza</text>
      <text x="40" y="420" fill="#f4b942">Acceso:</text>
      <text x="40" y="470" font-size="34">entrada con escalones;</text>
      <text x="40" y="515" font-size="34">consultanos el recorrido</text>
      <text x="40" y="560" font-size="34">accesible. Habrá pausas.</text>
      <text x="40" y="650" font-size="32">Audio y texto en el grupo</text>
      <text x="40" y="690" font-size="32">de WhatsApp. Entrada libre.</text>
    </g></svg>`;
}
