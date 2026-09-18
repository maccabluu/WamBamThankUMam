from pathlib import Path
import sys

root=Path(sys.argv[1])
src=Path(__file__).resolve().parent/'layout-1156.js'
assert src.exists()
index=root/'index.html'
text=index.read_text()
assert 'background-1155.js' in text
if 'layout-1156.js' not in text:
    text=text.replace('</body>','  <script src="layout-1156.js"></script>\n</body>',1)
    index.write_text(text)
(root/'layout-1156.js').write_text(src.read_text())
print('Applied Levels 11-100 level-bar and booster-strip layout patch.')
