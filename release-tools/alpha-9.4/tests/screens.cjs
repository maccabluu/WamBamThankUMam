// End-to-end tests run in CI's own Chromium against the packaged game modules.
const {chromium}=require('playwright');
const fs=require('node:fs/promises');
const path=require('node:path');
const assert=require('node:assert/strict');
const http=require('node:http');

async function main(){
  const www=path.resolve(process.argv[2]);
  const screenshots=path.resolve(process.argv[3]||'screen-checks');await fs.mkdir(screenshots,{recursive:true});
  const qa=`<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><script>window.gdjs={};</script><script src="wam-campaign.js"></script><script src="wam-engine.js"></script><script src="wam-ui.js"></script><script src="wam-map.js"></script><script src="code1.js"></script><script src="code2.js"></script></head><body><canvas style="display:none"></canvas><script>
  localStorage.setItem('wambam-unlocked-level','9');localStorage.setItem('wambam-selected-level','6');
  window.qa={scene:{},name:'Level Map'};
  window.gdjs.evtTools={runtimeScene:{replaceScene:(scene,name)=>{qa.scene={};qa.name=name;if(name==='Untitled scene'){document.body.dataset.home='true';}}}};
  setInterval(()=>{if(qa.name==='Game')gdjs.GameCode.func(qa.scene);if(qa.name==='Level Map')gdjs.Level_32MapCode.func(qa.scene);},16);
  </script></body></html>`;
  const server=http.createServer(async(req,res)=>{try{
    const url=new URL(req.url,'http://localhost'),rel=decodeURIComponent(url.pathname).replace(/^\//,'');
    if(rel==='qa.html'){res.setHeader('Content-Type','text/html; charset=utf-8');res.end(qa);return;}
    const file=path.resolve(www,rel);if(!file.startsWith(www+path.sep)){res.writeHead(403).end();return;}
    const mime={'.js':'text/javascript; charset=utf-8','.html':'text/html; charset=utf-8','.png':'image/png','.jpg':'image/jpeg','.mp3':'audio/mpeg'}[path.extname(file)];
    if(mime)res.setHeader('Content-Type',mime);res.end(await fs.readFile(file));
  }catch{res.writeHead(404).end();}});
  await new Promise(r=>server.listen(0,'127.0.0.1',r));
  const url=`http://127.0.0.1:${server.address().port}/qa.html`;
  const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
  const failures=[];
  try{
    const page=await browser.newPage({viewport:{width:414,height:896},deviceScaleFactor:2,hasTouch:true});
    page.on('pageerror',e=>failures.push(String(e)));
    await page.goto(url);await page.getByRole('button',{name:'LEVEL LIST',exact:true}).waitFor();
    assert.equal(await page.getByRole('button',{name:'Home',exact:true}).textContent(),'⌂');
    assert.ok(await page.locator('.wam-node-stars').first().textContent()==='✓ COMPLETE');
    const overlapping=await page.evaluate(()=>{
      const stops=[...document.querySelectorAll('.wam-map-stop')].map(e=>e.getBoundingClientRect());
      return stops.some((a,i)=>stops.slice(i+1).some(b=>a.left<b.right&&a.right>b.left&&a.top<b.bottom&&a.bottom>b.top));
    });
    assert.equal(overlapping,false,'Map level names and stars must not overlap other stops');
    await page.screenshot({path:path.join(screenshots,'map-phone.png')});
    for(const level of [6,7,8,9]){
      await page.getByRole('button',{name:'LEVEL LIST',exact:true}).click();
      await page.getByRole('button',{name:`View Level ${level}`,exact:true}).click();
      await page.getByRole('dialog').waitFor();
      assert.equal(await page.locator('.wam-target-card').count(),3);
      await page.screenshot({path:path.join(screenshots,`level-${level}-targets.png`)});
      await page.getByRole('dialog').getByRole('button',{name:`PLAY LEVEL ${level}`,exact:true}).click();
      await page.locator('.wam-grid').waitFor();await page.waitForFunction(()=>[...document.querySelectorAll('.wam-cell img')].every(img=>!img.getAttribute('src')||img.complete&&img.naturalWidth>0));
      assert.equal(await page.locator('.wam-cell').count(),60);
      await page.screenshot({path:path.join(screenshots,`level-${level}-phone.png`)});
      assert.equal(await page.evaluate(()=>qa.scene.__wam94Game.config.id),level);
      const move=await page.evaluate(()=>qa.scene.__wam94Game.game.findMove());
      const before=await page.evaluate(()=>qa.scene.__wam94Game.game.moves);
      const from=await page.locator(`[data-cell="${move[0]}"]`).boundingBox(),to=await page.locator(`[data-cell="${move[1]}"]`).boundingBox();
      await page.mouse.move(from.x+from.width/2,from.y+from.height/2);await page.mouse.down();await page.mouse.move(to.x+to.width/2,to.y+to.height/2,{steps:5});await page.mouse.up();
      await page.waitForFunction(()=>!qa.scene.__wam94Game.busy,{},{timeout:25000});
      assert.equal(await page.evaluate(()=>qa.scene.__wam94Game.game.moves),before-1);
      assert.equal(await page.evaluate(()=>qa.scene.__wam94Game.game.board.filter(Boolean).length+qa.scene.__wam94Game.game.bags.size),60);
      await page.getByRole('button',{name:'Pause game'}).click();await page.getByRole('button',{name:'ROAD MAP',exact:true}).click();
      await page.getByRole('button',{name:'LEVEL LIST',exact:true}).waitFor();
    }
    // A last-move Disco completes the level without requiring an extra cascade.
    await page.getByRole('button',{name:'LEVEL LIST',exact:true}).click();await page.getByRole('button',{name:'View Level 6'}).click();await page.getByRole('dialog').getByRole('button',{name:'PLAY LEVEL 6',exact:true}).click();await page.locator('.wam-grid').waitFor();
    await page.evaluate(()=>{const v=qa.scene.__wam94Game,g=v.game;g.board.forEach((p,i)=>{if(p){p.type=g.config.palette[(Math.floor(i/6)*2+i%6)%5];p.special=null;}});g.targets={lips:1,bow:0,heel:0};g.moves=1;g.board[0]=g.piece('disco','disco');g.board[1]=g.piece('lips');v.render();});
    await page.locator('[data-cell="0"]').click();await page.locator('[data-cell="1"]').click();
    await page.getByRole('dialog',{name:'Level 6 complete!'}).waitFor({timeout:25000});
    assert.ok((await page.evaluate(()=>+localStorage.getItem('wambam-stars-6')))>=1);
    await page.getByRole('button',{name:'PLAY LEVEL 7',exact:true}).click();await page.locator('.wam-grid').waitFor();
    assert.equal(await page.evaluate(()=>qa.scene.__wam94Game.config.id),7);
    await page.screenshot({path:path.join(screenshots,'next-level-7.png')});
    await page.setViewportSize({width:900,height:1440});await page.screenshot({path:path.join(screenshots,'game-tablet.png')});
    const bounds=await page.locator('.wam-stage').boundingBox();assert.ok(bounds.x>=0&&bounds.y>=0&&bounds.x+bounds.width<=901&&bounds.y+bounds.height<=1441);
    await page.getByRole('button',{name:'Pause game'}).click();await page.getByRole('button',{name:'ROAD MAP',exact:true}).click();await page.getByRole('button',{name:'LEVEL LIST',exact:true}).waitFor();
    await page.screenshot({path:path.join(screenshots,'map-tablet.png')});
    // Locked nodes allow target previews but never start an unavailable level.
    await page.evaluate(()=>{qa.scene.__wam94Map.dispose();localStorage.setItem('wambam-unlocked-level','2');localStorage.setItem('wambam-completed-level','1');qa.scene={};});
    await page.getByRole('button',{name:'LEVEL LIST',exact:true}).click();await page.getByRole('button',{name:'View Level 9',exact:true}).click();
    assert.equal(await page.getByRole('button',{name:'LEVEL LOCKED',exact:true}).isDisabled(),true);
    await page.getByRole('button',{name:'BACK TO MAP',exact:true}).click();await page.getByRole('button',{name:'MY LEVEL',exact:true}).click();
    const focused=await page.evaluate(()=>document.activeElement.dataset.level);assert.equal(focused,'2');
    await page.getByRole('button',{name:'Home',exact:true}).click();await page.waitForFunction(()=>document.body.dataset.home==='true');
    // Load the unchanged GDevelop/Cordova front end with only the browser-ready event shim.
    let full=(await fs.readFile(path.join(www,'index.html'),'utf8')).replace("<script src='cordova.js'></script>",'').replace('document.addEventListener("deviceready", onDeviceReady, false);','window.addEventListener("load", onDeviceReady);');
    await fs.writeFile(path.join(www,'integration-check.html'),full);
    await page.goto(url.replace('qa.html','integration-check.html'));await page.locator('#wambam-home-effects').waitFor({timeout:30000});
    await page.locator('#wambam-blustudio-boot').waitFor({state:'detached',timeout:10000});
    await page.screenshot({path:path.join(screenshots,'original-home.png')});
    const home=await page.locator('#wambam-home-effects').boundingBox();
    await page.mouse.click(home.x+home.width*.5,home.y+home.height*.735);
    await page.getByRole('button',{name:'LEVEL LIST',exact:true}).waitFor();
    await page.getByRole('button',{name:'PLAY LEVEL 2',exact:true}).click();
    await page.getByRole('dialog').getByRole('button',{name:'PLAY LEVEL 2',exact:true}).click();
    await page.locator('.wam-grid').waitFor();assert.equal(await page.locator('.wam-cell').count(),60);
    await page.getByRole('button',{name:'Pause game'}).click();await page.getByRole('button',{name:'HOME',exact:true}).click();
    await page.locator('#wambam-home-effects').waitFor();assert.equal(await page.locator('canvas').evaluate(e=>getComputedStyle(e).visibility),'visible');
    assert.deepEqual(failures,[]);console.log('PASS: all new levels, targets, swipe controls, last-move win, next level, locked previews, map spacing, tablet layout and original home-to-map-to-game return flow.');
  }finally{await browser.close();await new Promise(r=>server.close(r));}
}
main().catch(error=>{console.error(error);process.exitCode=1;});
