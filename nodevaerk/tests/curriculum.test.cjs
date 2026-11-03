const test=require('node:test');
const assert=require('node:assert/strict');
const E=require('../engine.js');
const C=require('../curriculum.js');

const total=(arr)=>arr.reduce((x,n)=>x+E.beats(n),0);
const fromChoice=q=>q.options.find(o=>o.value===q.answer)?.label;

test('All five meters have valid patterns at every teaching tier',()=>{
 assert.deepEqual(C.METERS,['2/4','3/4','4/4','6/8','12/8']);
 for(const [meter,tiers] of Object.entries(C.PATTERNS)){
  assert.equal(tiers.length,3,meter);
  const [top,bottom]=meter.split('/').map(Number);
  for(const [tier,patterns] of tiers.entries()){
   assert.ok(patterns.length>0,meter+' tier '+tier);
   for(const p of patterns){const units=p.reduce((n,d)=>{
    const dots=d.endsWith('d')?1:0;
    return n+E.beats({duration:d.replace('d',''),dots});
   },0);
   assert.equal(units,4*top/bottom,meter+': '+p.join(' '));}
  }
 }
});
test('12/8 is four dotted-quarter pulses with 12 eighth-note positions',()=>{
 assert.equal(C.momentLabel(0,'12/8'),'1');
 assert.equal(C.momentLabel(1.5,'12/8'),'4');
 assert.equal(C.momentLabel(3,'12/8'),'7');
 assert.equal(C.momentLabel(4.5,'12/8'),'10');
 assert.equal(C.momentLabel(5.5,'12/8'),'12');
 assert.equal(C.momentLabel(1.5,'6/8'),'4');
 for(let i=0;i<60;i++){
  const s=C.buildScore(4,()=>.99,'treble',2,true);
  assert.equal(s.time,'12/8');
  assert.deepEqual(E.validateScore(s),[]);
  for(const m of s.measures){assert.equal(total(m.treble),6);assert.equal(total(m.bass),6);}
 }
});
test('12/8 supports bar pitch reading, rhythm counting and both hands',()=>{
 for(const mk of [C.barNotes,C.rhythmBar,C.together]){
  for(let seed=0;seed<40;seed++){
   const q=mk(4,()=>.99);
   assert.equal(q.score.time,'12/8');
   assert.deepEqual(E.validateScore(q.score),[]);
   assert.equal(q.options.length,4);
   assert.equal(fromChoice(q),q.answerLabel);
  }
 }
});
test('New whole-bar questions have correct independently derived answers',()=>{
 for(let seed=0;seed<1800;seed++){
  const rng=E.rng(seed*53+1);
  const level=1+seed%4;
  const q=C.barNotes(level,rng);
  const m=q.score.measures.length-1;
  const clef=q.prompt.includes('højre')?'treble':'bass';
  const expected=E.resolveScore(q.score)[m][clef].filter(n=>!n.rest).map(n=>n.name).join(' · ');
  assert.equal(q.answerLabel,expected);
  assert.equal(fromChoice(q),expected);
  assert.deepEqual(E.validateScore(q.score),[],String(seed));
 }
});
test('New rhythms equal durations preceding the highlighted note',()=>{
 for(let seed=0;seed<1800;seed++){
  const q=C.rhythmBar(seed%4+1,E.rng(seed*19+3)),m=q.target.measure;
  const clef=q.target.clef,index=q.target.index;
  const onset=q.score.measures[m][clef].slice(0,index).reduce((v,n)=>v+E.beats(n),0);
  assert.equal(q.answerLabel,C.momentLabel(onset,q.score.time),String(seed));
  assert.equal(fromChoice(q),q.answerLabel);
  assert.deepEqual(E.validateScore(q.score),[],String(seed));
 }
});
test('New together questions match simultaneous fresh attacks',()=>{
 for(let seed=0;seed<1200;seed++){
  const q=C.together(seed%4+1,E.rng(seed*11+5));
  const m=q.score.measures[0];
  const xs=C.noteOnsets(m.treble).map(x=>x.at);
  const ys=C.noteOnsets(m.bass).map(x=>x.at);
  const expected=ys.filter(y=>xs.some(x=>Math.abs(x-y)<.00001)).map(t=>C.momentLabel(t,q.score.time)).join(' og ');
  assert.equal(q.answerLabel,expected,String(seed));
  assert.equal(fromChoice(q),expected,String(seed));
  assert.deepEqual(E.validateScore(q.score),[],String(seed));
 }
});
test('Blended training contains a full-bar task without losing other core areas',()=>{
 const state=E.newState();
 for(let i=0;i<100;i++){
  state.groups=i;
  const g=E.group(state,'mixed',i+5);
  assert.equal(g.length,5);
  assert.ok(g.some(q=>q.skill==='passage'&&['bar-notes','two-hands'].includes(q.kind)));
  assert.ok(g.some(q=>q.skill==='rhythm'&&q.kind==='bar-rhythm'));
  assert.ok(g.some(q=>q.skill==='treble'));
  assert.ok(g.some(q=>q.skill==='bass'));
 }
});
test('All focused modes generate 5 valid questions and 12/8 appears in level 4',()=>{
 const domains=['treble','bass','accidental','rhythm','interval','passage'];
 for(const focus of domains){
  const state=E.newState();state.skills[focus].level=4;
  const times=new Set();
  for(let i=0;i<100;i++){
   const g=E.group(state,focus,i+3);
   assert.equal(g.length,5);
   for(const q of g){assert.equal(q.skill,focus);assert.deepEqual(E.validateScore(q.score),[],focus);if(q.score.time)times.add(q.score.time);}
  }
  if(focus==='rhythm'||focus==='passage')assert.ok(times.has('12/8'),focus);
 }
});
test('Niveautjek returns 18 questions and preserves existing attempts',()=>{
 const state=E.newState();
 const earlier=E.question('bass',1,E.rng(12));E.record(state,earlier,earlier.answer,1100,1);
 const oldTotal=state.totals.answered;
 const diagnostic=C.assessment(state,55);
 assert.equal(diagnostic.length,18);
 assert.ok(diagnostic.every(q=>q.diagnostic));
 const session={kind:'assessment',questions:diagnostic,results:[],index:18};
 for(const q of diagnostic){const result=E.record(state,q,q.answer,900,200);session.results.push({q,result});}
 const assessment=C.applyAssessment(state,session,300);
 assert.equal(Object.keys(assessment.results).length,6);
 assert.ok(Object.values(assessment.results).every(v=>v.level>=2));
 assert.equal(state.totals.answered,oldTotal+18);
 assert.ok(E.validState(JSON.parse(JSON.stringify(state))));
 assert.strictEqual(C.applyAssessment(state,session,400),assessment);
});
test('10,000 diverse generated questions pass answer and music validation',()=>{
 const skills=['treble','bass','accidental','rhythm','interval','passage'];
 for(let i=0;i<10000;i++){
  const skill=skills[i%skills.length],level=1+Math.floor(i/skills.length)%4,q=C.question(skill,level,E.rng(i*239+29));
  assert.deepEqual(E.validateScore(q.score),[],i+':'+skill);
  if(q.type==='pitch'){
    assert.equal(E.targetNote(q).name,q.answerLabel,i+':'+skill);
  }else{
    assert.equal(q.options.filter(o=>o.value===q.answer).length,1,i+':'+skill);
    assert.equal(new Set(q.options.map(o=>o.value)).size,q.options.length,i+':'+skill);
  }
 }
});

test('12/8 notation beams are grouped as four triples of eighth notes',()=>{
 const VF=require('vexflow').Flow;
 const notes=Array.from({length:12},()=>new VF.StaveNote({keys:['g/4'],duration:'8',clef:'treble'}));
 const beams=VF.Beam.generateBeams(notes,{groups:[new VF.Fraction(3,8)]});
 assert.equal(beams.length,4);
 assert.ok(beams.every(b=>b.notes.length===3));
});

test('Reading a full measure gets proportionate response time without hiding raw speed',()=>{
 const q=C.barNotes(2,()=>.99,'treble','treble');
 const amount=q.score.measures[0].treble.filter(n=>!n.rest).length;
 assert.ok(amount>=4);
 const state=E.newState();state.skills.treble.level=2;
 for(let i=0;i<10;i++){
  const attempt=E.record(state,q,q.answer,20000,i);
  assert.equal(attempt.ms,20000);
  assert.equal(attempt.equivalentMs,20000/amount);
 }
 assert.equal(state.skills.treble.level,3);
 const persisted=JSON.parse(JSON.stringify(state));
 assert.ok(E.validState(persisted));
});
