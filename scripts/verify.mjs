import {createRequire} from 'node:module';
import {mkdir,writeFile} from 'node:fs/promises';
const require=createRequire('D:/safora-dashboard/e2e/package.json');
const {chromium}=require('@playwright/test');
const browser=await chromium.launch({headless:true});
const errors=[];const failures=[];const results=[];
await mkdir(new URL('../artifacts/',import.meta.url),{recursive:true});
try {
const page=await browser.newPage();
page.on('pageerror',e=>errors.push(e.message));
page.on('response',r=>{if(r.status()>=400&&r.url().startsWith('http://localhost:4175'))errors.push(`${r.status()} ${r.url()}`);});
await page.goto('http://localhost:4175',{waitUntil:'networkidle'});
for(const width of [1440,1024,768,600,390,320]){
await page.setViewportSize({width,height:1000});
for(const [label,title] of [['Security overview','Security overview'],['Cloud security','Cloud security'],['Control validation','Security control validation']]){
await page.getByRole('tab',{name:label,exact:true}).click();
await page.getByRole('heading',{name:title,exact:true}).waitFor();
await page.evaluate(()=>Promise.all([...document.images].map(image=>image.decode().catch(()=>{}))));
const layout=await page.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth,brokenImages:[...document.images].filter(i=>!i.complete||!i.naturalWidth).map(i=>i.src),metrics:document.querySelectorAll('.metric').length,ring:document.querySelector('#posture-value').textContent}));
if(layout.scroll>width)failures.push(`Overflow ${width} ${label}: ${layout.scroll}`);
if(layout.brokenImages.length)failures.push(`Broken images ${layout.brokenImages.join(', ')}`);
if(layout.metrics!==4)failures.push(`Missing metrics ${label}`);
results.push({width,view:label,...layout});
}
await page.getByRole('tab',{name:'Security overview',exact:true}).click();
if([1440,390,320].includes(width)){await page.screenshot({path:new URL(`../artifacts/landing-${width}.png`,import.meta.url).pathname.replace(/^\/(\w:)/,'$1'),fullPage:true});await page.evaluate(()=>window.scrollTo(0,0));await page.screenshot({path:new URL(`../artifacts/hero-${width}.png`,import.meta.url).pathname.replace(/^\/(\w:)/,'$1')});}
if(width<=600){await page.getByRole('button',{name:'Open navigation'}).click();if(!await page.getByRole('navigation',{name:'Main navigation'}).isVisible())failures.push(`Menu did not open ${width}`);await page.keyboard.press('Escape');if(await page.getByRole('button',{name:'Open navigation'}).getAttribute('aria-expanded')!=='false')failures.push(`Menu did not close ${width}`);}
}
await page.setViewportSize({width:1440,height:1000});
await page.getByRole('tab',{name:'Security overview',exact:true}).focus();await page.keyboard.press('ArrowDown');
if(await page.getByRole('tab',{name:'Cloud security',exact:true}).getAttribute('aria-selected')!=='true')failures.push('Desktop keyboard tabs');
await page.setViewportSize({width:390,height:1000});await page.getByRole('tab',{name:'Security overview',exact:true}).click();await page.keyboard.press('ArrowRight');
if(await page.getByRole('tab',{name:'Cloud security',exact:true}).getAttribute('aria-selected')!=='true')failures.push('Mobile keyboard tabs');
const faq=page.locator('summary').filter({hasText:'Can we see the platform in action?'});await faq.click();if(!await page.locator('details').nth(2).getAttribute('open').then(v=>v!==null))failures.push('FAQ did not open');
const emails=await page.locator('a[href^="mailto:"]').evaluateAll(links=>links.map(a=>a.getAttribute('href')));if(emails.some(s=>!s.startsWith('mailto:support@safora.ai')))failures.push('Incorrect email destination');
const report={errors,failures,checks:results.length,results};await writeFile(new URL('../artifacts/verification.json',import.meta.url),JSON.stringify(report,null,2));console.log(JSON.stringify({errors,failures,viewChecks:results.length,screenshots:[1440,390,320]}));if(errors.length||failures.length)process.exitCode=1;
}finally{await browser.close();}
