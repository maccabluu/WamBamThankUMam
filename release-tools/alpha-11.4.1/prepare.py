from pathlib import Path
import shutil
import sys

root = Path(sys.argv[1])
tools = Path(__file__).resolve().parent

assert (root / 'gameplay-1140.js').exists(), '11.4.0 production base missing gameplay-1140.js'
assert (root / 'artwork' / 'frankie-level10-bg.jpg').exists(), 'Frankie Level 10 artwork missing'
assert (root / 'artwork' / 'booster-bar-reference-1132.png').exists(), 'booster strip missing'
assert (root / 'wam-campaign.js').exists(), 'campaign missing'
assert (root / 'wam-ui.js').exists(), 'wam-ui.js missing'

hammer_src = tools / 'booster-hammer-1141.svg'
assert hammer_src.exists(), 'Hammer reward icon missing'
icons = root / 'icons'
icons.mkdir(parents=True, exist_ok=True)
shutil.copyfile(hammer_src, icons / 'booster-hammer-1141.svg')

# Rename the old visual label everywhere without changing the underlying
# booster key. The real inventory key stays "hammer" so existing saves keep working.
renamed = 0
for p in root.glob('*.js'):
    text = p.read_text()
    count = text.count('Heel Smash')
    if count:
        p.write_text(text.replace('Heel Smash', 'Hammer'))
        renamed += count
assert renamed >= 1, 'No Heel Smash label found to rename'

ui = root / 'wam-ui.js'
text = ui.read_text()

# Completion rewards already award the real "hammer" inventory key. Only the
# old heel artwork was still being displayed. Point that reward at the new hammer icon.
old_icon = "key==='hammer'?C.PIECES.heel.image"
new_icon = "key==='hammer'?'icons/booster-hammer-1141.svg'"
assert text.count(old_icon) == 1, 'Hammer reward icon expression not found exactly once'
text = text.replace(old_icon, new_icon, 1)

# Make the built-in modal shade sit above every custom HUD/booster layer.
old_shade = '.wam-shade{position:absolute;inset:0;z-index:1000;'
new_shade = '.wam-shade{position:absolute;inset:0;z-index:60000;'
assert text.count(old_shade) == 1, 'Modal shade z-index source not found exactly once'
text = text.replace(old_shade, new_shade, 1)
ui.write_text(text)

for name in ['data.js', 'code3.js']:
    p = root / name
    if p.exists():
        p.write_text(p.read_text().replace('11.4.0', '11.4.1'))

check = ui.read_text()
assert "hammer:'Hammer'" in check, 'Hammer booster label not updated in wam-ui.js'
assert "icons/booster-hammer-1141.svg" in check, 'Hammer reward icon hook missing'
assert 'z-index:60000' in check, 'Modal z-index fix missing'
assert 'Heel Smash' not in check, 'Old Heel Smash label remains in wam-ui.js'
print('Applied Alpha 11.4.1: Hammer reward visuals/label and modal-over-HUD layering fix.')
