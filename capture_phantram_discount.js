const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
(async()=>{
 const out='/home/huy/.openclaw/workspace/blog-satellite/tutorials/tinh-giam-gia/assets';
 fs.mkdirSync(out,{recursive:true});
 const browser=await chromium.launch({headless:true});
 const page=await browser.newPage({viewport:{width:1200,height:900}, deviceScaleFactor:1});
 await page.goto('https://1phantram.com/tinh-giam-gia',{waitUntil:'domcontentloaded', timeout:60000});
 await page.waitForTimeout(2500);
 await page.screenshot({path:path.join(out,'tinh-giam-gia-01-start.png'), fullPage:false});
 const inputs=await page.locator('input').count();
 const info=[];
 for(let i=0;i<inputs;i++){
   const input=page.locator('input').nth(i);
   if(!(await input.isVisible().catch(()=>false))) continue;
   const ph=await input.getAttribute('placeholder').catch(()=>null);
   const label=await input.evaluate(el=>{
     const near=el.closest('label') || el.parentElement;
     return near ? near.innerText : '';
   }).catch(()=>'');
   info.push({i, placeholder:ph, label:label.slice(0,200)});
 }
 fs.writeFileSync(path.join(out,'ui-inspect.json'), JSON.stringify(info,null,2));
 const visible=info.map(x=>x.i);
 if(visible.length>=2){
   await page.locator('input').nth(visible[0]).fill('25000000');
   await page.locator('input').nth(visible[1]).fill('12');
   await page.waitForTimeout(1000);
   await page.screenshot({path:path.join(out,'tinh-giam-gia-02-input-filled.png'), fullPage:false});
 }
 // focus result area by full page after calculation
 await page.screenshot({path:path.join(out,'tinh-giam-gia-03-result-full.png'), fullPage:true});
 // Try click copy/share if visible not needed, capture FAQ lower area
 await page.evaluate(()=>window.scrollTo(0, Math.min(1200, document.body.scrollHeight)));
 await page.waitForTimeout(500);
 await page.screenshot({path:path.join(out,'tinh-giam-gia-04-guide-content.png'), fullPage:false});
 await browser.close();
 console.log(JSON.stringify({out, info}, null, 2));
})();
