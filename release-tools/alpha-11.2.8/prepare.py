from pathlib import Path
import shutil
import sys

root = Path(sys.argv[1])
tools = Path(__file__).resolve().parent

for name in ['gameplay-1128.js','booster-mic-1128.svg','booster-heel-1128.svg','booster-disco-1128.svg','booster-swap-1128.svg']:
    src = tools / name
    assert src.exists(), f'{name} missing'
    if name.endswith('.svg'):
        dst = root / 'icons' / name
        dst.parent.mkdir(parents=True, exist_ok=True)
    else:
        dst = root / name
    shutil.copyfile(src, dst)

index = root / 'index.html'
html = index.read_text()
assert 'gameplay-1126.js' in html, '11.2.6 HUD base missing'
assert 'gameplay-1128.js' not in html, '11.2.8 already injected'
html = html.replace('</body>', '  <script src="gameplay-1128.js"></script>\n</body>', 1)
index.write_text(html)

for name in ['wam-campaign.js','data.js','code3.js']:
    p = root / name
    if p.exists():
        p.write_text(p.read_text().replace('11.2.7','11.2.8'))

assert '<script src="gameplay-1128.js"></script>' in index.read_text()
for name in ['booster-mic-1128.svg','booster-heel-1128.svg','booster-disco-1128.svg','booster-swap-1128.svg']:
    assert '<svg' in (root/'icons'/name).read_text()
print('Applied Alpha 11.2.8: premium reference-inspired booster bar and refreshed booster artwork.')
