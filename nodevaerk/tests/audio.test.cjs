const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const E=require('../engine.js');
const L=require('../learning.js');
require('../repertoire.js');
require('../advanced.js');

function near(actual,expected,label){assert.ok(Math.abs(actual-expected)<1e-8,label+': '+actual+' vs '+expected);}

test('Play starts notes immediately with no metronome or count-in in 4/4',()=>{
 const piece=E.PIECES.find(p=>p.id==='morgentrin');
 const plan=L.studioPlaybackPlan(piece,'both',60,0,2);
 assert.ok(plan.events.length>3);
 assert.equal(plan.events[0].startSeconds,0);
 assert.equal(plan.events.some(e=>e.clef==='treble'),true);
 assert.equal(plan.events.some(e=>e.clef==='bass'),true);
 assert.equal(plan.barSeconds,4);
 assert.equal(plan.totalSeconds,8);
 assert.equal(Object.hasOwn(plan,'countInSeconds'),false);
 const top=L.studioPlaybackPlan(piece,'treble',60,0,2);
 assert.ok(top.events.every(e=>e.clef==='treble'));
 const low=L.studioPlaybackPlan(piece,'bass',60,0,2);
 assert.ok(low.events.every(e=>e.clef==='bass'));
});

test('Selected measure segment uses the correct starting note and duration',()=>{
 const piece=E.PIECES.find(p=>p.id==='vals');
 const first=L.studioPlaybackPlan(piece,'both',70,0,1);
 const second=L.studioPlaybackPlan(piece,'both',70,1,2);
 const timeline=L.timeline(piece,'both',1,2);
 assert.deepEqual(second.events.map(e=>e.midi),timeline.events.map(e=>e.midi));
 near(second.events[0].startSeconds,0,'start of selection');
 near(second.totalSeconds,3*60/70,'3/4 measure');
 assert.notDeepEqual(first.events.map(e=>e.midi),second.events.map(e=>e.midi));
});

test('6/8 and 12/8 playback uses dotted-quarter BPM and the correct total duration',()=>{
 for(const meter of ['6/8','12/8']){
  const piece=E.PIECES.find(p=>p.time===meter);
  assert.ok(piece,meter);
  const info=L.pulseInfo(meter);
  const bpm=48,start=0,end=2;
  const plan=L.studioPlaybackPlan(piece,'both',bpm,start,end);
  const pulse=60/bpm;
  near(plan.barSeconds,info.pulses*pulse,meter+' bar seconds');
  near(plan.totalSeconds,2*info.pulses*pulse,meter+' playback duration');
  assert.ok(plan.events.every(e=>e.startSeconds>=0&&e.startSeconds<plan.totalSeconds),meter);
  assert.ok(plan.events.every(e=>Number.isFinite(e.midi)&&e.durationSeconds>0),meter);
 }
});

test('Chord voices are scheduled together and stop at a finite time',()=>{
 const p=E.PIECES.find(p=>p.id==='v8-modstrom-i-fis');
 assert.ok(p);
 const plan=L.studioPlaybackPlan(p,'bass',64,0,2);
 assert.ok(plan.events.filter(e=>e.startSeconds===0).length>=2);
 assert.ok(plan.events.length>6);
 assert.ok(plan.events.every(e=>e.startSeconds+e.durationSeconds<=plan.totalSeconds+.000001));
});

test('Invalid playback selections fail explicitly',()=>{
 const p=E.PIECES[0];
 for(const args of [['both',0,0,1],['both',60,2,2],['both',60,-1,1],['both',60,0,999],['broken',60,0,1]]){
  assert.throws(()=>L.studioPlaybackPlan(p,...args));
 }
});

test('The visible Play button starts musical notes, not a click track',()=>{
 const studio=fs.readFileSync(path.resolve(__dirname,'../studio.js'),'utf8');
 const fn=studio.slice(studio.indexOf('async function runStudio(){'),studio.indexOf('progress=function(){'));
 assert.ok(fn.includes('L.studioPlaybackPlan('));
 assert.ok(fn.includes('sound(event.midi,'));
 assert.ok(!fn.includes('scheduleClicks('));
 assert.match(studio,/Afspil valgte takter/);
 assert.ok(!studio.includes('Optælling og puls</button>'));
 assert.match(studio,/data-action="studio-stop"/);
 const index=fs.readFileSync(path.resolve(__dirname,'../index.html'),'utf8');
 assert.ok(index.indexOf('learning.js')<index.indexOf('studio.js'));
});

test('Audio fix does not change saved user progress identity',()=>{
 const app=fs.readFileSync(path.resolve(__dirname,'../app.js'),'utf8');
 assert.match(app,/nodevaerk\.progress\.v1/);
 const state=E.newState();state.skills.treble.level=4;state.totals.answered=19;
 assert.ok(E.validState(JSON.parse(JSON.stringify(state))));
 assert.equal(JSON.parse(JSON.stringify(state)).skills.treble.level,4);
});
