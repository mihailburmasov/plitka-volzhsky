// Локальный просмотр: node tools/serve.mjs docs 8091 → http://localhost:8091/plitka-volzhsky/
import http from 'http';
import fs from 'fs';
import path from 'path';
const [dir = 'docs', port = 8091] = process.argv.slice(2);
const prefix = dir === 'docs' ? '/plitka-volzhsky' : '';
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json', '.webp': 'image/webp', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.woff2': 'font/woff2', '.xml': 'application/xml', '.txt': 'text/plain; charset=utf-8', '.ico': 'image/x-icon' };
http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0]);
  if (prefix && p.startsWith(prefix)) p = p.slice(prefix.length) || '/';
  let f = path.join(dir, p);
  if (fs.existsSync(f) && fs.statSync(f).isDirectory()) f = path.join(f, 'index.html');
  if (!fs.existsSync(f)) { res.writeHead(404, { 'Content-Type': types['.html'] }); return res.end(fs.readFileSync(path.join(dir, '404.html'))); }
  res.writeHead(200, { 'Content-Type': types[path.extname(f)] || 'application/octet-stream' });
  fs.createReadStream(f).pipe(res);
}).listen(+port, () => console.log(`http://localhost:${port}${prefix}/`));
