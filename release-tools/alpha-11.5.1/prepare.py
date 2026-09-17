from pathlib import Path
import shutil
import sys

root = Path(sys.argv[1])
tools = Path(__file__).resolve().parent

required = [
    root / 'index.html',
    root / 'wam-campaign.js',
    root / 'wam-engine.js',
    root / 'gameplay-1140.js',
    root / 'gameplay-1142.js',
    root / 'gameplay-1150.js',
    root / 'artwork' / 'frankie-level10-bg-1150.png',
]
for p in required:
    assert p.exists(), f'Missing 11.5.0 production file: {p}'

src = tools / 'gameplay-1151.js'
text = src.read_text()
assert ".wam1140-boss .wam1140-health{top:18px!important}" in text
shutil.copyfile(src, root / 'gameplay-1151.js')

index = root / 'index.html'
html = index.read_text()
assert '<script src="gameplay-1150.js"></script>' in html, '11.5.0 gameplay layer missing'
assert 'gameplay-1151.js' not in html, '11.5.1 already injected'
html = html.replace('</body>', '  <script src="gameplay-1151.js"></script>\n</body>', 1)
index.write_text(html)

for name in ['data.js', 'code3.js']:
    p = root / name
    if p.exists():
        p.write_text(p.read_text().replace('11.5.0', '11.5.1'))

print('Prepared Alpha 11.5.1: Frankie Flash boss health group moved from top 38px to 18px. No gameplay logic changed.')
