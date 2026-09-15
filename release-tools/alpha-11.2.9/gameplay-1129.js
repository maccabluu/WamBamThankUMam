(()=>{
'use strict';
const U=window.WamUI;
if(!U?.GameView)return;
const P=U.GameView.prototype;
if(P.__wam1129Patched)return;
P.__wam1129Patched=true;

const ICONS={
  rocket:'icons/booster-mic-1128.svg',
  hammer:'icons/booster-heel-1128.svg',
  disco:'icons/booster-disco-1128.svg',
  swap:'icons/booster-swap-1128.svg'
};
const LABELS={rocket:'MIC BLAST',hammer:'HEEL SMASH',disco:'DISCO BALL',swap:'FREE SWAP'};

function imp(el,prop,value){if(el)el.style.setProperty(prop,value,'important');}

function installStyle(){
  if(document.getElementById('wam-1129-style'))return;
  const s=document.createElement('style');
  s.id='wam-1129-style';
  s.textContent=`
  .wam112-level1 .wam-booster:before{
    content:''!important;position:absolute!important;left:10px!important;right:10px!important;top:8px!important;height:112px!important;
    border-radius:18px!important;background:radial-gradient(circle at 50% 48%,#ffb14a45 0%,#ff3d8730 42%,transparent 73%)!important;
    pointer-events:none!important;z-index:0!important;
  }
  .wam112-level1 .wam-booster:after{
    content:''!important;position:absolute!important;left:9px!important;right:9px!important;top:7px!important;height:26px!important;
    border-radius:15px 15px 45% 45%!important;background:linear-gradient(180deg,#ffffff38,transparent)!important;pointer-events:none!important;z-index:1!important;
  }
  `;
  document.head.appendChild(s);
}

function forceIcon(button,key){
  let img=button.querySelector('.wam112-boost-icon');
  if(!img){
    img=document.createElement('img');img.className='wam112-boost-icon';img.alt='';button.insertBefore(img,button.firstChild);
  }
  img.src=ICONS[key];
  imp(img,'position','absolute');imp(img,'left','50%');imp(img,'top','7px');imp(img,'transform','translateX(-50%)');
  imp(img,'width',key==='hammer'?'118px':key==='rocket'?'108px':'114px');
  imp(img,'height','112px');imp(img,'object-fit','contain');imp(img,'z-index','3');
  imp(img,'margin','0');imp(img,'filter','drop-shadow(0 5px 4px #17000dcc) drop-shadow(0 0 9px #ff9b43aa)');

  button.querySelectorAll('.wam112-boost-symbol').forEach(n=>imp(n,'display','none'));
  let label=button.querySelector('.wam112-boost-label');
  if(!label){label=document.createElement('span');label.className='wam112-boost-label';button.appendChild(label);}
  label.textContent=LABELS[key];
  imp(label,'position','absolute');imp(label,'left','2px');imp(label,'right','2px');imp(label,'bottom','8px');
  imp(label,'width','auto');imp(label,'height','24px');imp(label,'display','flex');imp(label,'align-items','center');imp(label,'justify-content','center');
  imp(label,'border','0');imp(label,'background','transparent');imp(label,'color','#fff8ed');imp(label,'font-family',"Impact,'Arial Narrow',Arial,sans-serif");
  imp(label,'font-size',key==='swap'?'15px':'17px');imp(label,'line-height','20px');imp(label,'font-weight','900');
  imp(label,'letter-spacing','.5px');imp(label,'text-shadow','0 3px 2px #1b000c,0 0 5px #000');imp(label,'z-index','7');

  const count=Array.from(button.children).find(n=>n.tagName==='SPAN'&&!n.classList.contains('wam112-boost-label'));
  if(count){
    imp(count,'position','absolute');imp(count,'right','-9px');imp(count,'top','91px');imp(count,'left','auto');imp(count,'bottom','auto');
    imp(count,'width','42px');imp(count,'height','42px');imp(count,'min-width','42px');imp(count,'min-height','42px');imp(count,'padding','0');
    imp(count,'display','flex');imp(count,'align-items','center');imp(count,'justify-content','center');imp(count,'border','4px solid #ffd66c');
    imp(count,'border-radius','50%');imp(count,'background','linear-gradient(180deg,#ea2b7d,#b80b59)');imp(count,'color','#fff');
    imp(count,'font-size','23px');imp(count,'font-weight','900');imp(count,'box-shadow','0 3px 0 #67072d,0 0 0 2px #ff8eb8 inset');imp(count,'z-index','9');
  }
}

function ensure(view){
  if(view?.config?.id!==1||!view.stage)return;
  installStyle();
  const stage=view.stage;
  const tray=stage.querySelector('.wam112-booster-tray');
  if(tray){
    imp(tray,'left','16px');imp(tray,'top','1124px');imp(tray,'width','688px');imp(tray,'height','190px');
    imp(tray,'border','6px solid #f4c05a');imp(tray,'border-radius','29px');
    imp(tray,'background','linear-gradient(180deg,#8d1748 0%,#5c1037 48%,#300820 100%)');
    imp(tray,'box-shadow','0 7px 0 #15020f,0 0 0 3px #ff719f inset,0 0 22px #ff3d8c55');imp(tray,'overflow','visible');
  }
  const title=stage.querySelector('.wam112-booster-title');if(title)imp(title,'display','none');

  const lefts=[31,197,363,529];
  ['rocket','hammer','disco','swap'].forEach((key,i)=>{
    const b=view.boosterButtons?.[key]?.b;if(!b)return;
    b.dataset.booster=key;
    imp(b,'left',lefts[i]+'px');imp(b,'top','1138px');imp(b,'width','150px');imp(b,'height','164px');
    imp(b,'padding','0');imp(b,'box-sizing','border-box');imp(b,'border','4px solid #f7c45e');imp(b,'border-radius','23px');
    imp(b,'background','linear-gradient(180deg,#97194c 0%,#6d123f 48%,#400a2a 100%)');
    imp(b,'box-shadow','0 4px 0 #260214,0 0 0 2px #ff75a8 inset,0 0 12px #ff4d8d3d');
    imp(b,'display','block');imp(b,'overflow','visible');imp(b,'transform','none');
    forceIcon(b,key);
  });
}

const render=P.render;
P.render=function(){render.call(this);ensure(this);};
})();
