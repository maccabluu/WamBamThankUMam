(()=>{
'use strict';
const U=window.WamUI;
if(!U?.GameView)return;
const P=U.GameView.prototype;
if(P.__wam1136Patched)return;
P.__wam1136Patched=true;

const MIN_LEVEL=2;
const MAX_LEVEL=9;
const BG_PATH='artwork/wambam-level1-bg.jpg';
const COUNT_POS={
  hammer:{left:137,top:1082},
  rocket:{left:263,top:1082},
  swap:{left:390,top:1082},
  disco:{left:517,top:1082}
};

function inScope(view){
  const id=Number(view?.config?.id||0);
  return id>=MIN_LEVEL&&id<=MAX_LEVEL&&!!view?.stage;
}
function imp(el,prop,value){if(el)el.style.setProperty(prop,value,'important');}

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

function installStyle(){
  if(document.getElementById('wam-1136-style'))return;
  const s=document.createElement('style');
  s.id='wam-1136-style';
  s.textContent=`
  .wam1133-chapter .wam1134-count{display:none!important;opacity:0!important}
  .wam1136-count{
    position:absolute!important;width:28px!important;height:28px!important;
    display:flex!important;align-items:center!important;justify-content:center!important;
    padding:0!important;margin:0!important;border:0!important;background:transparent!important;
    color:#fff!important;font-family:Arial,Helvetica,sans-serif!important;font-size:20px!important;font-weight:900!important;
    line-height:28px!important;text-align:center!important;text-shadow:0 2px 0 #6b0736,0 0 3px #6b0736!important;
    z-index:10003!important;pointer-events:none!important;
  }
  .wam1136-clean-mask{
    position:absolute!important;left:605px!important;top:1110px!important;width:115px!important;height:170px!important;
    background-repeat:no-repeat!important;background-size:720px 1280px!important;background-position:-605px -1110px!important;
    z-index:10000!important;pointer-events:none!important;border:0!important;margin:0!important;padding:0!important;
  }
  .wam1133-chapter .wam1133-reference-bar{z-index:10001!important}
  `;
  document.head.appendChild(s);
}

function ensureMask(view){
  const stage=view.stage;
  let mask=stage.querySelector('.wam1136-clean-mask');
  if(!mask){
    mask=document.createElement('div');
    mask.className='wam1136-clean-mask';
    mask.setAttribute('aria-hidden','true');
    stage.appendChild(mask);
  }
  const bgUrl=new URL(BG_PATH,document.baseURI).href;
  imp(mask,'background-image',`url("${bgUrl}")`);
  imp(mask,'filter','saturate(1.04) brightness(.94)');

  const bar=stage.querySelector('.wam1133-reference-bar');
  if(bar)imp(bar,'z-index','10001');

  ['hammer','rocket','swap','disco'].forEach(key=>{
    const b=view.boosterButtons?.[key]?.b;
    if(b)imp(b,'z-index','10004');
  });
}

function ensureCounts(view){
  const stage=view.stage;
  stage.querySelectorAll('.wam1134-count').forEach(old=>{
    imp(old,'display','none');
    imp(old,'opacity','0');
  });

  for(const [key,pos] of Object.entries(COUNT_POS)){
    let badge=stage.querySelector(`.wam1136-count[data-key="${key}"]`);
    if(!badge){
      badge=document.createElement('span');
      badge.className='wam1136-count';
      badge.dataset.key=key;
      stage.appendChild(badge);
    }
    badge.textContent=readLiveCount(view.boosterButtons?.[key]?.b);
    imp(badge,'left',pos.left+'px');
    imp(badge,'top',pos.top+'px');
  }
}

function ensure(view){
  if(!inScope(view))return;
  installStyle();
  ensureMask(view);
  ensureCounts(view);
}

const render=P.render;
P.render=function(){
  render.call(this);
  ensure(this);
};
})();
