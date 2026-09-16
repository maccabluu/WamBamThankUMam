(()=>{
'use strict';
const U=window.WamUI;
if(!U?.GameView)return;
const P=U.GameView.prototype;
if(P.__wam1140Patched)return;
P.__wam1140Patched=true;

const LEVEL=10;
const BG='artwork/frankie-level10-bg.jpg';
const BAR='artwork/booster-bar-reference-1132.png';
const BOOSTERS=[
  {key:'hammer',label:'HAMMER',left:17,countLeft:137},
  {key:'rocket',label:'MIC BLAST',left:149,countLeft:263},
  {key:'swap',label:'SHUFFLE',left:281,countLeft:390},
  {key:'disco',label:'SPOTLIGHT',left:414,countLeft:517}
];
const JUKEBOX_COUNT_LEFT=644;

function inScope(v){return Number(v?.config?.id)===LEVEL&&!!v?.stage;}
function imp(el,p,v){if(el)el.style.setProperty(p,v,'important');}
function node(tag,cls,text){const n=document.createElement(tag);if(cls)n.className=cls;if(text!=null)n.textContent=text;return n;}

function installStyle(){
  if(document.getElementById('wam-1140-style'))return;
  const s=document.createElement('style');
  s.id='wam-1140-style';
  s.textContent=`
  .wam1140-boss{font-family:Arial,Helvetica,sans-serif!important;color:#fff!important}
  .wam1140-boss .wam-art{object-fit:cover!important;filter:saturate(1.08) brightness(.92)!important}
  .wam1140-boss .wam-boss-hud{display:none!important}
  .wam1140-goals,.wam1140-moves,.wam1140-health{position:absolute!important;box-sizing:border-box!important;z-index:40!important}
  .wam1140-goals{left:18px;top:30px;width:194px;min-height:205px;border:4px solid #ffd36b;border-radius:28px;background:linear-gradient(180deg,#e51d78 0,#ad0b59 34%,#65113d 100%);box-shadow:0 6px 0 #31051f,0 0 18px #ff4da17a,inset 0 0 0 3px #ff8fc3;overflow:hidden}
  .wam1140-goals:after{content:'';position:absolute;left:10px;right:10px;top:65px;bottom:10px;border-radius:20px;background:linear-gradient(180deg,#fff8eb,#f5e5d8);box-shadow:inset 0 0 0 2px #ffd5c8,0 3px 8px #4c092a55;z-index:0}
  .wam1140-goals strong{position:relative;z-index:2;display:block;text-align:center;padding:10px 30px 6px;color:#fff;font-size:27px;line-height:38px;letter-spacing:.8px;text-shadow:0 3px 0 #690733,0 0 7px #fff4b0}
  .wam1140-goals strong:before,.wam1140-goals strong:after{content:'★';position:absolute;top:10px;color:#ffd44d;font-size:25px;text-shadow:0 2px 0 #9b4d00,0 0 6px #fff4a8}
  .wam1140-goals strong:before{left:12px}.wam1140-goals strong:after{right:12px}
  .wam1140-boss .wam-target{left:31px!important;width:163px!important;height:52px!important;z-index:43!important;padding:2px 13px!important;box-sizing:border-box!important;border-radius:0!important;background:transparent!important;color:#53112e!important;font-size:29px!important;font-weight:900!important;box-shadow:none!important;gap:10px!important;justify-content:space-between!important}
  .wam1140-boss .wam-target img{width:47px!important;height:45px!important;object-fit:contain!important;filter:drop-shadow(0 2px 2px #7d203a44)!important}
  .wam1140-boss .wam-target.done{color:#188056!important}

  .wam1140-moves{right:18px;top:30px;width:158px;height:190px;border:4px solid #ffd36b;border-radius:30px;background:linear-gradient(180deg,#e51d78 0,#ad0b59 37%,#65113d 100%);box-shadow:0 6px 0 #31051f,0 0 18px #ff4da17a,inset 0 0 0 3px #ff8fc3;text-align:center;overflow:hidden}
  .wam1140-moves:after{content:'';position:absolute;left:10px;right:10px;top:68px;bottom:10px;border-radius:20px;background:linear-gradient(180deg,#fff9ef,#f4dfd7);box-shadow:inset 0 0 0 2px #ffd3c6,0 3px 8px #4c092a55;z-index:0}
  .wam1140-moves strong{position:relative;z-index:2;display:block;padding-top:6px;font-family:'Brush Script MT','Segoe Script',cursive;font-style:italic;color:#fff8e8;font-size:31px;line-height:52px;text-shadow:0 3px 0 #74083e,0 0 8px #fff6c9}
  .wam1140-moves strong:before,.wam1140-moves strong:after{content:'✦';position:absolute;top:10px;color:#ffd44d;font-family:Arial,sans-serif;font-size:21px;font-style:normal}.wam1140-moves strong:before{left:10px}.wam1140-moves strong:after{right:10px}
  .wam1140-boss .wam-moves{left:auto!important;right:29px!important;top:104px!important;width:132px!important;height:92px!important;z-index:44!important;color:#4d082d!important;font-size:67px!important;font-weight:900!important;line-height:1!important;text-shadow:0 2px 0 #fff9ed!important}

  .wam1140-health{left:218px;top:38px;width:318px;height:184px;text-align:center;overflow:visible;pointer-events:none}
  .wam1140-crown{font-size:27px;line-height:27px;color:#ffd34d;text-shadow:0 2px 0 #9b4d00,0 0 9px #ffb52a;margin-bottom:1px}
  .wam1140-name{font-size:24px;line-height:29px;font-weight:1000;letter-spacing:.8px;color:#fff4d2;text-shadow:0 3px 0 #5d0736,0 0 9px #ff2a8f}
  .wam1140-boss-label{font-size:13px;font-weight:900;letter-spacing:2px;color:#ff80be;margin:1px 0 5px;text-shadow:0 1px #240013}
  .wam1140-health-track{position:relative;width:310px;height:48px;border:5px solid #f5bf45;border-radius:27px;background:linear-gradient(180deg,#431037,#210d22);box-shadow:0 5px 0 #713414,0 0 0 2px #7b2356,inset 0 0 0 3px #140914;overflow:hidden}
  .wam1140-health-fill{height:100%;width:100%;background:linear-gradient(90deg,#ff206f 0%,#f33899 48%,#8d1fc2 100%);border-radius:20px;box-shadow:inset 0 4px 7px #ff9bc777;transition:width .28s ease}
  .wam1140-health-text{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:21px;font-weight:1000;color:#fff;text-shadow:0 2px 0 #5a062e,0 0 5px #000;z-index:2}
  .wam1140-health.hit{animation:wam1140Hit .22s ease 0s 2 alternate}
  @keyframes wam1140Hit{to{transform:scale(1.035);filter:brightness(1.35)}}
  .wam1140-reaction{position:absolute;right:18px;top:265px;z-index:45;max-width:180px;padding:8px 12px;border:3px solid #ffd36b;border-radius:18px;background:#7d0b4ce8;color:#fff7d5;font-size:17px;font-weight:900;text-align:center;box-shadow:0 4px 0 #30031e;text-shadow:0 2px #52052f;pointer-events:none}

  .wam1140-boss .wam-board-title{z-index:47!important;padding:0 10px!important;box-sizing:border-box!important;border:3px solid #ffd16a!important;border-radius:16px!important;background:#280c2ddd!important;color:#fff1c3!important;font-size:17px!important;box-shadow:0 4px 0 #170311!important;text-shadow:0 2px #6c1747!important;height:46px!important;pointer-events:auto!important}
  .wam1140-boss .wam-board-title button{background:#cf176b!important;color:#fff8da!important;border:2px solid #ffd46d!important;z-index:48!important;pointer-events:auto!important}
  .wam1140-boss .wam-board-info,.wam1140-boss .wam-shape-tip{display:none!important}
  .wam1140-boss .wam-grid{z-index:20!important;border-radius:25px!important;box-shadow:0 0 0 7px #160816e8,0 0 0 11px #ffd16a,0 10px 24px #08020ccc,0 0 32px #ff2f9a88!important;background:#11091bdc!important;overflow:hidden!important}
  .wam1140-boss .wam-grid.shaped .wam-cell{background:linear-gradient(145deg,#28152fee,#151020f4)!important;border:1.5px solid #8d6597!important;border-radius:8px!important;box-shadow:inset 0 1px #ffffff1f!important}
  .wam1140-boss .wam-cell.selected{background:#63346be8!important;box-shadow:inset 0 0 0 4px #ff4c9e!important}
  .wam1140-boss .wam-pause{left:650px!important;right:auto!important;top:292px!important;width:58px!important;height:58px!important;display:block!important;opacity:1!important;visibility:visible!important;z-index:60!important;pointer-events:auto!important;border:3px solid #ffd46d!important;border-radius:50%!important;background:#8e104eee!important;box-shadow:0 4px 0 #38051f!important;color:#fff4cf!important}

  .wam1140-reference-bar{position:absolute!important;left:15px!important;top:1092px!important;width:690px!important;height:171px!important;object-fit:fill!important;display:block!important;z-index:50!important;pointer-events:none!important;border:0!important;margin:0!important;padding:0!important;filter:drop-shadow(0 6px 7px #13000baa)!important}
  .wam1140-count{position:absolute!important;top:1180px!important;width:28px!important;height:28px!important;display:flex!important;align-items:center!important;justify-content:center!important;color:#fff!important;font-size:20px!important;font-weight:1000!important;line-height:28px!important;text-shadow:0 2px 0 #6b0736,0 0 3px #6b0736!important;z-index:54!important;pointer-events:none!important}
  .wam1140-attack{position:absolute;left:185px;top:385px;width:350px;padding:13px 16px;z-index:90;border:4px solid #ffd34d;border-radius:22px;background:linear-gradient(180deg,#d51469,#681044);box-shadow:0 8px 22px #000b;color:#fff6d2;font-size:27px;font-weight:1000;text-align:center;text-shadow:0 3px #5b062f;pointer-events:none;animation:wam1140Attack .95s ease both}
  @keyframes wam1140Attack{0%{opacity:0;transform:scale(.7) rotate(-3deg)}25%{opacity:1;transform:scale(1.08) rotate(2deg)}70%{opacity:1;transform:scale(1)}100%{opacity:0;transform:scale(.92)}}
  `;
  document.head.appendChild(s);
}

function ensureBackground(v){
  const art=v.stage.querySelector('.wam-art');if(!art)return;
  const url=new URL(BG,document.baseURI).href;
  if(art.tagName==='IMG'&&art.src!==url)art.src=url;
}

function ensureHud(v){
  const stage=v.stage;
  stage.classList.add('wam1140-boss');
  if(!stage.querySelector('.wam1140-goals')){const n=node('div','wam1140-goals');n.append(node('strong','', 'GOALS'));stage.append(n);}
  if(!stage.querySelector('.wam1140-moves')){const n=node('div','wam1140-moves');n.append(node('strong','', 'Moves'));stage.append(n);}
  if(!stage.querySelector('.wam1140-health')){
    const h=node('div','wam1140-health');
    h.append(node('div','wam1140-crown','♛'),node('div','wam1140-name','FRANKIE FLASH'),node('div','wam1140-boss-label','BOSS HEALTH'));
    const track=node('div','wam1140-health-track');track.append(node('div','wam1140-health-fill'),node('div','wam1140-health-text','100%'));
    h.append(track);stage.append(h);
  }
  if(!stage.querySelector('.wam1140-reaction'))stage.append(node('div','wam1140-reaction','COME ON THEN!'));

  const targets=Object.values(v.targetEls||{}).filter(e=>e?.row);
  const count=Math.max(1,targets.length),goals=stage.querySelector('.wam1140-goals');
  imp(goals,'height',Math.min(268,83+count*52)+'px');
  targets.forEach((entry,i)=>{imp(entry.row,'top',(91+i*49)+'px');imp(entry.row,'height','46px');});

  const title=stage.querySelector('.wam-board-title');
  if(title){
    const span=title.querySelector('span');if(span)span.textContent='LEVEL 10 · FRANKIE FLASH';
    imp(title,'left','74px');imp(title,'top','412px');imp(title,'width','572px');
  }
  const pause=stage.querySelector('.wam-pause');if(pause){pause.disabled=false;imp(pause,'display','block');imp(pause,'pointer-events','auto');}
}

function fitBoard(v){
  const b=v.board;if(!b||v.__wam1140BoardFit)return;
  const maxW=540,maxH=548;
  const size=Math.min(maxW/v.game.cols,maxH/v.game.rows);
  v.cellWidth=v.cellHeight=size;
  const w=v.game.cols*size,h=v.game.rows*size;
  imp(b,'width',w+'px');imp(b,'height',h+'px');imp(b,'left',(360-w/2)+'px');imp(b,'top','478px');
  v.__wam1140BoardFit=true;
}

function targetTotal(obj){return Object.values(obj||{}).reduce((a,n)=>a+Math.max(0,Number(n)||0),0);}
function updateBoss(v){
  if(v.__wam1140Initial==null)v.__wam1140Initial=Math.max(1,targetTotal(v.config?.targets));
  const remaining=targetTotal(v.game?.targets),pct=Math.max(0,Math.min(100,Math.round(remaining/v.__wam1140Initial*100)));
  const fill=v.stage.querySelector('.wam1140-health-fill'),text=v.stage.querySelector('.wam1140-health-text'),box=v.stage.querySelector('.wam1140-health'),reaction=v.stage.querySelector('.wam1140-reaction');
  if(fill)fill.style.width=pct+'%';if(text)text.textContent=pct+'%';
  if(v.__wam1140Health!=null&&pct<v.__wam1140Health&&box){box.classList.remove('hit');void box.offsetWidth;box.classList.add('hit');}
  v.__wam1140Health=pct;
  if(reaction)reaction.textContent=pct<=0?'NO!':pct<=25?'YOU GOT LUCKY!':pct<=50?'NOW I’M MAD!':pct<=75?'NOT BAD...':'COME ON THEN!';
}

function ensureBoosters(v){
  const stage=v.stage,url=new URL(BAR,document.baseURI).href;
  const oldTray=stage.querySelector('.wam112-booster-tray');if(oldTray)imp(oldTray,'display','none');
  const oldTitle=stage.querySelector('.wam112-booster-title');if(oldTitle)imp(oldTitle,'display','none');
  let bar=stage.querySelector('.wam1140-reference-bar');if(!bar){bar=document.createElement('img');bar.className='wam1140-reference-bar';bar.alt='';bar.setAttribute('aria-hidden','true');stage.append(bar);}if(bar.src!==url)bar.src=url;
  BOOSTERS.forEach(spec=>{
    const b=v.boosterButtons?.[spec.key]?.b;if(!b)return;
    b.title=spec.label;b.setAttribute('aria-label',spec.label);
    imp(b,'position','absolute');imp(b,'left',(15+spec.left)+'px');imp(b,'top','1101px');imp(b,'width','121px');imp(b,'height','149px');imp(b,'display','block');imp(b,'opacity','0');imp(b,'background','transparent');imp(b,'border','0');imp(b,'box-shadow','none');imp(b,'padding','0');imp(b,'margin','0');imp(b,'z-index','55');imp(b,'pointer-events','auto');imp(b,'transform','none');
    Array.from(b.children).forEach(c=>imp(c,'display','none'));Array.from(b.childNodes).forEach(n=>{if(n.nodeType===3)n.textContent='';});
    let badge=stage.querySelector(`.wam1140-count[data-key="${spec.key}"]`);if(!badge){badge=node('span','wam1140-count');badge.dataset.key=spec.key;stage.append(badge);}badge.textContent=String(Math.max(0,Number(v.game.boosters?.[spec.key])||0));imp(badge,'left',spec.countLeft+'px');
  });
  let j=stage.querySelector('.wam1140-count[data-key="jukebox"]');if(!j){j=node('span','wam1140-count','0');j.dataset.key='jukebox';stage.append(j);}j.textContent='0';imp(j,'left',JUKEBOX_COUNT_LEFT+'px');
}

function attackFlash(v){
  v.stage.querySelector('.wam1140-attack')?.remove();
  const a=node('div','wam1140-attack','⚡ FRANKIE STOLE A MOVE! ⚡');v.stage.append(a);setTimeout(()=>a.remove(),1000);
  const h=v.stage.querySelector('.wam1140-health');if(h){h.classList.remove('hit');void h.offsetWidth;h.classList.add('hit');}
}

function ensure(v){
  if(!inScope(v))return;
  installStyle();ensureBackground(v);ensureHud(v);fitBoard(v);ensureBoosters(v);updateBoss(v);
}

const render=P.render;
P.render=function(){render.call(this);ensure(this);};

const swap=P.swap;
P.swap=async function(a,b){
  if(!inScope(this))return swap.call(this,a,b);
  const before=this.game.moves;
  const out=await swap.call(this,a,b);
  if(this.disposed||this.ended)return out;
  const after=this.game.moves;
  if(after<before){
    this.__wam1140PlayerMoves=(this.__wam1140PlayerMoves||0)+1;
    if(this.__wam1140PlayerMoves%5===0&&this.game.moves>1){
      this.game.moves=Math.max(0,this.game.moves-1);
      attackFlash(this);this.render();
      if(this.game.finished&&!this.ended)this.end();
    }
  }
  return out;
};

const end=P.end;
P.end=function(){
  if(inScope(this)&&this.game?.won){
    this.stage.querySelector('.wam1140-reaction')?.replaceChildren(document.createTextNode('YOU BEAT ME!'));
    this.toast?.('BAM! FRANKIE FLASH DEFEATED!',1800);
  }
  return end.call(this);
};
})();
