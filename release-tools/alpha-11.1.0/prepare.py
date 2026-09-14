from pathlib import Path
import shutil,sys,re
root=Path(sys.argv[1]); source=Path(__file__).parent

def once(text,old,new):
    assert old in text, f'Missing expected hook: {old[:80]}'
    return text.replace(old,new,1)

# Load Wam World after the real Wam UI and map runtime are available.
p=root/'index.html'; s=p.read_text()
s=once(s,'<script src="wam-map.js"></script>','<script src="wam-map.js"></script>\n<script src="wam-world.js"></script>')
p.write_text(s)

# Attach Wam World to the real home scene, using the current GDevelop runtime scene for navigation.
p=root/'code0.js'; s=p.read_text()
s=once(s,'gdjs.Untitled_32sceneCode.userFuncWamBoot(runtimeScene);','gdjs.Untitled_32sceneCode.userFuncWamBoot(runtimeScene);\nif(window.WamWorld&&window.WamWorld.attachHome)window.WamWorld.attachHome(runtimeScene);')
p.write_text(s)

# Move the in-game version markers to 11.1.0 while retaining all existing gameplay/data.
for name in ['wam-campaign.js','data.js','code3.js']:
    p=root/name; s=p.read_text()
    s=s.replace('11.0.3','11.1.0')
    p.write_text(s)

shutil.copy2(source/'wam-world.js',root/'wam-world.js')
print('Integrated Wam World, story, Lounge upgrades and boss presentation into Alpha 11.1.0.')
