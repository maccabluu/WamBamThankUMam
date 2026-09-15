from pathlib import Path
import shutil
import sys

root = Path(sys.argv[1])
tools = Path(__file__).resolve().parent

for name in ['gameplay-1124.js', 'microphone-clean.svg', 'heel-clean.svg', 'free-swap.svg']:
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
assert 'gameplay-1123.js' in html, '11.2.3 production base not detected'
assert 'gameplay-1124.js' not in html, '11.2.4 already injected'
html = html.replace('</body>', '  <script src="gameplay-1124.js"></script>\n</body>', 1)
index.write_text(html)

for name in ['wam-campaign.js', 'data.js', 'code3.js']:
    p = root / name
    if p.exists():
        p.write_text(p.read_text().replace('11.2.3', '11.2.4'))

assert '<script src="gameplay-1124.js"></script>' in index.read_text()
print('Applied Alpha 11.2.4: bigger lower board and transparent booster artwork.')
