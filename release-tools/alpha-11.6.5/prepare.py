from pathlib import Path
import sys

root=Path(sys.argv[1])
p=root/'wam-map.js'
assert p.exists()
s=p.read_text()

old="""      C.AREAS.forEach((area,i)=>{const b=button(`${area.from}–${area.to}`,()=>this.showArea(i),'secondary');b.setAttribute('aria-label',`Area ${i+1}: ${area.name}`);this.tabs.append(b);});this.stage.append(this.tabs);"""
new="""      C.AREAS.forEach((area,i)=>{const b=button(`${area.from}–${area.to}`,()=>this.showArea(i),'secondary');if(area.from>=101)b.classList.add('wam-three-range');b.setAttribute('aria-label',`Area ${i+1}: ${area.name}`);this.tabs.append(b);});this.stage.append(this.tabs);"""
assert old in s
s=s.replace(old,new,1)

oldcss=""".wam-area-tabs{position:absolute;left:0;right:0;top:170px;height:90px;display:flex;gap:12px;padding:12px 24px;background:#28152e;z-index:20;overflow-x:auto;touch-action:pan-x}.wam-area-tabs .wam-button{flex:0 0 145px;padding:10px;font-size:23px;border-radius:18px;touch-action:pan-x}.wam-area-tabs [aria-current=true]{border-color:#6df5e7;color:#6df5e7;background:#54344e}"""
newcss=""".wam-area-tabs{position:absolute;left:0;right:0;top:170px;height:90px;display:flex;gap:12px;padding:12px 24px;background:#28152e;z-index:20;overflow-x:auto;touch-action:pan-x}.wam-area-tabs .wam-button{flex:0 0 145px;padding:10px;font-size:23px;border-radius:18px;touch-action:pan-x}.wam-area-tabs .wam-button.wam-three-range{font-size:18px!important;line-height:1!important;white-space:nowrap!important;letter-spacing:-.4px!important;display:flex!important;align-items:center!important;justify-content:center!important;padding:8px 6px!important}.wam-area-tabs [aria-current=true]{border-color:#6df5e7;color:#6df5e7;background:#54344e}"""
assert oldcss in s
s=s.replace(oldcss,newcss,1)

oldnode=""".wam-map-node{position:relative;display:block;margin:0 auto;width:78px;height:78px;border:5px solid #ffec9c;border-radius:50%;background:radial-gradient(circle at 30% 20%,#ff92c4,#e51c82 50%,#940b50);color:#fff;font-size:34px;font-weight:900;text-shadow:0 3px #590b36;box-shadow:0 6px 0 #781642,0 0 0 4px #6b2352;touch-action:pan-y!important}"""
newnode=""".wam-map-node{position:relative;display:block;margin:0 auto;width:78px;height:78px;border:5px solid #ffec9c;border-radius:50%;background:radial-gradient(circle at 30% 20%,#ff92c4,#e51c82 50%,#940b50);color:#fff;font-size:34px;font-weight:900;text-shadow:0 3px #590b36;box-shadow:0 6px 0 #781642,0 0 0 4px #6b2352;touch-action:pan-y!important}.wam-map-node.wam-three-digit{font-size:27px!important;line-height:1!important;letter-spacing:-1px!important;white-space:nowrap!important;padding:0!important;box-sizing:border-box!important;display:flex!important;align-items:center!important;justify-content:center!important;text-align:center!important}"""
assert oldnode in s
s=s.replace(oldnode,newnode,1)

oldcreate="""        const node=el('button','wam-map-node'+(locked?' locked':'')+(completed?' complete':'')+(config.id===this.progress.unlocked?' current':''));node.type='button';node.dataset.level=String(config.id);node.textContent=String(config.id);"""
newcreate="""        const node=el('button','wam-map-node'+(locked?' locked':'')+(completed?' complete':'')+(config.id===this.progress.unlocked?' current':''));node.type='button';node.dataset.level=String(config.id);if(config.id>=100)node.classList.add('wam-three-digit');node.textContent=String(config.id);"""
assert oldcreate in s
s=s.replace(oldcreate,newcreate,1)

oldlist="""      C.levels.forEach(config=>{const locked=false,b=button(String(config.id),()=>{modal.close();this.focus(config.id);this.preview(config.id);},locked?'secondary':'');b.append(el('small','',locked?'LOCKED':this.progress.stars[config.id-1]?'★'.repeat(this.progress.stars[config.id-1]):'VIEW'));b.setAttribute('aria-label',`View Level ${config.id}`);grid.append(b);});modal.card.append(grid,button('CLOSE',()=>modal.close(),'secondary'));"""
newlist="""      C.levels.forEach(config=>{const locked=false,b=button(String(config.id),()=>{modal.close();this.focus(config.id);this.preview(config.id);},locked?'secondary':'');if(config.id>=100)b.classList.add('wam-three-digit-picker');b.append(el('small','',locked?'LOCKED':this.progress.stars[config.id-1]?'★'.repeat(this.progress.stars[config.id-1]):'VIEW'));b.setAttribute('aria-label',`View Level ${config.id}`);grid.append(b);});modal.card.append(grid,button('CLOSE',()=>modal.close(),'secondary'));"""
assert oldlist in s
s=s.replace(oldlist,newlist,1)

oldpick=""".wam-level-picker{display:grid;grid-template-columns:repeat(5,1fr);gap:12px;margin:25px 0}.wam-level-picker .wam-button{min-height:80px;border-radius:16px;padding:7px;font-size:26px;margin:0}.wam-level-picker small{display:block;font-size:12px;margin-top:6px}"""
newpick=""".wam-level-picker{display:grid;grid-template-columns:repeat(5,1fr);gap:12px;margin:25px 0}.wam-level-picker .wam-button{min-height:80px;border-radius:16px;padding:7px;font-size:26px;margin:0}.wam-level-picker .wam-button.wam-three-digit-picker{font-size:21px!important;white-space:nowrap!important;letter-spacing:-.5px!important}.wam-level-picker small{display:block;font-size:12px;margin-top:6px}"""
assert oldpick in s
s=s.replace(oldpick,newpick,1)

p.write_text(s)
print('Fixed map 3-digit level numbers and 101-200 area tabs to fit cleanly.')
