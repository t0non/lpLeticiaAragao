const { chromium } = require('C:/Users/eduar/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs = require('node:fs/promises');
const assert = require('node:assert/strict');

(async () => {
  const browser = await chromium.launch({channel:'msedge',headless:true});
  const page = await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
  const errors = [];
  page.on('pageerror', error=>errors.push(error.message));
  page.on('response', response=>{if(response.url().startsWith('http://localhost:5173/') && response.status() >= 400) errors.push(response.status()+' '+response.url());});
  await page.goto('http://localhost:5173/', {waitUntil:'networkidle'});
  await page.evaluate(()=>document.fonts.ready);
  assert.match(await page.title(), /Letícia Aragão/);
  assert.doesNotMatch(await page.content(), /Caciquinho|Cláudia|geriatria|CRM MG|RQE|The Clinic|Clínica Sentir|553184210412|5531983205381|FOTO-7-D|FOTO-3-550/iu);
  assert.match(await page.locator('body').innerText(), /CRP 04\/26390/);
  assert.equal(await page.locator('main > section').nth(1).getAttribute('id'), 'curriculo');
  assert.match(await page.locator('#hero-title').innerText(), /Letícia Aragão/);
  for (const qualification of ['Cognitivo-Comportamental', 'Neuropsicologia', 'ABA', 'Criminal e Forense', 'Equoterapia', 'psicotécnicas']) {
    assert.ok((await page.locator('#curriculo').innerText()).includes(qualification));
  }
  assert.equal(await page.locator('.review--featured').count(), 0);

  const carousel = page.locator('.feature-carousel');
  await carousel.locator('[data-step="1"]').click();
  await page.waitForFunction(()=>document.querySelector('.feature-carousel .dots button:nth-child(2)').getAttribute('aria-current') === 'true');
  await carousel.locator('.dots button').nth(4).click();
  await page.waitForFunction(()=>document.querySelector('.feature-carousel .dots button:nth-child(5)').getAttribute('aria-current') === 'true');
  await carousel.locator('.dots button').first().click();

  await page.getByRole('tab',{name:'On-line',exact:true}).click();
  assert.equal(await page.locator('#panel-online').isVisible(),true);
  assert.equal(await page.locator('#panel-presencial').isVisible(),false);
  await page.getByRole('tab',{name:'On-line',exact:true}).press('ArrowLeft');
  assert.equal(await page.locator('#panel-presencial').isVisible(),true);

  await page.locator('.faq-list details').nth(1).locator('summary').click();
  assert.equal(await page.locator('.faq-list details[open]').count(),1);
  assert.equal(await page.locator('.faq-list details').nth(1).getAttribute('open'),'');
  await page.locator('.faq-list details').first().locator('summary').click();

  await page.getByRole('button',{name:'Privacidade',exact:true}).last().click();
  assert.equal(await page.locator('.privacy-dialog').isVisible(),true);
  await page.getByRole('button',{name:'Entendi',exact:true}).click();
  assert.equal(await page.locator('.privacy-dialog').isVisible(),false);
  await page.reload({waitUntil:'networkidle'});

  const reports = [];
  for (const width of [1440,390,320,768,1920]) {
    await page.setViewportSize({width,height:width<768?844:1000});
    await page.evaluate(async()=>{await document.fonts.ready; document.querySelectorAll('img').forEach(img=>img.loading='eager'); window.scrollTo(0,0);});
    await page.waitForTimeout(400);
    const report = await page.evaluate(()=>{
      const rect = el=>el.getBoundingClientRect();
      return {
        width:innerWidth,height:document.body.scrollHeight,
        overflow:document.documentElement.scrollWidth>innerWidth,
        failedImages:[...document.images].filter(img=>!img.complete||!img.naturalWidth).map(img=>img.src),
        overflowElements:[...document.querySelectorAll('h1,h2,h3,.cta,.outline-card,.location-panel')].filter(el=>!el.closest('.slides')&&(rect(el).right>innerWidth+1||rect(el).left< -1)).map(el=>({tag:el.tagName,text:el.textContent.slice(0,50)})),
        clippedText:[...document.querySelectorAll('h1,h2,h3,.cta')].filter(el=>el.scrollWidth>el.clientWidth+2).map(el=>el.textContent.slice(0,50)),
        fontsLoaded:document.fonts.check('18px Poppins'),
        contactLinks:[...document.querySelectorAll('[data-contact]')].every(a=>{const url=new URL(a.href);return a.tagName==='A'&&url.origin==='https://wa.me'&&url.pathname==='/5532988042418'&&url.searchParams.get('text')==='Olá, Letícia! Gostaria de informações sobre o atendimento psicológico.'&&a.target==='_blank';})
      };
    });
    reports.push(report);
    if(width===1440||width===390) {
      await page.screenshot({path:'.reference/local-'+width+'.png',fullPage:true});
      await page.screenshot({path:'.reference/local-'+width+'-viewport.png'});
    }
    assert.equal(report.overflow,false,JSON.stringify(report));
    assert.equal(report.failedImages.length,0,JSON.stringify(report));
    assert.equal(report.overflowElements.length,0,JSON.stringify(report));
    assert.equal(report.clippedText.length,0,JSON.stringify(report));
    assert.equal(report.fontsLoaded,true);
    assert.equal(report.contactLinks,true);
  }
  assert.deepEqual(errors,[]);
  await fs.writeFile('.reference/qa.json',JSON.stringify({errors,reports,interactions:'passed'},null,2));
  console.log(JSON.stringify({errors,reports,interactions:'passed'},null,2));
  await browser.close();
})().catch(error=>{console.error(error);process.exitCode=1;process.exit(1);});
