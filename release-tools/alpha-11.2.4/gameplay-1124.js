(()=>{
'use strict';
const U=window.WamUI;
if(!U?.GameView)return;
const P=U.GameView.prototype;
if(P.__wam1124Patched)return;
P.__wam1124Patched=true;

function style(){
  if(document.getElementById('wam-1124-style'))return;
  const s=document.createElement('style');
  s.id='wam-1124-style';
  s.textContent=`
  /* Larger board, moved down so it starts beneath the host's head. */
  .wam112-level1 .wam-board-title{left:28px!important;top:365px!important;width:560px!important;height:46px!important;font-size:18px!important}
  .wam112-level1 .wam-grid{left:28px!important;top:420px!important;width:560px!important;height:560px!important;border-radius:25px!important}

  /* Keep the 11.2.3 Royal-style LEVEL 1 progress meter. */
  .wam112-level1 .wam112-stars{left:218px!important;top:48px!important;width:292px!important;height:170px!important}

  /* Booster tray/cards stay translucent; artwork itself is truly transparent. */
  .wam112-level1 .wam-booster{background:rgba(72,8,52,.34)!important;backdrop-filter:blur(3px)!important}
  .wam112-level1 .wam112-booster-tray{background:linear-gradient(180deg,rgba(62,8,49,.55),rgba(19,4,17,.58))!important;backdrop-filter:blur(4px)!important}
  .wam112-level1 .wam112-boost-icon{width:136px!important;height:102px!important;object-fit:contain!important;background:transparent!important;mix-blend-mode:normal!important;filter:drop-shadow(0 4px 5px #16000daa)!important;box-shadow:none!important}
  .wam112-level1 .wam-booster[data-booster="swap"] .wam112-boost-icon{width:132px!important;height:100px!important}
  .wam112-level1 .wam112-boost-symbol{display:none!important}
  `;
  document.head.appendChild(s);
}

function setArt(button,src,key){
  if(!button)return;
  const oldSymbol=button.querySelector('.wam112-boost-symbol');
  if(oldSymbol)oldSymbol.remove();
  let img=button.querySelector('.wam112-boost-icon');
  if(!img){
    img=document.createElement('img');
    img.className='wam112-boost-icon';
    img.alt='';
    const label=button.querySelector('.wam112-boost-label');
    if(label)button.insertBefore(img,label);
    else button.insertBefore(img,button.firstChild);
  }
  if(img.dataset.wam1124!==key){
    img.src=src;
    img.dataset.wam1124=key;
  }
}

function ensure(view){
  if(view?.config?.id!==1||!view.stage)return;
  style();
  const stage=view.stage;

  if(view.board){
    view.board.style.left='28px';
    view.board.style.top='420px';
    view.board.style.width='560px';
    view.board.style.height='560px';
  }

  const title=stage.querySelector('.wam-board-title');
  if(title){
    title.style.left='28px';
    title.style.top='365px';
    title.style.width='560px';
  }

  setArt(view.boosterButtons?.rocket?.b,'icons/microphone-clean.svg','rocket');
  setArt(view.boosterButtons?.hammer?.b,'icons/heel-clean.svg','hammer');
  setArt(view.boosterButtons?.swap?.b,'icons/free-swap.svg','swap');
}

const render=P.render;
P.render=function(){
  render.call(this);
  ensure(this);
};
})();
