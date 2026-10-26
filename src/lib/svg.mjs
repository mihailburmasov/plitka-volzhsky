// Схемы и иконки. Цвета берутся из CSS-переменных, поэтому схемы работают на светлом и тёмном фоне.

// Внешний угол: пластиковый уголок против запила 45° (вид сверху, разрез) — две схемы рядом, на телефоне друг под другом
const miterOne = (id, title, desc, head, accentHead, shape, notes) => `<svg class="diagram" viewBox="0 0 300 300" role="img" aria-labelledby="${id}-t ${id}-d">
<title id="${id}-t">${title}</title><desc id="${id}-d">${desc}</desc>
<text x="20" y="30" font-family="PT Sans, Arial, sans-serif" font-size="17" font-weight="700" fill="${accentHead ? 'var(--d-accent)' : 'var(--d-ink)'}">${head}</text>
<g transform="translate(20 56)"><rect x="0" y="0" width="210" height="170" fill="var(--d-wall)"/>${shape}</g>
<g font-family="PT Sans, Arial, sans-serif" font-size="15" fill="var(--d-muted)">${notes.map((n, i) => `<text x="20" y="${258 + i * 20}">${n}</text>`).join('')}</g>
</svg>`;
export const miterCompare = `<div class="diagram-pair">${miterOne('mc1', 'Внешний угол с пластиковым уголком', 'Торцы плитки закрыты пластиковым профилем, полоска пластика видна на углу.', 'С пластиковым уголком', false,
  '<rect x="0" y="0" width="194" height="16" fill="var(--d-tile)" stroke="var(--d-line)"/><rect x="194" y="16" width="16" height="154" fill="var(--d-tile)" stroke="var(--d-line)"/><path d="M190 -4 h28 v28 h-8 v-20 h-20z" fill="var(--d-plastic)" stroke="var(--d-line)"/>',
  ['Торцы прячет профиль, угол толще,', 'полоска пластика видна всегда'])}${miterOne('mc2', 'Внешний угол с запилом под 45°', 'Кромки двух плиток срезаны под 45° и сходятся в тонкий ровный угол без накладок.', 'Запил под 45°', true,
  '<path d="M0 0 H226 L210 16 H0 Z" fill="var(--d-tile)" stroke="var(--d-line)"/><path d="M226 0 V170 H210 V16 Z" fill="var(--d-tile)" stroke="var(--d-line)"/><path d="M226 0 L210 16" stroke="var(--d-accent)" stroke-width="3"/><circle cx="226" cy="0" r="22" fill="none" stroke="var(--d-accent)" stroke-dasharray="4 4"/><text x="236" y="42" font-family="PT Sans, Arial, sans-serif" font-size="16" font-weight="700" fill="var(--d-accent)">45°</text>',
  ['Кромки срезаны под 45° и сходятся', 'в тонкий угол без накладок'])}</div>`;

// Ниша в стене / коробе (вид спереди)
export const nicheDiagram = `<svg class="diagram" viewBox="0 0 420 340" role="img" aria-labelledby="nd-t nd-d">
<title id="nd-t">Ниша из плитки в душевой зоне</title>
<desc id="nd-d">Стена в плитке с утопленной нишей. Швы ниши совпадают со швами стены, наружные кромки ниши — с запилом под 45°, полка внутри с уклоном для стока воды.</desc>
<defs><pattern id="nd-g" width="70" height="70" patternUnits="userSpaceOnUse"><rect width="70" height="70" fill="var(--d-tile)"/><path d="M70 0V70H0" fill="none" stroke="var(--d-line)" stroke-width="2"/></pattern></defs>
<rect x="10" y="10" width="400" height="320" fill="url(#nd-g)"/>
<rect x="150" y="80" width="140" height="140" fill="var(--d-wall)" stroke="var(--d-accent)" stroke-width="3"/>
<path d="M150 80 l12 12 h116 l12 -12 M150 220 l12 -12 h116 l12 12 M162 92 v116 M278 92 v116" fill="none" stroke="var(--d-line)" stroke-width="2"/>
<path d="M162 150 h116" stroke="var(--d-line)" stroke-width="2"/>
<g font-family="PT Sans, Arial, sans-serif" font-size="14" fill="var(--d-ink)">
  <path d="M290 82 h10" stroke="var(--d-accent)"/><text x="304" y="87">кромки —</text><text x="304" y="105">запил 45°</text>
  <path d="M150 210 l-60 40" stroke="var(--d-accent)"/><text x="22" y="270">дно с уклоном</text><text x="22" y="288">к краю — вода не стоит</text>
  <path d="M220 80 v-46" stroke="var(--d-accent)" stroke-dasharray="4 4"/><text x="140" y="28">швы ниши = швы стены</text>
</g>
</svg>`;

// Скрытый (невидимый) люк под плитку
export const hatchDiagram = `<svg class="diagram" viewBox="0 0 420 300" role="img" aria-labelledby="hd-t hd-d">
<title id="hd-t">Скрытый люк под плитку</title>
<desc id="hd-d">Стена в плитке, в которой ревизионный люк облицован той же плиткой: видны только тонкие швы по контуру, рисунок не прерывается.</desc>
<defs><pattern id="hd-g" width="60" height="120" patternUnits="userSpaceOnUse"><rect width="60" height="120" fill="var(--d-tile)"/><path d="M60 0V120H0" fill="none" stroke="var(--d-line)" stroke-width="2"/></pattern></defs>
<rect x="10" y="10" width="400" height="280" fill="url(#hd-g)"/>
<rect x="130" y="130" width="120" height="120" fill="none" stroke="var(--d-accent)" stroke-width="3" stroke-dasharray="8 6"/>
<circle cx="236" cy="190" r="5" fill="var(--d-accent)"/>
<g font-family="PT Sans, Arial, sans-serif" font-size="14" fill="var(--d-ink)">
  <path d="M250 140 l60 -60" stroke="var(--d-accent)"/><text x="262" y="70">дверца в той же плитке,</text><text x="262" y="88">контур = обычный шов</text>
  <path d="M236 195 l40 60" stroke="var(--d-accent)"/><text x="250" y="276">нажимной замок</text>
</g>
</svg>`;

// Иконки (24×24, обводка currentColor)
const ic = d => `<svg class="ico" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`;
export const icons = {
  tile: ic('<path d="M3 3h8v8H3zM13 3h8v8h-8zM3 13h8v8H3zM13 13h5l3 3v5h-8z"/>'),
  miter: ic('<path d="M4 20V4h16"/><path d="M8 20V8h12"/><path d="M4 4l4 4"/>'),
  niche: ic('<rect x="3" y="3" width="18" height="18"/><rect x="7" y="7" width="10" height="10"/><path d="M7 12h10"/>'),
  counter: ic('<path d="M2 9h20v3H2zM4 12v9M20 12v9M7 3h10v6H7z"/>'),
  bath: ic('<path d="M3 12h18v3a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5z"/><path d="M6 12V5a2 2 0 0 1 4 0"/><path d="M7 20l-1 2M17 20l1 2"/>'),
  tools: ic('<path d="M14 7l3-3 3 3-3 3M17 10l-9 9-4 1 1-4 9-9"/>'),
  bolt: ic('<path d="M13 2L4 14h7l-1 8 9-12h-7z"/>'),
  pipe: ic('<path d="M3 7h9a4 4 0 0 1 4 4v10M8 4v6M20 17h-8"/>'),
  board: ic('<path d="M4 3h12l4 4v14H4z"/><path d="M8 3v18M12 3v18"/>'),
  hatch: ic('<rect x="3" y="3" width="18" height="18"/><rect x="7" y="7" width="10" height="10" stroke-dasharray="2 2"/><circle cx="15" cy="12" r=".8" fill="currentColor"/>'),
  hammer: ic('<path d="M14 4l6 6-3 3-6-6zM11 7l-8 8 3 3 8-8"/>'),
  level: ic('<rect x="2" y="9" width="20" height="6" rx="1"/><circle cx="12" cy="12" r="1.5"/><path d="M6 9v6M18 9v6"/>'),
  check: ic('<path d="M4 12l5 5L20 6"/>'),
  arrow: ic('<path d="M5 12h14M13 6l6 6-6 6"/>'),
};
