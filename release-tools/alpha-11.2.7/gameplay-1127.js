(()=>{
'use strict';
const U=window.WamUI;
if(!U?.GameView)return;
const P=U.GameView.prototype;
if(P.__wam1127Patched)return;
P.__wam1127Patched=true;

function style(){
  if(document.getElementById('wam-1127-style'))return;
  const s=document.createElement('style');
  s.id='wam-1127-style';
  s.textContent=`
  /* 11.2.7: Level 1 is now 9 columns x 8 rows. Keep the same tile scale
     by extending the board only to the right. */
  .wam112-level1 .wam-board-title{left:46px!important;top:365px!important;width:630px!important;height:46px!important}
  .wam112-level1 .wam-grid{left:46px!important;top:420px!important;width:630px!important;height:560px!important;border-radius:25px!important}
  `;
  document.head.appendChild(s);
}

function ensure(view){
  if(view?.config?.id!==1||!view.stage)return;
  style();
  if(view.board){
    view.board.style.left='46px';
    view.board.style.top='420px';
    view.board.style.width='630px';
    view.board.style.height='560px';
  }
  const title=view.stage.querySelector('.wam-board-title');
  if(title){
    title.style.left='46px';
    title.style.top='365px';
    title.style.width='630px';
  }
}

const render=P.render;
P.render=function(){render.call(this);ensure(this);};
})();
