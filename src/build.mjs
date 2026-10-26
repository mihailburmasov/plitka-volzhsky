// Сборка сайта.  npm run build → docs/ (превью на GitHub Pages, noindex)
//                 npm run build:prod → dist/ (боевой домен; не собирается, пока есть todo/draft)
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { MODE, layout, company, abs, missing, drafts, isTodo, SERVICE_LINKS } from './lib/ui.mjs';
import { SERVICES, servicePage, servicesHub } from './pages/services.mjs';
import * as M from './pages/misc.mjs';

const OUT = MODE === 'prod' ? 'dist' : 'docs';
fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });

const pages = [M.home(), servicesHub(), ...SERVICES.map(servicePage), M.works(), M.contacts(), M.privacy(), M.consent(), M.notFound()];
// Факты, которые не выводятся на страницах, но без которых запускать нельзя
for (const k of ['brandApproved', 'leadEndpoint']) if (isTodo(company[k])) missing.add(company[k].todo);

// Без комментариев разработчика в HTML (они видны в исходном коде страницы)
const strip = html => html.replace(/<!--(?!\[if)[\s\S]*?-->/g, '');
for (const p of pages) {
  const file = p.file ? path.join(OUT, p.file) : path.join(OUT, p.path, 'index.html');
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const html = strip(layout(p));
  // битая разметка из шаблонов (например, индекс из .map() вместо имени тега) не должна уйти на сайт
  const bad = html.match(/<\/?(\d|undefined|null|\[object)[^>]*>/);
  if (bad) { console.error(`Битый тег на ${p.path}: ${bad[0]}`); process.exit(1); }
  fs.writeFileSync(file, html);
}

if (MODE === 'prod' && (missing.size || drafts.size)) {
  fs.rmSync(OUT, { recursive: true, force: true });
  console.error('\nБоевая сборка остановлена. Не хватает данных от клиента:');
  for (const m of missing) console.error('  • ' + m);
  if (drafts.size) console.error('Тексты студии, которые должен подтвердить Евгений (draft):');
  for (const d of drafts) console.error('  • ' + d);
  process.exit(1);
}

// ---------- ассеты ----------
fs.cpSync('src/assets', path.join(OUT, 'assets'), { recursive: true });
{ // шрифты внутрь style.css — на один запрос меньше
  const cssDir = path.join(OUT, 'assets/css');
  const css = fs.readFileSync(path.join(cssDir, 'fonts.css'), 'utf8') + fs.readFileSync(path.join(cssDir, 'style.css'), 'utf8').replace(/@import url\(fonts\.css\);\s*/, '');
  fs.writeFileSync(path.join(cssDir, 'style.css'), css.replace(/\/\*[\s\S]*?\*\//g, ''));
  fs.rmSync(path.join(cssDir, 'fonts.css'));
}
fs.copyFileSync('src/static/favicon.svg', path.join(OUT, 'favicon.svg'));
await sharp('src/static/favicon.svg').resize(180, 180).flatten({ background: '#fbf7f1' }).png().toFile(path.join(OUT, 'apple-touch-icon.png'));
await sharp('src/static/favicon.svg').resize(48, 48).png().toFile(path.join(OUT, 'favicon.ico')); // PNG внутри .ico понимают все современные браузеры

// OG-картинка 1200×630: фото справа, текст на графите слева
{
  const photo = await sharp('src/assets/img/elochka-vannaya-960.webp').resize(520, 630, { fit: 'cover', position: 'bottom' }).toBuffer();
  const grid = Array.from({ length: 10 }, (_, i) => `<path d="M${i * 68} 0V630" stroke="#16181b" stroke-opacity=".05"/>`).join('') + Array.from({ length: 10 }, (_, i) => `<path d="M0 ${i * 68}H680" stroke="#16181b" stroke-opacity=".05"/>`).join('');
  const svg = `<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg"><rect width="1200" height="630" fill="#fbf7f1"/>${grid}
  <path d="M60 70h34l14 14v34H60z" fill="#d07a45"/><path d="M60 94h48M84 70v48" stroke="#fbf7f1" stroke-width="3"/>
  <text x="128" y="106" font-family="Arial, sans-serif" font-weight="700" font-size="30" fill="#16181b">${company.brand}</text>
  <text x="60" y="260" font-family="Arial, sans-serif" font-weight="700" font-size="58" fill="#16181b">Укладка плитки</text>
  <text x="60" y="330" font-family="Arial, sans-serif" font-weight="700" font-size="58" fill="#16181b">в Волжском</text>
  <text x="60" y="400" font-family="Arial, sans-serif" font-size="27" fill="#9c4f1f">Запил 45° · ниши · ванная под ключ</text>
  <text x="60" y="540" font-family="Arial, sans-serif" font-weight="700" font-size="34" fill="#16181b">${company.phoneDisplay}</text></svg>`;
  await sharp(Buffer.from(svg)).composite([{ input: photo, left: 680, top: 0 }, { input: Buffer.from('<svg width="520" height="630"><path d="M0 0H460L520 60V630H0Z" fill="none"/><path d="M460 0H520V60Z" fill="#fbf7f1"/></svg>'), left: 680, top: 0 }]).jpeg({ quality: 84 }).toFile(path.join(OUT, 'assets/og.jpg'));
}

// ---------- SEO-файлы ----------
const indexable = pages.filter(p => !p.noindex && !p.file);
const today = new Date().toISOString().slice(0, 10);
fs.writeFileSync(path.join(OUT, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${indexable.map(p => `  <url><loc>${abs(p.path)}</loc><lastmod>${today}</lastmod></url>`).join('\n')}
</urlset>
`);
fs.writeFileSync(path.join(OUT, 'robots.txt'), MODE === 'prod'
  ? `User-agent: *\nAllow: /\nClean-param: utm_source&utm_medium&utm_campaign&utm_content&utm_term&yclid&ysclid\n\n# AI-ассистенты (ответы в Алисе, ChatGPT, Perplexity и т. п.)\nUser-agent: GPTBot\nAllow: /\n\nUser-agent: ClaudeBot\nAllow: /\n\nUser-agent: PerplexityBot\nAllow: /\n\nUser-agent: Google-Extended\nAllow: /\n\nSitemap: ${abs('/sitemap.xml')}\n`
  : `# Превью — закрыто от индексации, чтобы не дублировать боевой сайт\nUser-agent: *\nDisallow: /\n`);
fs.writeFileSync(path.join(OUT, 'llms.txt'), `# ${company.brand} — плиточник в Волжском

> Мастер ${company.master}, ${company.city} (${company.region}). Укладка плитки и керамогранита, запил углов под 45° (заусовка), ниши и полки из плитки, столешницы и фартуки из керамогранита, ванные комнаты под ключ. Сопутствующие работы: монтаж электрики и сантехники, короба из гипсокартона, скрытые люки, демонтаж старого кафеля. Телефон ${company.phoneDisplay} (звонок или MAX). Стоимость — после осмотра объекта.

## Страницы

- [Главная](${abs('/')}): услуги, работы, вопросы и ответы, расчёт стоимости
${SERVICE_LINKS.map(s => `- [${s.short}](${abs(s.path)})`).join('\n')}
- [Фото работ](${abs('/raboty/')})
- [Контакты](${abs('/kontakty/')})
`);
if (MODE === 'preview') fs.writeFileSync(path.join(OUT, '.nojekyll'), '');

console.log(`${MODE}: ${pages.length} страниц → ${OUT}/`);
if (missing.size) console.log('Ждём от клиента:', [...missing].join('; '));
if (drafts.size) console.log('Черновые тексты (draft):', drafts.size);
