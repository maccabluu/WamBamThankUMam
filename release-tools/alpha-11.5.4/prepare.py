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
    root / 'goals-1152.js',
    root / 'goals-1153.js',
    root / 'artwork' / 'frankie-level10-bg-1150.png',
]
for p in required:
    assert p.exists(), f'Missing 11.5.3 production file: {p}'

src = tools / 'goals-1154.js'
text = src.read_text()
for needle in [
    "goals.appendChild(row)",
    "left:14px!important",
    "width:166px!important",
    "height:38px!important",
    "const tops=[70,118,166]",
    "Number(v?.config?.id)===10",
]:
    assert needle in text, needle
shutil.copyfile(src, root / 'goals-1154.js')

index = root / 'index.html'
html = index.read_text()
assert '<script src="goals-1153.js"></script>' in html, '11.5.3 goals layer missing'
assert 'goals-1154.js' not in html, '11.5.4 already injected'
html = html.replace('</body>', '  <script src="goals-1154.js"></script>\n</body>', 1)
index.write_text(html)

for name in ['data.js', 'code3.js']:
    p = root / name
    if p.exists():
        p.write_text(p.read_text().replace('11.5.3', '11.5.4'))

print('Prepared Alpha 11.5.4: Level 10 target rows are now children of the GOALS panel so they stay physically contained inside it. Gameplay logic unchanged.')
