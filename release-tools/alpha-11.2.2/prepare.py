from pathlib import Path
import shutil
import sys

root = Path(sys.argv[1])
tools = Path(__file__).resolve().parent

src = tools / 'gameplay-1122.js'
dst = root / 'gameplay-1122.js'
assert src.exists(), 'gameplay-1122.js missing'
shutil.copyfile(src, dst)

index = root / 'index.html'
html = index.read_text()
assert 'gameplay-1121.js' in html, '11.2.1 production base not detected'
assert 'gameplay-1122.js' not in html, '11.2.2 already injected'
html = html.replace('</body>', '  <script src="gameplay-1122.js"></script>\n</body>', 1)
index.write_text(html)

for name in ['wam-campaign.js','data.js','code3.js']:
    p = root / name
    if p.exists():
        t = p.read_text()
        p.write_text(t.replace('11.2.1', '11.2.2'))

assert dst.exists()
assert '<script src="gameplay-1122.js"></script>' in index.read_text()
print('Applied Alpha 11.2.2: 580px Level 1 board and transparent high-visibility boosters.')
