const test=require('node:test'),assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const E=require('../engine.js'),C=require('../curriculum.js'),L=require('../learning.js');
const advanced=require('../advanced.js');

test('Legacy v1/v3 state remains readable, and levels 5 to 8 promote without resetting data',()=>{
 assert.equal(E.MAX_LEVEL,8);const s=E.newState();s.skills.bass.level=4;
 s.totals={answered:37,correct:34};s.attempts=[{id:'old',skill:'treble',level:3,correct:true,ms:1400}];
 s.learning={version:3,reviews:{},practice:[{pieceId:'known',rating:'flow'}],introducedAt:1};
 const old=JSON.stringify({attempts:s.attempts,totals:s.totals,practice:s.learning.practice});
 for(let level=4;level<=7;level++){
  const q=L.question('bass',level,E.rng(level*333));
  assert.ok(q.type==='pitch'||q.type==='sequence'||q.type==='choice',q.type);
  for(let i=0;i<10;i++)E.record(s,q,q.answer,1300,1000+level*50+i);
  assert.equal(s.skills.bass.level,level+1,'promotion from '+level);
 }
 assert.equal(s.skills.bass.level,8);
 assert.ok(E.validState(JSON.parse(JSON.stringify(s))));
 assert.deepEqual(s.attempts[0],JSON.parse(old).attempts[0]);
 assert.deepEqual(s.learning.practice[0],JSON.parse(old).practice[0]);
 assert.equal(s.totals.answered,77);
 assert.equal(s.totals.correct,74);
 const q=L.question('bass',8,E.rng(401));for(let i=0;i<12;i++)E.record(s,q,q.answer,900,2000+i);
 assert.equal(s.skills.bass.level,8);
 assert.equal(L.readiness(s,'bass').complete,true);
});

test('High-level music challenges use more measures, subdivisions and wider ranges',()=>{
 for(let level=5;level<=8;level++){
  const count=level>=8?6:level>=7?5:level>=6?4:3;
  for(let i=0;i<100;i++){
   const q=L.melodyQuestion(level,E.rng(i*101+level),'passage',i%2?'bass':'treble');
   assert.equal(q.score.measures.length,count);
   assert.equal(q.groups.length,2,'two answer bars');
   assert.equal(q.groups[0].measure,count-2);
   assert.equal(q.groups[1].measure,count-1);
   assert.equal(q.expectedTokens.length,JSON.parse(q.answer).length);
   assert.deepEqual(E.validateScore(q.score),[]);
  }
  const used=new Set();for(let i=0;i<100;i++)for(const m of C.buildScore(level,E.rng(i*37+level),'treble',2).measures)for(const n of m.treble)used.add(n.duration);
  assert.ok(used.has('16'),'level '+level+' should include sixteenth notes');
 }
 const q=C.together(8,E.rng(812));assert.equal(q.score.measures.length,3);assert.deepEqual(E.validateScore(q.score),[]);
});

test('All skills generate valid questions at every advanced level',()=>{
 for(let seed=0;seed<18000;seed++){
  const level=5+Math.floor(seed/6)%4;
  const skill=['treble','bass','accidental','rhythm','interval','passage'][seed%6];
  const q=L.question(skill,level,E.rng(seed*113+17),C.TONALITIES[seed%24].id);
  assert.equal(q.level,level,skill+seed);
  assert.deepEqual(L.validateScore(q.score),[],skill+' seed='+seed);
  if(q.type==='sequence'){
   assert.ok(q.expectedTokens.length>0);
   assert.deepEqual(JSON.parse(q.answer),q.expectedTokens);
  }else if(q.type==='pitch'){
   assert.equal(q.answer,E.targetNote(q).id);
  }else if(q.options){
   assert.equal(q.options.filter(o=>o.value===q.answer).length,1);
  }
 }
});

test('Four new advanced scores are original, fully formed and readable by both hands',()=>{
 assert.equal(advanced.length,4);
 for(const [i,p]of advanced.entries()){
  assert.equal(p.level,i+5);
  assert.ok(p.measures.length>=6);
  assert.equal(p.source.license,'CC0');
  assert.deepEqual(L.validateScore(p),[],p.id);
  const resolved=E.resolveScore(p);
  for(const clef of ['treble','bass'])assert.ok(resolved.every(m=>m[clef].some(n=>!n.rest)),p.id+' '+clef);
  const sq=L.sequenceQuestion(p,'treble','passage',p.level,[p.measures.length-2,p.measures.length-1]);
  assert.ok(sq.expectedTokens.length>3);
 }
});

test('Two-bar tapping calculates onsets through both measures and grades every note',()=>{
 const q=L.tapQuestion(8,E.rng(84));
 assert.equal(q.score.measures.length,2);
 assert.deepEqual(E.validateScore(q.score),[]);
 const targets=L.tapTargets(q),barBeats=L.pulseInfo(q.score.time).beats;
 assert.ok(targets.some(t=>t>=barBeats),'second bar must be included');
 const unit=60000/q.tempo/L.pulseInfo(q.score.time).pulse;
 const taps=targets.map(t=>t*unit);
 assert.equal(L.gradeTaps(q,taps,q.tempo).correct,true);
 assert.equal(L.gradeTaps(q,taps.slice(0,-1),q.tempo).correct,false);
});

test('Speed-vs-accuracy trend identifies a faster but less accurate period',()=>{
 const s=E.newState();s.skills.treble.level=3;
 const baseline=Array.from({length:8},(_,i)=>({skill:'treble',kind:'pitch',level:3,correct:true,ms:5300,equivalentMs:5300,at:i}));
 const recent=Array.from({length:8},(_,i)=>({skill:'treble',kind:'pitch',level:3,correct:i<6,ms:2300,equivalentMs:2300,at:i+8}));
 s.attempts=[...baseline,...recent];let tr=L.performanceTrends(s);
 assert.equal(tr.length,1);
 assert.equal(tr[0].category,'tradeoff');
 assert.equal(tr[0].earlyCorrect,8);assert.equal(tr[0].lateCorrect,6);
 assert.equal(tr[0].earlyMs,5300);assert.equal(tr[0].lateMs,2300);
 assert.match(tr[0].message,/flere fejl/);
});

test('Trends distinguish real comparable samples and hide premature speed claims',()=>{
 const s=E.newState();s.skills.bass.level=5;
 s.attempts=[...Array.from({length:12},(_,i)=>({skill:'bass',kind:'pitch',level:5,correct:true,ms:4000,equivalentMs:4000,at:i})),
 ...Array.from({length:12},(_,i)=>({skill:'bass',kind:'sequence',level:5,correct:true,ms:50000,equivalentMs:4000,at:100+i}))];
 assert.deepEqual(L.performanceTrends(s),[],'different tasks are not a 24-answer sample');
 s.attempts.push(...Array.from({length:8},(_,i)=>({skill:'bass',kind:'pitch',level:4,correct:true,ms:2000,equivalentMs:2000,at:200+i})));
 assert.deepEqual(L.performanceTrends(s),[],'different levels are not compared');
 s.attempts.push(...Array.from({length:4},(_,i)=>({skill:'bass',kind:'pitch',level:5,correct:true,ms:2500,equivalentMs:2500,at:300+i})));
 const trend=L.performanceTrends(s);assert.equal(trend.length,1);
 assert.equal(trend[0].kind,'pitch');assert.equal(trend[0].level,5);
 assert.equal(trend[0].category,'speed');
});

test('Syntax, scripts and offline assets are correct and storage version is unchanged',()=>{
 const files=['engine.js','curriculum.js','learning.js','repertoire.js','advanced.js','notation.js','app.js','studio.js','sw.js'];
 for(const name of files)assert.doesNotThrow(()=>new vm.Script(fs.readFileSync(path.join(__dirname,'..',name),'utf8'),{filename:name}));
 const html=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');
 assert.ok(html.indexOf('repertoire.js')<html.indexOf('advanced.js'));
 assert.ok(html.indexOf('advanced.js')<html.indexOf('app.js'));
 const sw=fs.readFileSync(path.join(__dirname,'../sw.js'),'utf8');assert.match(sw,/advanced\.js/);
 const app=fs.readFileSync(path.join(__dirname,'../app.js'),'utf8');assert.match(app,/nodevaerk\.progress\.v1/);
 const s=E.newState();assert.equal(s.version,1);
 assert.ok(E.validState(s));
});
