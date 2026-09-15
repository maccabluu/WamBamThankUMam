from pathlib import Path
import shutil
import sys

root=Path(sys.argv[1])
tools=Path(__file__).resolve().parent
src=tools/'gameplay-1129.js'
assert src.exists(), 'gameplay-1129.js missing'
shutil.copyfile(src, root/'gameplay-1129.js')

index=root/'index.html'
html=index.read_text()
assert 'gameplay-1128.js' in html, '11.2.8 production base missing'
assert 'gameplay-1129.js' not in html, '11.2.9 already injected'
html=html.replace('</body>','  <script src="gameplay-1129.js"></script>\n</body>',1)
index.write_text(html)

for name in ['wam-campaign.js','data.js','code3.js']:
    p=root/name
    if p.exists():
        p.write_text(p.read_text().replace('11.2.8','11.2.9'))

assert '<script src="gameplay-1129.js"></script>' in index.read_text()
print('Applied Alpha 11.2.9: force reference-style booster cards directly at runtime.')
