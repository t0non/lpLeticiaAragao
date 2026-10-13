const fs = require('node:fs/promises');
const path = require('node:path');

(async () => {
  const structure = JSON.parse(await fs.readFile('.reference/structure.json', 'utf8'));
  const sheets = JSON.parse(await fs.readFile('.reference/styles.json', 'utf8'));
  const urls = [...new Set([...structure.images.map(x => x.src), ...sheets.flatMap(x => [...x.css.matchAll(/url\(["']?([^"')]+)["']?\)/g)].map(m => m[1]))])];
  await fs.mkdir('assets/images', {recursive:true});
  await fs.mkdir('assets/fonts', {recursive:true});
  await fs.mkdir('assets/vendor', {recursive:true});
  const manifest = [];
  for (const url of urls) {
    if (!url.startsWith('https://draclaudiacaciquinho.com.br/')) continue;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`${response.status}: ${url}`);
    const local = 'assets/images/' + path.basename(new URL(url).pathname);
    await fs.writeFile(local, Buffer.from(await response.arrayBuffer()));
    manifest.push({url,local});
  }
  const fontUrl = 'https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap';
  let css = await fetch(fontUrl, {headers:{'User-Agent':'Mozilla/5.0 Chrome/130.0.0.0 Safari/537.36'}}).then(r=>r.text());
  for (const url of [...new Set([...css.matchAll(/url\(([^)]+)\)/g)].map(m=>m[1]))]) {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Font download failed');
    const name = path.basename(new URL(url).pathname);
    await fs.writeFile('assets/fonts/' + name, Buffer.from(await response.arrayBuffer()));
    css = css.split(url).join('./' + name);
    manifest.push({url,local:'assets/fonts/'+name});
  }
  await fs.writeFile('assets/fonts/poppins.css',css);
  const iconsUrl = 'https://unpkg.com/lucide@0.468.0/dist/umd/lucide.min.js';
  const icons = await fetch(iconsUrl);
  if (!icons.ok) throw new Error('Icon download failed');
  await fs.writeFile('assets/vendor/lucide.min.js',await icons.text());
  manifest.push({url:iconsUrl,local:'assets/vendor/lucide.min.js'});
  await fs.writeFile('assets/sources.json', JSON.stringify(manifest,null,2));
  const sharp = require('C:/Users/eduar/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp');
  await sharp('.reference/desktop.png').extract({left:0,top:0,width:1440,height:1442}).toFile('.reference/top.png');
  await sharp('.reference/desktop.png').extract({left:0,top:2900,width:1440,height:1800}).toFile('.reference/middle.png');
  await sharp('.reference/mobile.png').extract({left:0,top:0,width:390,height:2100}).toFile('.reference/mobile-top.png');
  console.log(`Downloaded ${manifest.length} local assets.`);
})().catch(error=>{console.error(error);process.exitCode=1});
