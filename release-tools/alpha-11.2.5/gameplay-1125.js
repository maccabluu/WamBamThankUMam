(()=>{
'use strict';
const U=window.WamUI;
if(!U?.GameView)return;
const P=U.GameView.prototype;
if(P.__wam1125Patched)return;
P.__wam1125Patched=true;

function style(){
  if(document.getElementById('wam-1125-style'))return;
  const s=document.createElement('style');
  s.id='wam-1125-style';
  s.textContent=`
  /* 11.2.5 BlueStacks polish: shift the large board right without covering the host. */
  .wam112-level1 .wam-board-title{left:46px!important;top:365px!important;width:560px!important;height:46px!important}
  .wam112-level1 .wam-grid{left:46px!important;top:420px!important;width:560px!important;height:560px!important;border-radius:25px!important}

  /* Give the board and booster area proper breathing room. */
  .wam112-level1 .wam112-booster-tray{top:1060px!important;height:196px!important}
  .wam112-level1 .wam-booster{top:1084px!important}

  /* New heel artwork is truly transparent and sized as a proper stiletto. */
  .wam112-level1 .wam-booster[data-booster="hammer"] .wam112-boost-icon{width:126px!important;height:104px!important;object-fit:contain!important;filter:drop-shadow(0 4px 5px #16000daa)!important}
  `;
  document.head.appendChild(s);
}

function setHeel(view){
  const b=view.boosterButtons?.hammer?.b;
  if(!b)return;
  let img=b.querySelector('.wam112-boost-icon');
  if(!img){
    img=document.createElement('img');
    img.className='wam112-boost-icon';
    img.alt='';
    const label=b.querySelector('.wam112-boost-label');
    if(label)b.insertBefore(img,label);else b.insertBefore(img,b.firstChild);
  }
  if(img.dataset.wam1125!=='heel'){
    img.src='icons/heel-clean-1125.svg';
    img.dataset.wam1125='heel';
  }
}

function ensure(view){
  if(view?.config?.id!==1||!view.stage)return;
  style();
  if(view.board){
    view.board.style.left='46px';
    view.board.style.top='420px';
    view.board.style.width='560px';
    view.board.style.height='560px';
  }
  const title=view.stage.querySelector('.wam-board-title');
  if(title){
    title.style.left='46px';
    title.style.top='365px';
    title.style.width='560px';
  }
  setHeel(view);
}

const render=P.render;
P.render=function(){render.call(this);ensure(this);};
})();
