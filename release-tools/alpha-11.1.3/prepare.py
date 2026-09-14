from pathlib import Path
import sys

root = Path(sys.argv[1])

def once(text, old, new, label):
    assert old in text, f"Missing expected {label} hook: {old[:120]}"
    assert text.count(old) == 1, f"Expected one {label} hook, found {text.count(old)}"
    return text.replace(old, new, 1)

# Alpha 11.1.2 recreated the transparent home-control DOM on every GDevelop
# frame. The pointer-down node disappeared before click, so PLAY appeared dead.
p = root / "home-controls-111.js"
s = p.read_text()
s = once(
    s,
    "function levelMap(){if(!currentRuntime)return;let names=[];try{const layouts=globalThis.gdjs?.projectData?.layouts||[];names=layouts.map(x=>x?.name).filter(Boolean)}catch(e){}const preferred=['Level Map','LevelMap','Map','World Map','Road Map'];let target=preferred.find(w=>names.some(n=>String(n).toLowerCase()===w.toLowerCase()));if(!target)target=names.find(n=>/map/i.test(String(n)));if(target){gdjs.evtTools.runtimeScene.replaceScene(currentRuntime,target,false);return}const p=C.progress(storage),level=Math.max(1,Math.min(C.TOTAL,Number(p.selected||p.unlocked||1)));C.write(storage,'wambam-selected-level',level);gdjs.evtTools.runtimeScene.replaceScene(currentRuntime,'Game',false)}",
    "function levelMap(){if(!currentRuntime||blocked)return;gdjs.evtTools.runtimeScene.replaceScene(currentRuntime,'Level Map',false)}",
    "PLAY handler",
)
s = once(
    s,
    "function attachHome(runtimeScene){currentRuntime=runtimeScene;css();const host=document.getElementById('wambam-home-effects');if(!host)return;host.querySelector('#wambam-home-111')?.remove();const root=document.createElement('div');root.id='wambam-home-111';host.appendChild(root);controlsRoot=root;if(blocked)root.classList.add('wam111-blocked');",
    "function attachHome(runtimeScene){currentRuntime=runtimeScene;css();const host=document.getElementById('wambam-home-effects');if(!host)return;const mounted=host.querySelector('#wambam-home-111');if(mounted){controlsRoot=mounted;return}const root=document.createElement('div');root.id='wambam-home-111';host.appendChild(root);controlsRoot=root;if(blocked)root.classList.add('wam111-blocked');",
    "stable home controls",
)
p.write_text(s)

# Consume touch releases as well as pointer/click events above the stable home
# controls. Home remains blocked until Wam World has finished closing.
p = root / "wam-world.js"
s = p.read_text()
s = once(
    s,
    "const stop=e=>e.stopPropagation();overlay.addEventListener('pointerdown',stop);overlay.addEventListener('click',stop);",
    "const stop=e=>e.stopPropagation();overlay.addEventListener('pointerdown',stop);overlay.addEventListener('pointerup',stop);overlay.addEventListener('touchstart',stop,{passive:true});overlay.addEventListener('touchend',stop);overlay.addEventListener('click',stop);",
    "overlay event isolation",
)
p.write_text(s)

# Preserve package identity, save keys, campaign content, artwork and levels.
for name in ["wam-campaign.js", "data.js", "code3.js"]:
    p = root / name
    p.write_text(p.read_text().replace("11.1.2", "11.1.3"))

print("Applied Alpha 11.1.3: stable controls, verified Level Map PLAY handler, and isolated Wam World input.")
