from pathlib import Path
import sys

root=Path(sys.argv[1])
src=Path(__file__).resolve().parent/'counter-align-1157.js'
assert src.exists()
index=root/'index.html'
text=index.read_text()
assert 'layout-1156.js' in text
if 'counter-align-1157.js' not in text:
    text=text.replace('</body>','  <script src="counter-align-1157.js"></script>\n</body>',1)
    index.write_text(text)
(root/'counter-align-1157.js').write_text(src.read_text())
print('Applied Levels 11-100 booster count alignment patch.')
