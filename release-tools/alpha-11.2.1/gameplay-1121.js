(()=>{
'use strict';
const U=window.WamUI;
if(!U?.GameView)return;
const P=U.GameView.prototype;
if(P.__wam1121Patched)return;
P.__wam1121Patched=true;

function style(){
  if(document.getElementById('wam-1121-style'))return;
  const s=document.createElement('style');
  s.id='wam-1121-style';
  s.textContent=`
  /* Alpha 11.2.1 visual polish: larger gameplay board + clearer boosters */
  .wam112-level1 .wam-board-title{left:100px!important;top:266px!important;width:520px!important;height:46px!important;font-size:18px!important}
  .wam112-level1 .wam-grid{left:100px!important;top:326px!important;width:520px!important;height:520px!important;border-radius:24px!important;box-shadow:0 0 0 7px #190919e6,0 0 0 11px #ffd16a,0 12px 28px #08020cdd,0 0 32px #ff3c9f88!important}
  .wam112-level1 .wam-pause{left:645px!important;top:248px!important}

  .wam112-level1 .wam112-booster-tray{left:18px!important;top:1013px!important;width:684px!important;height:182px!important;border-radius:26px!important}
  .wam112-level1 .wam112-booster-title{top:-27px!important;left:233px!important;width:214px!important;padding:4px 0!important;font-size:18px!important}

  .wam112-level1 .wam-booster{top:1034px!important;width:150px!important;height:136px!important;border-radius:20px!important;padding:6px 5px 5px!important;box-sizing:border-box!important;justify-content:flex-start!important;gap:3px!important;background:linear-gradient(180deg,#b20d63,#5a123f)!important}
  .wam112-level1 .wam-booster[data-booster="rocket"]{left:31px!important}
  .wam112-level1 .wam-booster[data-booster="hammer"]{left:195px!important}
  .wam112-level1 .wam-booster[data-booster="disco"]{left:359px!important}
  .wam112-level1 .wam-booster[data-booster="swap"]{left:523px!important}

  .wam112-level1 .wam112-boost-icon,
  .wam112-level1 .wam112-boost-symbol{width:112px!important;height:94px!important;min-height:94px!important;box-sizing:border-box!important;border-radius:14px!important;background:linear-gradient(180deg,#fffdf4,#ffe8d7)!important;box-shadow:inset 0 0 0 2px #ffd0df,0 3px 6px #26051b66!important;margin-top:1px!important}
  .wam112-level1 .wam112-boost-icon{object-fit:contain!important;padding:5px!important;filter:drop-shadow(0 4px 3px #5d214766)!important}
  .wam112-level1 .wam112-boost-symbol{display:flex!important;align-items:center!important;justify-content:center!important;color:#0bded5!important;font-size:72px!important;font-weight:900!important;text-shadow:0 3px #8c1550!important}
  .wam112-level1 .wam112-boost-label{font-size:14px!important;line-height:17px!important;height:20px!important;color:#fff8d8!important;text-shadow:0 2px #4a082d!important}
  .wam112-level1 .wam-booster>span:not(.wam112-boost-label){right:-7px!important;top:-10px!important;min-width:38px!important;min-height:38px!important;font-size:22px!important;border-width:3px!important}

  @media (max-width:680px){
    .wam112-level1 .wam-grid{left:96px!important;width:510px!important;height:510px!important}
    .wam112-level1 .wam-board-title{left:96px!important;width:510px!important}
  }
  `;
  document.head.appendChild(s);
}

function ensure(view){
  if(view?.config?.id!==1||!view.stage)return;
  style();
  const stage=view.stage;
  stage.classList.add('wam1121-level1');
  if(view.board){
    view.board.style.left='100px';
    view.board.style.top='326px';
    view.board.style.width='520px';
    view.board.style.height='520px';
  }
  const keys=['rocket','hammer','disco','swap'];
  keys.forEach((key)=>{
    const b=view.boosterButtons?.[key]?.b;
    if(b)b.dataset.booster=key;
  });
}

const render=P.render;
P.render=function(){
  render.call(this);
  ensure(this);
};
})();
