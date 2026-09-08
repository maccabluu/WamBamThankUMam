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
      this.rows=config.mask?.length||ROWS; this.cols=config.mask?.[0]?.length||COLS;
      if(config.mask && config.mask.some(row=>row.length!==this.cols||/[^.#]/.test(row))) throw new Error('Invalid board shape');
      this.holes=new Set();
      config.mask?.forEach((row,r)=>[...row].forEach((cell,c)=>{if(cell==='.')this.holes.add(this.key(r,c));}));
      this.crates=new Map((config.crates||[]).map(([r,c,hits=1])=>[this.key(r,c),hits]));
      this.ice=new Map((config.ice||[]).map(([r,c,hits=1])=>[this.key(r,c),hits]));
      this.moves=config.moves; this.score=0; this.targets={...config.targets};
      this.boosters={rocket:3,hammer:3,disco:3,swap:3};
      this.bags=new Map((config.bags||[]).map(([r,c])=>[this.key(r,c),2]));
      this.board=Array(this.rows*this.cols).fill(null);
      this.generate();
    }
    key(r,c) { return r*this.cols+c; }
    coords(i) { return {r:Math.floor(i/this.cols),c:i%this.cols}; }
    blocked(i) { return this.holes.has(i)||this.bags.has(i)||this.crates.has(i); }
    neighbours(i) { const {r,c}=this.coords(i);return [[r-1,c],[r+1,c],[r,c-1],[r,c+1]].filter(([r,c])=>r>=0&&r<this.rows&&c>=0&&c<this.cols).map(([r,c])=>this.key(r,c)); }
    piece(type,special=null) { return {id:++this.serial,type,special}; }
    randomPiece() { return this.piece(this.config.palette[Math.floor(this.random()*this.config.palette.length)]); }
    valid(i) { return Number.isInteger(i)&&i>=0&&i<this.board.length&&!this.holes.has(i); }
    adjacent(a,b) { const x=this.coords(a),y=this.coords(b); return Math.abs(x.r-y.r)+Math.abs(x.c-y.c)===1; }
    type(i) { const p=this.board[i]; return this.blocked(i)||!p||p.special==='disco' ? null : p.type; }
    swap(a,b) { [this.board[a],this.board[b]]=[this.board[b],this.board[a]]; }
    scan(preferred=[]) {
      const runs=[],squares=[];
      for (let r=0;r<this.rows;r++) for(let c=0;c<this.cols;) {
        const start=c,type=this.type(this.key(r,c));
        while(++c<this.cols&&this.type(this.key(r,c))===type) {}
        if(type&&c-start>=3) runs.push({axis:'row',cells:Array.from({length:c-start},(_,n)=>this.key(r,start+n))});
      }
      for (let c=0;c<this.cols;c++) for(let r=0;r<this.rows;) {
        const start=r,type=this.type(this.key(r,c));
        while(++r<this.rows&&this.type(this.key(r,c))===type) {}
        if(type&&r-start>=3) runs.push({axis:'column',cells:Array.from({length:r-start},(_,n)=>this.key(start+n,c))});
      }
      for(let r=0;r<this.rows-1;r++) for(let c=0;c<this.cols-1;c++) {
        const cells=[this.key(r,c),this.key(r,c+1),this.key(r+1,c),this.key(r+1,c+1)],type=this.type(cells[0]);
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
        const special=five?'disco':cross?'wrapped':four?four.axis:square?(this.config.squareSpecial||'disco'):null;
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
          if(this.blocked(i)) continue;
          const {r,c}=this.coords(i),offset=Math.floor(this.random()*this.config.palette.length);
          for(let n=0;n<this.config.palette.length;n++) {
            const type=this.config.palette[(offset+n)%this.config.palette.length];
            if(c>=2&&this.type(i-1)===type&&this.type(i-2)===type) continue;
            if(r>=2&&this.type(i-this.cols)===type&&this.type(i-this.cols*2)===type) continue;
            if(r>=1&&c>=1&&this.type(i-1)===type&&this.type(i-this.cols)===type&&this.type(i-this.cols-1)===type) continue;
            this.board[i]=this.piece(type); break;
          }
        }
        if(this.findMove()) return;
      }
      throw new Error('Could not create a playable board');
    }
    findMove() {
      for(let a=0;a<this.board.length;a++) {
        if(!this.board[a]||this.blocked(a)) continue;
        for(const b of [a+1,a+this.cols]) {
          if(!this.valid(b)||!this.adjacent(a,b)||this.blocked(b)||!this.board[b]) continue;
          const x=this.board[a],y=this.board[b];
          if(x.special||y.special) return [a,b];
          if(x.type===y.type) continue;
          this.swap(a,b); const found=this.scan().cells.length>0; this.swap(a,b);
          if(found) return [a,b];
        }
      }
      return null;
    }
    area(at,radius=1) {
      const p=this.coords(at),cells=[];
      for(let r=Math.max(0,p.r-radius);r<=Math.min(this.rows-1,p.r+radius);r++)
        for(let c=Math.max(0,p.c-radius);c<=Math.min(this.cols-1,p.c+radius);c++) cells.push(this.key(r,c));
      return cells;
    }
    line(at,axis) {
      const {r,c}=this.coords(at);
      return axis==='row'?Array.from({length:this.cols},(_,n)=>this.key(r,n)):Array.from({length:this.rows},(_,n)=>this.key(n,c));
    }
    targetCell(excluded=[]) {
      const skip=new Set(excluded);
      const cells=this.board.map((p,i)=>i).filter(i=>this.valid(i)&&!skip.has(i));
      const priority=i=>this.ice.has(i)&&this.targets.ice>0?5:this.crates.has(i)&&this.targets.crate>0?4:this.bags.has(i)&&this.targets.handbag>0?3:this.targets[this.board[i]?.type]>0?2:this.board[i]?1:0;
      cells.sort((a,b)=>priority(b)-priority(a));
      return cells.find(i=>priority(i)>0);
    }
    activate(at) {
      if(!this.valid(at)||!this.board[at]?.special||this.moves<=0||this.won)return null;
      this.moves--;return {cells:[at],spawns:[],label:'SPECIAL CLEAR!'};
    }
    bestColour() {
      const counts=new Map();
      for(const p of this.board) if(p&&p.special!=='disco') counts.set(p.type,(counts.get(p.type)||0)+1);
      return [...counts].sort((a,b)=>Math.min(b[1],this.targets[b[0]]||0)-Math.min(a[1],this.targets[a[0]]||0)||b[1]-a[1])[0]?.[0];
    }
    attempt(a,b,free=false) {
      if(!this.valid(a)||!this.valid(b)||!this.adjacent(a,b)||this.blocked(a)||this.blocked(b)||!this.board[a]||!this.board[b]||this.moves<=0) return {valid:false};
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
        else if(x.special==='flyer'||y.special==='flyer') {
          const other=x.special==='flyer'?y:x,used=[a,b];
          const count=other.special==='flyer'?3:1;
          for(let n=0;n<count;n++) {
            const target=this.targetCell(used);if(target===undefined)break;used.push(target);cells.push(target);
            if(other.special==='wrapped')cells.push(...this.area(target,2));
            else if(other.special==='row'||other.special==='column')cells.push(...this.line(target,other.special));
          }
        } else if(x.special==='wrapped'||y.special==='wrapped') {
          const {r,c}=this.coords(b);
          for(let n=-1;n<=1;n++) {
            if(r+n>=0&&r+n<this.rows) cells.push(...this.line(this.key(r+n,c),'row'));
            if(c+n>=0&&c+n<this.cols) cells.push(...this.line(this.key(r,c+n),'column'));
          }
        } else cells.push(...this.line(b,'row'),...this.line(b,'column'));
        wave={cells:[...new Set(cells)],spawns:[],label:'SPECIAL COMBO!'};
      } else if(x.special||y.special) wave={cells:[x.special?a:b],spawns:[],label:'SPECIAL CLEAR!'};
      else wave=this.scan([b,a]);
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
        else if(p.special==='flyer') {
          queue.push(...this.neighbours(at));
          const target=this.targetCell([...found,...queue]);if(target!==undefined)queue.push(target);
        }
        else if(p.special==='disco'&&!skipDiscos.includes(at)) {
          const type=this.bestColour();
          this.board.forEach((p,i)=>{if(p&&p.type===type&&p.special!=='disco') queue.push(i);});
        }
      }
      return [...found];
    }
    clear(wave,combo=1) {
      const cells=this.expand(wave.cells,wave.skipDiscos),bagHits=new Set(),crateHits=new Set(),cleared=[];
      for(const i of cells) {
        if(this.bags.has(i)) bagHits.add(i);
        if(this.crates.has(i)) crateHits.add(i);
        if(this.ice.has(i)) {
          const hits=this.ice.get(i)-1;
          if(hits>0)this.ice.set(i,hits);else {this.ice.delete(i);if('ice' in this.targets)this.targets.ice=Math.max(0,this.targets.ice-1);}
        }
        const p=this.board[i];
        if(!p) continue;
        const type=p.special==='disco'?'disco':p.type;
        if(type in this.targets) this.targets[type]=Math.max(0,this.targets[type]-1);
        cleared.push({at:i,piece:p}); this.board[i]=null;
        const {r,c}=this.coords(i);
        for(const [dr,dc] of [[-1,0],[1,0],[0,-1],[0,1]]) {
          const nr=r+dr,nc=c+dc;
          if(nr>=0&&nr<this.rows&&nc>=0&&nc<this.cols) {
            const near=this.key(nr,nc);
            if(this.bags.has(near))bagHits.add(near);
            if(this.crates.has(near))crateHits.add(near);
          }
        }
      }
      let bagsCleared=0;
      for(const i of bagHits) {
        const hits=this.bags.get(i)-1;
        if(hits>0) this.bags.set(i,hits);
        else { this.bags.delete(i); bagsCleared++; if('handbag' in this.targets) this.targets.handbag=Math.max(0,this.targets.handbag-1); }
      }
      let cratesCleared=0;
      for(const i of crateHits) {
        const hits=this.crates.get(i)-1;
        if(hits>0)this.crates.set(i,hits);else {this.crates.delete(i);cratesCleared++;if('crate' in this.targets)this.targets.crate=Math.max(0,this.targets.crate-1);}
      }
      for(const spawn of wave.spawns||[]) {
        if(this.valid(spawn.at)&&!this.blocked(spawn.at)) this.board[spawn.at]=this.piece(spawn.special==='disco'?'disco':spawn.type,spawn.special);
      }
      this.score+=cleared.length*60*Math.min(combo,6)+(bagsCleared+cratesCleared)*150;
      return {cells,cleared,bagsCleared,cratesCleared,bagHits:[...bagHits],spawns:wave.spawns||[]};
    }
    fall() {
      const falls=[];
      // Pack each segment independently. Handbags never move or let icons pass through.
      for(let c=0;c<this.cols;c++) {
        let bottom=this.rows-1;
        while(bottom>=0) {
          if(this.blocked(this.key(bottom,c))) {bottom--;continue;}
          let top=bottom; while(top>0&&!this.blocked(this.key(top-1,c))) top--;
          const survivors=[];
          for(let r=bottom;r>=top;r--) if(this.board[this.key(r,c)]) survivors.push({piece:this.board[this.key(r,c)],from:r});
          for(let r=top;r<=bottom;r++) this.board[this.key(r,c)]=null;
          let row=bottom;
          for(const survivor of survivors) {
            const at=this.key(row,c);this.board[at]=survivor.piece;
            if(row!==survivor.from) falls.push({at,distance:row-survivor.from});
            row--;
          }
          const missing=row-top+1;
          for(;row>=top;row--) {const at=this.key(row,c);this.board[at]=this.randomPiece();falls.push({at,distance:missing});}
          bottom=top-2;
        }
      }
      return falls;
    }
    reshuffle() {
      const slots=this.board.map((p,i)=>p&&!this.blocked(i)?i:null).filter(i=>i!==null);
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
      if(!this.valid(at)||this.boosters[name]<=0||name==='swap'||this.moves<=0||this.won) return null;
      let cells;
      if(name==='hammer') cells=[at];
      else if(name==='rocket') cells=[...this.line(at,'row'),...this.line(at,'column')];
      else if(name==='disco') {
        if(this.blocked(at)||!this.board[at]) return null;
        const type=this.board[at].type;cells=this.board.flatMap((p,i)=>p&&p.type===type?[i]:[]);
      } else return null;
      this.boosters[name]--;return {cells:[...new Set(cells)],spawns:[],label:name==='hammer'?'HEEL SMASH!':name==='rocket'?'LIP LASER!':'DISCO CLEAR!'};
    }
    get won() { return Object.values(this.targets).every(n=>n===0); }
    get finished() { return this.won||this.moves<=0; }
  }
  return {Game,ROWS,COLS,key,coords};
});
