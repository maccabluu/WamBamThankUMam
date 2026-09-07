const {test}=require('node:test');
const assert=require('node:assert/strict');
const C=require('../web/wam-campaign.js');
const {Game,ROWS,COLS,key}=require('../web/wam-engine.js');
const rng=seed=>()=>{seed=(1664525*seed+1013904223)>>>0;return seed/4294967296;};
const empty=()=>{const g=new Game(C.level(6),rng(42));g.board.fill(null);g.bags.clear();return g;};
const fill=(g,positions,type='lips',special=null)=>positions.forEach(i=>g.board[i]=g.piece(type,special));
const memory=()=>{const map=new Map();return{getItem:k=>map.get(k)??null,setItem:(k,v)=>map.set(k,String(v))};};

test('all nine levels start without matches, with a legal move and reachable targets',()=>{
  for(const config of C.levels)for(let seed=1;seed<=25;seed++){
    const g=new Game(config,rng(seed));assert.equal(g.board.length,60);assert.equal(g.scan().cells.length,0);assert.ok(g.findMove());
    assert.equal(g.board.filter(Boolean).length+g.bags.size,60);
    for(const type of Object.keys(config.targets))assert.ok(config.palette.includes(type)||['handbag','disco'].includes(type));
    if(config.targets.handbag)assert.equal(config.targets.handbag,config.bags.length);
  }
});
test('levels 6-9 use every supplied icon and four different objective sets',()=>{
  const used=new Set(C.levels.slice(5).flatMap(l=>l.palette));assert.equal(used.size,10);
  assert.equal(new Set(C.levels.slice(5).map(l=>JSON.stringify(l.targets))).size,4);
  for(const type of used)assert.ok(C.PIECES[type].image.startsWith('icons/'));
});
test('four makes a line special, five a disco, T/L an area blast and square a disco',()=>{
  const samples=[[[0,1,2,3],'row'],[[0,6,12,18],'column'],[[0,1,2,3,4],'disco'],[[0,1,2,6,12],'wrapped'],[[0,1,6,7],'disco']];
  for(const [cells,expected]of samples){const g=empty();fill(g,cells);const wave=g.scan([cells[0]]);assert.equal(wave.spawns.length,1);assert.equal(wave.spawns[0].special,expected);assert.equal(wave.spawns[0].at,cells[0]);}
});
test('simultaneous independent matches each create their own special',()=>{
  const g=empty();fill(g,[0,1,2,3]);fill(g,[42,43,44,45],'bow');assert.equal(g.scan().spawns.length,2);
});
test('invalid swaps return pieces and cost no move',()=>{
  const g=new Game(C.level(6),rng(71));const before=g.board.map(p=>p.id),moves=g.moves;
  let checked=false;
  for(let i=0;i<59&&!checked;i++)if(g.adjacent(i,i+1)){const result=g.attempt(i,i+1);if(!result.valid){assert.deepEqual(g.board.map(p=>p.id),before);assert.equal(g.moves,moves);checked=true;}else{g.swap(i,i+1);g.moves=moves;}}
  assert.ok(checked);
});
test('booster clears count targets exactly once and do not use moves',()=>{
  const g=empty();fill(g,[0,1,2]);g.targets={lips:3};const moves=g.moves;
  const wave=g.useBooster('rocket',1);g.clear(wave);assert.equal(g.targets.lips,0);assert.equal(g.moves,moves);assert.equal(g.boosters.rocket,2);
});
test('disco swaps end a level on its last move and double disco clears the board',()=>{
  const g=empty();g.moves=1;g.targets={disco:1,lips:2};fill(g,[0],'disco','disco');fill(g,[1,4]);
  const result=g.attempt(0,1);assert.ok(result.valid);g.clear(result.wave);assert.ok(g.won);assert.ok(g.finished);assert.equal(g.moves,0);
  const pair=empty();fill(pair,[0,1],'disco','disco');fill(pair,[59],'bow');const wave=pair.attempt(0,1).wave;pair.clear(wave);assert.equal(pair.board.filter(Boolean).length,0);
});
test('a disco swap clears the chosen colour, not a different target colour',()=>{
  const g=empty();fill(g,[0],'disco','disco');fill(g,[1,4],'bow');fill(g,[10,11,12,13],'lips');g.targets={lips:4};
  g.clear(g.attempt(0,1).wave);assert.equal(g.targets.lips,4);assert.equal(g.board.filter(Boolean).length,4);
});
test('row/column chains account for every original icon only once',()=>{
  const g=empty();for(let i=0;i<60;i++)g.board[i]=g.piece('lips');g.board[0].special='row';g.board[3].special='column';g.targets={lips:60};
  const result=g.clear({cells:[0],spawns:[]});assert.equal(result.cleared.length,15);assert.equal(g.targets.lips,45);
});
test('a handbag takes one hit per wave even beside several matches',()=>{
  const g=empty();g.bags.set(7,2);g.targets={handbag:1,lips:10};fill(g,[1,6,8,13]);
  g.clear({cells:[1,6,8,13],spawns:[]});assert.equal(g.bags.get(7),1);assert.equal(g.targets.handbag,1);
  g.clear(g.useBooster('hammer',7));assert.equal(g.bags.size,0);assert.equal(g.targets.handbag,0);
});
test('gravity keeps order, fills every gap and never passes through handbags',()=>{
  const g=empty();g.bags.set(key(4,0),2);const top=g.piece('bow'),bottom=g.piece('lips');g.board[key(0,0)]=top;g.board[key(5,0)]=bottom;
  const falls=g.fall();assert.equal(g.board[key(3,0)].id,top.id);assert.equal(g.board[key(9,0)].id,bottom.id);assert.equal(g.board[key(4,0)],null);assert.equal(g.board.filter(Boolean).length,59);assert.ok(falls.length>0);
});
test('reshuffles preserve earned specials, bags, targets and moves',()=>{
  const g=new Game(C.level(8),rng(100));const at=g.board.findIndex(Boolean);g.board[at].special='disco';g.board[at].type='disco';const id=g.board[at].id;
  const targets={...g.targets},moves=g.moves,bags=[...g.bags];g.reshuffle();assert.ok(g.board.some(p=>p?.id===id));assert.deepEqual(g.targets,targets);assert.equal(g.moves,moves);assert.deepEqual([...g.bags],bags);assert.ok(g.findMove());assert.equal(g.scan().cells.length,0);
});
test('progress preserves existing saves and only advances after a win',()=>{
  const s=memory();s.setItem('wambam-unlocked-level','5');s.setItem('wambam-selected-level','99');assert.equal(C.progress(s).selected,5);
  assert.equal(C.complete(s,C.level(5),10,7000),3);assert.equal(C.progress(s).unlocked,6);
  C.complete(s,C.level(5),0,1000);assert.equal(C.progress(s).stars[4],3);assert.equal(C.read(s,'wambam-score-5'),7000);
  C.complete(s,C.level(9),0,12000);assert.equal(C.progress(s).unlocked,9);assert.equal(C.progress(s).highest,9);assert.equal(C.progress(s).selected,9);
});
test('random legal moves and cascades keep stable boards on all nine levels',()=>{
  for(const config of C.levels){const g=new Game(config,rng(config.id*99));for(let turn=0;turn<15&&!g.finished;turn++){
    const move=g.findMove();assert.ok(move);let wave=g.attempt(...move).wave;let cascades=0;
    while(wave.cells.length){assert.ok(++cascades<100);g.clear(wave,cascades);g.fall();wave=g.scan();}
    assert.equal(g.board.filter(Boolean).length+g.bags.size,60);assert.ok(Object.values(g.targets).every(v=>v>=0));
    if(!g.findMove())g.reshuffle();assert.ok(g.findMove());
  }}
});
