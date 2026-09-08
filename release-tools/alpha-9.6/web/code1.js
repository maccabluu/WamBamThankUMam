gdjs.Level_32MapCode = {};
gdjs.Level_32MapCode.func = function(runtimeScene) {
  if(runtimeScene.__wam94NextScene) {
    const next=runtimeScene.__wam94NextScene;runtimeScene.__wam94NextScene=null;
    runtimeScene.__wam94Map?.dispose();runtimeScene.__wam94Map=null;
    gdjs.evtTools.runtimeScene.replaceScene(runtimeScene,next,false);return;
  }
  if(!runtimeScene.__wam94Map||runtimeScene.__wam94Map.disposed)runtimeScene.__wam94Map=new window.WamMapView(runtimeScene);
};
gdjs['Level_32MapCode']=gdjs.Level_32MapCode;
