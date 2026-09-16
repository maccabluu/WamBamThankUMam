(()=>{
'use strict';
const U=window.WamUI;
if(!U?.GameView)return;
const P=U.GameView.prototype;
if(P.__wam1134Patched)return;
P.__wam1134Patched=true;

const MIN_LEVEL=2;
const MAX_LEVEL=9;
const COUNT_POS={hammer:132,rocket:264,swap:396,disco:529};

function inScope(view){
  const id=Number(view?.config?.id||0);
  return id>=MIN_LEVEL&&id<=MAX_LEVEL&&!!view?.stage;
}
function imp(el,prop,value){if(el)el.style.setProperty(prop,value,'important');}

function installStyle(){
  if(document.getElementById('wam-1134-style'))return;
  const s=document.createElement('style');
  s.id='wam-1134-style';
  s.textContent=`
  /* Keep every old live booster control invisible: artwork + separate count badges are the only visible booster UI. */
  .wam1133-chapter .wam-booster,
  .wam1133-chapter .wam-booster *{background:transparent!important;box-shadow:none!important;border-color:transparent!important;color:transparent!important;text-shadow:none!important}
  .wam1133-chapter .wam-booster:before,
  .wam1133-chapter .wam-booster:after{display:none!important;content:none!important}
  .wam1133-chapter .wam112-booster-tray,
  .wam1133-chapter .wam112-booster-title{display:none!important}

  .wam1134-count{
    position:absolute!important;top:1080px!important;width:38px!important;height:38px!important;
    display:flex!important;align-items:center!important;justify-content:center!important;
    box-sizing:border-box!important;border:3px solid #ffd66f!important;border-radius:50%!important;
    background:linear-gradient(180deg,#e82d78,#bd0b58)!important;color:#fff!important;
    font-family:Arial,Helvetica,sans-serif!important;font-size:21px!important;font-weight:900!important;line-height:1!important;
    text-shadow:0 2px 0 #65072f!important;box-shadow:0 3px 0 #5d092e,0 0 0 2px #ff8eb9 inset!important;
    z-index:15!important;pointer-events:none!important;
  }

  /* Goals panel grows with the target count. Rows are kept entirely inside the cream area. */
  .wam1133-chapter .wam-target{overflow:visible!important;white-space:nowrap!important}
  .wam1133-chapter .wam-target img{flex:0 0 auto!important}

  /* Suppress the stray oval/legacy booster decorations visible at the bottom-right in 11.3.3. */
  .wam1133-chapter [class*="booster"]:not(.wam1133-reference-bar):not(.wam1134-count):before,
  .wam1133-chapter [class*="booster"]:not(.wam1133-reference-bar):not(.wam1134-count):after{display:none!important;content:none!important}
  `;
  document.head.appendChild(s);
}

function readLiveCount(button){
  if(!button)return '0';
  const candidates=[...button.querySelectorAll('span,b,strong,em')];
  for(const n of candidates){
    const t=String(n.textContent||'').trim();
    if(/^\d+$/.test(t))return t;
  }
  const all=String(button.textContent||'').match(/\b\d+\b/g);
  return all?.length?all[all.length-1]:'0';
}

function ensureCounts(view){
  const stage=view.stage;
  for(const [key,left] of Object.entries(COUNT_POS)){
    const button=view.boosterButtons?.[key]?.b;
    let badge=stage.querySelector(`.wam1134-count[data-key="${key}"]`);
    if(!badge){
      badge=document.createElement('span');
      badge.className='wam1134-count';
      badge.dataset.key=key;
      stage.appendChild(badge);
    }
    badge.textContent=readLiveCount(button);
    imp(badge,'left',left+'px');
  }
}

function fitGoals(view){
  const stage=view.stage;
  const goals=stage.querySelector('.wam1133-goals');
  const targets=Object.values(view.targetEls||{}).filter(e=>e?.row);
  if(!goals||!targets.length)return;
  const count=targets.length;
  const rowH=count>=4?43:48;
  const gap=count>=4?3:4;
  const firstTop=101;
  const panelBottom=firstTop + count*(rowH+gap) + 10;
  const panelHeight=Math.max(205,panelBottom-32);
  imp(goals,'height',panelHeight+'px');
  imp(goals,'min-height',panelHeight+'px');

  targets.forEach((entry,i)=>{
    const row=entry.row;
    imp(row,'left','31px');
    imp(row,'top',(firstTop+i*(rowH+gap))+'px');
    imp(row,'width','163px');
    imp(row,'height',rowH+'px');
    imp(row,'padding','1px 11px');
    imp(row,'font-size',count>=4?'25px':'28px');
    const img=row.querySelector('img');
    if(img){
      imp(img,'width',count>=4?'39px':'44px');
      imp(img,'height',count>=4?'38px':'43px');
      imp(img,'object-fit','contain');
    }
  });
}

function enlargeExistingBoard(view){
  const board=view.board;
  const title=view.stage.querySelector('.wam-board-title');
  if(!board)return;
  const cs=getComputedStyle(board);
  const left=parseFloat(board.style.left||cs.left);
  const top=parseFloat(board.style.top||cs.top);
  const width=parseFloat(board.style.width||cs.width);
  const height=parseFloat(board.style.height||cs.height);
  if(![left,top,width,height].every(Number.isFinite)||width<=0||height<=0)return;

  /* Scale the already-existing board instead of replacing its geometry. */
  const scale=Math.max(1,Math.min(1.16,625/width,(982-top)/height));
  imp(board,'transform-origin','center top');
  imp(board,'transform',`scale(${scale.toFixed(4)})`);

  if(title){
    const visualWidth=width*scale;
    const visualLeft=left-(visualWidth-width)/2;
    imp(title,'left',Math.max(18,visualLeft)+'px');
    imp(title,'width',Math.min(684,visualWidth)+'px');
    imp(title,'top',Math.max(250,top-56)+'px');
    imp(title,'height','46px');
  }
}

function removeStrays(view){
  const stage=view.stage;
  /* Hide any live booster button that is not one of the four mapped transparent hit areas. */
  const allowed=new Set(['hammer','rocket','swap','disco']);
  stage.querySelectorAll('.wam-booster').forEach(b=>{
    const key=b.dataset.booster||'';
    imp(b,'background','transparent');
    imp(b,'border','0');
    imp(b,'box-shadow','none');
    if(!allowed.has(key)){
      imp(b,'display','none');
      imp(b,'opacity','0');
      imp(b,'pointer-events','none');
    }
  });
}

function ensure(view){
  if(!inScope(view))return;
  installStyle();
  fitGoals(view);
  enlargeExistingBoard(view);
  removeStrays(view);
  ensureCounts(view);
}

const render=P.render;
P.render=function(){
  render.call(this);
  ensure(this);
};
})();
