from pathlib import Path
import shutil
import sys

root=Path(sys.argv[1])
tools=Path(__file__).resolve().parent

required=[
    root/'index.html',
    root/'wam-campaign.js',
    root/'wam-engine.js',
    root/'gameplay-1140.js',
    root/'gameplay-1142.js',
    root/'gameplay-1150.js',
    root/'gameplay-1151.js',
    root/'goals-1152.js',
    root/'goals-1153.js',
    root/'goals-1154.js',
    root/'artwork'/'wambam-level1-bg.jpg',
    root/'artwork'/'frankie-level10-bg-1150.png',
]
for p in required:
    assert p.exists(), f'Missing 11.5.4 production file: {p}'

src=tools/'background-1155.js'
text=src.read_text()
for needle in [
    "const MIN_LEVEL=11;",
    "const MAX_LEVEL=100;",
    "const BG_PATH='artwork/wambam-level1-bg.jpg';",
    "imp(art,'object-fit','cover');",
    "imp(art,'filter','saturate(1.04) brightness(.94)');",
]:
    assert needle in text, needle
shutil.copyfile(src,root/'background-1155.js')

index=root/'index.html'
html=index.read_text()
assert '<script src="goals-1154.js"></script>' in html, '11.5.4 layer missing'
assert 'background-1155.js' not in html, '11.5.5 already injected'
html=html.replace('</body>','  <script src="background-1155.js"></script>\n</body>',1)
index.write_text(html)

for name in ['data.js','code3.js']:
    p=root/name
    if p.exists():
        p.write_text(p.read_text().replace('11.5.4','11.5.5'))

print('Prepared Alpha 11.5.5: Levels 11-100 use the same gameplay background and presentation as Levels 1-9. Gameplay logic unchanged.')
