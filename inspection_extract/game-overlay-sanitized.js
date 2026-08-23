(() => {
  const ID = "wambam-alpha02-overlay";
  const oldHomeEffects = document.getElementById("wambam-home-effects");
  if (oldHomeEffects) oldHomeEffects.remove();
  const PIECES = [
      {key:"heart", img:"tile_heart_new.png"},
      {key:"star", img:"tile_star_new.png"},
      {key:"diamond", img:"tile_diamond_new.png"},
      {key:"cherries", img:"tile_cherries_new.png"},
      {key:"bam", img:"tile_bam_new.png"},
      {key:"disco", img:"tile_disco_new.png", special:true}
    ];

  const LEVEL_CONFIGS = {
    1: {
      moves: 16,
      background: "game_background_new.jpg",
      targets: {cherries:30, diamond:18, star:20}
    },
    2: {
      moves: 16,
      background: "level_2_background.png",
      targets: {cherries:34, diamond:21, star:23}
    },
    3: {
      moves: 18,
      background: "level_3_background.png",
      targets: {heart:28, bam:22, disco:6}
    },
    4: {
      moves: 20,
      background: "level_4_background.png",
      targets: {cherries:32, diamond:24, star:26}
    },
    5: {
      moves: 24,
      background: "level_5_background.png",
      targets: {handbag:8, heart:24, diamond:22}
    }
  };

  const LEVEL_5_HANDBAGS = [
    [0,2],[0,5],[2,0],[2,7],
    [4,2],[4,5],[6,0],[6,7]
  ];

  const levelConfig = level => LEVEL_CONFIGS[level] || LEVEL_CONFIGS[1];

  document.documentElement.style.background = "#000";
  document.body.style.background = "#000";
  document.body.style.margin = "0";

  // Mobile wrapper fix only. Do not change the original 720x1280 game layout.
  // On iPhone/Android, cover any extra-tall viewport area with the CURRENT
  // background and prevent the page from scrolling down to old scene artwork.
  const isMobileBuild = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) ||
    !!window.cordova;

  if (isMobileBuild) {
    document.documentElement.style.width = "100%";
    document.documentElement.style.height = "100%";
    document.documentElement.style.overflow = "hidden";
    document.body.style.width = "100%";
    document.body.style.height = "100%";
    document.body.style.overflow = "hidden";

    if (!document.getElementById("wambam-mobile-screen-bg")) {
      const mobileBg = document.createElement("img");
      mobileBg.id = "wambam-mobile-screen-bg";
      const mobileLevel = Math.min(5, Math.max(1,
        readSaveNumber("wambam-selected-level", 1)));
      mobileBg.src = levelConfig(mobileLevel).background;
      mobileBg.style.position = "fixed";
      mobileBg.style.inset = "0";
      mobileBg.style.width = "100vw";
      mobileBg.style.height = "100vh";
      mobileBg.style.objectFit = "cover";
      mobileBg.style.zIndex = "2147482000";
      mobileBg.style.pointerEvents = "none";
      document.body.appendChild(mobileBg);
    }
  }

  function removeOld() {
    const old = document.getElementById(ID);
    if (old) old.remove();
  }

  function restoreBaseCanvas() {
    const canvas = document.querySelector("canvas");
    if (canvas) canvas.style.visibility = "visible";
    if (canvas && canvas.parentElement) {
      canvas.parentElement.style.overflow = "hidden";
      canvas.parentElement.style.background = "#000";
    }
    document.documentElement.style.background = "#000";
    document.body.style.background = "#000";
  }

  function readSaveNumber(key, fallback) {
    try {
      const value = Number.parseInt(localStorage.getItem(key) || "", 10);
      return Number.isFinite(value) ? value : fallback;
    } catch (_) {
      return fallback;
    }
  }

  function writeSaveNumber(key, value) {
    try { localStorage.setItem(key, String(value)); } catch (_) {}
  }

  function recordDailyEvent(type, amount=1) {
    if (window.__wamEvents && typeof window.__wamEvents.record === "function") {
      window.__wamEvents.record(type, amount);
      return;
    }
    try {
      const now = new Date();
      const today = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,"0")}-${String(now.getDate()).padStart(2,"0")}`;
      if (localStorage.getItem("wambam-event-day") !== today) {
        localStorage.setItem("wambam-event-day", today);
        ["matches","handbags","gift-claimed","match-claimed","bag-claimed"].forEach(key =>
          localStorage.setItem(`wambam-event-${key}`, "0"));
      }
      const key = type === "handbags" ? "wambam-event-handbags" : "wambam-event-matches";
      const current = Number.parseInt(localStorage.getItem(key) || "0", 10) || 0;
      localStorage.setItem(key, String(Math.max(0, current + Math.max(0, Math.floor(amount)))));
    } catch (_) {}
  }

  function openIncomingCurtain() {
    const curtain = document.getElementById("wambam-curtain-transition");
    if (!curtain || curtain.dataset.opening === "1") return;
    curtain.dataset.opening = "1";

    const left = curtain.querySelector(".wam-curtain-left");
    const right = curtain.querySelector(".wam-curtain-right");
    const valance = curtain.querySelector(".wam-curtain-valance");
    const title = curtain.querySelector(".wam-curtain-title");

    setTimeout(() => {
      if (left) left.style.transform = "translateX(-104%)";
      if (right) right.style.transform = "translateX(104%)";
      if (valance) valance.style.transform = "translateY(-110%)";
      if (title) {
        title.style.opacity = "0";
        title.style.transform = "rotate(-3deg) scale(1.18)";
      }
      curtain.style.background = "transparent";
    }, 140);

    setTimeout(() => {
      if (curtain.isConnected) curtain.remove();
    }, 1220);
  }

  if (runtimeScene.__wamGoMap) {
    runtimeScene.__wamGoMap = false;
    removeOld();
    const mobileBg = document.getElementById("wambam-mobile-screen-bg");
    if (mobileBg) mobileBg.remove();
    restoreBaseCanvas();
    runtimeScene.__wam02 = null;
    gdjs.evtTools.runtimeScene.replaceScene(runtimeScene, "Level Map", false);
    return;
  }

  if (runtimeScene.__wamGoHomeFromGame) {
    runtimeScene.__wamGoHomeFromGame = false;
    removeOld();
    const mobileBg = document.getElementById("wambam-mobile-screen-bg");
    if (mobileBg) mobileBg.remove();
    restoreBaseCanvas();
    runtimeScene.__wam02 = null;
    gdjs.evtTools.runtimeScene.replaceScene(runtimeScene, "Untitled scene", false);
    return;
  }

  if (!runtimeScene.__wam02) {
    removeOld();

    const startingLevel = Math.min(
      5,
      Math.max(1, readSaveNumber("wambam-selected-level", 1))
    );
    const startingCoins = Math.max(0, readSaveNumber("wambam-coins", 0));
    const startingConfig = levelConfig(startingLevel);

    const st = runtimeScene.__wam02 = {
      board: [],
      moves: startingConfig.moves,
      selected: null,
      locked: false,
      targets: {...startingConfig.targets},
      targetKeys: Object.keys(startingConfig.targets),
      coins: startingCoins,
      lives: Math.max(0, Math.min(5, readSaveNumber("wambam-lives", 5))),
      booster: null,
      boosters: {rocket:3, hammer:3, disco:3, swap:3},
      paused: false,
      level: startingLevel,
      combo: 0,
      dropAnimating: false,
      dropColumns: [],
      dropMoves: [],
      ended: false,
      discoConverting: new Set(),
      handbags: new Map(),
      handbagHits: new Set(),
      audioReady: false,
      bgm: null,
      sounds: {}
    };

    const root = document.createElement("div");
    root.id = ID;
    root.style.position = "fixed";
    root.style.zIndex = "2147483000";
    root.style.pointerEvents = "none";
    root.style.fontFamily = "Arial Black, Impact, sans-serif";
    root.style.userSelect = "none";
    root.style.touchAction = "none";
    document.body.appendChild(root);
    st.root = root;
    const gameBg = document.createElement("img");
    gameBg.src = levelConfig(st.level).background;
    gameBg.style.position = "absolute";
    gameBg.style.left = "0";
    gameBg.style.top = "0";
    gameBg.style.width = "100%";
    gameBg.style.height = "100%";
    gameBg.style.objectFit = "cover";
    gameBg.style.zIndex = "0";
    gameBg.style.pointerEvents = "none";
    root.prepend(gameBg);


    if (!document.getElementById("wambam-alpha25-style")) {
      const style = document.createElement("style");
      style.id = "wambam-alpha25-style";
      style.textContent = `
        @keyframes wamDrop {
          0% { transform: translateY(-28%) scale(.78); opacity: .25; }
          100% { transform: translateY(0) scale(.78); opacity: 1; }
        }
        @keyframes wamPop {
          0% { transform: scale(.78); opacity: 1; }
          65% { transform: scale(1.08); opacity: 1; }
          100% { transform: scale(.08); opacity: 0; }
        }
        @keyframes wamDropSmooth {
          0% { transform: translateY(-70%) scale(.78); opacity: .08; }
          72% { transform: translateY(4%) scale(.78); opacity: 1; }
          100% { transform: translateY(0) scale(.78); opacity: 1; }
        }
        @keyframes wamSwapForward {
          0% { transform:translate(0,0) scale(1); }
          100% { transform:translate(var(--swap-x),var(--swap-y)) scale(1); }
        }
        @keyframes wamDropExact {
          0% { transform:translateY(var(--wam-fall)) scale(.78); opacity:.25; }
          80% { transform:translateY(4%) scale(.78); opacity:1; }
          100% { transform:translateY(0) scale(.78); opacity:1; }
        }
        @keyframes wamMatchPulse {
          0% { transform: scale(.78); filter: brightness(1); }
          40% { transform: scale(.92); filter: brightness(1.35); }
          70% { transform: scale(.72); filter: brightness(1.1); }
          100% { transform: scale(.02); opacity: 0; }
        }
        @keyframes wamDiscoConvert {
          0% { transform: scale(.78) rotate(0); filter: brightness(1); }
          35% { transform: scale(1.02) rotate(-8deg); filter: brightness(1.75) drop-shadow(0 0 10px #fff); }
          70% { transform: scale(.9) rotate(7deg); filter: brightness(1.35) drop-shadow(0 0 14px #25e4ff); }
          100% { transform: scale(.78) rotate(0); filter: brightness(1); }
        }
        @keyframes wamDiscoPulse {
          0%,100% { transform: scale(.88); filter: brightness(1.05) drop-shadow(0 0 4px #24e8ff) drop-shadow(0 0 5px #ff2c9a); }
          50% { transform: scale(1.01); filter: brightness(1.55) drop-shadow(0 0 9px #fff) drop-shadow(0 0 13px #25e8ff); }
        }
        @keyframes wamToast {
          0% { transform: translate(-50%,-25%) scale(.75); opacity: 0; }
          18% { transform: translate(-50%,0) scale(1.06); opacity: 1; }
          82% { transform: translate(-50%,0) scale(1); opacity: 1; }
          100% { transform: translate(-50%,-18%) scale(.95); opacity: 0; }
        }
        @keyframes wamThreeBam {
          0% { transform: translate(-50%,-50%) scale(.25) rotate(-8deg); opacity: 0; }
          18% { transform: translate(-50%,-50%) scale(1.12) rotate(3deg); opacity: 1; }
          35% { transform: translate(-50%,-50%) scale(1.04) rotate(0deg); opacity: 1; }
          78% { transform: translate(-50%,-50%) scale(1) rotate(0deg); opacity: 1; }
          100% { transform: translate(-50%,-50%) scale(1.35); opacity: 0; }
        }
      `;
      document.head.appendChild(style);
    }

    function box(l,t,w,h) {
      const d = document.createElement("div");
      d.style.position = "absolute";
      d.style.left = l + "%";
      d.style.top = t + "%";
      d.style.width = w + "%";
      d.style.height = h + "%";
      d.style.boxSizing = "border-box";
      root.appendChild(d);
      return d;
    }

    function label(l,t,w,h,color="#fff") {
      const d = box(l,t,w,h);
      d.style.display = "flex";
      d.style.alignItems = "center";
      d.style.justifyContent = "center";
      d.style.color = color;
      d.style.fontWeight = "900";
      d.style.textAlign = "center";
      d.style.textShadow = "-2px -2px 0 #111,2px -2px 0 #111,-2px 2px 0 #111,2px 2px 0 #111";
      return d;
    }

    st.movesEl = label(5.1,5.2,14.5,5.9);
    st.movesEl.style.fontSize = "clamp(23px,3.8vw,40px)";
    st.coinsEl = label(76.8,2.65,14.4,3.05);
    st.coinsEl.style.fontSize = "clamp(13px,2.05vw,22px)";
    st.livesEl = label(87.3,9.05,8.0,3.7);
    st.livesEl.style.fontSize = "clamp(17px,2.55vw,27px)";
    st.livesEl.style.lineHeight = "1";

    const targetRows = [25.1,29.0,32.9];
    st.targetEls = {};
    st.targetKeys.forEach((key,index) => {
      if (st.level === 3 || st.level === 5) {
        const icon = document.createElement("img");
        icon.src = key === "handbag"
          ? "handbag_open.png"
          : PIECES.find(piece => piece.key === key).img;
        Object.assign(icon.style, {
          position: "absolute",
          left: "5.8%",
          top: `${targetRows[index] - .8}%`,
          width: "7%",
          height: "3.6%",
          objectFit: key === "disco" ? "cover" : "contain",
          objectPosition: "center",
          transform: key === "disco" ? "scale(1.28)" : key === "handbag" ? "scale(1.18)" : "none",
          filter: "drop-shadow(0 2px 1px rgba(0,0,0,.35))",
          zIndex: "3",
          pointerEvents: "none"
        });
        root.appendChild(icon);
      }
      st.targetEls[key] = label(13.0,targetRows[index] - .25,7.2,2.5,"#171717");
    });
    Object.values(st.targetEls).forEach(x => {
      x.style.fontSize = "clamp(15px,2.25vw,24px)";
      x.style.lineHeight = "1";
      x.style.textShadow = "0 1px 0 #fff,0 0 3px rgba(255,255,255,.7)";
    });

    const boardLayout = st.level === 1
      ? {left:14.1, top:38.0, width:74.0, height:45.7}
      : st.level === 4
        ? {left:14.0, top:38.4, width:74.8, height:47.5}
        : st.level === 5
          ? {left:14.1, top:38.7, width:74.7, height:47.0}
        : {left:14.2, top:38.6, width:75.2, height:46.8};
    const board = box(
      boardLayout.left,
      boardLayout.top,
      boardLayout.width,
      boardLayout.height
    );
    board.style.background="transparent";
    board.style.display = "grid";
    board.style.gridTemplateColumns = "repeat(8,1fr)";
    board.style.gridTemplateRows = "repeat(8,1fr)";
    board.style.gap = "0";
    board.style.transition = "all 180ms ease";
    board.style.padding = "0";
    board.style.pointerEvents = "auto";
    board.style.zIndex = "5";
    st.boardEl = board;

    function makeHitBox(l,t,w,h,onTap) {
      const d = box(l,t,w,h);
      d.style.pointerEvents = "auto";
      d.style.cursor = "pointer";
      d.addEventListener("pointerdown", e => {
        e.preventDefault();
        e.stopPropagation();
        onTap();
      });
      return d;
    }

    st.boosterBadges = {};

    const boosterDefs = [
      ["rocket", 4.8, 86.0, 18.0, 10.5],
      ["hammer", 25.5, 86.0, 18.0, 10.5],
      ["disco", 46.2, 86.0, 18.0, 10.5],
      ["swap", 66.8, 86.0, 18.0, 10.5]
    ];

    boosterDefs.forEach(([name,l,t,w,h]) => {
      const hit = makeHitBox(l,t,w,h,() => {
        if (st.locked || st.paused || st.boosters[name] <= 0) return;
        st.booster = st.booster === name ? null : name;
        st.selected = null;
        render();
      });
      hit.style.borderRadius = "50%";
      st[name+"Hit"] = hit;

      const badge = document.createElement("div");
      badge.style.position = "absolute";
      badge.style.right = "2%";
      badge.style.top = "0%";
      badge.style.minWidth = "24%";
      badge.style.height = "28%";
      badge.style.padding = "0 3%";
      badge.style.borderRadius = "999px";
      badge.style.background = "#f31872";
      badge.style.border = "2px solid #ffd15a";
      badge.style.color = "#fff";
      badge.style.display = "flex";
      badge.style.alignItems = "center";
      badge.style.justifyContent = "center";
      badge.style.fontWeight = "900";
      badge.style.fontSize = "clamp(11px,1.9vw,20px)";
      badge.style.textShadow = "1px 1px 0 #000";
      hit.appendChild(badge);
      st.boosterBadges[name] = badge;
    });

    const pauseHit = makeHitBox(88.0,88.2,10.0,8.0,() => {
      if (st.locked) return;
      st.paused = true;
      showPause();
    });

    function showPause() {
      const shade = box(0,0,100,100);
      shade.style.background = "rgba(0,0,0,.72)";
      shade.style.display = "flex";
      shade.style.alignItems = "center";
      shade.style.justifyContent = "center";
      shade.style.pointerEvents = "auto";
      shade.style.zIndex = "9999";

      const panel = document.createElement("div");
      panel.style.width = "76%";
      panel.style.padding = "6.5% 5% 7%";
      panel.style.borderRadius = "30px";
      panel.style.background = st.level === 4
        ? "radial-gradient(circle at 28% 10%,#288fa8,#092b49 62%,#16051b)"
        : "radial-gradient(circle at 28% 10%,#ff4b98,#9d004a 62%,#2a061c)";
      panel.style.border = "5px solid #ffd15a";
      panel.style.boxShadow = "0 0 0 4px #ff2489,0 18px 36px rgba(0,0,0,.72),inset 0 0 24px rgba(255,255,255,.16)";
      panel.style.textAlign = "center";

      const title = document.createElement("div");
      title.textContent = "PAUSED";
      title.style.color = "#fff";
      title.style.fontSize = "clamp(28px,6vw,58px)";
      title.style.fontWeight = "900";
      title.style.textShadow = "3px 4px 0 #111";
      panel.appendChild(title);

      const makePauseButton = (text, background, onTap) => {
        const button = document.createElement("button");
        button.type = "button";
        button.textContent = text;
        Object.assign(button.style, {
          display: "block", margin: "5% auto 0", width: "88%", padding: "3.8%",
          borderRadius: "999px", border: "4px solid #111", background,
          color: "#111", font: "900 clamp(15px,3vw,28px) Arial Black,Impact,sans-serif",
          boxShadow: "0 5px 0 rgba(0,0,0,.48)", cursor: "pointer", touchAction: "manipulation"
        });
        let used = false;
        const activate = e => {
          if (used) return;
          used = true;
          e.preventDefault(); e.stopPropagation(); onTap();
        };
        button.addEventListener("pointerdown", activate, {passive:false});
        button.addEventListener("click", activate, {passive:false});
        panel.appendChild(button);
      };
      makePauseButton("RETURN TO GAME", "linear-gradient(#fff7b7,#f5b525)", () => {
        st.paused = false;
        shade.remove();
      });
      makePauseButton("HOME", "linear-gradient(#7ef8ff,#20b7dc)", () => {
        leaveGame("Untitled scene");
      });
      shade.appendChild(panel);
    }

    function showThreeBamPopup(duration=1250) {
      const old = document.getElementById("wam-three-bam-popup");
      if (old) old.remove();

      const pop = document.createElement("img");
      pop.id = "wam-three-bam-popup";
      pop.alt = "WAM!";
      pop.style.position = "absolute";
      pop.style.left = "50%";
      pop.style.top = "49%";
      pop.style.width = "58%";
      pop.style.maxWidth = "520px";
      pop.style.height = "auto";
      pop.style.background = "transparent";
      pop.style.border = "0";
      pop.style.boxShadow = "none";
      pop.style.zIndex = "900";
      pop.style.pointerEvents = "none";
      pop.style.filter = "drop-shadow(0 8px 12px rgba(0,0,0,.65))";
      pop.style.animation = `wamThreeBam ${duration}ms cubic-bezier(.2,.8,.25,1) forwards`;
      root.appendChild(pop);
      setTimeout(() => pop.remove(), duration + 60);
    }

    function showToast(text, duration=900) {
      const toast = document.createElement("div");
      toast.textContent = text;
      toast.style.position = "absolute";
      toast.style.left = "50%";
      toast.style.top = "36%";
      toast.style.zIndex = "500";
      toast.style.pointerEvents = "none";
      toast.style.padding = "2.1% 4.5%";
      toast.style.borderRadius = "999px";
      toast.style.background = "linear-gradient(#ff3b86,#c5005b)";
      toast.style.border = "3px solid #ffd15a";
      toast.style.color = "#fff";
      toast.style.fontWeight = "900";
      toast.style.fontSize = "clamp(15px,3vw,30px)";
      toast.style.textShadow = "2px 2px 0 #111";
      toast.style.whiteSpace = "nowrap";
      toast.style.animation = `wamToast ${duration}ms ease-out forwards`;
      root.appendChild(toast);
      setTimeout(() => toast.remove(), duration + 40);
    }

    async function animateSwap(a,b) {
      const buttons = board.children;
      const first = buttons[a.r * 8 + a.c];
      const second = buttons[b.r * 8 + b.c];
      if (!first || !second) return;

      const dx = (b.c - a.c) * 100;
      const dy = (b.r - a.r) * 100;

      first.style.setProperty("--swap-x", `${dx}%`);
      first.style.setProperty("--swap-y", `${dy}%`);
      second.style.setProperty("--swap-x", `${-dx}%`);
      second.style.setProperty("--swap-y", `${-dy}%`);

      first.style.zIndex = "30";
      second.style.zIndex = "30";
      first.style.animation = "wamSwapForward 180ms ease-in-out forwards";
      second.style.animation = "wamSwapForward 180ms ease-in-out forwards";

      await new Promise(res => setTimeout(res, 185));

      first.style.animation = "";
      second.style.animation = "";
      first.style.zIndex = "";
      second.style.zIndex = "";
    }

    async function animateMatched(cells) {
      const buttons = board.children;
      for (const p of cells) {
        const el = buttons[p.r * 8 + p.c];
        if (!el) continue;
        el.style.animation = "wamMatchPulse 260ms cubic-bezier(.2,.8,.2,1) forwards";
      }
      await new Promise(r => setTimeout(r, 265));
    }

    function initAudio() {
      if (!window.__wamAudio) {
        const settingEnabled = key => {
          try { return localStorage.getItem(key) !== "0"; } catch (_) { return true; }
        };
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
          bgm, sounds, activeSounds, suspended:false,
          apply() {
            const on = settingEnabled("wambam-music-enabled");
            bgm.muted = !on;
            if (on && !this.suspended && !document.hidden) bgm.play().catch(() => {}); else bgm.pause();
          },
          start() { if (!document.hidden) { this.suspended=false; this.apply(); } },
          suspend() {
            this.suspended=true;
            bgm.pause();
            activeSounds.forEach(sound => {
              try { sound.pause(); sound.currentTime=0; } catch (_) {}
            });
            activeSounds.clear();
          },
          resume() { if (!document.hidden) { this.suspended=false; this.apply(); } },
          play(name, volume=.72, playbackRate=1) {
            if (this.suspended || document.hidden || !settingEnabled("wambam-sfx-enabled")) return;
            const source = sounds[name];
            if (!source) return;
            const sound = source.cloneNode();
            sound.volume = Math.max(0, Math.min(1, volume));
            sound.playbackRate = Math.max(.65, Math.min(1.6, playbackRate));
            activeSounds.add(sound);
            const release=()=>activeSounds.delete(sound);
            sound.addEventListener("ended",release,{once:true});
            sound.addEventListener("error",release,{once:true});
            sound.play().catch(() => {});
          }
        };
      }
      if (!window.__wamAudioLifecycleInstalled) {
        window.__wamAudioLifecycleInstalled=true;
        const suspend=()=>window.__wamAudio && window.__wamAudio.suspend && window.__wamAudio.suspend();
        const resume=()=>window.__wamAudio && window.__wamAudio.resume && window.__wamAudio.resume();
        document.addEventListener("pause",suspend,false);
        document.addEventListener("resume",resume,false);
        document.addEventListener("visibilitychange",()=>document.hidden?suspend():resume(),false);
        window.addEventListener("pagehide",suspend,false);
        window.addEventListener("pageshow",resume,false);
        window.addEventListener("blur",suspend,false);
        window.addEventListener("focus",resume,false);
      }
      st.audioReady = true;
      window.__wamAudio.start();
    }

    function playSound(name, volume=.72, playbackRate=1) {
      initAudio();
      window.__wamAudio.play(name, volume, playbackRate);
    }

    root.addEventListener("pointerdown", initAudio, {capture:true});

    function resetForLevel(nextLevel) {
      const config = levelConfig(nextLevel);
      st.level = nextLevel;
      st.moves = config.moves;
      st.selected = null;
      st.locked = false;
      st.paused = false;
      st.ended = false;
      st.combo = 0;
      st.targets = {...config.targets};
      st.targetKeys = Object.keys(config.targets);
      st.discoConverting.clear();
      st.handbagHits.clear();
      makeBoard();
      render();
    }

    function awardCoins(amount) {
      const reward = Math.max(0, Math.floor(Number(amount) || 0));
      if (reward === 0) return;
      st.coins += reward;
      writeSaveNumber("wambam-coins", st.coins);
      playSound("coin", .66, reward >= 100 ? 1.08 : 1);
    }

    function leaveGame(sceneName) {
      if (sceneName === "Untitled scene") {
        // DOM button callbacks occur outside GDevelop's scene tick. Queue the
        // scene change for the next tick so HOME works reliably on BlueStacks.
        runtimeScene.__wamGoHomeFromGame = true;
      }
    }

    function showEndScreen(won) {
      if (st.ended) return;
      st.ended = true;
      st.locked = true;

      const shade = box(0,0,100,100);
      shade.style.background = "rgba(0,0,0,.58)";
      shade.style.display = "flex";
      shade.style.alignItems = "center";
      shade.style.justifyContent = "center";
      shade.style.pointerEvents = "auto";
      shade.style.zIndex = "99999";

      if (!won) {
        st.lives = Math.max(0, st.lives - 1);
        writeSaveNumber("wambam-lives", st.lives);
        render();
        const panel = document.createElement("div");
        panel.style.position = "relative";
        panel.style.width = "84%";
        panel.style.background = "transparent";
        panel.style.display = "flex";
        panel.style.alignItems = "center";
        panel.style.justifyContent = "center";

        const art = document.createElement("img");
        art.src = "out_of_moves.png";
        art.alt = "Out of moves. Try again?";
        art.style.width = "100%";
        art.style.height = "auto";
        art.style.display = "block";
        art.style.background = "transparent";
        art.style.filter = "drop-shadow(0 10px 15px rgba(0,0,0,.38))";
        panel.appendChild(art);

        // Make the actual popup artwork clickable using its own coordinates.
        // This avoids guessed CSS button positions.
        art.style.pointerEvents = "auto";
        art.style.cursor = "pointer";
        art.style.touchAction = "manipulation";

        let endScreenActionUsed = false;

        const handleOutOfMovesAction = e => {
          if (endScreenActionUsed) return;

          const rect = art.getBoundingClientRect();
          if (!rect.width || !rect.height) return;

          const x = (e.clientX - rect.left) / rect.width;
          const y = (e.clientY - rect.top) / rect.height;

          // Round retry arrow on the supplied artwork.
          if (x >= 0.36 && x <= 0.54 && y >= 0.56 && y <= 0.69) {
            e.preventDefault();
            e.stopPropagation();
            endScreenActionUsed = true;
            shade.remove();
            resetForLevel(st.level);
            return;
          }

          // Gold play triangle on the supplied artwork.
          if (x >= 0.53 && x <= 0.70 && y >= 0.56 && y <= 0.69) {
            e.preventDefault();
            e.stopPropagation();
            endScreenActionUsed = true;
            shade.remove();

            leaveGame("Untitled scene");
          }
        };

        art.addEventListener("pointerdown", handleOutOfMovesAction, {passive:false});
        art.addEventListener("click", handleOutOfMovesAction, {passive:false});

        shade.appendChild(panel);
        return;
      }

      const completionReward = 250;
      awardCoins(completionReward);
      st.lives = Math.min(5, st.lives + 1);
      writeSaveNumber("wambam-lives", st.lives);

      const unlockedBefore = Math.max(
        1,
        readSaveNumber("wambam-unlocked-level", 1)
      );
      const unlockedAfter = st.level < 5
        ? Math.max(st.level + 1, unlockedBefore)
        : unlockedBefore;
      writeSaveNumber("wambam-unlocked-level", unlockedAfter);
      // Select the newly unlocked stop before opening the road map so its
      // camera glides upward and lands on the next level automatically.
      writeSaveNumber("wambam-selected-level", st.level < 5 ? st.level + 1 : 5);
      render();

      // Use the supplied Wam Bam artwork as the complete result card while
      // keeping the changing level, coin and unlock copy live and accurate.
      {
        const artPanel = document.createElement("div");
        Object.assign(artPanel.style, {
          position: "relative",
          width: "94%",
          aspectRatio: "1286 / 1223",
          maxHeight: "94%",
          overflow: "hidden",
          borderRadius: "4.2%",
          filter: "drop-shadow(0 22px 28px rgba(0,0,0,.68))",
          pointerEvents: "auto"
        });

        const art = document.createElement("img");
        art.src = "level_complete_popup_dynamic.png";
        art.alt = `Level ${st.level} complete`;
        Object.assign(art.style, {
          position: "absolute",
          inset: "0",
          width: "100%",
          height: "100%",
          objectFit: "fill",
          pointerEvents: "none"
        });
        artPanel.appendChild(art);

        const artText = (textContent,left,top,width,height,style={}) => {
          const text = document.createElement("div");
          text.textContent = textContent;
          Object.assign(text.style, {
            position: "absolute",
            left, top, width, height,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            zIndex: "3",
            pointerEvents: "none",
            fontFamily: "Arial Black,Impact,sans-serif",
            fontWeight: "900",
            ...style
          });
          artPanel.appendChild(text);
          return text;
        };

        artText(st.coins.toLocaleString(),"81.2%","4.4%","11.2%","6.2%",{
          color: "#fff4c9",
          fontSize: "clamp(11px,2.3vw,21px)",
          textShadow: "0 2px 0 #000"
        });
        artText(`LEVEL ${st.level} COMPLETE`,"18%","38.5%","64%","8%",{
          color: "#dffcff",
          fontSize: "clamp(20px,4.7vw,44px)",
          letterSpacing: ".025em",
          textShadow: "-2px -2px 0 #111,2px -2px 0 #111,-2px 2px 0 #111,2px 2px 0 #111,0 0 10px #21e8e0"
        });
        artText(`+${completionReward} COINS`,"34%","58.7%","47%","9%",{
          color: "#fff0b0",
          fontSize: "clamp(17px,3.5vw,33px)",
          textShadow: "0 3px 0 #17000d"
        });
        artText(
          st.level < 5 ? `LEVEL ${st.level + 1} UNLOCKED!` : "COUTURE VAULT COMPLETE!",
          "18%","69.2%","64%","7%",{
            color: "#ffd34b",
            fontSize: "clamp(15px,3.2vw,29px)",
            textShadow: "0 3px 0 #5b2600,0 0 8px #ffb700"
          }
        );

        const artButton = document.createElement("button");
        artButton.type = "button";
        artButton.textContent = "ROAD MAP";
        Object.assign(artButton.style, {
          position: "absolute",
          left: "13.8%",
          top: "79.7%",
          width: "72.5%",
          height: "12.2%",
          zIndex: "4",
          padding: "0 22% 0 2%",
          border: "0",
          borderRadius: "999px",
          background: "transparent",
          color: "#fff",
          font: "900 clamp(18px,4vw,36px) Arial Black,Impact,sans-serif",
          textShadow: "0 3px 0 #4b082b,0 0 5px #fff",
          cursor: "pointer",
          touchAction: "manipulation"
        });

        let artRoadMapQueued = false;
        const openArtworkRoadMap = event => {
          if (artRoadMapQueued) return;
          artRoadMapQueued = true;
          event.preventDefault();
          event.stopPropagation();
          artButton.disabled = true;
          artButton.textContent = "OPENING…";
          runtimeScene.__wamGoMap = true;
        };
        artButton.addEventListener("pointerup", openArtworkRoadMap, {passive:false});
        artButton.addEventListener("click", openArtworkRoadMap, {passive:false});
        artPanel.appendChild(artButton);
        shade.appendChild(artPanel);
        return;
      }

      // Wam Bam show-poster result card. Gameplay stays locked behind it.
      const panel = document.createElement("div");
      panel.style.position = "relative";
      panel.style.width = "82%";
      panel.style.padding = "3.5% 4.5% 5%";
      panel.style.borderRadius = "34px";
      panel.style.background = "radial-gradient(circle at 14% 18%,rgba(255,255,255,.2) 0 2px,transparent 2.5px) 0 0/17px 17px,linear-gradient(155deg,#2a071e 0,#790041 46%,#160817 100%)";
      panel.style.border = "7px solid #ffc928";
      panel.style.textAlign = "center";
      panel.style.boxShadow = "0 0 0 4px #ff238b,0 0 0 8px #13000c,0 16px 0 #3e001f,0 28px 55px rgba(0,0,0,.7),inset 0 0 28px rgba(255,37,143,.45)";
      panel.style.overflow = "visible";

      const lounge = document.createElement("div");
      lounge.textContent = "★  THE BAM LOUNGE  ★";
      Object.assign(lounge.style, {
        display: "inline-block",
        position: "relative",
        zIndex: "3",
        marginTop: "-8%",
        marginBottom: "1.2%",
        padding: "1.8% 6%",
        border: "3px solid #20ded2",
        borderRadius: "999px",
        background: "#120515",
        color: "#ff4aa0",
        font: "900 clamp(11px,2.5vw,22px) Arial Black,Impact,sans-serif",
        letterSpacing: ".08em",
        textShadow: "0 0 9px #ff1582",
        boxShadow: "0 0 16px rgba(32,222,210,.75)"
      });
      panel.appendChild(lounge);

      const posterRow = document.createElement("div");
      Object.assign(posterRow.style, {
        position: "relative",
        zIndex: "2",
        minHeight: "22%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "2%"
      });
      panel.appendChild(posterRow);

      const artwork = document.createElement("img");
      artwork.src = "wam-bam-app-icon-512.png";
      artwork.alt = "Wam Bam lounge star";
      Object.assign(artwork.style, {
        width: "29%",
        aspectRatio: "1",
        objectFit: "cover",
        objectPosition: "38% 55%",
        borderRadius: "50%",
        border: "4px solid #ffd34f",
        boxShadow: "0 0 0 3px #ff238b,0 0 18px #23e2d7",
        transform: "rotate(-3deg)"
      });
      posterRow.appendChild(artwork);

      const burst = document.createElement("div");
      Object.assign(burst.style, {
        position: "absolute",
        zIndex: "0",
        left: "37%",
        top: "2%",
        width: "60%",
        aspectRatio: "1.65",
        background: "linear-gradient(145deg,#ffe05a,#ff701f)",
        clipPath: "polygon(50% 0,59% 24%,77% 5%,78% 31%,100% 22%,86% 46%,100% 62%,75% 61%,77% 94%,57% 73%,48% 100%,40% 74%,17% 93%,23% 63%,0 63%,15% 47%,0 28%,25% 31%,25% 6%,41% 25%)",
        filter: "drop-shadow(0 5px 0 #14000b)"
      });
      posterRow.appendChild(burst);

      const wam = document.createElement("div");
      wam.textContent = "WAM!";
      wam.style.position = "relative";
      wam.style.zIndex = "2";
      wam.style.color = "#ff2c8c";
      wam.style.font = "900 clamp(40px,9vw,82px) Impact,Arial Black,sans-serif";
      wam.style.transform = "rotate(-5deg)";
      wam.style.textShadow = "-4px -4px 0 #fff,4px -4px 0 #fff,-4px 4px 0 #fff,4px 4px 0 #fff,0 8px 0 #13000a,0 0 18px #ff1883";
      wam.style.flex = "1";
      posterRow.appendChild(wam);

      const title = document.createElement("div");
      title.textContent = `LEVEL ${st.level} COMPLETE`;
      title.style.position = "relative";
      title.style.zIndex = "2";
      title.style.color = "#23e2d7";
      title.style.fontSize = "clamp(22px,4.8vw,46px)";
      title.style.fontWeight = "900";
      title.style.letterSpacing = ".03em";
      title.style.textShadow = "-2px -2px 0 #080008,2px -2px 0 #080008,-2px 2px 0 #080008,2px 2px 0 #080008,0 0 12px #0ff";
      panel.appendChild(title);

      const stars = document.createElement("div");
      stars.textContent = "★ ★ ★";
      stars.style.position = "relative";
      stars.style.zIndex = "2";
      stars.style.marginTop = "1%";
      stars.style.color = "#ffd93d";
      stars.style.fontSize = "clamp(28px,6.5vw,58px)";
      stars.style.letterSpacing = "2%";
      stars.style.textShadow = "0 3px 0 #8c4c00,0 0 12px #fff3a0";
      panel.appendChild(stars);

      const reward = document.createElement("div");
      reward.textContent = `🪙  +${completionReward} COINS`;
      reward.style.position = "relative";
      reward.style.zIndex = "2";
      reward.style.width = "80%";
      reward.style.margin = "2% auto 0";
      reward.style.padding = "2.6% 2%";
      reward.style.borderRadius = "999px";
      reward.style.background = "linear-gradient(90deg,#101424,#25102d)";
      reward.style.border = "3px solid #20ded2";
      reward.style.color = "#fff7c7";
      reward.style.font = "900 clamp(14px,3vw,28px) Arial Black,Impact,sans-serif";
      reward.style.boxShadow = "inset 0 0 15px rgba(32,222,210,.24),0 0 12px rgba(32,222,210,.35)";
      panel.appendChild(reward);

      const sub = document.createElement("div");
      sub.textContent = st.level < 5
        ? `LEVEL ${st.level + 1} UNLOCKED!`
        : "COUTURE VAULT COMPLETE!";
      sub.style.position = "relative";
      sub.style.zIndex = "2";
      sub.style.color = "#ffd44f";
      sub.style.marginTop = "4%";
      sub.style.fontSize = "clamp(15px,3vw,28px)";
      sub.style.fontWeight = "900";
      sub.style.textShadow = "0 2px 0 #3b1700,0 0 9px #ffb300";
      panel.appendChild(sub);

      const btn = document.createElement("button");
      btn.type = "button";
      btn.textContent = "ROAD MAP  ➜";
      btn.style.position = "relative";
      btn.style.zIndex = "3";
      btn.style.marginTop = "5%";
      btn.style.width = "88%";
      btn.style.padding = "3.7%";
      btn.style.borderRadius = "999px";
      btn.style.border = "4px solid #ffd34d";
      btn.style.background = "linear-gradient(180deg,#ff4da2,#d90067)";
      btn.style.color = "#fff";
      btn.style.font = "900 clamp(15px,3vw,28px) Arial Black,Impact,sans-serif";
      btn.style.textShadow = "0 2px 0 #5b002c";
      btn.style.boxShadow = "0 6px 0 #66002f,0 0 18px rgba(255,35,139,.65)";
      btn.style.cursor = "pointer";
      btn.style.touchAction = "manipulation";

      let roadMapQueued = false;
      const queueRoadMap = e => {
        if (roadMapQueued) return;
        roadMapQueued = true;
        e.preventDefault();
        e.stopPropagation();
        btn.disabled = true;
        btn.textContent = "OPENING ROAD MAP…";
        runtimeScene.__wamGoMap = true;
      };
      btn.addEventListener("pointerup", queueRoadMap, {passive:false});
      btn.addEventListener("click", queueRoadMap, {passive:false});
      panel.appendChild(btn);
      shade.appendChild(panel);
    }

    const handbagKey = (r,c) => `${r},${c}`;

    function hasHandbag(r,c) {
      return st.level === 5 && st.handbags.has(handbagKey(r,c));
    }

    function matchValue(r,c) {
      return hasHandbag(r,c) ? null : st.board[r][c];
    }

    function damageHandbags(keys, announce=true) {
      let unlocked = 0;
      let cleared = 0;
      for (const key of new Set(keys)) {
        const state = st.handbags.get(key);
        if (state === 1) {
          st.handbags.set(key, 2);
          unlocked++;
        } else if (state === 2) {
          st.handbags.delete(key);
          cleared++;
          if (Object.prototype.hasOwnProperty.call(st.targets,"handbag")) {
            st.targets.handbag = Math.max(0, st.targets.handbag - 1);
          }
        }
      }
      const reward = unlocked * 25 + cleared * 50;
      if (reward) awardCoins(reward);
      if (cleared) recordDailyEvent("handbags", cleared);
      if (announce && cleared) showToast(`HANDBAG CLEARED!  +${reward}`, 1050);
      else if (announce && unlocked) showToast(`HANDBAG UNLOCKED!  +${reward}`, 1050);
      return unlocked + cleared;
    }

    function damageHandbagsNextTo(cells) {
      const keys = [];
      for (const cell of cells) {
        for (const [dr,dc] of [[-1,0],[1,0],[0,-1],[0,1]]) {
          const r = cell.r + dr;
          const c = cell.c + dc;
          if (r >= 0 && r < 8 && c >= 0 && c < 8 && hasHandbag(r,c)) {
            keys.push(handbagKey(r,c));
          }
        }
      }
      return damageHandbags(keys);
    }

    function hasMove() {
      const swapCreatesMatch = (r1,c1,r2,c2) => {
        if (hasHandbag(r1,c1) || hasHandbag(r2,c2)) return false;
        const a = st.board[r1][c1];
        const b = st.board[r2][c2];
        if (a === b) return false;

        st.board[r1][c1] = b;
        st.board[r2][c2] = a;

        const found = matches().length > 0;

        st.board[r1][c1] = a;
        st.board[r2][c2] = b;
        return found;
      };

      for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
          if (c < 7 && swapCreatesMatch(r,c,r,c+1)) return true;
          if (r < 7 && swapCreatesMatch(r,c,r+1,c)) return true;
        }
      }
      return false;
    }

    function makeBoard() {
      st.board = Array.from({length:8}, () => Array(8).fill(0));
      for (let r=0;r<8;r++) {
        for (let c=0;c<8;c++) {
          let v, tries=0;
          do {
            v = randomNormalPiece();
            tries++;
          } while (tries<30 &&
            ((c>=2 && st.board[r][c-1]===v && st.board[r][c-2]===v) ||
             (r>=2 && st.board[r-1][c]===v && st.board[r-2][c]===v) ||
             (r>=1 && c>=1 && st.board[r-1][c]===v &&
               st.board[r][c-1]===v && st.board[r-1][c-1]===v)));
          st.board[r][c] = v;
        }
      }
      st.handbags = st.level === 5
        ? new Map(LEVEL_5_HANDBAGS.map(([r,c]) => [handbagKey(r,c), 1]))
        : new Map();
      if (!hasMove()) makeBoard();
    }

    function swap(a,b) {
      const t=st.board[a.r][a.c];
      st.board[a.r][a.c]=st.board[b.r][b.c];
      st.board[b.r][b.c]=t;
    }

    function adjacent(a,b) {
      return Math.abs(a.r-b.r)+Math.abs(a.c-b.c)===1;
    }

    function randomNormalPiece() {
      // Disco is a special piece and never appears from normal random generation.
      return Math.floor(Math.random() * (PIECES.length - 1));
    }

    function squareGroups() {
      const groups = [];
      const discoIndex = PIECES.findIndex(piece => piece.key === "disco");

      for (let r=0; r<7; r++) {
        for (let c=0; c<7; c++) {
          const value = matchValue(r,c);
          if (value === null || value === discoIndex) continue;
          if (matchValue(r,c+1) === value &&
              matchValue(r+1,c) === value &&
              matchValue(r+1,c+1) === value) {
            groups.push([
              {r:r,c:c}, {r:r,c:c+1},
              {r:r+1,c:c}, {r:r+1,c:c+1}
            ]);
          }
        }
      }
      return groups;
    }

    function matches() {
      const found = new Map();

      const addCell = (r,c) => {
        found.set(`${r},${c}`, {r,c});
      };

      // HORIZONTAL: left to right across each row.
      for (let r = 0; r < 8; r++) {
        let c = 0;
        while (c < 8) {
          const value = matchValue(r,c);
          let end = c + 1;

          while (end < 8 && matchValue(r,end) === value) end++;

          if (value !== null && end - c >= 3) {
            for (let x = c; x < end; x++) addCell(r, x);
          }

          c = end;
        }
      }

      // VERTICAL: top to bottom down each column.
      // This covers matching upward or downward because the same
      // connected vertical line is detected regardless of swap direction.
      for (let c = 0; c < 8; c++) {
        let r = 0;
        while (r < 8) {
          const value = matchValue(r,c);
          let end = r + 1;

          while (end < 8 && matchValue(end,c) === value) end++;

          if (value !== null && end - r >= 3) {
            for (let y = r; y < end; y++) addCell(y, c);
          }

          r = end;
        }
      }

      // A 2 x 2 square of the same icon is also a valid match.
      // Its four cells are cleared and one becomes a Disco in resolve().
      squareGroups().forEach(group => {
        group.forEach(cell => addCell(cell.r, cell.c));
      });

      return [...found.values()];
    }

    function sixMatchGroups() {
      const groups = [];

      // Horizontal runs of 6 or more.
      for (let r = 0; r < 8; r++) {
        let c = 0;
        while (c < 8) {
          const value = matchValue(r,c);
          let end = c + 1;
          while (end < 8 && matchValue(r,end) === value) end++;
          if (value !== null && value !== PIECES.findIndex(p=>p.key==="disco") && end - c >= 6) {
            groups.push(Array.from({length:end-c}, (_,i)=>({r:r,c:c+i})));
          }
          c = end;
        }
      }

      // Vertical runs of 6 or more.
      for (let c = 0; c < 8; c++) {
        let r = 0;
        while (r < 8) {
          const value = matchValue(r,c);
          let end = r + 1;
          while (end < 8 && matchValue(end,c) === value) end++;
          if (value !== null && value !== PIECES.findIndex(p=>p.key==="disco") && end - r >= 6) {
            groups.push(Array.from({length:end-r}, (_,i)=>({r:r+i,c:c})));
          }
          r = end;
        }
      }

      return groups;
    }

    function applyTargets(cells) {
      for(const p of cells) {
        const v=st.board[p.r][p.c];
        const key = v === null ? null : PIECES[v].key;
        if(key && Object.prototype.hasOwnProperty.call(st.targets,key)) {
          st.targets[key]=Math.max(0,st.targets[key]-1);
        }
      }
    }

    async function settleColumns(columns=null) {
      const cols = columns && columns.length
        ? [...new Set(columns)]
        : [0,1,2,3,4,5,6,7];

      // Candy-Crush-style loop:
      // move pieces down one cell, draw it, then generate at the top.
      let safety = 0;
      while (safety++ < 30) {
        let moved = false;
        const stepMoves = [];

        // Move existing pieces down exactly one row where a blank is underneath.
        for (const c of cols) {
          for (let r = 7; r >= 1; r--) {
            if (st.board[r][c] === null && st.board[r-1][c] !== null) {
              st.board[r][c] = st.board[r-1][c];
              st.board[r-1][c] = null;
              stepMoves.push({c:c, to:r, distance:1});
              moved = true;
            }
          }
        }

        if (moved) {
          st.dropMoves = stepMoves;
          st.dropColumns = cols;
          st.dropAnimating = true;
          render();
          await new Promise(res => setTimeout(res, 105));
          st.dropAnimating = false;
          st.dropMoves = [];
          continue;
        }

        // Once pieces have slid as far as possible, generate one new piece
        // at the top of every affected column that still has a blank.
        const generated = [];
        for (const c of cols) {
          if (st.board[0][c] === null) {
            st.board[0][c] = randomNormalPiece();
            generated.push({c:c, to:0, distance:1});
            moved = true;
          }
        }

        if (generated.length) {
          st.dropMoves = generated;
          st.dropColumns = cols;
          st.dropAnimating = true;
          render();
          await new Promise(res => setTimeout(res, 105));
          st.dropAnimating = false;
          st.dropMoves = [];
          continue;
        }

        break;
      }

      st.dropColumns = [];
      st.dropMoves = [];
      st.dropAnimating = false;
      render();
    }

    function collapse(columns=null) {
      const cols=columns&&columns.length?[...new Set(columns)]:[0,1,2,3,4,5,6,7];
      const moves=[];
      for(const col of cols){
        let write=7;
        for(let r=7;r>=0;r--){
          if(st.board[r][col]!==null){
            const value=st.board[r][col];
            if(write!==r){
              st.board[write][col]=value;
              st.board[r][col]=null;
              moves.push({c:col,to:write,distance:write-r});
            }
            write--;
          }
        }
        const blanks=write+1;
        for(let r=write;r>=0;r--){
          st.board[r][col]=randomNormalPiece();
          moves.push({c:col,to:r,distance:Math.max(1,blanks)});
        }
      }
      return moves;
    }

    async function resolve(initial) {
      st.locked = true;
      st.combo = 0;
      let m = initial || matches();

      while (m.length) {
        st.combo++;
        playSound("match", .68, 1 + Math.min(.3, st.combo * .05));
        recordDailyEvent("matches", m.length);
        applyTargets(m);
        damageHandbagsNextTo(m);

        const bamIndex = PIECES.findIndex(piece => piece.key === "bam");
        const bamCount = m.reduce((count,p) =>
          count + (st.board[p.r][p.c] === bamIndex ? 1 : 0), 0);

        if (bamCount >= 3) {
          awardCoins(50);
          showThreeBamPopup();
        }

        if (st.combo >= 2) {
          const comboReward = st.combo * 10;
          awardCoins(comboReward);
          if (bamCount < 3) {
            showToast(`COMBO x${st.combo}  +${comboReward}`, 760);
          }
        }

        const squareMatches = squareGroups();
        const sixGroups = sixMatchGroups();
        const discoIndex = PIECES.findIndex(p => p.key === "disco");
        let discoSpawn = null;

        if (squareMatches.length) {
          const group = squareMatches[0];
          discoSpawn = group[group.length - 1];
          awardCoins(40);
          playSound("disco", .76, 1.05);
          showToast("2 x 2!  DISCO!  +40", 1050);
        } else if (sixGroups.length) {
          const group = sixGroups[0];
          discoSpawn = group[Math.floor(group.length / 2)];
        }

        // 1. Show the match popping.
        await animateMatched(m);

        // 2. Turn matched cells into blanks.
        const affectedColumns = [...new Set(m.map(p => p.c))];
        for (const p of m) st.board[p.r][p.c] = null;

        // A 2 x 2 square (or a 6+ run) leaves a Disco behind.
        if (discoSpawn) {
          st.board[discoSpawn.r][discoSpawn.c] = discoIndex;
          if (!squareMatches.length) showToast("DISCO!");
        }

        render();
        await new Promise(res => setTimeout(res, 70));

        // 3. Slide pieces down one row at a time.
        // 4. Generate new pieces from the top one row at a time.
        await settleColumns(affectedColumns);

        // 5. Check again for automatic cascades.
        m = matches();
        if (m.length) {
          await new Promise(res => setTimeout(res, 90));
        }
      }

      if (!hasMove()) {
        const vals = st.board.flat().sort(() => Math.random() - .5);
        for (let r=0;r<8;r++) {
          for (let c=0;c<8;c++) st.board[r][c] = vals[r*8+c];
        }
        showToast("RESHUFFLE!");
      }

      st.selected = null;
      st.locked = false;
      render();

      const won = Object.values(st.targets).every(value => value === 0);

      if (won) {
        setTimeout(() => showEndScreen(true), 220);
      } else if (st.moves <= 0) {
        setTimeout(() => showEndScreen(false), 220);
      }
    }

    async function tap(r,c) {
      if(st.locked || st.paused || st.ended) return;

      const discoIndex = PIECES.findIndex(p => p.key === "disco");
      const clickedValue = st.board[r][c];

      if (hasHandbag(r,c)) {
        if (st.booster === "hammer" && st.boosters.hammer > 0) {
          st.boosters.hammer--;
          st.booster = null;
          damageHandbags([handbagKey(r,c)]);
          render();
          const cascade = matches();
          if (cascade.length) await resolve(cascade);
          else if (Object.values(st.targets).every(value => value === 0)) {
            setTimeout(() => showEndScreen(true), 220);
          }
        } else {
          st.selected = null;
          showToast("MATCH NEXT TO THE HANDBAG", 780);
          render();
        }
        return;
      }

      // Disco special: choose the disco first, then swap/tap an adjacent icon.
      if (st.selected) {
        const firstValue = st.board[st.selected.r][st.selected.c];
        const adjacent =
          Math.abs(st.selected.r-r) + Math.abs(st.selected.c-c) === 1;

        if (adjacent && (firstValue === discoIndex || clickedValue === discoIndex)) {
          const targetValue = firstValue === discoIndex ? clickedValue : firstValue;

          if (targetValue !== discoIndex) {
            st.locked = true;
            st.moves = Math.max(0, st.moves - 1);

            const converted = [];
            for (let rr=0; rr<8; rr++) {
              for (let cc=0; cc<8; cc++) {
                if (!hasHandbag(rr,cc) && st.board[rr][cc] === targetValue) converted.push({r:rr,c:cc});
              }
            }

            const activeDisco = firstValue === discoIndex
              ? {r:st.selected.r,c:st.selected.c}
              : {r:r,c:c};
            const cleared = [...converted, activeDisco];

            // Count the original icon type toward the level targets first,
            // then visibly transform every matching icon into a Disco.
            applyTargets(cleared);
            damageHandbagsNextTo(cleared);
            for (const p of converted) st.board[p.r][p.c] = discoIndex;
            st.discoConverting = new Set(converted.map(p => `${p.r},${p.c}`));

            const conversionReward = converted.length * 10;
            awardCoins(conversionReward);
            showToast(
              `${PIECES[targetValue].key.toUpperCase()} → DISCOS!  +${conversionReward}`,
              1150
            );
            playSound("disco", .9, 1.12);
            render();
            await new Promise(res => setTimeout(res, 430));
            st.discoConverting.clear();
            await animateMatched(cleared);

            const affectedColumns = [...new Set(cleared.map(p=>p.c))];
            for (const p of cleared) st.board[p.r][p.c] = null;

            render();
            await new Promise(res => setTimeout(res,70));
            await settleColumns(affectedColumns);

            st.selected = null;
            st.locked = false;
            render();

            let cascade = matches();
            if (cascade.length) await resolve(cascade);
            return;
          }
        }
      }
      const cur={r,c};

      if (st.booster === "hammer") {
        if (st.boosters.hammer <= 0) return;
        st.boosters.hammer--;
        st.board[r][c] = null;
        st.booster = null;
        render();
        await settleColumns();
        await resolve(matches());
        return;
      }

      if (st.booster === "rocket") {
        if (st.boosters.rocket <= 0) return;
        st.boosters.rocket--;
        damageHandbags([
          ...Array.from({length:8},(_,i)=>handbagKey(r,i)),
          ...Array.from({length:8},(_,i)=>handbagKey(i,c))
        ]);
        for (let i=0;i<8;i++) {
          st.board[r][i] = null;
          st.board[i][c] = null;
        }
        st.booster = null;
        render();
        await settleColumns();
        await resolve(matches());
        return;
      }

      if (st.booster === "disco") {
        if (st.boosters.disco <= 0) return;
        st.boosters.disco--;
        const value = st.board[r][c];
        for (let rr=0;rr<8;rr++) {
          for (let cc=0;cc<8;cc++) {
            if (!hasHandbag(rr,cc) && st.board[rr][cc] === value) st.board[rr][cc] = null;
          }
        }
        st.booster = null;
        render();
        await settleColumns();
        await resolve(matches());
        return;
      }

      if(!st.selected) {
        st.selected=cur;
        render();
        return;
      }

      if(st.selected.r===r && st.selected.c===c) {
        st.selected=null;
        render();
        return;
      }

      if(!adjacent(st.selected,cur)) {
        st.selected=cur;
        render();
        return;
      }

      const a=st.selected;

      if (st.booster === "swap") {
        if (st.boosters.swap <= 0) return;
        st.boosters.swap--;
        await animateSwap(a,cur);
        swap(a,cur);
        st.selected = null;
        st.booster = null;
        render();
        await new Promise(r=>setTimeout(r,90));
        await resolve(matches());
        return;
      }

      await animateSwap(a,cur);
      swap(a,cur);
      const m=matches();

      if(!m.length) {
        // Show the invalid swap returning to its original position.
        render();
        await animateSwap(cur,a);
        swap(a,cur);
        st.selected=null;
        render();
        return;
      }

      st.moves--;
      st.selected=null;
      render();

      // Brief pause so the player sees the swapped icons in place before they pop.
      await new Promise(r=>setTimeout(r,90));
      await resolve(m);
    }

    function showMessage(text) {
      const shade=box(0,0,100,100);
      shade.style.background="rgba(0,0,0,.72)";
      shade.style.display="flex";
      shade.style.alignItems="center";
      shade.style.justifyContent="center";
      shade.style.pointerEvents="auto";

      const panel=document.createElement("div");
      panel.textContent=text;
      panel.style.width="76%";
      panel.style.padding="8% 4%";
      panel.style.borderRadius="28px";
      panel.style.background="linear-gradient(#ff3b86,#b5004f)";
      panel.style.border="5px solid #ffd15a";
      panel.style.color="#fff";
      panel.style.fontSize="clamp(32px,7vw,72px)";
      panel.style.fontWeight="900";
      panel.style.textAlign="center";
      panel.style.textShadow="3px 4px 0 #111";
      shade.appendChild(panel);
    }

    function render() {
      st.movesEl.textContent=st.moves;
      st.coinsEl.textContent=st.coins.toLocaleString();
      st.livesEl.textContent=st.lives;
      st.targetKeys.forEach(key => {
        if (st.targetEls[key]) st.targetEls[key].textContent = st.targets[key];
      });

      Object.keys(st.boosters).forEach(k => {
        if (st.boosterBadges[k]) st.boosterBadges[k].textContent = st.boosters[k];
        const hit = st[k+"Hit"];
        if (hit) {
          hit.style.filter = st.booster === k
            ? "drop-shadow(0 0 8px #fff) drop-shadow(0 0 12px #ff2a82)"
            : "none";
        }
      });

      board.innerHTML="";
      for(let r=0;r<8;r++) {
        for(let c=0;c<8;c++) {
          const b=document.createElement("button");
          b.type="button";
          b.style.margin="0";
          b.style.padding="0";
          b.style.border="0";
          b.style.borderRadius="10%";
          const pieceValue = st.board[r][c];
          const bagState = st.handbags.get(handbagKey(r,c));
          b.style.backgroundImage = bagState
            ? `url("${bagState === 1 ? "handbag_locked.png" : "handbag_open.png"}")`
            : pieceValue === null
              ? "none"
              : `url("${PIECES[pieceValue].img}")`;
          const pieceKey = pieceValue === null ? "" : PIECES[pieceValue].key;
          const iconFit = {
            heart: "108% 108%",
            star: "108% 108%",
            diamond: "96% 96%",
            cherries: "100% 100%",
            bam: "100% 100%",
            disco: "205% 116%"
          };
          b.style.backgroundSize = bagState
            ? (bagState === 1 ? "86% auto" : "82% auto")
            : iconFit[pieceKey] || "108% 108%";
          b.style.backgroundPosition="center center";
          b.style.backgroundRepeat="no-repeat";
          b.style.backgroundOrigin="content-box";
          b.style.backgroundClip="content-box";
          b.style.boxSizing="border-box";
          b.style.overflow="hidden";
          b.style.display="flex";
          b.style.alignItems="center";
          b.style.justifyContent="center";
          b.style.backgroundColor = st.board[r][c] === null
            ? "rgba(0,0,0,0)"
            : "transparent";
          b.style.width="100%";
          b.style.height="100%";
          b.style.cursor=bagState ? "default" : "pointer";
          b.style.transform=bagState ? "scale(.9)" : "scale(.78)";
          if (bagState) {
            b.setAttribute("aria-label", bagState === 1 ? "Locked handbag" : "Open handbag");
            b.style.filter = "drop-shadow(0 2px 2px rgba(0,0,0,.5))";
          }
          b.style.transformOrigin="center center";
          b.style.transition="transform 180ms ease, opacity 180ms ease";
          if (st.level === 4 && pieceValue !== null) {
            // Keep the frozen tint but avoid 64 live GPU filters. The old
            // per-piece filters caused Level 4 to stutter on Android emulators.
            b.style.backgroundColor = "rgba(219,250,255,.13)";
            b.style.border = "1px solid rgba(225,253,255,.34)";
          }
          if(pieceKey === "disco") {
            b.style.borderRadius = "50%";
            b.style.backgroundColor = "rgba(16,4,35,.88)";
            b.style.animation = "wamDiscoPulse 780ms ease-in-out infinite";
          }
          if(st.dropAnimating && Array.isArray(st.dropMoves)){
            const move=st.dropMoves.find(x=>x.c===c && x.to===r);
            if(move){
              b.style.setProperty("--wam-fall",`${Math.max(1,move.distance)*-105}%`);
              b.style.animation="wamDropExact 100ms linear both";
            }
          }
          if(st.discoConverting.has(`${r},${c}`)) {
            b.style.animation="wamDiscoConvert 420ms ease-in-out both";
          }
          b.style.boxShadow = st.selected && st.selected.r===r && st.selected.c===c
            ? "inset 0 0 0 4px #fff,0 0 12px #ffd93d"
            : "none";
          b.addEventListener("pointerdown", e => {
            e.preventDefault();
            e.stopPropagation();
            tap(r,c);
          });
          board.appendChild(b);
        }
      }
    }

    makeBoard();
    render();
  }

  const st=runtimeScene.__wam02;
  const canvas=document.querySelector("canvas");
  if(st && canvas) {
    const r=canvas.getBoundingClientRect();
    const targetAspect = 720 / 1280;

    let hostLeft = r.left;
    let hostTop = r.top;
    let hostW = r.width;
    let hostH = r.height;

    if (isMobileBuild) {
      // Cordova/iPhone fix: keep the ORIGINAL 720x1280 layout intact,
      // centre the whole game inside the real phone viewport, and hide
      // GDevelop's old canvas artwork underneath.
      hostLeft = 0;
      hostTop = 0;
      hostW = window.innerWidth || r.width;
      hostH = window.innerHeight || r.height;
      canvas.style.visibility = "hidden";
      if (canvas.parentElement) {
        canvas.parentElement.style.overflow = "hidden";
        canvas.parentElement.style.background = "transparent";
      }
    }

    let viewW = hostW;
    let viewH = hostH;

    // Mobile uses the real WebView bounds edge-to-edge. The artwork and all
    // percentage-based controls stretch together, so there are no black
    // gutters and Android's already-safe content viewport keeps the footer in.
    if (!isMobileBuild) {
      if ((hostW / hostH) > targetAspect) {
        viewH = hostH;
        viewW = viewH * targetAspect;
      } else {
        viewW = hostW;
        viewH = viewW / targetAspect;
      }
    }

    // Centre only on mobile. Desktop preview stays exactly as Alpha 6.9.3.
    if (isMobileBuild) {
      st.root.style.left = hostLeft + "px";
      st.root.style.top = hostTop + "px";
    } else {
      st.root.style.left = r.left + "px";
      st.root.style.top = r.top + "px";
    }
    st.root.style.width = viewW + "px";
    st.root.style.height = viewH + "px";

    document.documentElement.style.background = "#000";
    document.body.style.background = "#000";
    if (!isMobileBuild && canvas.parentElement) canvas.parentElement.style.background = "#000";
  }

  openIncomingCurtain();
})();
