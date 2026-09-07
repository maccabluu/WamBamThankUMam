(function(root,factory) {
  const engine = factory();
  if (typeof module === 'object' && module.exports) module.exports = engine;
  else root.WamEngine = engine;
})(typeof window !== 'undefined' ? window : this, function() {
  'use strict';
  const ROWS=10, COLS=6;
  const key=(r,c)=>r*COLS+c;
  const coords=i=>({r:Math.floor(i/COLS),c:i%COLS});
  class Game {
    constructor(config,random=Math.random) {
      this.config=config; this.random=random; this.serial=0;
      this.moves=config.moves; this.score=0; this.targets={...config.targets};
      this.boosters={rocket:3,hammer:3,disco:3,swap:3};
      this.bags=new Map(config.bags.map(([r,c])=>[key(r,c),2]));
      this.board=Array(ROWS*COLS).fill(null);
      this.generate();
    }
    piece(type,special=null) { return {id:++this.serial,type,special}; }
    randomPiece() { return this.piece(this.config.palette[Math.floor(this.random()*this.config.palette.length)]); }
    valid(i) { return Number.isInteger(i)&&i>=0&&i<this.board.length; }
    adjacent(a,b) { const x=coords(a),y=coords(b); return Math.abs(x.r-y.r)+Math.abs(x.c-y.c)===1; }
    type(i) { const p=this.board[i]; return this.bags.has(i)||!p||p.special==='disco' ? null : p.type; }
    swap(a,b) { [this.board[a],this.board[b]]=[this.board[b],this.board[a]]; }
    scan(preferred=[]) {
      const runs=[],squares=[];
      for (let r=0;r<ROWS;r++) for(let c=0;c<COLS;) {
        const start=c,type=this.type(key(r,c));
        while(++c<COLS&&this.type(key(r,c))===type) {}
        if(type&&c-start>=3) runs.push({axis:'row',cells:Array.from({length:c-start},(_,n)=>key(r,start+n))});
      }
      for (let c=0;c<COLS;c++) for(let r=0;r<ROWS;) {
        const start=r,type=this.type(key(r,c));
        while(++r<ROWS&&this.type(key(r,c))===type) {}
        if(type&&r-start>=3) runs.push({axis:'column',cells:Array.from({length:r-start},(_,n)=>key(start+n,c))});
      }
      for(let r=0;r<ROWS-1;r++) for(let c=0;c<COLS-1;c++) {
        const cells=[key(r,c),key(r,c+1),key(r+1,c),key(r+1,c+1)],type=this.type(cells[0]);
        if(type&&cells.every(i=>this.type(i)===type)) squares.push({axis:'square',cells});
      }
      const groups=[];
      for(const run of [...runs,...squares]) {
        const overlaps=groups.filter(g=>run.cells.some(i=>g.cells.has(i)));
        const group={cells:new Set(run.cells),runs:[run]};
        for(const old of overlaps) {
          old.cells.forEach(i=>group.cells.add(i)); group.runs.push(...old.runs);
          groups.splice(groups.indexOf(old),1);
        }
        groups.push(group);
      }
      const cells=[],spawns=[];
      for(const group of groups) {
        cells.push(...group.cells);
        const five=group.runs.find(r=>r.axis!=='square'&&r.cells.length>=5);
        const cross=group.runs.some(a=>a.axis==='row'&&group.runs.some(b=>b.axis==='column'&&a.cells.some(i=>b.cells.includes(i))));
        const four=group.runs.find(r=>r.axis!=='square'&&r.cells.length===4);
        const square=group.runs.some(r=>r.axis==='square');
        const special=five?'disco':cross?'wrapped':four?four.axis:square?'disco':null;
        if(special) {
          const choices=[...preferred,...group.cells];
          const at=choices.find(i=>group.cells.has(i)&&!this.board[i].special)??[...group.cells][0];
          spawns.push({at,type:this.board[at].type,special});
        }
      }
      return {cells:[...new Set(cells)],spawns};
    }
    generate() {
      for(let attempt=0;attempt<200;attempt++) {
        this.board.fill(null);
        for(let i=0;i<this.board.length;i++) {
          if(this.bags.has(i)) continue;
          const {r,c}=coords(i),offset=Math.floor(this.random()*this.config.palette.length);
          for(let n=0;n<this.config.palette.length;n++) {
            const type=this.config.palette[(offset+n)%this.config.palette.length];
            if(c>=2&&this.type(i-1)===type&&this.type(i-2)===type) continue;
            if(r>=2&&this.type(i-COLS)===type&&this.type(i-COLS*2)===type) continue;
            if(r>=1&&c>=1&&this.type(i-1)===type&&this.type(i-COLS)===type&&this.type(i-COLS-1)===type) continue;
            this.board[i]=this.piece(type); break;
          }
        }
        if(this.findMove()) return;
      }
      throw new Error('Could not create a playable board');
    }
    findMove() {
      for(let a=0;a<this.board.length;a++) {
        if(!this.board[a]||this.bags.has(a)) continue;
        for(const b of [a+1,a+COLS]) {
          if(!this.valid(b)||!this.adjacent(a,b)||this.bags.has(b)||!this.board[b]) continue;
          const x=this.board[a],y=this.board[b];
          if(x.special==='disco'||y.special==='disco'||(x.special&&y.special)) return [a,b];
          if(x.type===y.type) continue;
          this.swap(a,b); const found=this.scan().cells.length>0; this.swap(a,b);
          if(found) return [a,b];
        }
      }
      return null;
    }
    area(at,radius=1) {
      const p=coords(at),cells=[];
      for(let r=Math.max(0,p.r-radius);r<=Math.min(ROWS-1,p.r+radius);r++)
        for(let c=Math.max(0,p.c-radius);c<=Math.min(COLS-1,p.c+radius);c++) cells.push(key(r,c));
      return cells;
    }
    line(at,axis) {
      const {r,c}=coords(at);
      return axis==='row'?Array.from({length:COLS},(_,n)=>key(r,n)):Array.from({length:ROWS},(_,n)=>key(n,c));
    }
    bestColour() {
      const counts=new Map();
      for(const p of this.board) if(p&&p.special!=='disco') counts.set(p.type,(counts.get(p.type)||0)+1);
      return [...counts].sort((a,b)=>Math.min(b[1],this.targets[b[0]]||0)-Math.min(a[1],this.targets[a[0]]||0)||b[1]-a[1])[0]?.[0];
    }
    attempt(a,b,free=false) {
      if(!this.valid(a)||!this.valid(b)||!this.adjacent(a,b)||this.bags.has(a)||this.bags.has(b)||!this.board[a]||!this.board[b]||this.moves<=0) return {valid:false};
      if(free&&this.boosters.swap<=0) return {valid:false};
      this.swap(a,b);
      const x=this.board[a],y=this.board[b];
      let wave;
      if(x.special==='disco'||y.special==='disco') {
        const other=x.special==='disco'?y:x;
        const both=x.special==='disco'&&y.special==='disco';
        const cells=[a,b];
        for(let i=0;i<this.board.length;i++) {
          const p=this.board[i];
          if(both||(p&&p.type===other.type&&p.special!=='disco')) {
            cells.push(i);
            if(!both&&other.special&&p&&i!==a&&i!==b) p.special=other.special;
          }
        }
        wave={cells:[...new Set(cells)],spawns:[],skipDiscos:[a,b],label:both?'DOUBLE DISCO!':'DISCO CLEAR!'};
      } else if(x.special&&y.special) {
        let cells=[a,b];
        if(x.special==='wrapped'&&y.special==='wrapped') cells.push(...this.area(a,2),...this.area(b,2));
        else if(x.special==='wrapped'||y.special==='wrapped') {
          const {r,c}=coords(b);
          for(let n=-1;n<=1;n++) {
            if(r+n>=0&&r+n<ROWS) cells.push(...this.line(key(r+n,c),'row'));
            if(c+n>=0&&c+n<COLS) cells.push(...this.line(key(r,c+n),'column'));
          }
        } else cells.push(...this.line(b,'row'),...this.line(b,'column'));
        wave={cells:[...new Set(cells)],spawns:[],label:'SPECIAL COMBO!'};
      } else wave=this.scan([b,a]);
      if(!wave.cells.length&&!free) { this.swap(a,b); return {valid:false}; }
      if(free) this.boosters.swap--; else this.moves--;
      return {valid:true,wave};
    }
    expand(cells,skipDiscos=[]) {
      const found=new Set(),queue=[...cells];
      while(queue.length) {
        const at=queue.shift();
        if(!this.valid(at)||found.has(at)) continue;
        found.add(at); const p=this.board[at];
        if(!p) continue;
        if(p.special==='row'||p.special==='column') queue.push(...this.line(at,p.special));
        else if(p.special==='wrapped') queue.push(...this.area(at));
        else if(p.special==='disco'&&!skipDiscos.includes(at)) {
          const type=this.bestColour();
          this.board.forEach((p,i)=>{if(p&&p.type===type&&p.special!=='disco') queue.push(i);});
        }
      }
      return [...found];
    }
    clear(wave,combo=1) {
      const cells=this.expand(wave.cells,wave.skipDiscos),bagHits=new Set(),cleared=[];
      for(const i of cells) {
        if(this.bags.has(i)) bagHits.add(i);
        const p=this.board[i];
        if(!p) continue;
        const type=p.special==='disco'?'disco':p.type;
        if(type in this.targets) this.targets[type]=Math.max(0,this.targets[type]-1);
        cleared.push({at:i,piece:p}); this.board[i]=null;
        const {r,c}=coords(i);
        for(const [dr,dc] of [[-1,0],[1,0],[0,-1],[0,1]]) {
          const nr=r+dr,nc=c+dc;
          if(nr>=0&&nr<ROWS&&nc>=0&&nc<COLS&&this.bags.has(key(nr,nc))) bagHits.add(key(nr,nc));
        }
      }
      let bagsCleared=0;
      for(const i of bagHits) {
        const hits=this.bags.get(i)-1;
        if(hits>0) this.bags.set(i,hits);
        else { this.bags.delete(i); bagsCleared++; if('handbag' in this.targets) this.targets.handbag=Math.max(0,this.targets.handbag-1); }
      }
      for(const spawn of wave.spawns||[]) {
        if(!this.bags.has(spawn.at)) this.board[spawn.at]=this.piece(spawn.special==='disco'?'disco':spawn.type,spawn.special);
      }
      this.score+=cleared.length*60*Math.min(combo,6)+bagsCleared*150;
      return {cells,cleared,bagsCleared,bagHits:[...bagHits],spawns:wave.spawns||[]};
    }
    fall() {
      const falls=[];
      // Pack each segment independently. Handbags never move or let icons pass through.
      for(let c=0;c<COLS;c++) {
        let bottom=ROWS-1;
        while(bottom>=0) {
          if(this.bags.has(key(bottom,c))) {bottom--;continue;}
          let top=bottom; while(top>0&&!this.bags.has(key(top-1,c))) top--;
          const survivors=[];
          for(let r=bottom;r>=top;r--) if(this.board[key(r,c)]) survivors.push({piece:this.board[key(r,c)],from:r});
          for(let r=top;r<=bottom;r++) this.board[key(r,c)]=null;
          let row=bottom;
          for(const survivor of survivors) {
            const at=key(row,c);this.board[at]=survivor.piece;
            if(row!==survivor.from) falls.push({at,distance:row-survivor.from});
            row--;
          }
          const missing=row-top+1;
          for(;row>=top;row--) {const at=key(row,c);this.board[at]=this.randomPiece();falls.push({at,distance:missing});}
          bottom=top-2;
        }
      }
      return falls;
    }
    reshuffle() {
      const slots=this.board.map((p,i)=>p&&!this.bags.has(i)?i:null).filter(i=>i!==null);
      const pieces=slots.map(i=>this.board[i]);
      for(let attempt=0;attempt<300;attempt++) {
        for(let i=pieces.length-1;i>0;i--) {const j=Math.floor(this.random()*(i+1));[pieces[i],pieces[j]]=[pieces[j],pieces[i]];}
        slots.forEach((at,i)=>this.board[at]=pieces[i]);
        if(!this.scan().cells.length&&this.findMove()) return;
      }
      // Extremely rare fallback preserves earned specials and all objective progress.
      const specials=pieces.filter(p=>p.special);this.generate();
      specials.forEach((piece,i)=>{this.board[slots[i]]=piece;});
      if(this.scan().cells.length) return this.reshuffle();
    }
    useBooster(name,at) {
      if(!this.valid(at)||this.boosters[name]<=0||name==='swap') return null;
      let cells;
      if(name==='hammer') cells=[at];
      else if(name==='rocket') cells=[...this.line(at,'row'),...this.line(at,'column')];
      else if(name==='disco') {
        if(this.bags.has(at)||!this.board[at]) return null;
        const type=this.board[at].type;cells=this.board.flatMap((p,i)=>p&&p.type===type?[i]:[]);
      } else return null;
      this.boosters[name]--;return {cells:[...new Set(cells)],spawns:[],label:name==='hammer'?'HEEL SMASH!':name==='rocket'?'LIP LASER!':'DISCO CLEAR!'};
    }
    get won() { return Object.values(this.targets).every(n=>n===0); }
    get finished() { return this.won||this.moves<=0; }
  }
  return {Game,ROWS,COLS,key,coords};
});
