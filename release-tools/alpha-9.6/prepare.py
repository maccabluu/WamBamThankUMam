#!/usr/bin/env python3
"""Apply the 9.6 web game to the verified 9.3 APK's extracted www folder.

Usage: python3 prepare.py PATH/TO/assets/www
The native Cordova runtime, app identifier, artwork and existing save origin stay
in the original APK. Signing runs in Actions with the existing signing secrets.
"""
from pathlib import Path
import json
import re
import shutil
import sys

root = Path(sys.argv[1])
source = Path(__file__).parent / 'web'
html = root / 'index.html'
text = html.read_text()
assert 'wam-campaign.js' not in text, 'Already updated. Start from the 9.3 APK.'
marker = '<script src="code0.js"'
assert marker in text, 'Missing original GDevelop entry point'
scripts = '\n'.join(f'<script src="{name}"></script>' for name in
                    ['wam-campaign.js', 'wam-engine.js', 'wam-ui.js', 'wam-map.js'])
html.write_text(text.replace(marker, scripts + '\n\t' + marker, 1))

data = root / 'data.js'
project = data.read_text()
assert '"version":"9.3.0"' in project, 'Expected the supplied Alpha 9.3 project'
data.write_text(project.replace('"version":"9.3.0"', '"version":"9.6.0"', 1))

home = root / 'code0.js'
text = home.read_text()
old = 'Math.max(1, Math.min(5, readNumber("wambam-selected-level", 1)))'
assert old in text, 'Expected original home progress label'
text = text.replace(old, 'window.WamCampaign.progress(window.WamUI.storage).selected', 1)
# Map and game navigation replace scenes. Replace Home too so returning to it
# does not leave another inactive Home scene underneath on every visit.
old = 'gdjs.evtTools.runtimeScene.pushScene(runtimeScene, "Level Map");'
assert old in text, 'Expected original Home-to-map navigation'
text = text.replace(old, 'gdjs.evtTools.runtimeScene.replaceScene(runtimeScene, "Level Map", false);', 1)
text = text.replace('Clear 4 handbags in Level 5.', 'Clear 4 handbags in Levels 5 or 8.')
home.write_text(text)

settings = root / 'code3.js'
text = settings.read_text()
text, count = re.subn(r'const CURRENT_VERSION = "[^"]+";', 'const CURRENT_VERSION = "9.6.0";', text, count=1)
assert count == 1, 'Missing installed version label'
text = text.replace('Swap two icons to match 3 or more. Make a 2 × 2 square for a Disco. Swap a Disco with an icon to turn all matching icons into Discos, clear targets and earn coins.',
                    'Swap neighbours to match 3. Match 4 for a line blast. A T or L creates an area blast. Match 5 for a Disco. From Level 10, squares make Flying Kisses. Clear ice, gift boxes and handbags, combine specials and decorate four areas across 40 levels.')
settings.write_text(text)

shutil.copytree(Path(__file__).parent.parent / 'alpha-9.4/web/icons', root / 'icons', dirs_exist_ok=True)

for item in source.iterdir():
    if item.is_dir():
        shutil.copytree(item, root / item.name, dirs_exist_ok=True)
    else:
        shutil.copy2(item, root / item.name)

print(json.dumps({'version': '9.6.0', 'levels': 40, 'new_icons': len(list((root/'icons').glob('*.png'))), 'www': str(root)}))
