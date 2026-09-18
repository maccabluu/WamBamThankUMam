from pathlib import Path
import sys

root=Path(sys.argv[1])
src=Path(__file__).resolve().parent/'reaction-11510.js'
assert src.exists()

index=root/'index.html'
text=index.read_text()
assert 'transition-1159.js' in text

if 'reaction-11510.js' not in text:
    text=text.replace('</body>','  <script src="reaction-11510.js"></script>\n</body>',1)
    index.write_text(text)

(root/'reaction-11510.js').write_text(src.read_text())

print('Applied Level 10 Frankie reaction bubble position patch.')
