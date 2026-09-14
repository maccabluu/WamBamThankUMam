from pathlib import Path
import sys,re

root=Path(sys.argv[1])

def once(text,old,new,label):
    assert old in text, f'Missing expected {label} hook: {old[:120]}'
    return text.replace(old,new,1)

# Fix the transparent home hitbox layer so it is disabled while Wam World is open.
p=root/'home-controls-111.js'
s=p.read_text()
s=once(s,
"let currentRuntime=null,panel=null;",
"let currentRuntime=null,panel=null,controlsRoot=null,blocked=false;",
"home state")
s=once(s,
".wam111-hit{position:absolute;border:0;background:transparent;color:transparent;padding:0;margin:0;pointer-events:auto;touch-action:manipulation;-webkit-tap-highlight-color:transparent}",
".wam111-hit{position:absolute;border:0;background:transparent;color:transparent;padding:0;margin:0;pointer-events:auto;touch-action:manipulation;-webkit-tap-highlight-color:transparent}\n#wambam-home-111.wam111-blocked .wam111-hit{pointer-events:none!important}",
"blocked hitbox css")
s=once(s,
"function close(){panel?.remove();panel=null}\nfunction shell(title){close();const root=document.getElementById('wambam-home-effects');if(!root)return null;",
"function close(){panel?.remove();panel=null}\nfunction setBlocked(v){blocked=!!v;if(controlsRoot)controlsRoot.classList.toggle('wam111-blocked',blocked);if(blocked)close()}\nfunction shell(title){if(blocked)return null;close();const root=document.getElementById('wambam-home-effects');if(!root)return null;",
"home blocking")
s=once(s,
"function levelMap(){if(!currentRuntime)return;gdjs.evtTools.runtimeScene.replaceScene(currentRuntime,'Level Map',false)}",
"function levelMap(){if(!currentRuntime)return;let names=[];try{const layouts=globalThis.gdjs?.projectData?.layouts||[];names=layouts.map(x=>x?.name).filter(Boolean)}catch(e){}const preferred=['Level Map','LevelMap','Map','World Map','Road Map'];let target=preferred.find(w=>names.some(n=>String(n).toLowerCase()===w.toLowerCase()));if(!target)target=names.find(n=>/map/i.test(String(n)));if(target){gdjs.evtTools.runtimeScene.replaceScene(currentRuntime,target,false);return}const p=C.progress(storage),level=Math.max(1,Math.min(C.TOTAL,Number(p.selected||p.unlocked||1)));C.write(storage,'wambam-selected-level',level);gdjs.evtTools.runtimeScene.replaceScene(currentRuntime,'Game',false)}",
"play navigation")
s=once(s,
"function world(){window.WamWorld?.open?.()}",
"function world(){setBlocked(true);close();if(window.WamWorld?.open)window.WamWorld.open();else setBlocked(false)}",
"world opener")
s=once(s,
"const root=document.createElement('div');root.id='wambam-home-111';host.appendChild(root);",
"const root=document.createElement('div');root.id='wambam-home-111';host.appendChild(root);controlsRoot=root;if(blocked)root.classList.add('wam111-blocked');",
"controls root")
s=once(s,
"window.WamHome111={attachHome,events,shop,profile,vip};",
"window.WamHome111={attachHome,events,shop,profile,vip,setBlocked};",
"home export")
p.write_text(s)

# Make Wam World fully interactive, prevent taps passing through to home controls,
# and add a real BACK button alongside the X.
p=root/'wam-world.js'
s=p.read_text()
s=once(s,
".wam-world-overlay{position:absolute;inset:0;z-index:500;background:",
".wam-world-overlay{position:absolute;inset:0;z-index:1500;pointer-events:auto!important;background:",
"world pointer css")
s=once(s,
".ww-top h1{margin:0;font-size:",
".ww-back-home{min-width:18%;min-height:52px;border:3px solid #ffe087;border-radius:18px;background:#1aa6ae;color:#fff;font:900 clamp(13px,3vw,21px) Arial;padding:1% 2%}.ww-top>div{flex:1;padding:0 2%}.ww-top h1{margin:0;font-size:",
"back button css")
s=once(s,
"function close(){overlay?.remove();overlay=null}\nfunction shell(title,sub){close();overlay=document.createElement('section');overlay.className='wam-world-overlay';overlay.innerHTML=`<div class=\"ww-top\"><div><small>${sub}</small><h1>${title}</h1></div><button class=\"ww-close\" aria-label=\"Close\">×</button></div><div class=\"ww-scroll\"></div>`;overlay.querySelector('.ww-close').onclick=close;document.getElementById('wambam-home-effects')?.appendChild(overlay);return overlay.querySelector('.ww-scroll')}",
"function close(resumeHome=true){overlay?.remove();overlay=null;if(resumeHome)setTimeout(()=>window.WamHome111?.setBlocked?.(false),260)}\nfunction shell(title,sub){close(false);window.WamHome111?.setBlocked?.(true);overlay=document.createElement('section');overlay.className='wam-world-overlay';overlay.innerHTML=`<div class=\"ww-top\"><button class=\"ww-back-home\" aria-label=\"Back to home\">← BACK</button><div><small>${sub}</small><h1>${title}</h1></div><button class=\"ww-close\" aria-label=\"Close\">×</button></div><div class=\"ww-scroll\"></div>`;const stop=e=>e.stopPropagation();overlay.addEventListener('pointerdown',stop);overlay.addEventListener('click',stop);const leave=e=>{e.preventDefault();e.stopPropagation();close(true)};overlay.querySelector('.ww-close').onclick=leave;overlay.querySelector('.ww-back-home').onclick=leave;document.getElementById('wambam-home-effects')?.appendChild(overlay);return overlay.querySelector('.ww-scroll')}",
"world shell")
s=once(s,
"function startBoss(level){if(!currentRuntime)return;write('wambam-selected-level',level);close();gdjs.evtTools.runtimeScene.replaceScene(currentRuntime,'Game',false)}",
"function startBoss(level){if(!currentRuntime)return;write('wambam-selected-level',level);close(false);gdjs.evtTools.runtimeScene.replaceScene(currentRuntime,'Game',false)}",
"boss close")
p.write_text(s)

# Version markers only. Existing campaign data, saves and artwork remain untouched.
for name in ['wam-campaign.js','data.js','code3.js']:
    p=root/name
    s=p.read_text().replace('11.1.1','11.1.2')
    p.write_text(s)

print('Applied Alpha 11.1.2: PLAY fallback, interactive Wam World, tap-through fix, and HOME back button.')
