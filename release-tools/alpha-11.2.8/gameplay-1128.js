(()=>{
'use strict';
const U=window.WamUI;
if(!U?.GameView)return;
const P=U.GameView.prototype;
if(P.__wam1128Patched)return;
P.__wam1128Patched=true;

const ICONS={
  rocket:'icons/booster-mic-1128.svg',
  hammer:'icons/booster-heel-1128.svg',
  disco:'icons/booster-disco-1128.svg',
  swap:'icons/booster-swap-1128.svg'
};

function style(){
  if(document.getElementById('wam-1128-style'))return;
  const s=document.createElement('style');
  s.id='wam-1128-style';
  s.textContent=`
  /* 11.2.8 premium booster bar inspired by the supplied reference. */
  .wam112-level1 .wam112-booster-tray{
    left:20px!important;top:1112px!important;width:680px!important;height:174px!important;
    border:5px solid #f6bf55!important;border-radius:28px!important;
    background:linear-gradient(180deg,#7d173f 0%,#4a0c2d 58%,#25091d 100%)!important;
    box-shadow:0 7px 0 #12020d,0 0 0 3px #ff5c99 inset,0 0 24px #ff3d9a55!important;
    overflow:visible!important;
  }
  .wam112-level1 .wam112-booster-title{display:none!important}
  .wam112-level1 .wam-booster{
    top:1127px!important;width:150px!important;height:146px!important;
    border:4px solid #f9c15a!important;border-radius:24px!important;
    background:linear-gradient(180deg,#8a1746 0%,#641039 47%,#3b0928 100%)!important;
    box-shadow:0 4px 0 #260214,0 0 0 2px #ff6da6 inset,0 0 14px #ff4c8b44!important;
    display:flex!important;flex-direction:column!important;align-items:center!important;justify-content:flex-start!important;
    padding:6px 5px 5px!important;box-sizing:border-box!important;overflow:visible!important;
  }
  .wam112-level1 .wam-booster:before{
    content:'';position:absolute;left:15px;top:8px;width:112px;height:100px;border-radius:50%;
    background:radial-gradient(circle,#ffdf7b55 0%,#ff3e8c33 38%,#33051f00 72%);
    filter:blur(.2px);pointer-events:none;
  }
  .wam112-level1 .wam-booster.active{
    transform:translateY(-2px);box-shadow:0 0 0 5px #62fff0,0 0 26px #62fff0aa,0 4px 0 #260214,0 0 0 2px white inset!important;
  }
  .wam112-level1 .wam112-boost-icon{
    position:relative!important;z-index:2!important;width:104px!important;height:102px!important;
    object-fit:contain!important;margin:0 auto!important;filter:drop-shadow(0 4px 5px #16000dcc) drop-shadow(0 0 7px #ff9b43aa)!important;
    pointer-events:none!important;
  }
  .wam112-level1 .wam-booster[data-booster="rocket"] .wam112-boost-icon{width:98px!important;height:103px!important}
  .wam112-level1 .wam-booster[data-booster="hammer"] .wam112-boost-icon{width:112px!important;height:104px!important}
  .wam112-level1 .wam-booster[data-booster="disco"] .wam112-boost-icon{width:106px!important;height:104px!important}
  .wam112-level1 .wam-booster[data-booster="swap"] .wam112-boost-icon{width:108px!important;height:100px!important}
  .wam112-level1 .wam112-boost-symbol{display:none!important}
  .wam112-level1 .wam112-boost-label{
    position:absolute!important;left:2px!important;right:2px!important;bottom:7px!important;width:auto!important;
    color:#fff8e7!important;font-family:Impact,'Arial Narrow',Arial,sans-serif!important;font-size:16px!important;line-height:18px!important;
    font-weight:900!important;letter-spacing:.45px!important;text-align:center!important;text-transform:uppercase!important;
    text-shadow:0 3px 2px #25000f,0 0 5px #000!important;white-space:nowrap!important;z-index:4!important;
  }
  .wam112-level1 .wam-booster>span:not(.wam112-boost-label){
    right:-10px!important;top:87px!important;z-index:8!important;min-width:39px!important;min-height:39px!important;
    width:39px!important;height:39px!important;padding:0!important;border:4px solid #ffd46d!important;border-radius:50%!important;
    background:linear-gradient(180deg,#e82378,#b40854)!important;color:#fff!important;font-size:22px!important;font-weight:900!important;
    box-shadow:0 3px 0 #600727,0 0 0 2px #ff8ab4 inset!important;
  }
  `;
  document.head.appendChild(s);
}

function setIcon(view,key){
  const b=view.boosterButtons?.[key]?.b;if(!b)return;
  b.dataset.booster=key;
  let img=b.querySelector('.wam112-boost-icon');
  if(!img){
    img=document.createElement('img');img.className='wam112-boost-icon';img.alt='';
    const label=b.querySelector('.wam112-boost-label');
    if(label)b.insertBefore(img,label);else b.insertBefore(img,b.firstChild);
  }
  const src=ICONS[key];
  if(src&&img.getAttribute('src')!==src)img.src=src;
}

function ensure(view){
  if(view?.config?.id!==1||!view.stage)return;
  style();
  ['rocket','hammer','disco','swap'].forEach((key,i)=>{
    const b=view.boosterButtons?.[key]?.b;if(!b)return;
    b.style.left=(33+i*163)+'px';
    setIcon(view,key);
  });
}

const render=P.render;
P.render=function(){render.call(this);ensure(this);};
})();
