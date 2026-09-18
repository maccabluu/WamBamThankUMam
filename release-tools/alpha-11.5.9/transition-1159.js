(()=>{
'use strict';

const U=window.WamUI;
if(!U?.GameView)return;

const COVER_ID='wambam-level-transition-cover';
const COVER_Z='2147483646';

function removeOldCover(){
  document.getElementById(COVER_ID)?.remove();
}

function makeFallback(){
  const n=document.createElement('div');
  n.id=COVER_ID;
  Object.assign(n.style,{
    position:'fixed',
    inset:'0',
    zIndex:COVER_Z,
    pointerEvents:'none',
    background:'#170b20'
  });
  n.setAttribute('aria-hidden','true');
  document.body.appendChild(n);
  return n;
}

function makeCover(view){
  removeOldCover();

  const source=view?.view?.host || document.querySelector('.wam-host');
  if(!source)return makeFallback();

  const clone=source.cloneNode(true);
  clone.id=COVER_ID;
  clone.setAttribute('aria-hidden','true');
  clone.style.pointerEvents='none';
  clone.style.zIndex=COVER_Z;

  clone.querySelectorAll('[id]').forEach(node=>node.removeAttribute('id'));
  clone.querySelectorAll('button,input,select,textarea,a').forEach(node=>{
    node.tabIndex=-1;
    node.setAttribute('aria-hidden','true');
  });

  document.body.appendChild(clone);
  return clone;
}

function removeWhenReady(view){
  const cover=document.getElementById(COVER_ID);
  if(!cover)return;

  let removed=false;
  const finish=()=>{
    if(removed)return;
    removed=true;
    requestAnimationFrame(()=>requestAnimationFrame(()=>{
      document.getElementById(COVER_ID)?.remove();
    }));
  };

  const art=view?.stage?.querySelector('.wam-art');
  if(art?.tagName==='IMG'){
    if(art.complete && art.naturalWidth>0){
      finish();
    }else{
      art.addEventListener('load',finish,{once:true});
      art.addEventListener('error',finish,{once:true});
      setTimeout(finish,1200);
    }
  }else{
    finish();
  }
}

const GP=U.GameView.prototype;
if(!GP.__wam1159TransitionPatched){
  GP.__wam1159TransitionPatched=1;

  const nav=GP.navigate;
  GP.navigate=function(name){
    if(name==='Game')makeCover(this);
    return nav.call(this,name);
  };

  const render=GP.render;
  GP.render=function(){
    render.call(this);
    if(!this.disposed)removeWhenReady(this);
  };
}

const MP=window.WamMapView?.prototype;
if(MP && !MP.__wam1159TransitionPatched){
  MP.__wam1159TransitionPatched=1;
  const nav=MP.navigate;
  MP.navigate=function(name){
    if(name==='Game')makeCover(this);
    return nav.call(this,name);
  };
}

const runtimeSceneTools=window.gdjs?.evtTools?.runtimeScene;
if(runtimeSceneTools?.replaceScene && !runtimeSceneTools.__wam1159TransitionPatched){
  runtimeSceneTools.__wam1159TransitionPatched=1;
  const replace=runtimeSceneTools.replaceScene;
  runtimeSceneTools.replaceScene=function(runtimeScene,newSceneName,clearOthers){
    if(newSceneName==='Game' && !document.getElementById(COVER_ID)){
      makeCover(null);
    }
    return replace.call(this,runtimeScene,newSceneName,clearOthers);
  };
}
})();