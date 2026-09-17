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
    root / 'gameplay-1151.js',
    root / 'artwork' / 'frankie-level10-bg-1150.png',
]
for p in required:
    assert p.exists(), f'Missing 11.5.1 production file: {p}'

src = tools / 'goals-1152.js'
text = src.read_text()
for needle in [
    '.wam1140-boss .wam1140-goals',
    "height:232px!important",
    'const tops=[78,128,178]',
    "Number(v?.config?.id)===10",
]:
    assert needle in text, needle
shutil.copyfile(src, root / 'goals-1152.js')

index = root / 'index.html'
html = index.read_text()
assert '<script src="gameplay-1151.js"></script>' in html, '11.5.1 gameplay layer missing'
assert 'goals-1152.js' not in html, '11.5.2 already injected'
html = html.replace('</body>', '  <script src="goals-1152.js"></script>\n</body>', 1)
index.write_text(html)

for name in ['data.js', 'code3.js']:
    p = root / name
    if p.exists():
        p.write_text(p.read_text().replace('11.5.1', '11.5.2'))

print('Prepared Alpha 11.5.2: Level 10 GOALS panel spacing and target alignment fixed. Gameplay logic unchanged.')
