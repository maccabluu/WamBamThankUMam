import fs from "node:fs";
import path from "node:path";

const projectDirectory = path.resolve(process.argv[2] || ".");
const projectPath = path.join(projectDirectory, "Wam Bam Thank u Mam.json");
const project = JSON.parse(fs.readFileSync(projectPath, "utf8"));

const readInline = filename =>
  fs.readFileSync(path.join(projectDirectory, filename), "utf8")
    .replace(/\r\n/g, "\n")
    .replace(/\n$/, "")
    .split("\n");

const bootCode = readInline("boot-screen.inline.js");
const homeEffectsCode = readInline("home-effects.inline.js");
const mapCode = readInline("level-map-7.7.inline.js");
const gameCode = readInline("game-overlay.inline.js");
const settingsCode = readInline("settings-overlay-7.7.inline.js");

const getLayout = name => {
  const layout = project.layouts.find(candidate => candidate.name === name);
  if (!layout) throw new Error(`Missing layout: ${name}`);
  return layout;
};

const jsEvent = inlineCode => ({
  type: "BuiltinCommonInstructions::JsCode",
  inlineCode,
  parameterObjects: "",
  useStrict: true,
  eventsSheetExpanded: true
});

const home = getLayout("Untitled scene");
const homeBackground = home.objects.find(object => object.name === "NewSprite");
const homeFrame = homeBackground?.animations?.[0]?.directions?.[0]?.sprites?.[0];
if (!homeFrame) throw new Error("Missing Home background sprite frame");
homeFrame.image = "home_screen_v2.jpg";
home.events = home.events.filter(event =>
  !(event.type === "BuiltinCommonInstructions::JsCode" &&
    (event.inlineCode || []).some(line =>
      line.includes("wambam-blustudio-boot") || line.includes("wambam-home-effects")
    ))
);
home.events.unshift(jsEvent([...bootCode, "", ...homeEffectsCode]));

const levelMap = getLayout("Level Map");
levelMap.events = [jsEvent(mapCode)];

const game = getLayout("Game");
game.events = [jsEvent(gameCode)];

const settings = getLayout("Settings");
settings.events = [jsEvent(settingsCode)];

project.properties.version = "7.9.0";
project.properties.name = "Wam Bam";
project.properties.loadingScreen = {
  ...project.properties.loadingScreen,
  backgroundColor: 0,
  backgroundFadeInDuration: 0.1,
  backgroundImageResourceName: "",
  logoAndProgressFadeInDuration: 0.15,
  logoAndProgressLogoFadeInDelay: 0,
  minDuration: 0.1,
  progressBarColor: 4436223,
  progressBarHeight: 10,
  progressBarMaxWidth: 360,
  progressBarMinWidth: 120,
  progressBarWidthPercent: 56,
  showGDevelopSplash: false,
  showProgressBar: false
};

const resources = project.resources.resources;
if (!resources.some(resource => resource.name === "blustudio_boot.jpg")) {
  resources.push({
    alwaysLoaded: false,
    file: "blustudio_boot.jpg",
    kind: "image",
    metadata: "",
    name: "blustudio_boot.jpg",
    smoothed: true,
    userAdded: true
  });
}

if (!resources.some(resource => resource.name === "level_3_background.png")) {
  resources.push({
    alwaysLoaded: false,
    file: "level_3_background.png",
    kind: "image",
    metadata: "",
    name: "level_3_background.png",
    smoothed: true,
    userAdded: true
  });
}

if (!resources.some(resource => resource.name === "level_4_background.png")) {
  resources.push({
    alwaysLoaded: false,
    file: "level_4_background.png",
    kind: "image",
    metadata: "",
    name: "level_4_background.png",
    smoothed: true,
    userAdded: true
  });
}

const addResource = (name, kind="image") => {
  if (resources.some(resource => resource.name === name)) return;
  resources.push({
    alwaysLoaded: false,
    file: name,
    kind,
    metadata: "",
    name,
    smoothed: kind === "image",
    userAdded: true
  });
};

addResource("level_complete_popup_dynamic.png");
addResource("home_screen_v2.jpg");
addResource("road_map_candy_lounge_v2.png");
addResource("level_5_background.png");
addResource("handbag_locked.png");
addResource("handbag_open.png");
addResource("wam_bam_lounge_loop.mp3", "audio");
addResource("wam_match.mp3", "audio");
addResource("wam_coin.mp3", "audio");
addResource("wam_disco.mp3", "audio");

fs.writeFileSync(projectPath, JSON.stringify(project, null, 2) + "\n");
