from pathlib import Path
import shutil
import sys

root = Path(sys.argv[1])
tools = Path(__file__).resolve().parent

src = tools / 'gameplay-1123.js'
dst = root / 'gameplay-1123.js'
assert src.exists(), 'gameplay-1123.js missing'
shutil.copyfile(src, dst)

index = root / 'index.html'
html = index.read_text()
assert 'gameplay-1122.js' in html, '11.2.2 production base not detected'
assert 'gameplay-1123.js' not in html, '11.2.3 already injected'
html = html.replace('</body>', '  <script src="gameplay-1123.js"></script>\n</body>', 1)
index.write_text(html)

for name in ['wam-campaign.js','data.js','code3.js']:
    p = root / name
    if p.exists():
        t = p.read_text()
        p.write_text(t.replace('11.2.2', '11.2.3'))

assert '<script src="gameplay-1123.js"></script>' in index.read_text()
print('Applied Alpha 11.2.3: more girl visible, blended booster art, Royal-style level progress.')
