import {test} from 'node:test';
import assert from 'node:assert/strict';
import {blankState,validateBackup,persistState,planSignature} from '../dist/state.mjs';

test('migrate v1 without losing notes, visits or itinerary',()=>{
 const old={version:1,read:{changan:true},notes:{changan:'旧心得'},visits:[{id:'xuanzang',method:'manual',date:'2026-09-20T00:00:00Z'}],trip:[{id:'xuanzang',minutes:45,must:true}],positions:{13:125}};
 const next=validateBackup(old);assert.equal(next.version,2);assert.deepEqual(next.trip,old.trip);assert.deepEqual(next.notes,old.notes);assert.deepEqual(next.visits,old.visits);assert.equal(next.positions[13],125);assert.equal(next.mode,'walking');
});
test('v2 roundtrip preserves confirmed POI and settings but drops credentials',()=>{
 const s=blankState();s.mode='driving';s.budgetMinutes=240;s.confirmedPlaces.xuanzang={name:'测试地点',address:'测试地址',point:{lng:108,lat:34},coordinateSystem:'bd09ll',ak:'never-export'};
 const next=validateBackup(JSON.parse(JSON.stringify(s)));assert.equal(next.mode,'driving');assert.equal(next.budgetMinutes,240);assert.equal(next.confirmedPlaces.xuanzang.point.lng,108);assert.equal(JSON.stringify(next).includes('never-export'),false);
});
test('valid backup replaces corrupt storage, invalid backup leaves it intact',()=>{
 let raw='{broken';const store={setItem(k,v){raw=v}};
 assert.throws(()=>persistState(store,'test',{version:999}));assert.equal(raw,'{broken');
 const next=persistState(store,'test',blankState());assert.deepEqual(JSON.parse(raw),next);
});
test('storage failure never returns successful state',()=>{assert.throws(()=>persistState({setItem(){throw Error('quota')}},'test',blankState()),/quota/)});
test('planner inputs all invalidate pending suggestions',()=>{
 const s=blankState();s.trip=[{id:'xuanzang',minutes:45,must:false}];const signature=planSignature(s);
 for(const change of [n=>n.trip[0].must=true,n=>n.trip[0].minutes=60,n=>n.budgetMinutes=240,n=>n.mode='driving',n=>n.confirmedPlaces={xuanzang:{name:'test'}}]){const n=structuredClone(s);change(n);assert.notEqual(planSignature(n),signature);}
});
test('reject area-only destinations and malformed coordinate systems',()=>{
 const s=blankState();s.trip=[{id:'danba',minutes:45,must:false}];assert.throws(()=>validateBackup(s));s.trip=[];s.confirmedPlaces.xuanzang={name:'test',address:'test',point:{lng:108,lat:34},coordinateSystem:'wgs84'};assert.throws(()=>validateBackup(s));
});
