from pathlib import Path
import sys

root=Path(sys.argv[1])
campaign=root/'wam-campaign.js'
assert campaign.exists()

s=campaign.read_text()

bad="""  const AREAS=[
    {name:'The Bam Lounge',from:1,to:10,colour:'#e62681',items:['Neon sign','Velvet seating','Jukebox','Dance floor']},
    {name:'Lipstick Lounge',from:11,to:20,colour:'#d043aa',items:['Vanity mirror','Lip display','Rose lights','Photo corner']},
    {name:'Disco Diner',from:21,to:30,colour:'#149da6',items:['Record wall','Diner booths','Disco ball','Spotlight stage']},
    {name:'Couture Club',from:31,to:40,colour:'#815ed1',items:['Gold doorway','Couture rail','Diamond display','Finale lights']}
  ];
  EXPANSION_AREAS.forEach((name,i)=>AREAS.push({
    name,from:101+i*10,to:110+i*10,
    colour:['#f14391','#357be8','#b248d5','#ec8b35','#ef4e75','#2ea8c7','#8e65e8','#e744a2','#d6a42d','#ff356f'][i],
    items:['Neon welcome','VIP seating','Music feature','Finale lights']
  }));
  const DECOR_COSTS=[2,3,2,3];
  ['Velvet Revue','Jukebox Palace','Pink Promenade','Starlight Social','Golden Galleria','Wam Bam Boulevard'].forEach((name,i)=>AREAS.push({name,from:41+i*10,to:50+i*10,colour:['#ef438e','#19c9cc','#f37abe','#7965df','#e4ad39','#f62d86'][i],items:['Neon welcome','Velvet booths','Music corner','Celebration lights']}));"""

good="""  const AREAS=[
    {name:'The Bam Lounge',from:1,to:10,colour:'#e62681',items:['Neon sign','Velvet seating','Jukebox','Dance floor']},
    {name:'Lipstick Lounge',from:11,to:20,colour:'#d043aa',items:['Vanity mirror','Lip display','Rose lights','Photo corner']},
    {name:'Disco Diner',from:21,to:30,colour:'#149da6',items:['Record wall','Diner booths','Disco ball','Spotlight stage']},
    {name:'Couture Club',from:31,to:40,colour:'#815ed1',items:['Gold doorway','Couture rail','Diamond display','Finale lights']}
  ];
  ['Velvet Revue','Jukebox Palace','Pink Promenade','Starlight Social','Golden Galleria','Wam Bam Boulevard'].forEach((name,i)=>AREAS.push({name,from:41+i*10,to:50+i*10,colour:['#ef438e','#19c9cc','#f37abe','#7965df','#e4ad39','#f62d86'][i],items:['Neon welcome','Velvet booths','Music corner','Celebration lights']}));
  EXPANSION_AREAS.forEach((name,i)=>AREAS.push({
    name,from:101+i*10,to:110+i*10,
    colour:['#f14391','#357be8','#b248d5','#ec8b35','#ef4e75','#2ea8c7','#8e65e8','#e744a2','#d6a42d','#ff356f'][i],
    items:['Neon welcome','VIP seating','Music feature','Finale lights']
  }));
  const DECOR_COSTS=[2,3,2,3];"""

assert bad in s
s=s.replace(bad,good,1)
campaign.write_text(s)
print('Fixed map area order so Levels 1-200 appear in strict numerical sequence.')
