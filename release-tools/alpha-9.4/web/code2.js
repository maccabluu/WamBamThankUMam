gdjs.GameCode = {};
gdjs.GameCode.func = function(runtimeScene) {
  if(runtimeScene.__wam94NextScene) {
    const next=runtimeScene.__wam94NextScene;runtimeScene.__wam94NextScene=null;
    runtimeScene.__wam94Game?.dispose();runtimeScene.__wam94Game=null;
    gdjs.evtTools.runtimeScene.replaceScene(runtimeScene,next,false);return;
  }
  if(!runtimeScene.__wam94Game||runtimeScene.__wam94Game.disposed)runtimeScene.__wam94Game=new window.WamUI.GameView(runtimeScene);
};
gdjs['GameCode']=gdjs.GameCode;
