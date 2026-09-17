gdjs.Untitled_32sceneCode = {};
gdjs.Untitled_32sceneCode.localVariables = [];
gdjs.Untitled_32sceneCode.idToCallbackMap = new Map();
gdjs.Untitled_32sceneCode.GDNewSpriteObjects1= [];
gdjs.Untitled_32sceneCode.GDNewSpriteObjects2= [];
gdjs.Untitled_32sceneCode.GDplaybuttonObjects1= [];
gdjs.Untitled_32sceneCode.GDplaybuttonObjects2= [];
gdjs.Untitled_32sceneCode.GDsettingsbuttonObjects1= [];
gdjs.Untitled_32sceneCode.GDsettingsbuttonObjects2= [];


gdjs.Untitled_32sceneCode.mapOfGDgdjs_9546Untitled_959532sceneCode_9546GDplaybuttonObjects1Objects = Hashtable.newFrom({"playbutton": gdjs.Untitled_32sceneCode.GDplaybuttonObjects1});
gdjs.Untitled_32sceneCode.mapOfGDgdjs_9546Untitled_959532sceneCode_9546GDsettingsbuttonObjects1Objects = Hashtable.newFrom({"settingsbutton": gdjs.Untitled_32sceneCode.GDsettingsbuttonObjects1});
gdjs.Untitled_32sceneCode.userFuncWamBoot = function GDJSInlineCode(runtimeScene) {
"use strict";
(() => {
  const ID = "wambam-blustudio-boot";
  if (window.__wambamBootShown || document.getElementById(ID)) return;

  try {
    if (sessionStorage.getItem("wambam-boot-shown") === "1") {
      window.__wambamBootShown = true;
      return;
    }
    sessionStorage.setItem("wambam-boot-shown", "1");
  } catch (_) {}

  window.__wambamBootShown = true;

  if (!document.getElementById("wambam-boot-style")) {
    const style = document.createElement("style");
    style.id = "wambam-boot-style";
    style.textContent = `
      @keyframes wamBluLogoIn {
        0% { transform: scale(.68); opacity: 0; filter: blur(8px) brightness(.5); }
        62% { transform: scale(1.04); opacity: 1; filter: blur(0) brightness(1.22); }
        100% { transform: scale(1); opacity: 1; filter: blur(0) brightness(1); }
      }
      @keyframes wamBluGlow {
        0%,100% { box-shadow: 0 0 20px rgba(0,111,255,.25),0 0 50px rgba(0,111,255,.12); }
        50% { box-shadow: 0 0 34px rgba(0,151,255,.58),0 0 88px rgba(0,95,255,.35); }
      }
      @keyframes wamBluLoad { from { transform: scaleX(0); } to { transform: scaleX(1); } }
      @keyframes wamBluText { 0%,25% { opacity: 0; letter-spacing: .45em; } 100% { opacity: 1; letter-spacing: .24em; } }
    `;
    document.head.appendChild(style);
  }

  const overlay = document.createElement("div");
  overlay.id = ID;
  Object.assign(overlay.style, {
    position: "fixed",
    inset: "0",
    zIndex: "2147483646",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    pointerEvents: "auto",
    background: "radial-gradient(circle at 50% 42%,#061936 0,#020713 46%,#000 78%)",
    opacity: "1",
    transition: "opacity 520ms ease"
  });

  const stars = document.createElement("div");
  Object.assign(stars.style, {
    position: "absolute",
    inset: "0",
    opacity: ".4",
    backgroundImage: "radial-gradient(circle,#2f9cff 0 1px,transparent 1.5px)",
    backgroundSize: "29px 29px",
    maskImage: "linear-gradient(transparent,#000 30%,#000 70%,transparent)"
  });
  overlay.appendChild(stars);

  const logo = document.createElement("img");
  logo.src = "blustudio_boot.jpg";
  logo.alt = "BluStudio";
  Object.assign(logo.style, {
    position: "relative",
    width: "min(60vw,430px)",
    maxHeight: "48vh",
    objectFit: "contain",
    borderRadius: "12%",
    animation: "wamBluLogoIn 850ms cubic-bezier(.18,.88,.25,1) both,wamBluGlow 1.4s ease-in-out 700ms infinite"
  });
  overlay.appendChild(logo);

  const presents = document.createElement("div");
  presents.textContent = "BLUSTUDIO PRESENTS";
  Object.assign(presents.style, {
    position: "relative",
    marginTop: "4.5vh",
    color: "#dcecff",
    font: "700 clamp(12px,2.7vw,23px) Arial,sans-serif",
    letterSpacing: ".24em",
    textShadow: "0 0 15px #087fff",
    animation: "wamBluText 900ms ease 450ms both"
  });
  overlay.appendChild(presents);

  const track = document.createElement("div");
  Object.assign(track.style, {
    position: "relative",
    width: "min(56vw,360px)",
    height: "6px",
    marginTop: "3vh",
    overflow: "hidden",
    borderRadius: "99px",
    background: "rgba(255,255,255,.12)",
    boxShadow: "0 0 0 1px rgba(87,169,255,.3)"
  });
  const bar = document.createElement("div");
  Object.assign(bar.style, {
    width: "100%",
    height: "100%",
    borderRadius: "inherit",
    transformOrigin: "left",
    background: "linear-gradient(90deg,#005fff,#18c9ff,#f7fbff)",
    boxShadow: "0 0 16px #078dff",
    animation: "wamBluLoad 1.35s cubic-bezier(.2,.7,.25,1) both"
  });
  track.appendChild(bar);
  overlay.appendChild(track);

  document.body.appendChild(overlay);
  setTimeout(() => { overlay.style.opacity = "0"; }, 1580);
  setTimeout(() => { if (overlay.isConnected) overlay.remove(); }, 2120);
})();

(() => {
  const ID = "wambam-home-effects";

  function settingEnabled(key) {
    try { return localStorage.getItem(key) !== "0"; } catch (_) { return true; }
  }

  function readNumber(key, fallback) {
    try {
      const value = Number.parseInt(localStorage.getItem(key) || "", 10);
      return Number.isFinite(value) ? value : fallback;
    } catch (_) { return fallback; }
  }

  function updateHomeCounters() {
    const coins = document.getElementById("wambam-home-coins");
    const lives = document.getElementById("wambam-home-lives");
    const level = document.getElementById("wambam-home-level");
    if (coins) coins.textContent = Math.max(0, readNumber("wambam-coins", 0)).toLocaleString();
    if (lives) lives.textContent = Math.max(0, Math.min(5, readNumber("wambam-lives", 5)));
    if (level) level.textContent = Math.max(1, Math.min(5, readNumber("wambam-selected-level", 1)));
  }

  function getAudio() {
    if (window.__wamAudio) return window.__wamAudio;

    const bgm = new Audio("wam_bam_lounge_loop.mp3");
    bgm.loop = true;
    bgm.volume = .28;
    bgm.preload = "auto";
    bgm.setAttribute("playsinline", "");

    const sounds = {
      match: new Audio("wam_match.mp3"),
      coin: new Audio("wam_coin.mp3"),
      disco: new Audio("wam_disco.mp3")
    };
    Object.values(sounds).forEach(sound => {
      sound.preload = "auto";
      sound.setAttribute("playsinline", "");
    });

    const activeSounds = new Set();
    window.__wamAudio = {
      bgm,
      sounds,
      activeSounds,
      suspended: false,
      apply() {
        const musicOn = settingEnabled("wambam-music-enabled");
        bgm.muted = !musicOn;
        if (musicOn && !this.suspended && !document.hidden) bgm.play().catch(() => {});
        else bgm.pause();
      },
      start() {
        if (document.hidden) return;
        this.suspended = false;
        this.apply();
      },
      suspend() {
        this.suspended = true;
        bgm.pause();
        activeSounds.forEach(sound => {
          try { sound.pause(); sound.currentTime = 0; } catch (_) {}
        });
        activeSounds.clear();
      },
      resume() {
        if (document.hidden) return;
        this.suspended = false;
        this.apply();
      },
      play(name, volume=.72, playbackRate=1) {
        if (this.suspended || document.hidden || !settingEnabled("wambam-sfx-enabled")) return;
        const source = sounds[name];
        if (!source) return;
        const sound = source.cloneNode();
        sound.volume = Math.max(0, Math.min(1, volume));
        sound.playbackRate = Math.max(.65, Math.min(1.6, playbackRate));
        activeSounds.add(sound);
        const release = () => activeSounds.delete(sound);
        sound.addEventListener("ended", release, {once:true});
        sound.addEventListener("error", release, {once:true});
        sound.play().catch(() => {});
      }
    };
    return window.__wamAudio;
  }

  const audio = getAudio();
  audio.start();
  if (!window.__wamAudioLifecycleInstalled) {
    window.__wamAudioLifecycleInstalled = true;
    const suspend = () => getAudio().suspend();
    const resume = () => getAudio().resume();
    document.addEventListener("pause", suspend, false);
    document.addEventListener("resume", resume, false);
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) suspend(); else resume();
    }, false);
    window.addEventListener("pagehide", suspend, false);
    window.addEventListener("pageshow", resume, false);
    window.addEventListener("blur", suspend, false);
    window.addEventListener("focus", resume, false);
  }
  if (!window.__wamAudioGestureInstalled) {
    window.__wamAudioGestureInstalled = true;
    window.addEventListener("pointerdown", () => getAudio().start(), {
      capture: true,
      passive: true
    });
  }

  if (document.getElementById(ID)) {
    updateHomeCounters();
    return;
  }

  if (!document.getElementById("wambam-home-effects-style")) {
    const style = document.createElement("style");
    style.id = "wambam-home-effects-style";
    style.textContent = `
      @keyframes wamHeadLive {
        0%,100% { transform: translate3d(0,0,0) rotate(-.12deg) scale(1.001); }
        38% { transform: translate3d(.08%,-.16%,0) rotate(.2deg) scale(1.004); }
        68% { transform: translate3d(-.06%,.05%,0) rotate(.03deg) scale(1.002); }
      }
      @keyframes wamRealWink {
        0%,62%,69%,100% { opacity:0; transform:rotate(-4deg) scaleY(.12); }
        64%,67% { opacity:1; transform:rotate(-4deg) scaleY(1); }
      }
      @keyframes wamWinkSpark {
        0%,63%,68%,100% { opacity:0; transform:scale(.25) rotate(-12deg); }
        65%,67% { opacity:1; transform:scale(1.08) rotate(8deg); }
      }
      @keyframes wamNeonFlicker {
        0%,18%,22%,55%,58%,100% { opacity:.13; filter:brightness(1); }
        20%,56% { opacity:.34; filter:brightness(1.8); }
        73% { opacity:.2; filter:brightness(1.35); }
      }
      @keyframes wamPlayGlow {
        0%,100% { opacity:.08; transform:scale(.96); }
        50% { opacity:.3; transform:scale(1.03); }
      }
      @keyframes wamEventPing {
        0%,100% { transform:scale(1); box-shadow:0 0 7px #ffef71; }
        50% { transform:scale(1.14); box-shadow:0 0 18px #ff2d92; }
      }
    `;
    document.head.appendChild(style);
  }

  const root = document.createElement("div");
  root.id = ID;
  Object.assign(root.style, {
    position: "fixed",
    zIndex: "2147482500",
    overflow: "hidden",
    pointerEvents: "none",
    userSelect: "none"
  });
  document.body.appendChild(root);

  const makeCounter = (id, left, top, width, height, color="#fff", fontSize="clamp(15px,2.65vw,24px)") => {
    const counter = document.createElement("div");
    counter.id = id;
    Object.assign(counter.style, {
      position:"absolute", left, top, width, height,
      display:"flex", alignItems:"center", justifyContent:"center",
      color, font:`900 ${fontSize} Arial Black,Impact,sans-serif`,
      textShadow:"-2px -2px 0 #111,2px -2px 0 #111,-2px 2px 0 #111,2px 2px 0 #111,0 0 8px rgba(255,255,255,.55)",
      letterSpacing:".02em", lineHeight:"1", pointerEvents:"none"
    });
    root.appendChild(counter);
    return counter;
  };
  makeCounter("wambam-home-lives", "28.1%", "1.7%", "10.6%", "4.7%", "#fff", "clamp(15px,2.55vw,23px)");
  makeCounter("wambam-home-coins", "58.1%", "1.7%", "13.8%", "4.7%", "#fff6c1", "clamp(12px,2.18vw,20px)");
  makeCounter("wambam-home-level", "13.6%", "6.2%", "6.2%", "4.1%", "#fff", "clamp(13px,2.25vw,21px)");
  updateHomeCounters();

  const head = document.createElement("img");
  head.src = "home_screen_v2.jpg";
  head.alt = "";
  Object.assign(head.style, {
    position: "absolute",
    inset: "0",
    width: "100%",
    height: "100%",
    objectFit: "fill",
    clipPath: "polygon(35% 35%,68% 35%,73% 43%,70% 54%,63% 59%,48% 56%,36% 53%,32% 44%)",
    transformOrigin: "52% 47%",
    animation: "wamHeadLive 5.8s ease-in-out infinite",
    willChange: "transform"
  });
  root.appendChild(head);

  // The new Home artwork has both eyes open. A skin-toned eyelid with a curved
  // lash briefly covers the right eye to create a true visible wink.
  const winkLid = document.createElement("div");
  Object.assign(winkLid.style, {
    position: "absolute",
    left: "51.05%",
    top: "44.18%",
    width: "5.6%",
    height: "1.58%",
    borderRadius: "52% 52% 48% 48%",
    background: "linear-gradient(#f7ac79,#e78a5f)",
    borderBottom: "clamp(2px,.45vw,4px) solid #251216",
    boxShadow: "inset 0 -2px 0 rgba(109,28,36,.38)",
    transformOrigin: "center",
    animation: "wamRealWink 5.4s ease-in-out infinite",
    willChange: "opacity,transform"
  });
  root.appendChild(winkLid);

  const wink = document.createElement("div");
  wink.textContent = "✦";
  Object.assign(wink.style, {
    position: "absolute",
    left: "56.0%",
    top: "43.9%",
    color: "#fff5bd",
    font: "900 clamp(12px,3vw,25px) Arial,sans-serif",
    textShadow: "0 0 7px #fff,0 0 13px #ff2c92",
    animation: "wamWinkSpark 5.4s ease-in-out infinite"
  });
  root.appendChild(wink);

  const neon = document.createElement("div");
  Object.assign(neon.style, {
    position: "absolute",
    inset: "0",
    background: "radial-gradient(circle at 12% 42%,rgba(24,240,255,.8),transparent 14%),radial-gradient(circle at 87% 44%,rgba(255,32,151,.8),transparent 17%),radial-gradient(circle at 87% 72%,rgba(25,210,255,.7),transparent 14%)",
    mixBlendMode: "screen",
    animation: "wamNeonFlicker 4.9s steps(1,end) infinite"
  });
  root.appendChild(neon);

  const playGlow = document.createElement("div");
  Object.assign(playGlow.style, {
    position: "absolute",
    left: "22%",
    top: "68.6%",
    width: "56%",
    height: "10%",
    borderRadius: "50%",
    boxShadow: "0 0 26px 10px #ff2a8d, inset 0 0 18px #fff",
    animation: "wamPlayGlow 1.8s ease-in-out infinite"
  });
  root.appendChild(playGlow);

  const eventDay = () => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,"0")}-${String(now.getDate()).padStart(2,"0")}`;
  };
  const readEventValue = (key, fallback=0) => {
    try {
      const value = Number.parseInt(localStorage.getItem(key) || "", 10);
      return Number.isFinite(value) ? value : fallback;
    } catch (_) { return fallback; }
  };
  const writeEventValue = (key, value) => {
    try { localStorage.setItem(key, String(value)); } catch (_) {}
  };
  const prepareDailyEvents = () => {
    try {
      const today = eventDay();
      if (localStorage.getItem("wambam-event-day") === today) return;
      localStorage.setItem("wambam-event-day", today);
      ["matches","handbags","gift-claimed","match-claimed","bag-claimed"].forEach(key =>
        localStorage.setItem(`wambam-event-${key}`, "0"));
    } catch (_) {}
  };
  prepareDailyEvents();

  window.__wamEvents = {
    record(type, amount=1) {
      prepareDailyEvents();
      const key = type === "handbags" ? "wambam-event-handbags" : "wambam-event-matches";
      writeEventValue(key, Math.max(0, readEventValue(key, 0) + Math.max(0, Math.floor(amount))));
    }
  };

  const notificationApi = () =>
    window.cordova && window.cordova.plugins && window.cordova.plugins.notification
      ? window.cordova.plugins.notification.local
      : null;

  const scheduleEventReminder = async () => {
    const local = notificationApi();
    if (!local) return false;
    let allowed = true;
    try {
      if (typeof local.requestPermission === "function") {
        const result = local.requestPermission();
        allowed = result && typeof result.then === "function" ? await result : result !== false;
      }
      if (!allowed) return false;
      if (typeof local.cancel === "function") {
        try {
          const cancelled = local.cancel(7901);
          if (cancelled && typeof cancelled.then === "function") await cancelled;
        } catch (_) {}
      }
      local.schedule({
        id: 7901,
        title: "Wam Bam! Your event is ready",
        text: "Return to The Bam Lounge and collect today’s event coins!",
        trigger: {at: new Date(Date.now() + 20 * 60 * 60 * 1000)},
        foreground: false,
        smallIcon: "res://icon",
        icon: "res://icon"
      });
      try { localStorage.setItem("wambam-notifications-enabled", "1"); } catch (_) {}
      return true;
    } catch (_) {
      return false;
    }
  };

  if (!window.__wamNotificationReadyInstalled) {
    window.__wamNotificationReadyInstalled = true;
    document.addEventListener("deviceready", () => {
      try {
        if (localStorage.getItem("wambam-notifications-enabled") === "1") {
          scheduleEventReminder();
        }
      } catch (_) {}
    }, false);
  }

  const awardEventCoins = amount => {
    const next = Math.max(0, readNumber("wambam-coins", 0) + amount);
    try { localStorage.setItem("wambam-coins", String(next)); } catch (_) {}
    updateHomeCounters();
    getAudio().play("coin", .78, 1.08);
  };

  const showEvents = () => {
    prepareDailyEvents();
    const previous = document.getElementById("wambam-events-panel");
    if (previous) previous.remove();

    const shade = document.createElement("div");
    shade.id = "wambam-events-panel";
    Object.assign(shade.style, {
      position:"absolute", inset:"0", zIndex:"400", display:"flex", alignItems:"center", justifyContent:"center",
      background:"rgba(3,0,12,.84)", backdropFilter:"blur(3px)", pointerEvents:"auto"
    });
    root.appendChild(shade);

    const panel = document.createElement("div");
    Object.assign(panel.style, {
      width:"88%", maxHeight:"86%", overflowY:"auto", boxSizing:"border-box", padding:"5% 5% 4%",
      border:"clamp(4px,.75vw,7px) solid #ffd746", borderRadius:"6%", background:"linear-gradient(155deg,#780032,#2a073f 54%,#004f68)",
      boxShadow:"0 0 0 5px #ff1680,0 0 30px #18e7df,inset 0 0 30px rgba(255,46,145,.28)", color:"#fff", textAlign:"center"
    });
    shade.appendChild(panel);

    const title = document.createElement("div");
    title.textContent = "★ WAM BAM EVENTS ★";
    Object.assign(title.style, {
      color:"#fff4b1", font:"900 clamp(23px,5.6vw,48px) Impact,Arial Black,sans-serif", lineHeight:"1",
      textShadow:"0 4px 0 #340013,0 0 14px #ff2892", marginBottom:"4%"
    });
    panel.appendChild(title);

    const addCard = ({icon,titleText,detail,progress,goal,reward,claimKey,alwaysReady=false}) => {
      const ready = alwaysReady || progress >= goal;
      const claimed = readEventValue(claimKey, 0) === 1;
      const card = document.createElement("div");
      Object.assign(card.style, {
        display:"grid", gridTemplateColumns:"17% 1fr 29%", alignItems:"center", gap:"2%", boxSizing:"border-box",
        width:"100%", minHeight:"15%", margin:"3% 0", padding:"3%", border:"2px solid #e5b943", borderRadius:"18px",
        background:"linear-gradient(110deg,rgba(17,5,35,.94),rgba(92,8,64,.9))", boxShadow:"inset 0 0 15px rgba(255,255,255,.08)"
      });
      const badge = document.createElement("div");
      badge.textContent = icon;
      badge.style.fontSize = "clamp(27px,7vw,58px)";
      card.appendChild(badge);
      const copy = document.createElement("div");
      copy.style.textAlign = "left";
      copy.innerHTML = `<div style="font:900 clamp(13px,3.2vw,27px) Arial Black,Impact,sans-serif;color:#57f6f1">${titleText}</div><div style="font:700 clamp(10px,2.25vw,19px) Arial,sans-serif;color:#fff3c9;margin-top:2%">${detail}</div><div style="font:900 clamp(11px,2.6vw,22px) Arial Black,sans-serif;color:#ffd943;margin-top:3%">${alwaysReady ? "READY" : `${Math.min(progress,goal)} / ${goal}`} · +${reward} COINS</div>`;
      card.appendChild(copy);
      const claim = document.createElement("button");
      claim.type = "button";
      claim.textContent = claimed ? "DONE" : ready ? "CLAIM" : "PLAY";
      Object.assign(claim.style, {
        width:"100%", padding:"13% 2%", border:"3px solid #fff3a2", borderRadius:"999px", color:claimed?"#ddd":"#180619",
        background:claimed?"#4c3e53":ready?"linear-gradient(#ffe46b,#ffae00)":"linear-gradient(#31f0ea,#0497ba)",
        font:"900 clamp(10px,2.5vw,20px) Arial Black,Impact,sans-serif", cursor:claimed?"default":"pointer", touchAction:"manipulation"
      });
      if (!claimed) {
        claim.addEventListener("pointerup", event => {
          event.preventDefault(); event.stopPropagation();
          if (ready) {
            writeEventValue(claimKey, 1);
            awardEventCoins(reward);
          } else {
            shade.remove();
          }
          if (ready) showEvents();
        }, {passive:false});
      }
      card.appendChild(claim);
      panel.appendChild(card);
    };

    addCard({icon:"🎁",titleText:"DAILY SPOTLIGHT",detail:"Your free lounge gift is waiting.",progress:1,goal:1,reward:150,claimKey:"wambam-event-gift-claimed",alwaysReady:true});
    addCard({icon:"💥",titleText:"MATCH MANIA",detail:"Clear 25 icons in any level today.",progress:readEventValue("wambam-event-matches",0),goal:25,reward:300,claimKey:"wambam-event-match-claimed"});
    addCard({icon:"👜",titleText:"COUTURE RESCUE",detail:"Clear 4 handbags in Level 5.",progress:readEventValue("wambam-event-handbags",0),goal:4,reward:400,claimKey:"wambam-event-bag-claimed"});

    const notifications = document.createElement("button");
    notifications.type = "button";
    const notificationsOn = (() => { try { return localStorage.getItem("wambam-notifications-enabled") === "1"; } catch (_) { return false; } })();
    notifications.textContent = notificationsOn ? "🔔 EVENT NOTIFICATIONS ON" : "🔔 ENABLE EVENT NOTIFICATIONS";
    Object.assign(notifications.style, {
      width:"100%", marginTop:"3%", padding:"3.5% 2%", border:"3px solid #22eee6", borderRadius:"999px",
      background:"linear-gradient(#2b0a3f,#13051f)", color:"#fff", font:"900 clamp(11px,2.6vw,22px) Arial Black,Impact,sans-serif", cursor:"pointer"
    });
    notifications.addEventListener("pointerup", async event => {
      event.preventDefault(); event.stopPropagation();
      notifications.textContent = "SETTING REMINDER…";
      const enabled = await scheduleEventReminder();
      notifications.textContent = enabled ? "🔔 EVENT NOTIFICATIONS ON" : "🔔 INSTALL APK TO ENABLE";
    }, {passive:false});
    panel.appendChild(notifications);

    const close = document.createElement("button");
    close.type = "button";
    close.textContent = "CLOSE";
    Object.assign(close.style, {
      width:"58%", marginTop:"4%", padding:"3.4%", border:"3px solid #ffe15e", borderRadius:"999px",
      background:"linear-gradient(#ff4d9d,#cc005d)", color:"#fff", font:"900 clamp(16px,3.8vw,32px) Arial Black,Impact,sans-serif", cursor:"pointer"
    });
    close.addEventListener("pointerup", event => { event.preventDefault(); shade.remove(); }, {passive:false});
    panel.appendChild(close);
  };

  const eventHit = document.createElement("button");
  eventHit.type = "button";
  eventHit.setAttribute("aria-label", "Open Wam Bam Events");
  Object.assign(eventHit.style, {
    position:"absolute", left:"1.2%", top:"79.2%", width:"22.4%", height:"12.4%", zIndex:"320",
    border:"0", borderRadius:"15%", padding:"0", background:"transparent", cursor:"pointer", pointerEvents:"auto", touchAction:"manipulation"
  });
  eventHit.addEventListener("pointerup", event => { event.preventDefault(); event.stopPropagation(); getAudio().start(); showEvents(); }, {passive:false});
  eventHit.addEventListener("click", event => { event.preventDefault(); event.stopPropagation(); showEvents(); }, {passive:false});
  root.appendChild(eventHit);

  const eventPing = document.createElement("div");
  eventPing.textContent = "!";
  Object.assign(eventPing.style, {
    position:"absolute", left:"18.1%", top:"78.7%", width:"4.8%", aspectRatio:"1", zIndex:"321", borderRadius:"50%",
    display:"flex", alignItems:"center", justifyContent:"center", background:"#ff176f", color:"#fff5a6",
    border:"2px solid #ffe55d", font:"900 clamp(11px,2.4vw,20px) Arial Black,sans-serif", animation:"wamEventPing 1.6s ease-in-out infinite", pointerEvents:"none"
  });
  root.appendChild(eventPing);

  function fit() {
    if (!root.isConnected) return;
    const canvas = document.querySelector("canvas");
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const aspect = 720 / 1280;
    let width = rect.width;
    let height = rect.height;
    let left = rect.left;
    let top = rect.top;
    if (width / height > aspect) {
      width = height * aspect;
      left = rect.left + (rect.width - width) / 2;
    } else {
      height = width / aspect;
      top = rect.top + (rect.height - height) / 2;
    }
    Object.assign(root.style, {
      left: left + "px",
      top: top + "px",
      width: width + "px",
      height: height + "px"
    });
  }

  fit();
  window.addEventListener("resize", fit);
})();
};
gdjs.Untitled_32sceneCode.eventsList0 = function(runtimeScene) {

{

gdjs.Untitled_32sceneCode.userFuncWamBoot(runtimeScene);

}

{

gdjs.copyArray(runtimeScene.getObjects("playbutton"), gdjs.Untitled_32sceneCode.GDplaybuttonObjects1);

let isConditionTrue_0 = false;
isConditionTrue_0 = false;
isConditionTrue_0 = gdjs.evtTools.input.cursorOnObject(gdjs.Untitled_32sceneCode.mapOfGDgdjs_9546Untitled_959532sceneCode_9546GDplaybuttonObjects1Objects, runtimeScene, true, false);
if (isConditionTrue_0) {
isConditionTrue_0 = false;
isConditionTrue_0 = gdjs.evtTools.input.isMouseButtonReleased(runtimeScene, "Left");
}
if (isConditionTrue_0) {
{gdjs.evtTools.runtimeScene.pushScene(runtimeScene, "Level Map");
}
}

}


{

gdjs.copyArray(runtimeScene.getObjects("settingsbutton"), gdjs.Untitled_32sceneCode.GDsettingsbuttonObjects1);

let isConditionTrue_0 = false;
isConditionTrue_0 = false;
isConditionTrue_0 = gdjs.evtTools.input.cursorOnObject(gdjs.Untitled_32sceneCode.mapOfGDgdjs_9546Untitled_959532sceneCode_9546GDsettingsbuttonObjects1Objects, runtimeScene, true, false);
if (isConditionTrue_0) {
isConditionTrue_0 = false;
isConditionTrue_0 = gdjs.evtTools.input.isMouseButtonReleased(runtimeScene, "Left");
}
if (isConditionTrue_0) {
{gdjs.evtTools.runtimeScene.pushScene(runtimeScene, "Settings");
}
}

}


};

gdjs.Untitled_32sceneCode.func = function(runtimeScene) {
runtimeScene.getOnceTriggers().startNewFrame();

gdjs.Untitled_32sceneCode.GDNewSpriteObjects1.length = 0;
gdjs.Untitled_32sceneCode.GDNewSpriteObjects2.length = 0;
gdjs.Untitled_32sceneCode.GDplaybuttonObjects1.length = 0;
gdjs.Untitled_32sceneCode.GDplaybuttonObjects2.length = 0;
gdjs.Untitled_32sceneCode.GDsettingsbuttonObjects1.length = 0;
gdjs.Untitled_32sceneCode.GDsettingsbuttonObjects2.length = 0;

gdjs.Untitled_32sceneCode.eventsList0(runtimeScene);
gdjs.Untitled_32sceneCode.GDNewSpriteObjects1.length = 0;
gdjs.Untitled_32sceneCode.GDNewSpriteObjects2.length = 0;
gdjs.Untitled_32sceneCode.GDplaybuttonObjects1.length = 0;
gdjs.Untitled_32sceneCode.GDplaybuttonObjects2.length = 0;
gdjs.Untitled_32sceneCode.GDsettingsbuttonObjects1.length = 0;
gdjs.Untitled_32sceneCode.GDsettingsbuttonObjects2.length = 0;


return;

}

gdjs['Untitled_32sceneCode'] = gdjs.Untitled_32sceneCode;
