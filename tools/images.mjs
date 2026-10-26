// Фото: _source/client + _source/stock → src/assets/img/*.webp и src/data/images.json
// sharp по умолчанию не переносит EXIF (в нём бывают GPS-координаты квартир заказчиков).
import fs from 'fs';
import sharp from 'sharp';
import { client, stock } from './curation.mjs';

const OUT = 'src/assets/img/';
fs.mkdirSync(OUT, { recursive: true });
const files = fs.readdirSync('_source/client').filter(f => /\.jpe?g$/i.test(f)).sort();
const credits = JSON.parse(fs.readFileSync('_source/stock/credits.json', 'utf8'));
const SIZES = [480, 960, 1600];

async function make(src, id, sizes = SIZES) {
  const img = sharp(src).rotate();
  const meta = await img.metadata();
  const swap = (meta.orientation || 1) >= 5;
  const w = swap ? meta.height : meta.width, h = swap ? meta.width : meta.height;
  for (const s of sizes) {
    const file = `${OUT}${id}-${s}.webp`;
    if (!fs.existsSync(file)) await sharp(src).rotate().resize({ width: Math.min(s, w) }).webp({ quality: s === 480 ? 70 : 76 }).toFile(file);
  }
  return { w, h, ...(sizes !== SIZES ? { sizes } : {}) };
}

const out = {};
for (const [id, c] of Object.entries(client)) out[id] = { ...(await make('_source/client/' + files[c.n], id)), alt: c.alt, kind: 'client' };
for (const [id, c] of Object.entries(stock)) {
  const cr = credits[c.id];
  out[id] = { ...(await make(`_source/stock/${c.id}.jpg`, id, c.sizes)), alt: c.alt, kind: 'stock', credit: { author: cr.author, license: cr.license, licenseUrl: cr.licenseUrl, page: cr.page } };
}
fs.writeFileSync('src/data/images.json', JSON.stringify(out, null, 1));
const total = fs.readdirSync(OUT).reduce((s, f) => s + fs.statSync(OUT + f).size, 0);
console.log(Object.keys(out).length, 'фото,', (total / 1e6).toFixed(1), 'МБ');
