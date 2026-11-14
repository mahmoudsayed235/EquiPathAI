import test from 'node:test';
import assert from 'node:assert/strict';
import {evaluateScenario,regionalStats,generateActionPlan,EXAMPLES} from '../src/engine.js';
import {REGIONS,NATIONAL} from '../data/regions-2024.js';

test('all 22 area records sum to national data',()=>{
 assert.equal(REGIONS.length,22);
 for(const k of ['picked','attended','positives','colonoscopies'])
  assert.equal(REGIONS.reduce((a,r)=>a+r[k],0),NATIONAL[k]);
});
test('positive tests never less than recorded colonoscopies',()=>{
 for(const r of REGIONS) assert.ok(r.positives>=r.colonoscopies);
});
test('Kymenlaakso rate and documented unrecorded follow-ups',()=>{
 const s=regionalStats(REGIONS.find(r=>r.region==='Kymenlaakso'));
 assert.equal(s.unresolved,188);
 assert.equal(s.completion.toFixed(1),'62.1');
 assert.equal(s.nationalCompletion.toFixed(1),'72.7');
});
for(const scenario of ['transfer','report','referral']){
 test(`${scenario}: without safeguard, gap has no accountable task`,()=>{
  const a=evaluateScenario(scenario,false);
  assert.equal(a.issues.length,1);
  assert.equal(a.tasks.length,0);
  assert.equal(a.accountable,false);
 });
 test(`${scenario}: with safeguard, issue remains unverified but review is assigned`,()=>{
  const b=evaluateScenario(scenario,true);
  assert.equal(b.issues.length,1);
  assert.equal(b.tasks.length,1);
  assert.equal(b.accountable,true);
  assert.equal(b.verified,false);
 });
}
test('negative control: fully resolved pathway generates no alert',()=>{
 const a=evaluateScenario('resolved',true);
 assert.equal(a.verified,true);
 assert.equal(a.issues.length,0);
 assert.equal(a.tasks.length,0);
});
test('action plan has owner KPI and caution',()=>{
 const plan=generateActionPlan(REGIONS.find(r=>r.region==='Kymenlaakso'));
 assert.ok(plan.owner && plan.kpi && plan.data_caution && plan.verification);
});
