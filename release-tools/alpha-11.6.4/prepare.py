from pathlib import Path
import sys

root=Path(sys.argv[1])
layout=root/'layout-1156.js'
assert layout.exists()

s=layout.read_text()

anchor="""  const stars=v.stage.querySelector('.wam1150-stars');
  if(stars)imp(stars,'z-index','120');
}"""
insert="""  const stars=v.stage.querySelector('.wam1150-stars');
  if(stars)imp(stars,'z-index','120');

  const id=Number(v?.config?.id||0);
  const level=v.stage.querySelector('.wam1150-level');
  if(level && id>=100 && id<=200){
    imp(level,'white-space','nowrap');
    imp(level,'font-size','19px');
    imp(level,'line-height','1');
    imp(level,'padding','0 6px');
    imp(level,'box-sizing','border-box');
    imp(level,'overflow','hidden');
    imp(level,'text-align','center');
    imp(level,'display','flex');
    imp(level,'align-items','center');
    imp(level,'justify-content','center');
  }
}"""
assert anchor in s
s=s.replace(anchor,insert,1)
layout.write_text(s)
print('Applied 3-digit level label fit fix for Levels 100-200.')
