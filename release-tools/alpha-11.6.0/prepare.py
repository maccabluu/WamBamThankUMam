from pathlib import Path
import base64, sys

root=Path(sys.argv[1])
tools=Path(__file__).resolve().parent
campaign=root/'wam-campaign.js'
assert campaign.exists()

# New transparent PNG icons are downloaded into assets/www/icons1160 by the production workflow.
icon_dir=root/'icons1160'
required=['glam-lipstick.png','pink-perfume.png','purple-perfume.png','blue-perfume.png','pink-purse.png','pink-heel.png','crown-lipstick.png','heart-compact.png','blue-controller.png','crown-football.png','blue-watch.png','pink-watch.png']
for name in required:
    p=icon_dir/name
    assert p.exists() and p.stat().st_size>1000, name

s=campaign.read_text()
assert "const VERSION = '11.2.0';" in s
s=s.replace("const VERSION = '11.2.0';","const VERSION = '11.6.0';",1)

piece_anchor="    eyelashes: {label:'Eyelashes', image:'icons/eyelashes.png', card:true}\n  };"
assert piece_anchor in s
new_piece_block="""    eyelashes: {label:'Eyelashes', image:'icons/eyelashes.png', card:true},
    glam_lipstick: {label:'Glam lipstick', image:'icons1160/glam-lipstick.png'},
    pink_perfume: {label:'Pink perfume', image:'icons1160/pink-perfume.png'},
    purple_perfume: {label:'Purple perfume', image:'icons1160/purple-perfume.png'},
    blue_perfume: {label:'Blue perfume', image:'icons1160/blue-perfume.png'},
    pink_purse: {label:'Pink handbag', image:'icons1160/pink-purse.png'},
    pink_heel: {label:'Pink heel', image:'icons1160/pink-heel.png'},
    crown_lipstick: {label:'Crown lipstick', image:'icons1160/crown-lipstick.png'},
    heart_compact: {label:'Heart compact', image:'icons1160/heart-compact.png'},
    blue_controller: {label:'Blue controller', image:'icons1160/blue-controller.png'},
    crown_football: {label:'Crowned football', image:'icons1160/crown-football.png'},
    blue_watch: {label:'Blue watch', image:'icons1160/blue-watch.png'},
    pink_watch: {label:'Pink watch', image:'icons1160/pink-watch.png'}
  };"""
s=s.replace(piece_anchor,new_piece_block,1)

areas_anchor="  const AREAS=[\n"
assert areas_anchor in s
extra_levels="""
  // Alpha 11.6.0 expansion: 100 authored campaign levels, 101-200.
  // The boards use the same polished match-3 presentation as the main campaign,
  // while preserving distinct shapes, goals, moves, blockers and difficulty.
  const EXPANSION_PALETTES=[
    ['glam_lipstick','pink_perfume','pink_purse','pink_heel','heart_compact'],
    ['purple_perfume','blue_perfume','pink_watch','crown_lipstick','pink_purse'],
    ['blue_controller','crown_football','blue_watch','microphone','vinyl'],
    ['blue_controller','pink_watch','glam_lipstick','crown_football','pink_perfume'],
    ['heart_compact','blue_watch','pink_heel','blue_perfume','crown_lipstick'],
    ['pink_purse','blue_controller','pink_watch','purple_perfume','crown_football']
  ];
  const EXPANSION_AREAS=[
    'Neon Runway','Crown Arcade','Midnight Boulevard','Velvet Casino','Pop Star Penthouse',
    'Gold Rush Garage','Starlight Social','Electric Promenade','Diamond District','Wam Bam Afterparty'
  ];
  const EXPANSION_STAGES=['Opening','Spotlight','Shuffle','Showcase','Rush','Remix','Challenge','Fever','Encore','Finale'];
  const EXPANSION_SHAPES=['square','stage','arch','steps','hourglass','wings','window','diamond','bridge','split'];
  const EXPANSION_KINDS=['ice','crate','handbag'];
  for(let n=0;n<100;n++){
    const id=101+n,area=Math.floor(n/10),slot=n%10;
    const shape=EXPANSION_SHAPES[(slot+area*2)%EXPANSION_SHAPES.length],mask=SHAPES[shape];
    const palette=EXPANSION_PALETTES[(area+slot)%EXPANSION_PALETTES.length];
    const kind=EXPANSION_KINDS[(slot+area)%EXPANSION_KINDS.length];
    const blockerCount=8+((slot*2+area)%6)*2;
    const positions=obstacleCells(mask,blockerCount,id);
    const bags=kind==='handbag'?positions:[];
    const crates=kind==='crate'?positions.map(([r,c])=>[r,c,id>=151?2:1]):[];
    const ice=kind==='ice'?positions.map(([r,c])=>[r,c,id>=141?2:1]):[];
    const firstGoal=22+((slot+area)%5)*2;
    const secondGoal=18+((slot*2+area)%5)*2;
    const targets={
      [kind]:positions.length,
      [palette[0]]:firstGoal,
      [palette[1]]:secondGoal
    };
    const moves=28+Math.floor(area/2)+(slot%4)*2+(slot===9?5:0);
    const difficulty=slot===9?'Finale':slot===4||slot===7?'Hard':'Normal';
    const tip=(kind==='ice'?'Clear the ice while collecting the new Wam Bam pieces.':kind==='crate'?'Break the gift boxes while collecting the new Wam Bam pieces.':'Open the pink locks while collecting the new Wam Bam pieces.')+' Match 4 for a line blast, make a square for a Flying Kiss, and match 5 for a Disco.';
    levels.push(Object.freeze({
      id,
      name:`${EXPANSION_AREAS[area]} ${EXPANSION_STAGES[slot]}`,
      moves,mask,shape,area:10+area,difficulty,squareSpecial:'flyer',targets,palette,bags,crates,ice,tip,
      background:'artwork/wambam-level1-bg.jpg'
    }));
  }

"""
s=s.replace(areas_anchor,extra_levels+areas_anchor,1)

# Add ten new map/renovation areas for Levels 101-200.
area_push_anchor="  const DECOR_COSTS=[2,3,2,3];"
assert area_push_anchor in s
area_push="""  EXPANSION_AREAS.forEach((name,i)=>AREAS.push({
    name,from:101+i*10,to:110+i*10,
    colour:['#f14391','#357be8','#b248d5','#ec8b35','#ef4e75','#2ea8c7','#8e65e8','#e744a2','#d6a42d','#ff356f'][i],
    items:['Neon welcome','VIP seating','Music feature','Finale lights']
  }));
"""
s=s.replace(area_push_anchor,area_push+area_push_anchor,1)
campaign.write_text(s)

# Extend the existing polished Levels 11-100 UI system through Level 200.
repls={
 'gameplay-1150.js':[
   ('STANDARD_MIN=11,STANDARD_MAX=100','STANDARD_MIN=11,STANDARD_MAX=200'),
   ('bid(v)>=1&&bid(v)<=100&&v?.stage&&v?.game','bid(v)>=1&&bid(v)<=200&&v?.stage&&v?.game')
 ],
 'background-1155.js':[('const MAX_LEVEL=100;','const MAX_LEVEL=200;')],
 'layout-1156.js':[('const MIN=11,MAX=100;','const MIN=11,MAX=200;')],
 'counter-align-1157.js':[('const MIN=11,MAX=100;','const MIN=11,MAX=200;')],
 'counter-optical-1158.js':[('const MIN=11,MAX=100;','const MIN=11,MAX=200;')],
}
for name,pairs in repls.items():
    p=root/name
    assert p.exists(), name
    t=p.read_text()
    for old,new in pairs:
        assert old in t,(name,old)
        t=t.replace(old,new,1)
    p.write_text(t)

print('Prepared Wam Bam Alpha 11.6.0: Levels 101-200, twelve new transparent pieces, and Level 1-9 style UI coverage through Level 200.')
