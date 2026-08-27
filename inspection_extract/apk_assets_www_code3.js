gdjs.SettingsCode = {};
gdjs.SettingsCode.localVariables = [];
gdjs.SettingsCode.idToCallbackMap = new Map();
gdjs.SettingsCode.GDSettingsBackgroundObjects1= [];
gdjs.SettingsCode.GDSettingsBackgroundObjects2= [];
gdjs.SettingsCode.GDSettingsHomeButtonObjects1= [];
gdjs.SettingsCode.GDSettingsHomeButtonObjects2= [];
gdjs.SettingsCode.GDSettingsCloseButtonObjects1= [];
gdjs.SettingsCode.GDSettingsCloseButtonObjects2= [];


gdjs.SettingsCode.mapOfGDgdjs_9546SettingsCode_9546GDSettingsHomeButtonObjects1Objects = Hashtable.newFrom({"SettingsHomeButton": gdjs.SettingsCode.GDSettingsHomeButtonObjects1});
gdjs.SettingsCode.mapOfGDgdjs_9546SettingsCode_9546GDSettingsCloseButtonObjects1Objects = Hashtable.newFrom({"SettingsCloseButton": gdjs.SettingsCode.GDSettingsCloseButtonObjects1});
gdjs.SettingsCode.userFuncWamSettings = function GDJSInlineCode(runtimeScene) {
"use strict";
(() => {
  const ID = "wambam-settings-controls";
  const CURRENT_VERSION = "7.9.0";
  const RELEASES_URL = "https://api.github.com/repos/maccabluu/WamBamThankUMam/releases?per_page=20";
  const oldHomeEffects = document.getElementById("wambam-home-effects");
  if (oldHomeEffects) oldHomeEffects.remove();

  function enabled(key) {
    try { return localStorage.getItem(key) !== "0"; } catch (_) { return true; }
  }
  function save(key,value) {
    try { localStorage.setItem(key,value); } catch (_) {}
  }
  function applyAudio() {
    if (window.__wamAudio && typeof window.__wamAudio.apply === "function") window.__wamAudio.apply();
  }

  if (runtimeScene.__wamSettingsGoHome) {
    runtimeScene.__wamSettingsGoHome=false;
    const old=document.getElementById(ID);if(old)old.remove();
    gdjs.evtTools.runtimeScene.popScene(runtimeScene);
    return;
  }
  if (document.getElementById(ID)) return;

  if (!document.getElementById("wambam-settings-style")) {
    const style=document.createElement("style");style.id="wambam-settings-style";
    style.textContent=`
      @keyframes wamSettingsGlow { 0%,100%{box-shadow:0 0 12px rgba(30,232,223,.45)} 50%{box-shadow:0 0 25px rgba(30,232,223,.88)} }
      @keyframes wamSettingsSpin { to{transform:rotate(360deg)} }
    `;document.head.appendChild(style);
  }

  const root=document.createElement("div");root.id=ID;
  Object.assign(root.style,{
    position:"fixed",zIndex:"2147483500",overflow:"hidden",pointerEvents:"none",userSelect:"none",
    fontFamily:"Arial Black,Impact,sans-serif",background:"rgba(3,0,8,.28)"
  });document.body.appendChild(root);

  function fit() {
    if(!root.isConnected)return;const canvas=document.querySelector("canvas");if(!canvas)return;
    const rect=canvas.getBoundingClientRect();const aspect=720/1280;
    let width=rect.width,height=rect.height,left=rect.left,top=rect.top;
    if(width/height>aspect){width=height*aspect;left=rect.left+(rect.width-width)/2;}
    else{height=width/aspect;top=rect.top+(rect.height-height)/2;}
    Object.assign(root.style,{left:left+"px",top:top+"px",width:width+"px",height:height+"px"});
  }
  fit();window.addEventListener("resize",fit);

  const buttonize=(button,onTap)=>{
    let used=false;const activate=event=>{
      if(used)return;used=true;event.preventDefault();event.stopPropagation();onTap();setTimeout(()=>{used=false;},220);
    };
    button.addEventListener("pointerup",activate,{passive:false});button.addEventListener("click",activate,{passive:false});
    return button;
  };
  const makeButton=(text,style,onTap,label=text)=>{
    const button=document.createElement("button");button.type="button";button.textContent=text;button.setAttribute("aria-label",label);
    Object.assign(button.style,{
      border:"3px solid #ffd151",borderRadius:"18px",background:"linear-gradient(#35102d,#160817)",color:"#fff7d4",
      font:"900 clamp(11px,2.3vw,21px) Arial Black,Impact,sans-serif",textShadow:"0 2px 0 #000",boxShadow:"0 5px 0 #09030b,0 0 12px rgba(255,37,137,.35)",
      cursor:"pointer",touchAction:"manipulation",pointerEvents:"auto",...style
    });buttonize(button,onTap);root.appendChild(button);return button;
  };

  const panel=document.createElement("div");
  Object.assign(panel.style,{
    position:"absolute",left:"8%",top:"13.8%",width:"84%",height:"79%",boxSizing:"border-box",border:"5px solid #f4bd3a",borderRadius:"5%",
    background:"radial-gradient(circle at 20% 15%,rgba(255,50,145,.14) 0 2px,transparent 2.5px) 0 0/18px 18px,linear-gradient(155deg,rgba(59,9,47,.98),rgba(13,5,20,.98) 72%)",
    boxShadow:"0 0 0 4px #e30a73,0 0 0 8px #1d091a,0 22px 45px rgba(0,0,0,.74),inset 0 0 30px rgba(255,31,133,.23)",pointerEvents:"none"
  });root.appendChild(panel);

  const title=document.createElement("div");title.textContent="SETTINGS";
  Object.assign(title.style,{
    position:"absolute",left:"18%",top:"10.5%",width:"64%",height:"8%",zIndex:"3",display:"flex",alignItems:"center",justifyContent:"center",
    border:"4px solid #ffd050",borderRadius:"26px",background:"linear-gradient(#d7136b,#6d063e)",color:"#ffd85d",
    font:"900 clamp(28px,7vw,62px) Impact,Arial Black,sans-serif",letterSpacing:".03em",textShadow:"-2px -2px 0 #551400,2px 2px 0 #551400,0 0 8px #fff1a1",
    boxShadow:"0 0 0 3px #340719,0 7px 0 #360520,0 0 18px #ff258b",pointerEvents:"none"
  });root.appendChild(title);

  const home=makeButton("⌂\nHOME",{position:"absolute",left:"2.2%",top:"2.1%",width:"14%",height:"9.2%",whiteSpace:"pre-line",fontSize:"clamp(11px,2.4vw,21px)"},()=>{runtimeScene.__wamSettingsGoHome=true;},"Home");

  const section=(top,label)=>{
    const row=document.createElement("div");
    Object.assign(row.style,{
      position:"absolute",left:"13%",top,width:"74%",height:"7%",boxSizing:"border-box",display:"flex",alignItems:"center",padding:"0 4%",
      border:"2px solid #93631d",borderRadius:"17px",background:"linear-gradient(90deg,rgba(19,8,24,.95),rgba(43,8,35,.95))",color:"#fff7dc",
      font:"900 clamp(11px,2.35vw,21px) Arial Black,Impact,sans-serif",whiteSpace:"nowrap",textShadow:"0 2px 0 #000",boxShadow:"inset 0 0 11px rgba(255,45,145,.13)",pointerEvents:"none"
    });row.textContent=label;root.appendChild(row);return row;
  };

  const musicRow=section("21%","♫  MUSIC");
  const sfxRow=section("29%","★  SOUND EFFECTS");
  const languageRow=section("37%","●  LANGUAGE");
  const themeRow=section("45%","✦  THEME");

  const makeToggle=(top,key,label)=>{
    const button=makeButton("",{position:"absolute",left:"61%",top,width:"23%",height:"5.4%",borderColor:"#20e7dd",borderRadius:"999px",animation:"wamSettingsGlow 2.5s ease-in-out infinite"},()=>{
      save(key,enabled(key)?"0":"1");update();applyAudio();
    },label);
    const update=()=>{button.textContent=enabled(key)?"ON":"OFF";button.style.opacity=enabled(key)?"1":".58";};update();return button;
  };
  makeToggle("21.8%","wambam-music-enabled","Toggle music");
  makeToggle("29.8%","wambam-sfx-enabled","Toggle sound effects");

  const languages=["ENGLISH","ESPAÑOL","FRANÇAIS"];
  const themes=["AUTO","NEON","FROZEN"];
  const savedChoice=(key,fallback)=>{try{return localStorage.getItem(key)||fallback;}catch(_){return fallback;}};
  let languageIndex=Math.max(0,languages.indexOf(savedChoice("wambam-language","ENGLISH")));
  let themeIndex=Math.max(0,themes.indexOf(savedChoice("wambam-theme","AUTO")));
  const languageButton=makeButton(languages[languageIndex]+"  ▾",{position:"absolute",left:"53%",top:"37.8%",width:"31%",height:"5.4%"},()=>{
    languageIndex=(languageIndex+1)%languages.length;languageButton.textContent=languages[languageIndex]+"  ▾";save("wambam-language",languages[languageIndex]);
  },"Change language");
  const themeButton=makeButton(themes[themeIndex]+"  ▾",{position:"absolute",left:"53%",top:"45.8%",width:"31%",height:"5.4%"},()=>{
    themeIndex=(themeIndex+1)%themes.length;themeButton.textContent=themes[themeIndex]+"  ▾";save("wambam-theme",themes[themeIndex]);
  },"Change theme");

  const updates=document.createElement("div");
  Object.assign(updates.style,{
    position:"absolute",left:"13%",top:"53%",width:"74%",height:"14.5%",boxSizing:"border-box",padding:"2.3% 4%",border:"3px solid #20e4da",borderRadius:"20px",
    background:"linear-gradient(135deg,rgba(0,117,144,.46),rgba(37,7,42,.96) 62%)",color:"#fff",boxShadow:"0 0 18px rgba(32,228,218,.42),inset 0 0 17px rgba(35,231,223,.12)",pointerEvents:"none"
  });
  updates.innerHTML=`<div style="color:#55fff3;font:900 clamp(15px,3.2vw,29px) Arial Black,Impact,sans-serif;text-shadow:0 2px #000">↻ GAME UPDATES</div><div style="margin-top:1%;color:#fff0bd;font:700 clamp(10px,2vw,18px) Arial,sans-serif">Installed version ${CURRENT_VERSION}</div>`;
  root.appendChild(updates);

  const modal=(titleText,message,options={})=>{
    const shade=document.createElement("div");
    Object.assign(shade.style,{position:"absolute",inset:"0",zIndex:"100",display:"flex",alignItems:"center",justifyContent:"center",background:"rgba(0,0,0,.79)",pointerEvents:"auto"});
    const card=document.createElement("div");
    Object.assign(card.style,{width:"78%",boxSizing:"border-box",padding:"7% 6%",border:"5px solid #ffd04e",borderRadius:"30px",background:"radial-gradient(circle at 18% 12%,#7f2055,#21061b 68%)",boxShadow:"0 0 0 4px #ff268b,0 22px 45px #000",textAlign:"center",color:"#fff"});
    const heading=document.createElement("div");heading.textContent=titleText;
    Object.assign(heading.style,{color:"#42f4e8",font:"900 clamp(24px,5.4vw,50px) Arial Black,Impact,sans-serif",textShadow:"0 3px 0 #000,0 0 12px #21e8df"});card.appendChild(heading);
    const copy=document.createElement("div");copy.textContent=message;
    Object.assign(copy.style,{marginTop:"5%",whiteSpace:"pre-line",color:"#fff7dd",font:"700 clamp(14px,2.7vw,24px) Arial,sans-serif",lineHeight:"1.45"});card.appendChild(copy);
    if(options.downloadUrl){
      const download=document.createElement("button");download.type="button";download.textContent="DOWNLOAD UPDATE";
      Object.assign(download.style,{width:"88%",marginTop:"6%",padding:"4%",border:"3px solid #fff0a6",borderRadius:"999px",background:"linear-gradient(#21e8df,#0086a7)",color:"#091218",font:"900 clamp(15px,3vw,27px) Arial Black,Impact,sans-serif",cursor:"pointer"});
      buttonize(download,()=>{try{const opened=window.open(options.downloadUrl,"_system");if(!opened)window.location.href=options.downloadUrl;}catch(_){window.location.href=options.downloadUrl;}});card.appendChild(download);
    }
    const close=document.createElement("button");close.type="button";close.textContent="CLOSE";
    Object.assign(close.style,{width:"72%",marginTop:"6%",padding:"3.5%",border:"3px solid #ffd14d",borderRadius:"999px",background:"linear-gradient(#ff489b,#ce005c)",color:"#fff",font:"900 clamp(15px,3vw,27px) Arial Black,Impact,sans-serif",cursor:"pointer"});
    buttonize(close,()=>shade.remove());card.appendChild(close);shade.appendChild(card);root.appendChild(shade);return{shade,card,copy};
  };

  const versionParts=value=>String(value||"").replace(/^v/i,"").split(/[^0-9]+/).filter(Boolean).map(Number);
  const compareVersions=(a,b)=>{const aa=versionParts(a),bb=versionParts(b);for(let i=0;i<Math.max(aa.length,bb.length);i++){const diff=(aa[i]||0)-(bb[i]||0);if(diff)return diff>0?1:-1;}return 0;};
  const checkUpdates=async()=>{
    const status=modal("CHECKING…","Looking for the newest Wam Bam APK on GitHub.");
    try{
      const response=await fetch(RELEASES_URL,{headers:{Accept:"application/vnd.github+json"},cache:"no-store"});
      if(!response.ok)throw new Error("Update service unavailable");
      const releases=await response.json();
      const release=releases.find(item=>!item.draft&&Array.isArray(item.assets)&&item.assets.some(asset=>/\.apk$/i.test(asset.name||"")));
      const asset=release&&release.assets.find(item=>/\.apk$/i.test(item.name||""));
      if(release&&asset&&compareVersions(release.tag_name,CURRENT_VERSION)>0){
        status.shade.remove();modal("UPDATE READY",`Wam Bam ${String(release.tag_name).replace(/^v/i,"")} is available.\nTap below to download the signed APK.`,{downloadUrl:asset.browser_download_url});
      }else{
        status.shade.remove();modal("YOU’RE UP TO DATE",`Wam Bam ${CURRENT_VERSION} is the newest version available for this build.`);
      }
    }catch(_){
      status.shade.remove();modal("CAN’T CHECK YET","Please check your internet connection and try again.");
    }
  };
  makeButton("CHECK FOR UPDATES",{position:"absolute",left:"51%",top:"60.2%",width:"33%",height:"5.2%",borderColor:"#20e8df",background:"linear-gradient(#22e5dc,#008da9)",color:"#06141b",fontSize:"clamp(8px,1.62vw,15px)",whiteSpace:"nowrap",letterSpacing:"-.02em"},checkUpdates,"Check for updates");

  makeButton("★ RATE",{position:"absolute",left:"12%",top:"69.5%",width:"23.5%",height:"6.3%",fontSize:"clamp(9px,1.8vw,16px)",whiteSpace:"nowrap"},()=>modal("RATE WAM BAM","The store rating page will be connected when the public release goes live."),"Rate Wam Bam");
  makeButton("? HELP",{position:"absolute",left:"38.25%",top:"69.5%",width:"23.5%",height:"6.3%",fontSize:"clamp(9px,1.8vw,16px)",whiteSpace:"nowrap"},()=>modal("HOW TO PLAY","Swap two icons to match 3 or more. Make a 2 × 2 square for a Disco. Swap a Disco with an icon to turn all matching icons into Discos, clear targets and earn coins."),"Help");
  makeButton("▣ PRIVACY",{position:"absolute",left:"64.5%",top:"69.5%",width:"23.5%",height:"6.3%",fontSize:"clamp(8px,1.55vw,14px)",whiteSpace:"nowrap",letterSpacing:"-.02em"},()=>modal("PRIVACY","Coins, lives, unlocked levels and sound choices are stored only on this device. The game does not require an account."),"Privacy");

  makeButton("CLOSE",{position:"absolute",left:"28%",top:"80%",width:"44%",height:"8.2%",borderRadius:"999px",background:"linear-gradient(#ff4b9e,#cc005c)",fontSize:"clamp(20px,4.6vw,42px)"},()=>{runtimeScene.__wamSettingsGoHome=true;},"Close settings");
})();
};
gdjs.SettingsCode.eventsList0 = function(runtimeScene) {

{

gdjs.SettingsCode.userFuncWamSettings(runtimeScene);

}

{

gdjs.copyArray(runtimeScene.getObjects("SettingsHomeButton"), gdjs.SettingsCode.GDSettingsHomeButtonObjects1);

let isConditionTrue_0 = false;
isConditionTrue_0 = false;
isConditionTrue_0 = gdjs.evtTools.input.cursorOnObject(gdjs.SettingsCode.mapOfGDgdjs_9546SettingsCode_9546GDSettingsHomeButtonObjects1Objects, runtimeScene, true, false);
if (isConditionTrue_0) {
isConditionTrue_0 = false;
isConditionTrue_0 = gdjs.evtTools.input.isMouseButtonReleased(runtimeScene, "Left");
}
if (isConditionTrue_0) {
{gdjs.evtTools.runtimeScene.popScene(runtimeScene);
}
}

}


{

gdjs.copyArray(runtimeScene.getObjects("SettingsCloseButton"), gdjs.SettingsCode.GDSettingsCloseButtonObjects1);

let isConditionTrue_0 = false;
isConditionTrue_0 = false;
isConditionTrue_0 = gdjs.evtTools.input.cursorOnObject(gdjs.SettingsCode.mapOfGDgdjs_9546SettingsCode_9546GDSettingsCloseButtonObjects1Objects, runtimeScene, true, false);
if (isConditionTrue_0) {
isConditionTrue_0 = false;
isConditionTrue_0 = gdjs.evtTools.input.isMouseButtonReleased(runtimeScene, "Left");
}
if (isConditionTrue_0) {
{gdjs.evtTools.runtimeScene.popScene(runtimeScene);
}
}

}


};

gdjs.SettingsCode.func = function(runtimeScene) {
runtimeScene.getOnceTriggers().startNewFrame();

gdjs.SettingsCode.GDSettingsBackgroundObjects1.length = 0;
gdjs.SettingsCode.GDSettingsBackgroundObjects2.length = 0;
gdjs.SettingsCode.GDSettingsHomeButtonObjects1.length = 0;
gdjs.SettingsCode.GDSettingsHomeButtonObjects2.length = 0;
gdjs.SettingsCode.GDSettingsCloseButtonObjects1.length = 0;
gdjs.SettingsCode.GDSettingsCloseButtonObjects2.length = 0;

gdjs.SettingsCode.eventsList0(runtimeScene);
gdjs.SettingsCode.GDSettingsBackgroundObjects1.length = 0;
gdjs.SettingsCode.GDSettingsBackgroundObjects2.length = 0;
gdjs.SettingsCode.GDSettingsHomeButtonObjects1.length = 0;
gdjs.SettingsCode.GDSettingsHomeButtonObjects2.length = 0;
gdjs.SettingsCode.GDSettingsCloseButtonObjects1.length = 0;
gdjs.SettingsCode.GDSettingsCloseButtonObjects2.length = 0;


return;

}

gdjs['SettingsCode'] = gdjs.SettingsCode;
