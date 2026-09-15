(()=>{
'use strict';
const U=window.WamUI;
if(!U?.GameView)return;
const P=U.GameView.prototype;
if(P.__wam1122Patched)return;
P.__wam1122Patched=true;

function style(){
  if(document.getElementById('wam-1122-style'))return;
  const s=document.createElement('style');
  s.id='wam-1122-style';
  s.textContent=`
  /* Alpha 11.2.2: make the Level 1 board obviously larger and boosters clearer/transparent. */
  .wam112-level1 .wam-board-title{left:70px!important;top:258px!important;width:580px!important;height:48px!important;font-size:19px!important}
  .wam112-level1 .wam-grid{left:70px!important;top:316px!important;width:580px!important;height:580px!important;border-radius:25px!important;box-shadow:0 0 0 6px #160817cc,0 0 0 10px #ffd16a,0 12px 30px #08020cbb,0 0 34px #ff3c9f77!important;background:#120b1bba!important}
  .wam112-level1 .wam-grid.shaped .wam-cell{background:linear-gradient(145deg,#26172fc9,#171323d1)!important;border:1.5px solid #9a80a9aa!important;border-radius:8px!important}
  .wam112-level1 .wam-pause{left:652px!important;top:244px!important}

  .wam112-level1 .wam112-booster-tray{left:18px!important;top:1005px!important;width:684px!important;height:170px!important;border-radius:24px!important;background:linear-gradient(180deg,#3d0c32b8,#180617c2)!important;backdrop-filter:blur(3px);box-shadow:0 6px 0 #12020daa,0 0 22px #ff3d9a55,inset 0 0 0 2px #a8226877!important}
  .wam112-level1 .wam112-booster-title{top:-26px!important;left:232px!important;width:218px!important;padding:4px 0!important;font-size:18px!important}

  .wam112-level1 .wam-booster{top:1026px!important;width:152px!important;height:124px!important;border:2px solid #ffcf64cc!important;border-radius:19px!important;padding:2px 3px 3px!important;box-sizing:border-box!important;justify-content:flex-start!important;gap:0!important;background:rgba(91,10,61,.46)!important;box-shadow:0 4px 0 #26051b88,inset 0 0 0 1px #ff64aa66!important;backdrop-filter:blur(2px)}
  .wam112-level1 .wam-booster[data-booster="rocket"]{left:29px!important}
  .wam112-level1 .wam-booster[data-booster="hammer"]{left:194px!important}
  .wam112-level1 .wam-booster[data-booster="disco"]{left:359px!important}
  .wam112-level1 .wam-booster[data-booster="swap"]{left:524px!important}

  .wam112-level1 .wam112-boost-icon,
  .wam112-level1 .wam112-boost-symbol{width:128px!important;height:96px!important;min-height:96px!important;box-sizing:border-box!important;border:0!important;border-radius:0!important;background:transparent!important;box-shadow:none!important;margin-top:0!important}
  .wam112-level1 .wam112-boost-icon{object-fit:contain!important;padding:0!important;filter:drop-shadow(0 4px 4px #16000daa) saturate(1.12)!important}
  .wam112-level1 .wam112-boost-symbol{display:flex!important;align-items:center!important;justify-content:center!important;color:#3ff7ef!important;font-size:80px!important;font-weight:900!important;text-shadow:0 3px 5px #4c1039!important}
  .wam112-level1 .wam112-boost-label{font-size:14px!important;line-height:16px!important;height:18px!important;color:#fff8d8!important;text-shadow:0 2px #4a082d!important;margin-top:-1px!important}
  .wam112-level1 .wam-booster>span:not(.wam112-boost-label){right:-5px!important;top:-9px!important;min-width:36px!important;min-height:36px!important;font-size:21px!important;border-width:3px!important}

  @media (max-width:680px){
    .wam112-level1 .wam-grid{left:66px!important;width:570px!important;height:570px!important}
    .wam112-level1 .wam-board-title{left:66px!important;width:570px!important}
  }
  `;
  document.head.appendChild(s);
}

function ensure(view){
  if(view?.config?.id!==1||!view.stage)return;
  style();
  view.stage.classList.add('wam1122-level1');
  if(view.board){
    view.board.style.left='70px';
    view.board.style.top='316px';
    view.board.style.width='580px';
    view.board.style.height='580px';
  }
}

const render=P.render;
P.render=function(){render.call(this);ensure(this);};
})();
