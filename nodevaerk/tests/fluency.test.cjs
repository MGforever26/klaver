'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const source=fs.readFileSync(path.join(__dirname,'..','fluency.js'),'utf8');
function core(){
 const window={};
 vm.runInNewContext(source,{window,document:undefined});
 return window.NVFluency;
}
test('all 26 positions include both keys and the first ledger lines',()=>{
 const F=core();
 assert.equal(F.IDS.length,26);
 assert.equal(new Set(F.IDS).size,26);
 for(const clef of ['treble','bass'])for(let step=-2;step<=10;step++)assert.ok(F.IDS.includes(clef+':'+step));
});
test('all positions appear in every 30- or 50-note session',()=>{
 const F=core();
 for(const count of [30,50]){
  const ids=F.plan({deck:[],attempts:[]},count);
  assert.equal(ids.length,count);
  assert.equal(new Set(ids).size,26);
 }
});
test('short sessions rotate through the full range',()=>{
 const F=core(),state={deck:[],attempts:[]},found=new Set();
 for(let round=0;round<4;round++)for(const id of F.plan(state,10))found.add(id);
 assert.equal(found.size,26);
});
test('missed and slow positions receive extra weight',()=>{
 const F=core(),history=[
  {id:'treble:0',correct:false,ms:1200},
  {id:'treble:0',correct:true,ms:6500},
  {id:'bass:0',correct:true,ms:700}
 ];
 assert.ok(F.weight('treble:0',history)>F.weight('bass:0',history));
});
test('accuracy includes every first answer; median uses only correct answers',()=>{
 const F=core(),result=F.stats([
  {correct:true,ms:1000},{correct:false,ms:300},{correct:true,ms:2000}
 ]);
 assert.equal(result.total,3);
 assert.equal(result.correct,2);
 assert.equal(result.accuracy,67);
 assert.equal(result.medianMs,1500);
});
test('thirty practice answers never change regular totals, levels or groups',()=>{
 const hooks={},window={
  NV:{fromDiatonic(i){const letters=['C','D','E','F','G','A','B'];return {letter:letters[((i%7)+7)%7],octave:Math.floor(i/7),duration:'q'};}},
  addEventListener(){},scrollTo(){}
 };
 const doc={hidden:false,
  addEventListener(event,fn){(hooks[event]??=[]).push(fn);},
  getElementById(){return {addEventListener(){}};}
 };
 const app={
  querySelector(selector){
   if(selector==='.chips')return {querySelector(){return null;},insertAdjacentHTML(){}};
   if(selector==='main')return {appendChild(){}};
   return null;
  },querySelectorAll(){return [];}
 };
 const state={attempts:[{correct:true,ms:1000}],totals:{answered:42,correct:40},groups:11,
  skills:{treble:{level:3}},completedPieces:{},settings:{focus:'mixed'}};
 let html='',renderCount=0;
 const ctx={window,document:doc,state,save(){},home(){},progress(){},help(){},APP:app,
  shell(s){html=s;},page:'home',stopClock(){},stopAudio(){},icon(){return '';},
  esc(x){return String(x);},Notation:{render(element,score){assert.ok(score.measures[0].treble.length+score.measures[0].bass.length===1);renderCount++;}},
  performance:{now(){return 1111;}},openZoom(){},setTimeout(){return 1;},clearTimeout(){}};
 vm.runInNewContext(source,ctx);
 function action(name,value){
  const button={disabled:false,dataset:{action:name,value},closest(){return this;}};
  for(const handler of hooks.click)handler({target:button});
 }
 action('fluency-open');
 assert.ok(html.includes('Start 30 toner'));
 action('fluency-start');
 assert.equal(state.fluency.active.ids.length,30);
 for(const id of state.fluency.active.ids.slice()){
  const [clef,step]=id.split(':');
  const letter=window.NV.fromDiatonic((clef==='bass'?18:30)+Number(step)).letter;
  const expected=letter==='B'?'H':letter;
  const wrong=['C','D','E','F','G','A','H'].find(x=>x!==expected);
  action('fluency-answer',wrong);
  action('fluency-next');
 }
 assert.equal(state.fluency.active.phase,'summary');
 assert.equal(state.fluency.attempts.length,30);
 assert.equal(state.fluency.runs.length,1);
 assert.equal(state.attempts.length,1);
 assert.equal(state.totals.answered,42);
 assert.equal(state.totals.correct,40);
 assert.equal(state.groups,11);
 assert.equal(state.skills.treble.level,3);
 assert.equal(renderCount,60);
});
test('main app retains direct next-five navigation, and offline assets include fluency',()=>{
 const base=path.join(__dirname,'..');
 const app=fs.readFileSync(path.join(base,'app.js'),'utf8');
 const html=fs.readFileSync(path.join(base,'index.html'),'utf8');
 const sw=fs.readFileSync(path.join(base,'sw.js'),'utf8');
 assert.ok(app.includes('Næste fem opgaver'));
 assert.ok(html.includes('src="fluency.js"'));
 assert.ok(sw.includes("'./fluency.js'"));
});
