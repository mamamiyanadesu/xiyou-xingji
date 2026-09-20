import {test} from 'node:test';
import assert from 'node:assert/strict';
import {requestGuard} from '../dist/request-guard.mjs';
test('an older request cannot update UI after its generation changes',async()=>{
 let generation=1;const live=requestGuard(()=>generation);let resolve;
 const result=new Promise(r=>resolve=r);let painted=false;
 const pending=result.then(()=>{if(live())painted=true});generation++;resolve();await pending;assert.equal(painted,false);
});
test('current request may update UI',()=>{const live=requestGuard(()=>2);assert.equal(live(),true)});
