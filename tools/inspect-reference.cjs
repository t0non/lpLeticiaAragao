const { chromium } = require('C:/Users/eduar/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs = require('node:fs/promises');

(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1 });
  await page.goto('https://draclaudiacaciquinho.com.br/', { waitUntil: 'networkidle' });
  await page.evaluate(async () => {
    await document.fonts.ready;
    for (let y = 0; y < document.body.scrollHeight; y += 700) {
      window.scrollTo(0, y);
      await new Promise(resolve => setTimeout(resolve, 400));
    }
    window.scrollTo(0, 0);
  });
  await page.evaluate(() => { document.querySelectorAll('.e-con').forEach(el => el.classList.add('e-lazyloaded')); document.querySelectorAll('.elementor-invisible').forEach(el => el.classList.remove('elementor-invisible')); });
  await page.addStyleTag({content: '.elementor-element { animation: none !important; transition: none !important; } .cmplz-cookiebanner {display:none!important}'});
  await page.waitForTimeout(1800);
  await fs.mkdir('.reference', { recursive: true });
  await page.screenshot({ path: '.reference/desktop.png', fullPage: true });
  const data = await page.evaluate(() => {
    const styleOf = el => {
      const s = getComputedStyle(el);
      const r = el.getBoundingClientRect();
      return { tag: el.tagName, id: el.id, class: el.className, text: el.innerText?.slice(0, 90), x: r.x, y: r.y, w: r.width, h: r.height, font: s.fontFamily, size: s.fontSize, weight: s.fontWeight, lineHeight: s.lineHeight, color: s.color, background: s.backgroundColor, backgroundImage: s.backgroundImage, padding: s.padding, gap: s.gap, borderRadius: s.borderRadius };
    };
    return {
      title: document.title,
      stylesheets: [...document.styleSheets].map(x => x.href).filter(Boolean),
      images: [...document.images].map(x => ({ src: x.currentSrc || x.src, alt: x.alt, width: x.naturalWidth, height: x.naturalHeight })),
      backgrounds: [...document.querySelectorAll('*')].filter(x => getComputedStyle(x).backgroundImage.includes('url(')).map(styleOf),
      sections: [...document.querySelectorAll('.elementor > .e-con, .elementor > section')].map(styleOf),
      headings: [...document.querySelectorAll('h1,h2,h3,.elementor-heading-title')].map(styleOf),
      fonts: [...document.fonts].map(x => ({family:x.family,weight:x.weight,status:x.status})),
      links: [...document.querySelectorAll('a[href]')].map(x => ({text:x.innerText, href:x.href})),
      widgets: [...document.querySelectorAll('.elementor-widget')].map(x => ({type:x.dataset.widget_type,...styleOf(x)})),
    };
  });
  await fs.writeFile('.reference/structure.json', JSON.stringify(data, null, 2));
  const css = await Promise.all(data.stylesheets.filter(url => /post-19|post-14|base-desktop|base-mobile/.test(url)).map(async url => ({url,css:await fetch(url).then(r=>r.text())})));
  await fs.writeFile('.reference/styles.json', JSON.stringify(css,null,2));
  console.log(JSON.stringify({backgrounds:data.backgrounds,cssAssets:[...new Set(css.flatMap(x=>[...x.css.matchAll(/url\(["']?([^"')]+)["']?\)/g)].map(m=>m[1])))]}, null, 2));
  await page.setViewportSize({width:390,height:844});
  await page.goto('https://draclaudiacaciquinho.com.br/',{waitUntil:'networkidle'});
  await page.evaluate(async () => { await document.fonts.ready; for(let y=0;y<document.body.scrollHeight;y+=700){window.scrollTo(0,y);await new Promise(r=>setTimeout(r,70));}window.scrollTo(0,0); });
  await page.evaluate(() => { document.querySelectorAll('.e-con').forEach(el=>el.classList.add('e-lazyloaded')); document.querySelectorAll('.elementor-invisible').forEach(el=>el.classList.remove('elementor-invisible')); });
  await page.addStyleTag({content: '.elementor-element {animation:none!important;transition:none!important} .cmplz-cookiebanner{display:none!important}'});
  await page.waitForTimeout(1200);
  await page.screenshot({path:'.reference/mobile.png',fullPage:true});
  await browser.close();
})().catch(error => { console.error(error); process.exitCode = 1; });
