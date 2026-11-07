const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');
const E=require('../engine.js'),C=require('../curriculum.js'),L=require('../learning.js');

const names=['C','G','F','D','Bb','A','Eb','E','Ab','B','Db','F#',
 'Am','Em','Dm','Bm','Gm','F#m','Cm','C#m','Fm','G#m','Bbm','D#m'];

test('All 24 major/relative minor keys are known and named in Danish',()=>{
 assert.equal(C.TONALITIES.length,24);
 assert.deepEqual(new Set(C.TONALITIES.map(x=>x.id)),new Set(names));
 for(const t of C.TONALITIES){
  assert.ok(E.KEYS[t.key],t.id);
  assert.ok(E.KEY_NAMES[t.id],t.id);
  const n=E.parse(t.tonic+'4'),resolved=E.resolveMeasure([n],t.key)[0];
  assert.ok(Number.isFinite(resolved.midi),t.id);
 }
 const fis=E.resolveMeasure([E.parse('E4'),E.parse('F4')],'F#');
 assert.deepEqual(fis.map(n=>n.name),['Eis','Fis']);
 const bes=E.resolveMeasure([E.parse('B3')],'Db');
 assert.equal(bes[0].name,'B');
});

test('Levels introduce a widening key pool and level 3 covers all 24',()=>{
 assert.equal(C.tonePool(1).length,6);
 assert.equal(C.tonePool(2).length,14);
 assert.equal(C.tonePool(3).length,24);
 assert.equal(C.tonePool(4).length,24);
 for(let l=1;l<=4;l++)for(let i=0;i<C.tonePool(l).length;i++)
  assert.equal(C.tonalityFor(l,i).id,C.tonePool(l)[i].id);
});

test('Whole bars in every tonality: correct key signatures and answer reconstruction',()=>{
 for(let i=0;i<24;i++)for(const lvl of [3,4]){
  const tone=C.TONALITIES[i],r=E.rng(i*61+lvl);
  const score=C.buildScore(lvl,r,'treble',2,true,tone.id);
  assert.equal(score.key,tone.key);
  assert.equal(score.tonality,tone.id);
  assert.deepEqual(E.validateScore(score),[],tone.id);
  for(const [clef,q] of [['treble',L.melodyQuestion(lvl,E.rng(i*31+lvl),'passage','treble',tone.id)],['bass',L.melodyQuestion(lvl,E.rng(i*29+lvl),'passage','bass',tone.id)]]){
   assert.equal(q.score.tonality,tone.id);
   const expected=E.resolveScore(q.score).flatMap(m=>m[clef].filter(n=>!n.rest&&!n.tied).flatMap(n=>n.tones.map(p=>p.id)));
   assert.deepEqual(q.expectedTokens,expected,tone.id+' '+clef);
  }
 }
});

test('Different exercise types retain accurate notes in all tone signatures',()=>{
 for(const tone of C.TONALITIES)for(const skill of ['treble','bass','accidental','rhythm','passage']){
  const q=C.question(skill,4,E.rng(tone.difficulty*251+skill.length*61+(tone.mode==='major'?0:1)),tone.id);
  assert.equal(q.score.tonality,tone.id,tone.id+' '+skill);
  assert.deepEqual(E.validateScore(q.score),[],tone.id+' '+skill);
  if(q.type==='pitch')assert.equal(q.answer,E.targetNote(q).id,tone.id+' '+skill);
  if(q.options)assert.equal(q.options.find(o=>o.value===q.answer)?.label,q.answerLabel);
 }
});

test('Mixed and focused progression visits every tonality instead of repeating four keys',()=>{
 for(const focus of ['mixed','passage','treble','bass','chords']){
  const s=E.newState();Object.values(s.skills).forEach(k=>k.level=3);const seen=new Set();
  for(let group=0;group<24;group++){
   s.groups=group;
   const qs=L.group(s,focus,group*193+41);
   assert.equal(qs.length,5,focus+' '+group);
   for(const q of qs){assert.deepEqual(E.validateScore(q.score),[],focus+' '+group);if(q.score.tonality)seen.add(q.score.tonality);}
  }
  assert.equal(seen.size,24,focus+': '+[...seen].join(','));
 }
});

test('Existing state is not reset and key coverage is tracked only when known',()=>{
 const s=E.newState();s.skills.treble.level=3;s.groups=13;
 s.attempts=[{skill:'bass',correct:true,ms:2300,level:2}];
 s.totals={answered:1,correct:1};
 s.learning={version:3,reviews:{},practice:[],introducedAt:1};
 const copy=JSON.stringify(s);
 L.migrate(s);
 assert.equal(s.skills.treble.level,3);
 assert.equal(s.totals.answered,1);
 assert.deepEqual(s.attempts,[{skill:'bass',correct:true,ms:2300,level:2}]);
 assert.equal(L.keyCoverage(s).count,0);
 const q=L.melodyQuestion(3,E.rng(123),'passage','treble','F#m');
 E.record(s,q,q.answer,3000);
 assert.equal(L.keyCoverage(s).count,1);
 assert.equal(s.attempts[1].tonality,'F#m');
 assert.equal(s.totals.answered,2);
 assert.ok(E.validState(JSON.parse(JSON.stringify(s))));
});

test('Promotion readiness uses the same rolling 10 answers as the level engine',()=>{
 const s=E.newState();s.skills.bass.level=3;
 const q=C.question('bass',3,E.rng(22),'Cm');
 for(let i=0;i<10;i++)E.record(s,q,i<2?'wrong':q.answer,1100,i);
 const p=L.readiness(s,'bass');
 assert.equal(p.level,3);assert.equal(p.answered,10);assert.equal(p.correct,8);
 assert.equal(p.missing,1);assert.equal(p.answerProgress,100);
 assert.ok(p.status.includes('mindst 9'));
 E.record(s,q,q.answer,1100,11);
 assert.equal(s.skills.bass.level,4);
 assert.equal(L.readiness(s,'bass').complete,false);assert.equal(L.readiness(s,'bass').maxLevel,8);
 assert.equal(s.totals.answered,11);
});

test('Practice path recommends measurable next steps without overwriting state',()=>{
 const s=E.newState();L.migrate(s);
 const first=L.nextGuidance(s,[],Date.UTC(2026,10,7,12));
 assert.equal(first.focus,'mixed');assert.equal(first.status.foundation,false);
 L.markRoute(s,'group',Date.UTC(2026,10,7,12));
 const second=L.nextGuidance(s,[],Date.UTC(2026,10,7,12));
 assert.equal(second.focus,'passage');
 L.markRoute(s,'bars',Date.UTC(2026,10,7,12));
 const third=L.nextGuidance(s,[],Date.UTC(2026,10,7,12));
 assert.equal(third.kind,'studio');
 assert.ok(E.validState(JSON.parse(JSON.stringify(s))));
});

test('All shipped browser source files parse and retain the same storage key',()=>{
 const scripts=['engine.js','curriculum.js','learning.js','repertoire.js','notation.js','app.js','studio.js','sw.js'];
 for(const filename of scripts){const content=fs.readFileSync(path.resolve(__dirname,'..',filename),'utf8');assert.doesNotThrow(()=>new vm.Script(content,{filename}),filename);}
 const app=fs.readFileSync(path.resolve(__dirname,'../app.js'),'utf8');
 assert.match(app,/nodevaerk\.progress\.v1/);
 assert.match(app,/levelProgressMarkup/);
 assert.match(app,/progress-from-summary/);
 const sw=fs.readFileSync(path.resolve(__dirname,'../sw.js'),'utf8');
 assert.match(sw,/curriculum\.js/);assert.match(sw,/learning\.js/);
});

test('Every introduced printed key signature is accepted by the notation engine',()=>{
 const VF=require('vexflow').Flow;
 for(const t of C.TONALITIES){
  for(const clef of ['treble','bass']){
   const stave=new VF.Stave(0,0,550).addClef(clef);
   assert.doesNotThrow(()=>stave.addKeySignature(t.key),t.id+' '+clef);
   assert.ok(stave.getNoteStartX()>0,t.id+' '+clef);
  }
 }
});
