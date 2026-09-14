const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

class ClassList {
  constructor() { this.values = new Set(); }
  toggle(name, force) { force ? this.values.add(name) : this.values.delete(name); }
  contains(name) { return this.values.has(name); }
}

class Element {
  constructor(tag = 'div') {
    this.tagName = tag.toUpperCase();
    this.children = [];
    this.parentNode = null;
    this.style = {};
    this.classList = new ClassList();
    this.attributes = {};
    this.onclick = null;
    this.id = '';
    this.className = '';
  }
  appendChild(child) { child.parentNode = this; this.children.push(child); return child; }
  remove() {
    if (!this.parentNode) return;
    this.parentNode.children = this.parentNode.children.filter(child => child !== this);
    this.parentNode = null;
  }
  setAttribute(name, value) { this.attributes[name] = String(value); }
  querySelector(selector) {
    const matches = node => selector[0] === '#' && node.id === selector.slice(1);
    const queue = [...this.children];
    while (queue.length) {
      const node = queue.shift();
      if (matches(node)) return node;
      queue.push(...node.children);
    }
    return null;
  }
}

const host = new Element();
host.id = 'wambam-home-effects';
const head = new Element('head');
const document = {
  head,
  createElement: tag => new Element(tag),
  getElementById(id) {
    if (id === host.id) return host;
    if (id === 'wam-home-111-style') return head.querySelector('#wam-home-111-style');
    return null;
  },
};
const transitions = [];
const context = {
  document,
  window: {
    WamCampaign: {
      TOTAL: 40,
      read: (_storage, _key, fallback) => fallback,
      write() {},
      progress: () => ({ selected: 1, stars: [], highest: 0 }),
      inventory: () => ({}),
      saveInventory() {},
    },
    WamUI: { storage: {} },
  },
  gdjs: { evtTools: { runtimeScene: {
    replaceScene: (runtime, scene, clear) => transitions.push({ runtime, scene, clear }),
    pushScene() {},
  } } },
  setTimeout,
};
context.globalThis = context;
vm.createContext(context);
vm.runInContext(fs.readFileSync(process.argv[2], 'utf8'), context);

const firstRuntime = { frame: 1 };
context.window.WamHome111.attachHome(firstRuntime);
const controls = host.querySelector('#wambam-home-111');
assert.ok(controls, 'home controls must mount');
assert.equal(controls.children.length, 9, 'all home controls must mount');
const play = controls.children.find(button => button.attributes['aria-label'] === 'Play');
assert.ok(play, 'PLAY control must exist');

// Model the next GDevelop frame. In 11.1.2 this detached the pending PLAY tap.
const secondRuntime = { frame: 2 };
context.window.WamHome111.attachHome(secondRuntime);
assert.strictEqual(host.querySelector('#wambam-home-111'), controls,
  'home controls must retain DOM identity between frames');
assert.strictEqual(play.parentNode, controls, 'PLAY must remain attached');

// Load the actual packaged engine, including its frame reset and scene tools.
const path = require('node:path');
const root = path.dirname(process.argv[2]);
context.gdjs.Logger = class { info() {} warn() {} error() {} };
context.gdjs.RuntimeInstanceContainer = class {};
context.gdjs.AsyncTask = class {};
context.Hashtable = { newFrom: x => x };
for(const name of ['runtimescene.js','events-tools/runtimescenetools.js','code0.js'])
  vm.runInContext(fs.readFileSync(path.join(root,name),'utf8'),context);
vm.runInContext(fs.readFileSync(path.join(root,'data.js'),'utf8'),context);
const G=context.gdjs;
for(const key of ['callbacksRuntimeScenePreEvents','callbacksRuntimeScenePostEvents'])G[key]=[];
const runtime=Object.create(G.RuntimeScene.prototype);
Object.assign(runtime,{
  _requestedChange:0,_profiler:null,
  _runtimeGame:{getMinimalFramerate:()=>20,getSceneAndExtensionsData:name=>G.projectData.layouts.find(x=>x.name===name)},
  _timeManager:{update(){}},_asyncTasksManager:{processTasks(){}},
  _updateObjectsPreEvents(){},_stepBehaviorsPostEvents(){},render(){},
  _eventsFunction:G.Untitled_32sceneCode.eventsList0
});
// Keep UI boot/rendering outside this engine scheduling test.
G.Untitled_32sceneCode.userFuncWamBoot=()=>{};
context.window.WamHome111.attachHome(runtime);
const click=button=>button.onclick({preventDefault(){},stopPropagation(){}});
// Prove the old direct request is lost in the real engine frame.
G.evtTools.runtimeScene.replaceScene(runtime,'Level Map',false);
assert.equal(runtime.getRequestedChange(),G.SceneChangeRequest.REPLACE_SCENE);
runtime.renderAndStep(16);
assert.equal(runtime.getRequestedChange(),G.SceneChangeRequest.CONTINUE,'old direct DOM navigation is erased');
click(play);
runtime.renderAndStep(16);
assert.equal(runtime.getRequestedChange(),G.SceneChangeRequest.REPLACE_SCENE);
assert.equal(runtime.getRequestedScene(),'Level Map');
const settings=controls.children.find(b=>b.attributes['aria-label']==='Settings');
click(settings);
runtime.renderAndStep(16);
assert.equal(runtime.getRequestedChange(),G.SceneChangeRequest.PUSH_SCENE);
assert.equal(runtime.getRequestedScene(),'Settings');

context.window.WamHome111.setBlocked(true);
assert.ok(controls.classList.contains('wam111-blocked'), 'Wam World must block home hitboxes');
click(play);click(settings);
runtime.renderAndStep(16);
assert.equal(runtime.getRequestedChange(),G.SceneChangeRequest.CONTINUE,'overlay blocks both controls');
context.window.WamHome111.setBlocked(false);
click(play);runtime.renderAndStep(16);
assert.equal(runtime.getRequestedScene(),'Level Map');
assert.equal(runtime.getRequestedChange(),G.SceneChangeRequest.REPLACE_SCENE);

console.log('Actual packaged engine: reproduced erased direct request; queued PLAY and Settings survive frame reset; overlay blocks both and navigation resumes after close.');
