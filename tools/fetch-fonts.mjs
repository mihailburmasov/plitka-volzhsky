// Однократно скачивает шрифты Google Fonts (кириллица + латиница) в src/static/fonts
// и пишет src/assets/fonts.css. Запуск: node tools/fetch-fonts.mjs
import fs from 'fs';
const OUT = 'src/assets/fonts';
fs.mkdirSync(OUT, { recursive: true });
const families = [
  'Unbounded:wght@500;700',
  'Manrope:wght@400..800',
];
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36';
let css = '';
for (const f of families) {
  const r = await fetch(`https://fonts.googleapis.com/css2?family=${f}&display=swap`, { headers: { 'User-Agent': UA } });
  const text = await r.text();
  // блоки @font-face с комментарием подмножества перед ними
  const blocks = text.split('/* ').slice(1);
  for (const b of blocks) {
    const subset = b.slice(0, b.indexOf(' */'));
    if (!['cyrillic', 'latin', 'cyrillic-ext'].includes(subset)) continue;
    const face = b.slice(b.indexOf('@font-face'));
    const url = face.match(/url\((https:[^)]+\.woff2)\)/)[1];
    const fam = face.match(/font-family: '([^']+)'/)[1].replace(/\s+/g, '');
    const style = face.match(/font-style: (\w+)/)[1];
    const weight = face.match(/font-weight: ([\d ]+)/)[1].trim().replace(' ', '-');
    const name = `${fam}-${style}-${weight}-${subset}.woff2`;
    if (!fs.existsSync(`${OUT}/${name}`)) {
      const buf = Buffer.from(await (await fetch(url)).arrayBuffer());
      fs.writeFileSync(`${OUT}/${name}`, buf);
    }
    css += face.replace(url, `../fonts/${name}`) + '\n';
  }
}
fs.writeFileSync('src/assets/css/fonts.css', css);
console.log('ok', fs.readdirSync(OUT));
