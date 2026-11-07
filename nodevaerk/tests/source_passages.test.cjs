const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const E=require('../engine.js');
const L=require('../learning.js');
require('../repertoire.js');
require('../advanced.js');
const added=require('../source_passages.js');

const groups={
 'satie-gymno':7,
 'burgmuller-arabesque':3,
 'mozart-k2':6,
 'petzold-menuet':8,
 'beethoven-furelise':2,
 'chopin-prelude28-4':2,
 'mozart-turkish':2
};

test('Seven works have 30 separate public-domain excerpts and stable names',()=>{
 assert.equal(added.length,18);
 assert.equal(E.PIECES.length,64);
 assert.equal(new Set(E.PIECES.map(p=>p.id)).size,E.PIECES.length);
 for(const [workId,count] of Object.entries(groups)){
  const pieces=E.PIECES.filter(p=>p.workId===workId);
  assert.equal(pieces.length,count,workId);
  assert.ok(pieces.every(p=>p.workName&&p.collection==='klassisk'&&p.source?.license==='Public Domain'),workId);
 }
 const original=E.PIECES.slice(0,6);
 assert.deepEqual(original.map(p=>p.id),['morgentrin','vals','samtale','paa-vej','boelger','drejning']);
});

test('New passages have full measures and usable notes in both hands',()=>{
 for(const piece of added){
  assert.deepEqual(L.validateScore(piece),[],piece.id);
  assert.ok(piece.measures.length>=2&&piece.measures.length<=6,piece.id);
  const score=E.resolveScore(piece);
  for(const clef of ['treble','bass'])assert.ok(score.some(m=>m[clef].some(n=>!n.rest)),piece.id+' must use '+clef);
  for(const measure of score){
   assert.ok(['treble','bass'].some(clef=>measure[clef].some(n=>!n.rest)),piece.id+' has a silent measure');
   for(const clef of ['treble','bass']){
    const notes=measure[clef].filter(n=>!n.rest);
    for(const note of notes){
     const midi=note.tones.map(t=>t.midi);
     assert.deepEqual([...midi].sort((a,b)=>a-b),midi,piece.id+' chord order');
     assert.ok(midi.at(-1)-midi[0]<=12,piece.id+' one-hand span');
    }
   }
  }
  const play=L.studioPlaybackPlan(piece,'both',64,0,piece.measures.length);
  assert.ok(play.events.length>5,piece.id);
  assert.ok(play.events.every(e=>Number.isFinite(e.midi)&&e.startSeconds>=0&&e.durationSeconds>0),piece.id);
  assert.ok(play.events.every(e=>e.startSeconds+e.durationSeconds<=play.totalSeconds+1e-7),piece.id);
 }
});

test('Satie, Beethoven and Chopin samples preserve the critical accidentals',()=>{
 const get=id=>E.PIECES.find(p=>p.id===id);
 assert.equal(get('satie-gymno-t22-25').tonality,'Bm');
 assert.deepEqual(E.resolveScore(get('beethoven-furelise-t1-4'))[0].treble.map(n=>n.midi),[76,75,76,71,74,72]);
 assert.deepEqual(E.resolveScore(get('chopin-prelude28-4-t1-4'))[3].treble.map(n=>n.midi),[71,70]);
 assert.equal(E.resolveScore(get('chopin-prelude28-4-t5-8'))[4-1].treble.at(-1).midi,68);
});

test('The same work has multiple non-identical note passages',()=>{
 for(const workId of ['satie-gymno','petzold-menuet','mozart-k2','beethoven-furelise','chopin-prelude28-4','mozart-turkish']){
  const pieces=E.PIECES.filter(p=>p.workId===workId),melodies=pieces.map(p=>E.resolveScore(p).flatMap(m=>m.treble.flatMap(n=>n.rest?[]:n.tones.map(t=>t.midi))).join(','));
  assert.ok(new Set(melodies).size>1,workId);
 }
});

test('Für Elise plays at the right length and advances its 3/8 highlight every bar',()=>{
 const p=E.PIECES.find(x=>x.id==='beethoven-furelise-t1-4');
 const audio=L.studioPlaybackPlan(p,'both',60,0,p.measures.length);
 assert.equal(audio.barSeconds,1.5);
 assert.equal(audio.totalSeconds,6);
 assert.ok(audio.events.some(e=>e.startSeconds>=4.5));
 const studio=fs.readFileSync(path.join(__dirname,'../studio.js'),'utf8');
 assert.match(studio,/relatedPassagesMarkup\(p\)/);
 assert.match(studio,/id="catalog-work"/);
 assert.match(studio,/function workOptions\(/);
});

test('Mozarts Turkish March retains the characteristic note figures and two-beat bars',()=>{
 const p=E.PIECES.find(p=>p.id==='mozart-turkish-t1-4');
 assert.equal(p.key,'Am');assert.equal(p.time,'2/4');
 assert.deepEqual(E.resolveScore(p)[0].treble.filter(n=>!n.rest).map(n=>n.midi),[72,74,72,71,72]);
 const q=E.PIECES.find(p=>p.id==='mozart-turkish-t5-7');
 assert.deepEqual(E.resolveScore(q)[0].treble[1].tones.map(n=>n.midi),[78,81]);
 assert.equal(L.studioPlaybackPlan(p,'both',60,0,4).totalSeconds,8);
});

test('The new score module runs before app start and is available offline',()=>{
 const html=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');
 assert.ok(html.indexOf('advanced.js')<html.indexOf('source_passages.js'));
 assert.ok(html.indexOf('source_passages.js')<html.indexOf('app.js'));
 const cache=fs.readFileSync(path.join(__dirname,'../sw.js'),'utf8');
 assert.match(cache,/source_passages\.js/);
 for(const name of ['source_passages.js','studio.js','sw.js']){
  assert.doesNotThrow(()=>new vm.Script(fs.readFileSync(path.join(__dirname,'..',name),'utf8'),{filename:name}),name);
 }
 const app=fs.readFileSync(path.join(__dirname,'../app.js'),'utf8');
 assert.match(app,/nodevaerk\.progress\.v1/);
});
