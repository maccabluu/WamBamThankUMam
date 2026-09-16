(()=>{
'use strict';
const U=window.WamUI;
if(!U?.GameView)return;
const P=U.GameView.prototype;
if(P.__wam1133Patched)return;
P.__wam1133Patched=true;

const MIN_LEVEL=2;
const MAX_LEVEL=9;
const BG_PATH='artwork/wambam-level1-bg.jpg';
const BAR_PATH='artwork/booster-bar-reference-1132.png';
const BOOSTER_MAP=[
  {key:'hammer',label:'HAMMER',left:17},
  {key:'rocket',label:'MIC BLAST',left:149},
  {key:'swap',label:'SHUFFLE',left:281},
  {key:'disco',label:'SPOTLIGHT',left:414}
];

function inScope(view){
  const id=Number(view?.config?.id||0);
  return id>=MIN_LEVEL&&id<=MAX_LEVEL&&!!view?.stage;
}
function imp(el,prop,value){if(el)el.style.setProperty(prop,value,'important');}
function node(tag,cls,text){const n=document.createElement(tag);if(cls)n.className=cls;if(text!=null)n.textContent=text;return n;}

function installStyle(){
  if(document.getElementById('wam-1133-style'))return;
  const s=document.createElement('style');
  s.id='wam-1133-style';
  s.textContent=`
  .wam1133-chapter{font-family:Arial,Helvetica,sans-serif!important;color:#fff!important}
  .wam1133-chapter .wam-art{object-fit:cover!important;filter:saturate(1.04) brightness(.94)!important}

  .wam1133-goals,.wam1133-moves,.wam1133-stars{position:absolute!important;box-sizing:border-box!important;z-index:7!important}
  .wam1133-goals{left:18px;top:32px;width:194px;min-height:205px;border:4px solid #ffd36b;border-radius:28px;background:linear-gradient(180deg,#e51d78 0,#ad0b59 34%,#6c123f 100%);box-shadow:0 6px 0 #3a0926,0 0 18px #ff4da17a,inset 0 0 0 3px #ff8fc3;overflow:hidden}
  .wam1133-goals:after{content:'';position:absolute;left:10px;right:10px;top:65px;bottom:10px;border-radius:20px;background:linear-gradient(180deg,#fff8eb,#f5e5d8);box-shadow:inset 0 0 0 2px #ffd5c8,0 3px 8px #4c092a55;z-index:0}
  .wam1133-goals strong{position:relative;z-index:2;display:block;text-align:center;padding:10px 30px 6px;color:#fff;font-size:27px;line-height:38px;letter-spacing:.8px;text-shadow:0 3px 0 #690733,0 0 7px #fff4b0}
  .wam1133-goals strong:before,.wam1133-goals strong:after{content:'★';position:absolute;top:10px;color:#ffd44d;font-size:25px;text-shadow:0 2px 0 #9b4d00,0 0 6px #fff4a8}
  .wam1133-goals strong:before{left:12px}.wam1133-goals strong:after{right:12px}

  .wam1133-chapter .wam-target{left:31px!important;width:163px!important;height:60px!important;z-index:9!important;padding:2px 13px!important;box-sizing:border-box!important;border-radius:0!important;background:transparent!important;color:#53112e!important;font-size:34px!important;font-weight:900!important;box-shadow:none!important;gap:10px!important;justify-content:space-between!important}
  .wam1133-chapter .wam-target img{width:58px!important;height:55px!important;object-fit:contain!important;mix-blend-mode:normal!important;filter:drop-shadow(0 2px 2px #7d203a44)!important}
  .wam1133-chapter .wam-target.done{background:transparent!important;color:#188056!important}

  .wam1133-moves{right:18px;top:32px;width:158px;height:190px;border:4px solid #ffd36b;border-radius:30px;background:linear-gradient(180deg,#e51d78 0,#ad0b59 37%,#6c123f 100%);box-shadow:0 6px 0 #3a0926,0 0 18px #ff4da17a,inset 0 0 0 3px #ff8fc3;text-align:center;overflow:hidden}
  .wam1133-moves:after{content:'';position:absolute;left:10px;right:10px;top:68px;bottom:10px;border-radius:20px;background:linear-gradient(180deg,#fff9ef,#f4dfd7);box-shadow:inset 0 0 0 2px #ffd3c6,0 3px 8px #4c092a55;z-index:0}
  .wam1133-moves strong{position:relative;z-index:2;display:block;padding-top:6px;font-family:'Brush Script MT','Segoe Script',cursive;font-style:italic;font-weight:700;color:#fff8e8;font-size:31px;line-height:52px;text-shadow:0 3px 0 #74083e,0 0 8px #fff6c9}
  .wam1133-moves strong:before,.wam1133-moves strong:after{content:'✦';position:absolute;top:10px;color:#ffd44d;font-family:Arial,sans-serif;font-size:21px;font-style:normal;text-shadow:0 0 7px #fff0a0}
  .wam1133-moves strong:before{left:10px}.wam1133-moves strong:after{right:10px}
  .wam1133-chapter .wam-moves{left:auto!important;right:29px!important;top:106px!important;width:132px!important;height:92px!important;z-index:10!important;color:#4d082d!important;font-size:67px!important;font-weight:900!important;line-height:1!important;text-shadow:0 2px 0 #fff9ed!important}

  .wam1133-stars{left:218px;top:48px;width:292px;height:170px;overflow:visible;text-align:center}
  .wam1133-star-row{position:absolute;left:0;top:0;width:292px;height:70px;display:flex;justify-content:space-around;align-items:flex-start;z-index:5;pointer-events:none}
  .wam1133-star{font-size:62px;line-height:1;color:#6a345c;text-shadow:0 4px 0 #4c153a,0 0 4px #fff2b8;transition:transform .18s ease,color .18s ease,filter .18s ease}
  .wam1133-star.lit{color:#ffc928;filter:drop-shadow(0 0 7px #ffae2a);transform:scale(1.08)}
  .wam1133-track{position:absolute;left:0;top:55px;width:292px;height:48px;border:5px solid #f5bf45;border-radius:27px;background:linear-gradient(180deg,#481541,#261126);box-shadow:0 5px 0 #7f4218,0 0 0 2px #7b2356,inset 0 0 0 3px #140914;overflow:hidden}
  .wam1133-fill{height:100%;width:0;background:linear-gradient(90deg,#ff2d86 0%,#f52d8d 48%,#b51e74 100%);border-radius:20px;box-shadow:inset 0 4px 7px #ff9bc777;transition:width .2s ease}
  .wam1133-level-tab{position:absolute;left:74px;top:100px;width:144px;height:48px;display:flex;align-items:center;justify-content:center;border:4px solid #f5bf45;border-top:0;border-radius:0 0 20px 20px;background:linear-gradient(180deg,#ffd760,#f2a33b);color:#521431;font-size:23px;font-weight:900;letter-spacing:.4px;text-shadow:0 1px #fff3bd;box-shadow:0 4px 0 #8d4b1d;z-index:3}

  .wam1133-chapter .wam-board-title{z-index:8!important;padding:0 10px!important;box-sizing:border-box!important;border:3px solid #ffd16a!important;border-radius:16px!important;background:#280c2ddd!important;color:#fff1c3!important;font-size:17px!important;box-shadow:0 4px 0 #170311!important;text-shadow:0 2px #6c1747!important}
  .wam1133-chapter .wam-board-title button{background:#cf176b!important;color:#fff8da!important;border:2px solid #ffd46d!important}
  .wam1133-chapter .wam-board-info,.wam1133-chapter .wam-shape-tip{display:none!important}

  /* Visual polish only: no left/top/width/height is applied to the board. */
  .wam1133-chapter .wam-grid{z-index:6!important;border-radius:24px!important;box-shadow:0 0 0 7px #190919e6,0 0 0 11px #ffd16a,0 10px 24px #08020ccc,0 0 28px #ff3c9f77!important;background:#120b1bd9!important;overflow:hidden!important}
  .wam1133-chapter .wam-grid.shaped .wam-cell{background:linear-gradient(145deg,#26172fee,#171323f2)!important;border:1.5px solid #7e638c!important;border-radius:8px!important;box-shadow:inset 0 1px #ffffff1f!important}
  .wam1133-chapter .wam-cell img.supplied{mix-blend-mode:normal!important}
  .wam1133-chapter .wam-cell.selected{background:#55305ee8!important;box-shadow:inset 0 0 0 4px #ff4c9e!important}

  .wam1133-chapter .wam-pause{z-index:12!important;border:3px solid #ffd46d!important;border-radius:50%!important;background:#8e104eee!important;box-shadow:0 4px 0 #38051f!important;color:#fff4cf!important}
  .wam1133-reference-bar{position:absolute;left:15px;top:994px;width:690px;height:171px;object-fit:fill;display:block;z-index:8;pointer-events:none;border:0;margin:0;padding:0;filter:drop-shadow(0 6px 7px #13000baa)}
  `;
  document.head.appendChild(s);
}

function ensureBackground(stage){
  const bgUrl=new URL(BG_PATH,document.baseURI).href;
  const art=stage.querySelector('.wam-art');
  if(!art)return;
  if(art.tagName==='IMG'){
    if(art.src!==bgUrl)art.src=bgUrl;
  }else{
    imp(art,'background-image',`url("${bgUrl}")`);
    imp(art,'background-size','cover');
    imp(art,'background-position','center');
  }
}

function ensurePanels(view){
  const stage=view.stage;
  if(!stage.querySelector('.wam1133-goals')){
    const goals=node('div','wam1133-goals');
    goals.append(node('strong','', 'GOALS'));
    stage.appendChild(goals);
  }
  if(!stage.querySelector('.wam1133-moves')){
    const moves=node('div','wam1133-moves');
    moves.append(node('strong','', 'Moves'));
    stage.appendChild(moves);
  }
  if(!stage.querySelector('.wam1133-stars')){
    const wrap=node('div','wam1133-stars');
    const row=node('div','wam1133-star-row');
    for(let i=0;i<3;i++){const star=node('span','wam1133-star','★');star.dataset.star=String(i+1);row.appendChild(star);}
    const track=node('div','wam1133-track');track.appendChild(node('div','wam1133-fill'));
    const tab=node('div','wam1133-level-tab',`LEVEL ${view.config.id}`);
    wrap.append(row,track,tab);
    stage.appendChild(wrap);
  }

  const targets=Object.values(view.targetEls||{}).filter(e=>e?.row);
  const count=Math.max(1,targets.length);
  const compact=count>2;
  const goals=stage.querySelector('.wam1133-goals');
  if(goals)imp(goals,'height',(compact?Math.min(255,80+count*51):205)+'px');
  targets.forEach((entry,i)=>{
    imp(entry.row,'left','31px');
    imp(entry.row,'top',(compact?91+i*49:100+i*63)+'px');
    if(compact){
      imp(entry.row,'height','46px');
      imp(entry.row,'font-size','28px');
      const img=entry.row.querySelector('img');
      if(img){imp(img,'width','44px');imp(img,'height','42px');}
    }
  });
}

function alignTitleToExistingBoard(view){
  const title=view.stage.querySelector('.wam-board-title');
  const board=view.board;
  if(!title||!board)return;
  const cs=getComputedStyle(board);
  const left=parseFloat(board.style.left||cs.left);
  const top=parseFloat(board.style.top||cs.top);
  const width=parseFloat(board.style.width||cs.width);
  if(Number.isFinite(left))imp(title,'left',`${left}px`);
  if(Number.isFinite(width)&&width>0)imp(title,'width',`${width}px`);
  if(Number.isFinite(top))imp(title,'top',`${Math.max(250,top-56)}px`);
  imp(title,'height','46px');
  const span=title.querySelector('span');
  if(span)span.textContent=`LEVEL ${view.config.id} · ${String(view.config.name||'BAM LOUNGE').toUpperCase()}`;
}

function ensureBoosterBar(view){
  const stage=view.stage;
  const barUrl=new URL(BAR_PATH,document.baseURI).href;
  const oldTray=stage.querySelector('.wam112-booster-tray');if(oldTray)imp(oldTray,'display','none');
  const oldTitle=stage.querySelector('.wam112-booster-title');if(oldTitle)imp(oldTitle,'display','none');

  let bar=stage.querySelector('.wam1133-reference-bar');
  if(!bar){bar=document.createElement('img');bar.className='wam1133-reference-bar';bar.alt='';bar.setAttribute('aria-hidden','true');stage.appendChild(bar);}
  if(bar.src!==barUrl)bar.src=barUrl;

  BOOSTER_MAP.forEach(spec=>{
    const b=view.boosterButtons?.[spec.key]?.b;if(!b)return;
    b.dataset.booster=spec.key;b.title=spec.label;b.setAttribute('aria-label',spec.label);
    imp(b,'position','absolute');imp(b,'left',(15+spec.left)+'px');imp(b,'top','1003px');imp(b,'width','121px');imp(b,'height','149px');
    imp(b,'display','block');imp(b,'opacity','0');imp(b,'background','transparent');imp(b,'border','0');imp(b,'box-shadow','none');
    imp(b,'padding','0');imp(b,'margin','0');imp(b,'z-index','12');imp(b,'pointer-events','auto');imp(b,'transform','none');imp(b,'overflow','hidden');
    Array.from(b.children).forEach(child=>imp(child,'display','none'));
    Array.from(b.childNodes).forEach(n=>{if(n.nodeType===3)n.textContent='';});
  });
}

function updateProgress(view){
  const initial=Object.values(view.config?.targets||{}).reduce((a,b)=>a+Math.max(0,Number(b||0)),0)||1;
  const left=Object.values(view.game?.targets||{}).reduce((a,b)=>a+Math.max(0,Number(b||0)),0);
  const progress=Math.max(0,Math.min(1,(initial-left)/initial));
  const fill=view.stage.querySelector('.wam1133-fill');if(fill)fill.style.width=Math.round(progress*100)+'%';
  view.stage.querySelectorAll('.wam1133-star').forEach((star,i)=>star.classList.toggle('lit',progress>=((i+1)/3)-.001));
  const tab=view.stage.querySelector('.wam1133-level-tab');if(tab)tab.textContent=`LEVEL ${view.config.id}`;
}

function ensure(view){
  if(!inScope(view))return;
  installStyle();
  view.stage.classList.add('wam1133-chapter');
  ensureBackground(view.stage);
  ensurePanels(view);
  alignTitleToExistingBoard(view);
  ensureBoosterBar(view);
  updateProgress(view);
}

const render=P.render;
P.render=function(){render.call(this);ensure(this);};

const dispose=P.dispose;
P.dispose=function(){
  if(this?.stage?.classList)this.stage.classList.remove('wam1133-chapter');
  return dispose.call(this);
};
})();
