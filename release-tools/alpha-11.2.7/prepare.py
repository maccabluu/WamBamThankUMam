from pathlib import Path
import shutil
import sys

root = Path(sys.argv[1])
tools = Path(__file__).resolve().parent

# Replace the Heel Smash artwork with the cleaner 11.2.7 stiletto.
src = tools / 'heel-smash-1127.svg'
assert src.exists(), 'heel-smash-1127.svg missing'
dst = root / 'icons' / 'heel-smash-1126.svg'
dst.parent.mkdir(parents=True, exist_ok=True)
shutil.copyfile(src, dst)

# Extend Level 1 from 8 columns x 8 rows to 9 columns x 8 rows.
campaign = root / 'wam-campaign.js'
assert campaign.exists(), 'wam-campaign.js missing'
s = campaign.read_text()
old_square = "square:['########','########','########','########','########','########','########','########']"
new_square = "square:['#########','#########','#########','#########','#########','#########','#########','#########']"
assert s.count(old_square) == 1, f'Expected one 8x8 square definition, found {s.count(old_square)}'
s = s.replace(old_square, new_square, 1)
s = s.replace('11.2.6', '11.2.7')
campaign.write_text(s)

# Add the 11.2.7 layout override after the existing HUD patches.
layout_src = tools / 'gameplay-1127.js'
assert layout_src.exists(), 'gameplay-1127.js missing'
shutil.copyfile(layout_src, root / 'gameplay-1127.js')
index = root / 'index.html'
html = index.read_text()
assert 'gameplay-1126.js' in html, '11.2.6 production base not detected'
assert 'gameplay-1127.js' not in html, '11.2.7 already injected'
html = html.replace('</body>', '  <script src="gameplay-1127.js"></script>\n</body>', 1)
index.write_text(html)

for name in ['data.js', 'code3.js']:
    p = root / name
    if p.exists():
        p.write_text(p.read_text().replace('11.2.6', '11.2.7'))

patched = campaign.read_text()
assert new_square in patched
assert '<svg' in dst.read_text()
assert '<script src="gameplay-1127.js"></script>' in index.read_text()
print('Applied Alpha 11.2.7: true leopard stiletto Heel Smash plus a 9-column Level 1 board extended on the right.')
