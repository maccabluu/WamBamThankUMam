(()=>{
'use strict';
const U=window.WamUI;
if(!U?.GameView)return;
const P=U.GameView.prototype;
if(P.__wam1130Patched)return;
P.__wam1130Patched=true;

const ICONS={
  rocket:'icons/booster-mic-1128.svg',
  hammer:'icons/booster-heel-1128.svg',
  disco:'icons/booster-disco-1128.svg',
  swap:'icons/booster-swap-1128.svg'
};
const LABELS={rocket:'MIC BLAST',hammer:'HEEL SMASH',disco:'DISCO BALL',swap:'FREE SWAP'};
const ORDER=['rocket','hammer','disco','swap'];
const LEFTS=[31,196,361,526];

function imp(el,prop,value){if(el)el.style.setProperty(prop,value,'important');}

function installStyle(){
  if(document.getElementById('wam-1130-style'))return;
  const s=document.createElement('style');
  s.id='wam-1130-style';
  s.textContent=`
  .wam112-level1 .wam-booster::before{
    content:''!important;position:absolute!important;inset:7px 8px 30px 8px!important;
    border-radius:18px!important;
    background:radial-gradient(circle at 50% 48%,#ffb35330 0%,#ff2f7b19 42%,transparent 72%)!important;
    pointer-events:none!important;z-index:0!important;
  }
  .wam112-level1 .wam-booster::after{
    content:''!important;position:absolute!important;left:10px!important;right:10px!important;top:8px!important;height:24px!important;
    border-radius:16px 16px 50% 50%!important;background:linear-gradient(180deg,#ffffff3d,transparent)!important;
    pointer-events:none!important;z-index:1!important;
  }
  .wam112-level1 .wam1130-label{
    position:absolute!important;left:1px!important;right:1px!important;bottom:6px!important;height:25px!important;
    display:flex!important;align-items:center!important;justify-content:center!important;
    color:#fff8ec!important;font-family:Impact,'Arial Narrow',Arial,sans-serif!important;
    font-size:16px!important;line-height:20px!important;font-weight:900!important;letter-spacing:.55px!important;
    text-align:center!important;text-transform:uppercase!important;white-space:nowrap!important;
    text-shadow:0 3px 2px #21000e,0 0 5px #000!important;z-index:9!important;pointer-events:none!important;
  }
  `;
  document.head.appendChild(s);
}

function numericCount(button){
  return Array.from(button.children).find(n=>n.tagName==='SPAN' && /^\s*\d+\s*$/.test(n.textContent||''));
}

function rebuildCard(button,key){
  button.dataset.booster=key;

  // Remove legacy plain text and legacy labels so names only appear under the icon.
  Array.from(button.childNodes).forEach(n=>{if(n.nodeType===3)n.textContent='';});
  button.querySelectorAll('.wam112-boost-label').forEach(n=>n.remove());
  button.querySelectorAll('.wam112-boost-symbol').forEach(n=>n.remove());

  let img=button.querySelector('.wam1130-icon');
  if(!img){
    button.querySelectorAll('.wam112-boost-icon').forEach(n=>n.remove());
    img=document.createElement('img');
    img.className='wam1130-icon';img.alt='';button.insertBefore(img,button.firstChild);
  }
  img.src=ICONS[key];
  imp(img,'position','absolute');imp(img,'left','50%');imp(img,'top','8px');imp(img,'transform','translateX(-50%)');
  imp(img,'width',key==='hammer'?'110px':key==='rocket'?'102px':'108px');imp(img,'height','104px');
  imp(img,'object-fit','contain');imp(img,'margin','0');imp(img,'z-index','5');imp(img,'pointer-events','none');
  imp(img,'filter','drop-shadow(0 4px 4px #18000dcc) drop-shadow(0 0 9px #ffb34faa)');

  let label=button.querySelector('.wam1130-label');
  if(!label){label=document.createElement('span');label.className='wam1130-label';button.appendChild(label);}
  label.textContent=LABELS[key];

  const count=numericCount(button);
  Array.from(button.children).forEach(n=>{
    if(n===img||n===label||n===count)return;
    if(n.tagName==='SPAN')imp(n,'display','none');
  });
  if(count){
    imp(count,'position','absolute');imp(count,'right','-7px');imp(count,'top','90px');imp(count,'left','auto');imp(count,'bottom','auto');
    imp(count,'width','40px');imp(count,'height','40px');imp(count,'min-width','40px');imp(count,'min-height','40px');imp(count,'padding','0');
    imp(count,'display','flex');imp(count,'align-items','center');imp(count,'justify-content','center');
    imp(count,'border','4px solid #f9d06b');imp(count,'border-radius','50%');
    imp(count,'background','linear-gradient(180deg,#e92e7b 0%,#bd0a57 100%)');
    imp(count,'color','#fff');imp(count,'font-family','Arial,Helvetica,sans-serif');imp(count,'font-size','22px');imp(count,'font-weight','900');
    imp(count,'line-height','40px');imp(count,'box-shadow','0 3px 0 #6a0b2f,0 0 0 2px #ff8bb5 inset');imp(count,'z-index','10');
  }
}

function ensure(view){
  if(view?.config?.id!==1||!view.stage)return;
  installStyle();
  const stage=view.stage;
  const tray=stage.querySelector('.wam112-booster-tray');
  if(tray){
    // Move the whole bar up so every card is fully visible on the 720x1280 game stage.
    imp(tray,'left','16px');imp(tray,'top','1004px');imp(tray,'width','688px');imp(tray,'height','172px');
    imp(tray,'box-sizing','border-box');imp(tray,'border','6px solid #efc06a');imp(tray,'border-radius','29px');
    imp(tray,'background','linear-gradient(180deg,#5f102f 0%,#3d0a25 52%,#250516 100%)');
    imp(tray,'box-shadow','0 6px 0 #16030e,0 0 0 3px #ff7aa7 inset,0 0 0 7px #7a173c inset,0 0 18px #ff3b8344');
    imp(tray,'overflow','visible');
  }
  const title=stage.querySelector('.wam112-booster-title');if(title)imp(title,'display','none');

  ORDER.forEach((key,i)=>{
    const b=view.boosterButtons?.[key]?.b;if(!b)return;
    imp(b,'left',LEFTS[i]+'px');imp(b,'top','1015px');imp(b,'width','152px');imp(b,'height','151px');
    imp(b,'padding','0');imp(b,'margin','0');imp(b,'box-sizing','border-box');imp(b,'font-size','0');imp(b,'color','transparent');
    imp(b,'border','4px solid #efc36a');imp(b,'border-radius','21px');
    imp(b,'background','linear-gradient(180deg,#7f1642 0%,#5d0d34 54%,#3a0924 100%)');
    imp(b,'box-shadow','0 4px 0 #260413,0 0 0 2px #ff678f inset,0 0 0 5px #6c1239 inset,0 0 12px #ff3c7f30');
    imp(b,'display','block');imp(b,'overflow','visible');imp(b,'transform','none');imp(b,'z-index','9');
    rebuildCard(b,key);
  });
}

const render=P.render;
P.render=function(){render.call(this);ensure(this);};
})();
