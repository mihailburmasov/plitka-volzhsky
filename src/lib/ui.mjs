// Общие части сайта: layout, шапка, подвал, картинки, SEO-разметка, todo-бейджи.
import fs from 'fs';

export const MODE = process.argv.includes('--prod') ? 'prod' : 'preview';
export const company = JSON.parse(fs.readFileSync('src/data/company.json', 'utf8'));
export const images = JSON.parse(fs.readFileSync('src/data/images.json', 'utf8'));
const pkgVersion = Date.now().toString(36); // версия для ?v= у CSS/JS

// ---------- todo / draft ----------
// Всё, чего клиент ещё не прислал, — {todo: '...'}; черновые тексты студии — draft(...).
// Реестр собирается при сборке; боевая сборка с непустым реестром не собирается.
export const missing = new Set();
export const drafts = new Set();
export const isTodo = v => v && typeof v === 'object' && 'todo' in v;
export function show(v) {
  if (isTodo(v)) { missing.add(v.todo); return `<span class="todo">${esc(v.todo)} — нужно от клиента</span>`; }
  return esc(v);
}
export function draft(label, html) { drafts.add(label); return html; }

export const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// ---------- адреса ----------
export const BASE = MODE === 'prod' ? '' : '/plitka-volzhsky';
export const SITE = MODE === 'prod' ? (isTodo(company.domain) ? (missing.add(company.domain.todo), 'https://example.invalid') : company.domain) : company.previewUrl;
export const url = p => BASE + p;
// Метрика ставится только в боевой сборке и только когда известен номер счётчика
export const hasMetrika = MODE === 'prod' && !isTodo(company.metrikaId);
export const abs = p => SITE + p;
const tel = `tel:${company.phone}`;

// ---------- картинки ----------
export function img(id, { sizes = '(max-width: 760px) 100vw, 50vw', cls = '', eager = false, caption = false, bare = false } = {}) {
  const m = images[id];
  if (!m) throw new Error('нет фото ' + id);
  const srcset = (m.sizes || [480, 960, 1600]).filter(s => s <= m.w || s === (m.sizes || [480])[0]).map(s => `${url(`/assets/img/${id}-${s}.webp`)} ${Math.min(s, m.w)}w`).join(', ');
  const h = Math.round(960 * m.h / m.w);
  const tag = `<img src="${url(`/assets/img/${id}-960.webp`)}" srcset="${srcset}" sizes="${sizes}" width="960" height="${h}" alt="${esc(m.alt)}"${eager ? ' fetchpriority="high"' : ' loading="lazy" decoding="async"'}${cls ? ` class="${cls}"` : ''}>`;
  if (bare) return tag;
  if (m.kind === 'stock') {
    const c = m.credit;
    return `<figure class="ph ph--stock">${tag}<figcaption>Фото для примера · <a href="${c.page}" target="_blank" rel="noopener">${esc(c.author)}</a>, <a href="${c.licenseUrl}" target="_blank" rel="noopener">${esc(c.license)}</a>, Wikimedia Commons</figcaption></figure>`;
  }
  return caption ? `<figure class="ph">${tag}<figcaption>${esc(caption)}</figcaption></figure>` : tag;
}

// ---------- навигация ----------
export const NAV = [
  { name: 'Услуги', path: '/uslugi/' },
  { name: 'Работы', path: '/raboty/' },
  { name: 'Вопросы', path: '/#voprosy' },
  { name: 'Контакты', path: '/kontakty/' },
];

const logo = `<svg class="logo__mark" viewBox="0 0 40 40" aria-hidden="true"><path d="M2 2h24l12 12v24H2z" fill="currentColor"/><path d="M2 20h36M20 2v36" stroke="var(--logo-seam)" stroke-width="2.4"/></svg>`;

function header(p) {
  const nav = NAV.map(n => `<a href="${url(n.path)}"${p.path.startsWith(n.path) && n.path !== '/' && !n.path.includes('#') ? ' aria-current="page"' : ''}>${n.name}</a>`).join('');
  return `<header class="hdr" id="top">
  <div class="wrap hdr__in">
    <a class="logo" href="${url('/')}" aria-label="${esc(company.brand)} — на главную">${logo}<span class="logo__txt"><b>${esc(company.brand)}</b><small>плиточник · ${esc(company.city)}</small></span></a>
    <nav class="nav" id="nav" aria-label="Основное меню">${nav}<a class="nav__cta" href="${url('/#raschet')}">Рассчитать стоимость</a></nav>
    <a class="hdr__tel" href="${tel}" data-goal="phone"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1A17 17 0 0 1 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1z" fill="currentColor"/></svg><span>${esc(company.phoneDisplay)}</span></a>
    <button class="burger" type="button" aria-label="Меню" aria-expanded="false" aria-controls="nav"><span></span><span></span></button>
  </div>
</header>`;
}

const STUDIO_UTM = () => `https://sitomika.ru/?utm_source=client_site&utm_medium=footer&utm_campaign=${MODE === 'prod' && !isTodo(company.domain) ? new URL(company.domain).hostname : 'plitka-volzhsky'}`;

function footer() {
  return `<footer class="ftr">
  <div class="wrap ftr__grid">
    <div>
      <a class="logo" href="${url('/')}">${logo}<span class="logo__txt"><b>${esc(company.brand)}</b><small>плиточник · ${esc(company.city)}</small></span></a>
      <p class="ftr__about">Мастер ${esc(company.master)}. Укладка плитки и керамогранита, ниши и полки, запил углов под 45°, ванные комнаты под ключ. ${esc(company.city)}, ${esc(company.region)}.</p>
    </div>
    <div>
      <h2 class="ftr__h">Услуги</h2>
      <ul class="ftr__list">${SERVICE_LINKS.map(s => `<li><a href="${url(s.path)}">${s.short}</a></li>`).join('')}</ul>
    </div>
    <div>
      <h2 class="ftr__h">Связаться</h2>
      <ul class="ftr__list">
        <li><a href="${tel}" data-goal="phone">${esc(company.phoneDisplay)}</a></li>
        <li>MAX — по этому же номеру</li>
        <li>${show(company.email)}</li>
        <li>${show(company.hours)}</li>
      </ul>
    </div>
  </div>
  <div class="wrap ftr__bottom">
    <span>© ${new Date().getFullYear()} ${esc(company.brand)}, ${esc(company.city)}</span>
    <a href="${url('/politika-konfidentsialnosti/')}">Политика конфиденциальности</a>
    <a href="${url('/soglasie/')}">Согласие на обработку данных</a>
    <a class="studio" href="${STUDIO_UTM()}" target="_blank" rel="noopener">Разработано в sitomika.ru</a>
  </div>
</footer>
<div class="mbar" aria-label="Быстрая связь"><a href="${tel}" data-goal="phone">Позвонить</a><a href="${url('/#raschet')}" class="mbar__accent">Рассчитать</a></div>
<div class="cookie" id="cookie" hidden><p>Сайт использует cookie, чтобы работать корректно${hasMetrika ? ', и Яндекс Метрику для статистики посещений' : ''}. Подробнее — в <a href="${url('/politika-konfidentsialnosti/')}">политике конфиденциальности</a>.</p><button type="button" class="btn btn--sm">Понятно</button></div>`;
}

// Список услуг для подвала и перелинковки (заполняет pages/services.mjs)
export const SERVICE_LINKS = [];

// ---------- JSON-LD ----------
export function business() {
  const b = {
    '@context': 'https://schema.org', '@type': 'HomeAndConstructionBusiness', '@id': abs('/#business'),
    name: company.brand, description: 'Укладка плитки и керамогранита, ванные комнаты под ключ, ниши и полки из плитки, запил углов под 45°, столешницы и фартуки из керамогранита в Волжском.',
    url: abs('/'), telephone: company.phone, image: abs('/assets/og.jpg'),
    address: { '@type': 'PostalAddress', addressLocality: company.city, addressRegion: company.region, addressCountry: 'RU' },
    areaServed: company.areaServed.map(n => ({ '@type': 'City', name: n })),
    founder: { '@type': 'Person', name: company.master, jobTitle: 'Плиточник' },
  };
  if (!isTodo(company.email)) b.email = company.email;
  return b;
}
export const crumbsLd = crumbs => ({ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: crumbs.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c.name, item: abs(c.path) })) });
export const faqLd = faq => ({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faq.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a.replace(/<[^>]+>/g, '') } })) });

// ---------- общие блоки ----------
export function credit(id) {
  const c = images[id].credit;
  return `Фото для примера · <a href="${c.page}" target="_blank" rel="noopener">${esc(c.author)}</a>, <a href="${c.licenseUrl}" target="_blank" rel="noopener">${esc(c.license)}</a>, Wikimedia Commons`;
}
export function crumbs(list) {
  return `<nav class="crumbs wrap" aria-label="Хлебные крошки"><ol>${list.map((c, i) => i === list.length - 1 ? `<li aria-current="page">${esc(c.name)}</li>` : `<li><a href="${url(c.path)}">${esc(c.name)}</a></li>`).join('')}</ol></nav>`;
}
export function faqBlock(faq, { id = 'voprosy', title = 'Частые вопросы' } = {}) {
  return `<section class="sec" id="${id}"><div class="wrap wrap--narrow">
  <h2 class="h2 reveal">${title}</h2>
  <div class="faq">${faq.map(f => `<details class="faq__i reveal"><summary><h3>${esc(f.q)}</h3></summary><div class="faq__a"><p>${f.a}</p>${f.more ? `<p>${f.more}</p>` : ''}</div></details>`).join('')}</div>
</div></section>`;
}
export function ctaBand(text = 'Опишите задачу — посчитаю стоимость и сроки') {
  return `<section class="band"><div class="wrap band__in reveal"><p class="band__t">${text}</p><div class="band__btns"><a class="btn" href="${url('/#raschet')}">Рассчитать стоимость</a><a class="btn btn--ghost-light" href="${tel}" data-goal="phone">${esc(company.phoneDisplay)}</a></div></div></section>`;
}

// ---------- layout ----------
export function layout(p) {
  const canonical = abs(p.path);
  const title = p.title, desc = p.description;
  const ld = [...(p.jsonld || [])];
  if (p.crumbs) ld.push(crumbsLd(p.crumbs));
  const robots = MODE === 'prod' ? (p.noindex ? 'noindex, follow' : 'index, follow') : 'noindex, nofollow';
  const metrika = MODE === 'prod' && !isTodo(company.metrikaId) ? metrikaCode(company.metrikaId) : (MODE === 'prod' ? (missing.add(company.metrikaId.todo), '') : '');
  return `<!doctype html>
<html lang="ru">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<meta name="robots" content="${robots}">
<link rel="canonical" href="${canonical}">
<meta property="og:type" content="website">
<meta property="og:locale" content="ru_RU">
<meta property="og:site_name" content="${esc(company.brand)}">
<meta property="og:title" content="${esc(p.ogTitle || title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${canonical}">
<meta property="og:image" content="${abs('/assets/og.jpg')}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#fbf7f1">
<link rel="icon" href="${url('/favicon.svg')}" type="image/svg+xml">
<link rel="icon" href="${url('/favicon.ico')}" sizes="48x48">
<link rel="apple-touch-icon" href="${url('/apple-touch-icon.png')}">
<link rel="preload" href="${url('/assets/fonts/Oswald-normal-500-700-cyrillic.woff2')}" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="${url('/assets/fonts/PTSans-normal-400-cyrillic.woff2')}" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="${url('/assets/css/style.css')}?v=${pkgVersion}">
<script>document.documentElement.classList.add('js')</script>
${ld.map(o => `<script type="application/ld+json">${JSON.stringify(o)}</script>`).join('\n')}
${metrika}</head>
<body class="${p.bodyClass || ''}">
<a class="skip" href="#main">К содержанию</a>
${header(p)}
<main id="main">
${p.body}
</main>
${footer()}
<script>window.SITE=${JSON.stringify({ lead: isTodo(company.leadEndpoint) ? null : company.leadEndpoint, phone: company.phoneDisplay, tel, metrika: MODE === 'prod' && !isTodo(company.metrikaId) ? company.metrikaId : null })}</script>
<script src="${url('/assets/js/main.js')}?v=${pkgVersion}" defer></script>
</body>
</html>
`;
}

function metrikaCode(id) {
  return `<script>(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};m[i].l=1*new Date();for(var j=0;j<document.scripts.length;j++){if(document.scripts[j].src===r){return}}k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})(window,document,'script','https://mc.yandex.ru/metrika/tag.js','ym');ym(${id},'init',{clickmap:true,trackLinks:true,accurateTrackBounce:true,webvisor:true});</script><noscript><div><img src="https://mc.yandex.ru/watch/${id}" style="position:absolute;left:-9999px" alt=""></div></noscript>
`;
}
