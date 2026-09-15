(()=>{
'use strict';
const U=window.WamUI;
if(!U?.GameView)return;
const P=U.GameView.prototype;
if(P.__wam1126Patched)return;
P.__wam1126Patched=true;

function style(){
  if(document.getElementById('wam-1126-style'))return;
  const s=document.createElement('style');
  s.id='wam-1126-style';
  s.textContent=`
  /* 11.2.6: glossy reference-inspired Goals and Moves cards. */
  .wam112-level1 .wam112-goals-panel{
    left:18px!important;top:32px!important;width:194px!important;height:205px!important;
    border:4px solid #ffd36b!important;border-radius:28px!important;
    background:linear-gradient(180deg,#e51d78 0,#ad0b59 34%,#6c123f 100%)!important;
    box-shadow:0 6px 0 #3a0926,0 0 18px #ff4da17a,inset 0 0 0 3px #ff8fc3!important;
    overflow:hidden!important;
  }
  .wam112-level1 .wam112-goals-panel:after{
    content:'';position:absolute;left:10px;right:10px;top:65px;bottom:10px;
    border-radius:20px;background:linear-gradient(180deg,#fff8eb,#f5e5d8);
    box-shadow:inset 0 0 0 2px #ffd5c8,0 3px 8px #4c092a55;z-index:0;
  }
  .wam112-level1 .wam112-goals-panel strong{
    position:relative;z-index:2;display:block!important;padding:10px 30px 6px!important;
    color:#fff!important;font-size:27px!important;line-height:38px!important;letter-spacing:.8px!important;
    text-shadow:0 3px 0 #690733,0 0 7px #fff4b0!important;
  }
  .wam112-level1 .wam112-goals-panel strong:before,
  .wam112-level1 .wam112-goals-panel strong:after{
    content:'★';position:absolute;top:10px;color:#ffd44d;font-size:25px;text-shadow:0 2px 0 #9b4d00,0 0 6px #fff4a8;
  }
  .wam112-level1 .wam112-goals-panel strong:before{left:12px}
  .wam112-level1 .wam112-goals-panel strong:after{right:12px}

  .wam112-level1 .wam-target{
    left:31px!important;width:163px!important;height:60px!important;z-index:9!important;
    padding:2px 13px!important;box-sizing:border-box!important;border-radius:0!important;
    background:transparent!important;color:#53112e!important;font-size:34px!important;font-weight:900!important;
    box-shadow:none!important;gap:10px!important;justify-content:space-between!important;
  }
  .wam112-level1 .wam-target:first-of-type{border-bottom:1.5px solid #d99f9d!important}
  .wam112-level1 .wam-target img{width:58px!important;height:55px!important;object-fit:contain!important;filter:drop-shadow(0 2px 2px #7d203a44)!important}
  .wam112-level1 .wam-target.done{background:transparent!important;color:#188056!important}

  .wam112-level1 .wam112-moves-panel{
    right:18px!important;top:32px!important;width:158px!important;height:190px!important;
    border:4px solid #ffd36b!important;border-radius:30px!important;
    background:linear-gradient(180deg,#e51d78 0,#ad0b59 37%,#6c123f 100%)!important;
    box-shadow:0 6px 0 #3a0926,0 0 18px #ff4da17a,inset 0 0 0 3px #ff8fc3!important;
    text-align:center!important;overflow:hidden!important;
  }
  .wam112-level1 .wam112-moves-panel:after{
    content:'';position:absolute;left:10px;right:10px;top:68px;bottom:10px;border-radius:20px;
    background:linear-gradient(180deg,#fff9ef,#f4dfd7);box-shadow:inset 0 0 0 2px #ffd3c6,0 3px 8px #4c092a55;z-index:0;
  }
  .wam112-level1 .wam112-moves-panel strong{
    position:relative;z-index:2;display:block!important;padding-top:6px!important;
    font-family:'Brush Script MT','Segoe Script',cursive!important;font-style:italic!important;font-weight:700!important;
    text-transform:none!important;color:#fff8e8!important;font-size:31px!important;line-height:52px!important;
    letter-spacing:0!important;text-shadow:0 3px 0 #74083e,0 0 8px #fff6c9!important;
  }
  .wam112-level1 .wam112-moves-panel strong:before,
  .wam112-level1 .wam112-moves-panel strong:after{
    content:'✦';position:absolute;top:10px;color:#ffd44d;font-family:Arial,sans-serif;font-size:21px;font-style:normal;text-shadow:0 0 7px #fff0a0;
  }
  .wam112-level1 .wam112-moves-panel strong:before{left:10px}
  .wam112-level1 .wam112-moves-panel strong:after{right:10px}
  .wam112-level1 .wam-moves{
    left:auto!important;right:29px!important;top:106px!important;width:132px!important;height:92px!important;z-index:10!important;
    color:#4d082d!important;font-size:67px!important;font-weight:900!important;line-height:1!important;
    text-shadow:0 2px 0 #fff9ed!important;
  }

  /* Booster tray remains low and separate from the board. */
  .wam112-level1 .wam112-booster-tray{top:1060px!important;height:196px!important}
  .wam112-level1 .wam-booster{top:1084px!important}

  /* Heel Smash: larger retro leopard stiletto on a starburst medallion, with no white box. */
  .wam112-level1 .wam-booster[data-booster="hammer"] .wam112-boost-icon{
    width:142px!important;height:112px!important;object-fit:contain!important;background:transparent!important;
    filter:drop-shadow(0 5px 5px #16000daa)!important;
  }
  `;
  document.head.appendChild(s);
}

function setHeel(view){
  const b=view.boosterButtons?.hammer?.b;
  if(!b)return;
  let img=b.querySelector('.wam112-boost-icon');
  if(!img){
    img=document.createElement('img');img.className='wam112-boost-icon';img.alt='';
    const label=b.querySelector('.wam112-boost-label');
    if(label)b.insertBefore(img,label);else b.insertBefore(img,b.firstChild);
  }
  if(img.dataset.wam1126!=='heel'){
    img.src='icons/heel-smash-1126.svg';
    img.dataset.wam1126='heel';
  }
}

function ensure(view){
  if(view?.config?.id!==1||!view.stage)return;
  style();
  const stage=view.stage;
  const targets=Object.values(view.targetEls||{});
  targets.forEach((entry,i)=>{
    if(!entry?.row)return;
    entry.row.style.top=(100+i*63)+'px';
    entry.row.style.left='31px';
  });
  const movesTitle=stage.querySelector('.wam112-moves-panel strong');
  if(movesTitle)movesTitle.textContent='Moves';
  setHeel(view);
}

const render=P.render;
P.render=function(){render.call(this);ensure(this);};
})();
