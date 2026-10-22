const fs = require('node:fs/promises');
const path = require('node:path');
(async()=>{
  const root = path.resolve(__dirname,'..');
  const out = path.join(root,'dist');
  await fs.rm(out, { recursive: true, force: true });
  await fs.mkdir(out,{recursive:true});
  for(const file of ['index.html','styles.css','app.js','assets','robots.txt','sitemap.xml','llms.txt']) {
    const src = path.join(root,file);
    const dst = path.join(out,file);
    await fs.cp(src,dst,{recursive:true});
  }
  console.log('Static site built in dist/');
})().catch(error=>{console.error(error);process.exitCode=1});
