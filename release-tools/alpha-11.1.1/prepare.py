from pathlib import Path
import shutil,sys,re
root=Path(sys.argv[1]); source=Path(__file__).parent; new_home=Path(sys.argv[2])

def once(text,old,new):
    assert old in text, f'Missing expected hook: {old[:100]}'
    return text.replace(old,new,1)

# Exact user-supplied new home artwork.
shutil.copy2(new_home, root/'home_screen_v2.jpg')

# Load new transparent home controls after Wam World.
p=root/'index.html'; s=p.read_text()
s=once(s,'<script src="wam-world.js"></script>','<script src="wam-world.js"></script>\n<script src="home-controls-111.js"></script>')
p.write_text(s)

# Attach the controls to the real existing home scene after Wam World is attached.
p=root/'code0.js'; s=p.read_text()
s=once(s,'if(window.WamWorld&&window.WamWorld.attachHome)window.WamWorld.attachHome(runtimeScene);','if(window.WamWorld&&window.WamWorld.attachHome)window.WamWorld.attachHome(runtimeScene);\nif(window.WamHome111&&window.WamHome111.attachHome)window.WamHome111.attachHome(runtimeScene);')
p.write_text(s)

# Move the real in-game version markers forward, retaining campaign and saves.
for name in ['wam-campaign.js','data.js','code3.js']:
    p=root/name; s=p.read_text(); s=s.replace('11.1.0','11.1.1'); p.write_text(s)

shutil.copy2(source/'home-controls.js',root/'home-controls-111.js')
print('Applied Alpha 11.1.1 exact home artwork and working home hotspots.')
